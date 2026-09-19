const fs = require('fs');
let content = fs.readFileSync('src/components/SchemeAdvisor.tsx', 'utf8');

if (!content.includes('Volume2')) {
  content = content.replace('import { Landmark,', 'import { Volume2, Play, Square, Landmark,');
}

if (!content.includes('isPlaying')) {
  content = content.replace(
    /export default function SchemeAdvisor\(\{[\s\S]*?\}\) \{/,
    `$&
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = schemes.map(s => s.name + ". " + s.description).join(". ");
      const utterance = new SpeechSynthesisUtterance(t.title + ". " + text);
      const langMap: Record<string, string> = { Hindi: 'hi-IN', Tamil: 'ta-IN', Bengali: 'bn-IN', Telugu: 'te-IN', Marathi: 'mr-IN', Gujarati: 'gu-IN', Kannada: 'kn-IN', Malayalam: 'ml-IN' };
      utterance.lang = langMap[language] || 'en-IN';
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };
`
  );
}

if (!content.includes('onClick={toggleSpeech}')) {
  content = content.replace(
    /<div className="flex justify-between items-start mb-8 print:hidden">/,
    `<div className="flex justify-between items-start mb-8 print:hidden">
        <button
          onClick={toggleSpeech}
          className={\`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-colors mr-4 \${
            isPlaying ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }\`}
          title={isPlaying ? 'Stop' : 'Read Aloud'}
        >
          {isPlaying ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>`
  );
}

fs.writeFileSync('src/components/SchemeAdvisor.tsx', content);
