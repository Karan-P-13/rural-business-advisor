const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const uploadLogic = `
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
`;

if (!page.includes("const fileInputRef = useRef")) {
  page = page.replace("const fetchLocation = () => {", uploadLogic + "\n\n  const fetchLocation = () => {");
}

fs.writeFileSync('src/app/page.tsx', page);
