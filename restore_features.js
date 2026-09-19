const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Imports
page = page.replace("Sparkles, Loader2", "Sparkles, Loader2, Camera");
if (!page.includes("useRef")) {
  page = page.replace("useState, useEffect", "useState, useEffect, useRef");
}

// 2. States
if (!page.includes("isListening")) {
  page = page.replace("const [isLocating, setIsLocating] = useState(false);", "const [isLocating, setIsLocating] = useState(false);\n  const [isListening, setIsListening] = useState(false);");
}

// 3. Logic
const featureLogic = `
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        setMessages(prev => [...prev, { id: Date.now().toString(), text: "Error analyzing document.", sender: 'bot' }]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };
`;

if (!page.includes("const fileInputRef")) {
  page = page.replace("const fetchLocation = () => {", featureLogic + "\n\n  const fetchLocation = () => {");
}

// 4. UI Icons
const oldMic = `<button 
                type="button" 
                onClick={fetchLocation}
                disabled={isLocating}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-emerald-600 transition-colors"
              >
                <MapPin className={\`w-5 h-5 \${isLocating ? 'animate-bounce' : ''}\`} />
              </button>
              <button 
                type="button" 
                className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-emerald-600 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>`;

const newMic = `<button 
                type="button" 
                onClick={fetchLocation}
                disabled={isLocating}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-emerald-600 transition-colors"
              >
                <MapPin className={\`w-5 h-5 \${isLocating ? 'animate-bounce' : ''}\`} />
              </button>
              <input 
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
                onClick={startListening}
                className={\`p-2 rounded-full transition-all duration-300 \${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-200 hover:text-emerald-600'}\`}
              >
                <Mic className="w-5 h-5" />
              </button>`;

page = page.replace(oldMic, newMic);

fs.writeFileSync('src/app/page.tsx', page);
