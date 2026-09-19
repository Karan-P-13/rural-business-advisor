const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!content.includes('Volume2')) {
  content = content.replace('import { Send, MapPin', 'import { Volume2, Send, MapPin');
}

if (!content.includes('playingMessageId')) {
  content = content.replace(
    /const \[language, setLanguage\] = useState<Language>\('English'\);/,
    `const [language, setLanguage] = useState<Language>('English');\n  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);`
  );
}

if (!content.includes('handleSpeak')) {
  content = content.replace(
    /const handleReset = \(\) => {/,
    `const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (playingMessageId === id) {
      setPlayingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/\\*\\*/g, ''));
    const langMap: Record<string, string> = { Hindi: 'hi-IN', Tamil: 'ta-IN', Bengali: 'bn-IN', Telugu: 'te-IN', Marathi: 'mr-IN', Gujarati: 'gu-IN', Kannada: 'kn-IN', Malayalam: 'ml-IN', Urdu: 'ur-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.onend = () => setPlayingMessageId(null);
    window.speechSynthesis.speak(utterance);
    setPlayingMessageId(id);
  };\n\n  const handleReset = () => {`
  );
}

if (!content.includes('onClick={() => handleSpeak(')) {
  content = content.replace(
    /<div className={`max-w-\[80%\] px-4 py-3 rounded-2xl shadow-\[0_1px_2px_rgba\(20,22,28,0\.05\)\] text-\[14px\] leading-relaxed whitespace-pre-wrap \${isBot \? 'bg-white text-\[#14161C\] rounded-bl-sm border border-\[#E8E8E4\]' : 'bg-\[#6366F1\] text-white rounded-br-sm'}`}>[\s\S]*?<\/div>/,
    `<div className="flex flex-col gap-1 max-w-[80%]">
                  <div className={\`px-4 py-3 rounded-2xl shadow-[0_1px_2px_rgba(20,22,28,0.05)] text-[14px] leading-relaxed whitespace-pre-wrap \${isBot ? 'bg-white text-[#14161C] rounded-bl-sm border border-[#E8E8E4]' : 'bg-[#6366F1] text-white rounded-br-sm'}\`}>
                    {text}
                  </div>
                  {isBot && (
                    <button 
                      onClick={() => handleSpeak(text || '', msg.id)}
                      className={\`self-start flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors \${playingMessageId === msg.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}\`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {playingMessageId === msg.id ? (t[language as keyof typeof t] || t.English).stop || 'Stop' : (t[language as keyof typeof t] || t.English).readAloud || 'Read Aloud'}
                    </button>
                  )}
                </div>`
  );
}

fs.writeFileSync('src/app/page.tsx', content);
