const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove fallback banner
page = page.replace(/{msg\.text === t\[language\]\.completed && \(!process\.env\.NEXT_PUBLIC_HAS_API_KEY\) \? \([\s\S]*?\) : null}/g, '');
page = page.replace(/<div className="mt-3 bg-yellow-50[\s\S]*?<\/div>/g, '');

// 2. Remove offlineIdeaDictionary completely
page = page.replace(/\/\/ Massive fallback offline dictionary[\s\S]*?\];/g, 'const offlineIdeaDictionary = {};');

// 3. Update SKILLS catch block
const oldSkillsCatch = `} catch (e) {
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
      }`;

const newSkillsCatch = `} catch (e) {
        console.error("AI Idea Generation failed:", e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi' ? "त्रुटि: AI से कनेक्ट करने में विफल। कृपया अपनी API कुंजी जांचें।" : language === 'Tamil' ? "பிழை: AI உடன் இணைக்க முடியவில்லை. உங்கள் API விசையை சரிபார்க்கவும்." : "Error: Failed to connect to AI. Please check your API key.",
          sender: 'bot'
        }]);
        setStep('SKILLS');
      }`;

page = page.replace(oldSkillsCatch, newSkillsCatch);

// 4. Update INTEREST catch block
const oldInterestError = `if (!response.ok) {
           triggerFallbackDashboard(newFormData);
           setIsLoading(false);
           return;
        }`;
const newInterestError = `if (!response.ok) {
           throw new Error("Advisory API Failed");
        }`;

page = page.replace(oldInterestError, newInterestError);

const oldInterestCatch = `} catch (e) {
        console.warn("AI Generation failed, using local smart-compute fallback.");
        triggerFallbackDashboard(newFormData);
      }`;

const newInterestCatch = `} catch (e) {
        console.error("AI Generation failed:", e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi' ? "त्रुटि: व्यवसाय योजना बनाने में विफल। कृपया अपनी API कुंजी जांचें।" : language === 'Tamil' ? "பிழை: வணிகத் திட்டத்தை உருவாக்க முடியவில்லை. உங்கள் API விசையை சரிபார்க்கவும்." : "Error: Failed to generate business plan. Please check your API key.",
          sender: 'bot'
        }]);
        setStep('INTEREST');
      }`;

page = page.replace(oldInterestCatch, newInterestCatch);

fs.writeFileSync('src/app/page.tsx', page);
