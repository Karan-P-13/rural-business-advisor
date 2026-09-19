import re

# 1. Purge Vision API mock
with open("src/app/api/vision/route.ts", "r") as f:
    vision = f.read()

vision = re.sub(
    r'if \(!process\.env\.GEMINI_API_KEY\) \{[\s\S]*?\}',
    r'if (!process.env.GEMINI_API_KEY) {\n      return NextResponse.json({ success: false, error: "Missing GEMINI_API_KEY in environment variables." }, { status: 400 });\n    }',
    vision
)
with open("src/app/api/vision/route.ts", "w") as f:
    f.write(vision)

# 2. Purge page.tsx mocks
with open("src/app/page.tsx", "r") as f:
    page = f.read()

# Remove the warning banner from the bot UI
page = re.sub(
    r'\{msg\.text === t\[language\]\.completed && \(!process\.env\.NEXT_PUBLIC_HAS_API_KEY\) \? \([\s\S]*?\) : null\}',
    '',
    page
)
# Just to be safe if my regex missed it because of exact string matches, let's remove the specific warning div
page = re.sub(
    r'<div className="mt-3 bg-yellow-50.*?</div>',
    '',
    page
)

# Remove offlineIdeaDictionary completely
page = re.sub(r'// Massive fallback offline dictionary[\s\S]*?\];\n', '', page)

# Update SKILLS step to throw error instead of fallback
old_ideas_catch = """      } catch (e) {
        console.warn("AI Idea Generation failed, using robust fuzzy offline matching.");
        const lowerInput = textToSend.toLowerCase();
        const matchedCategory = skillCategories.find(c => 
          c.name.toLowerCase() === lowerInput || 
          (c.labelHindi && c.labelHindi.toLowerCase() === lowerInput) ||
          (c.labelTamil && c.labelTamil.toLowerCase() === lowerInput) ||
          c.keywords.some(k => lowerInput.includes(k))
        )?.name || 'Agriculture & Farming';
        
        const fallbackIdeas = offlineIdeaDictionary[matchedCategory] || offlineIdeaDictionary['Retail & Food'];
        setDynamicIdeas(fallbackIdeas);
      }"""

new_ideas_catch = """      } catch (e) {
        console.error("AI Idea Generation failed:", e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi' ? "त्रुटि: AI से कनेक्ट करने में विफल। कृपया अपनी API कुंजी जांचें।" : language === 'Tamil' ? "பிழை: AI உடன் இணைக்க முடியவில்லை. உங்கள் API விசையை சரிபார்க்கவும்." : "Error: Failed to connect to AI. Please check your API key.",
          sender: 'bot'
        }]);
        setStep('SKILLS'); // keep them on this step
      }"""

page = page.replace(old_ideas_catch, new_ideas_catch)

# Update INTEREST step to throw error instead of triggerFallbackDashboard
old_advisory_catch = """        if (!response.ok) {
           triggerFallbackDashboard(newFormData);
           setIsLoading(false);
           return;
        }"""

new_advisory_catch = """        if (!response.ok) {
           throw new Error("Advisory API Failed");
        }"""
page = page.replace(old_advisory_catch, new_advisory_catch)

old_advisory_catch_2 = """      } catch (e) {
        console.warn("AI Generation failed, using local smart-compute fallback.");
        triggerFallbackDashboard(newFormData);
      }"""

new_advisory_catch_2 = """      } catch (e) {
        console.error("AI Generation failed:", e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi' ? "त्रुटि: व्यवसाय योजना बनाने में विफल। कृपया अपनी API कुंजी जांचें।" : language === 'Tamil' ? "பிழை: வணிகத் திட்டத்தை உருவாக்க முடியவில்லை. உங்கள் API விசையை சரிபார்க்கவும்." : "Error: Failed to generate business plan. Please check your API key.",
          sender: 'bot'
        }]);
        setStep('INTEREST'); // let them retry
      }"""
page = page.replace(old_advisory_catch_2, new_advisory_catch_2)

with open("src/app/page.tsx", "w") as f:
    f.write(page)
