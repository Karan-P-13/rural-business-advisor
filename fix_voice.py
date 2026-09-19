import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Add state for listening
content = content.replace("const [isLocating, setIsLocating] = useState(false);", "const [isLocating, setIsLocating] = useState(false);\n  const [isListening, setIsListening] = useState(false);")

# 2. Add startListening function
voice_func = """  const startListening = () => {
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
  };"""

# Insert before fetchLocation
content = content.replace("const fetchLocation = () => {", voice_func + "\n\n  const fetchLocation = () => {")

# 3. Update Mic Icon UI
old_mic = '<Mic className="w-5 h-5 text-slate-400 hover:text-emerald-600 transition-colors" />'
# The old one might just be text-gray-500, let's use regex
content = re.sub(
    r'<button[^>]*>\s*<Mic className="[^"]*" />\s*</button>',
    r'''<button 
                type="button" 
                onClick={startListening}
                className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-200 hover:text-emerald-600'}`}
              >
                <Mic className="w-5 h-5" />
              </button>''',
    content
)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
