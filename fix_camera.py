import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Import Camera icon and useRef
content = content.replace("Bot, User, Sparkles", "Bot, User, Sparkles, Camera")
content = content.replace("useState, useEffect", "useState, useEffect, useRef")

# 2. Add fileRef and handleUpload function
camera_logic = """
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant feedback in chat
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: tempId,
      text: language === 'Hindi' ? "[दस्तावेज़ अपलोड किया गया] विश्लेषण कर रहा हूँ..." : language === 'Tamil' ? "[ஆவணம் பதிவேற்றப்பட்டது] பகுப்பாய்வு செய்கிறது..." : "[Document Uploaded] Analyzing...",
      sender: 'user'
    }]);

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, language })
        });
        const data = await res.json();
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.message || "Failed to analyze.",
          sender: 'bot'
        }]);
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "Error analyzing document.",
          sender: 'bot'
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };"""

content = content.replace("const fileInputRef", "// fileInputRef replaced")
content = content.replace("const handleFileUpload", "// handleFileUpload replaced")
content = content.replace("const fetchLocation = () => {", camera_logic + "\n\n  const fetchLocation = () => {")

# 3. Add hidden input and Camera button to the UI
# We'll place it right before the Mic button
old_mic_ui = """              <button 
                type="button" 
                onClick={startListening}"""

new_mic_ui = """              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-blue-600 transition-all duration-300"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={startListening}"""

content = content.replace(old_mic_ui, new_mic_ui)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
