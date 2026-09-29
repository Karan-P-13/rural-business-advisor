const fs = require('fs');
let content = fs.readFileSync('src/components/BusinessDashboard.tsx', 'utf8');

// 1. Add sessionId to Props
content = content.replace(
  /interface BusinessDashboardProps \{/,
  `interface BusinessDashboardProps {\n  sessionId?: string;`
);

// 2. Destructure sessionId
content = content.replace(
  /const BusinessDashboard = \(\{ businessPlan, financialData, schemes, language = 'English' \}: BusinessDashboardProps\) => \{/,
  `const BusinessDashboard = ({ businessPlan, financialData, schemes, language = 'English', sessionId }: BusinessDashboardProps) => {`
);

// 3. Add translation dict updates for Share, Download, SMS, Read Aloud
const newUiDict = `const uiDict: Record<string, any> = {
  English: { share: "WhatsApp", sms: "SMS", readAloud: "Read Aloud", download: "Download PDF", tab1: "Business Feasibility", tab2: "Loan & Finances", tab3: "Matched Schemes", tab4: "Action Plan" },
  Hindi: { share: "व्हाट्सएप", sms: "एसएमएस", readAloud: "पढ़कर सुनाएं", download: "पीडीएफ डाउनलोड करें", tab1: "व्यवसाय व्यवहार्यता", tab2: "ऋण और वित्त", tab3: "सुझाई गई योजनाएं", tab4: "कार्य योजना" },
  Tamil: { share: "வாட்ஸ்அப்", sms: "எஸ்எம்எஸ்", readAloud: "படித்துக்காட்டு", download: "PDF பதிவிறக்கு", tab1: "வணிக சாத்தியக்கூறு", tab2: "கடன் மற்றும் நிதி", tab3: "பொருத்தமான திட்டங்கள்", tab4: "செயல் திட்டம்" }
};`;
content = content.replace(/const uiDict: Record<string, any> = \{[\s\S]*?\};\n/, newUiDict + '\n\n');

// 4. Update NextSteps usage to pass sessionId
content = content.replace(
  /<NextSteps businessPlan=\{businessPlan\} language=\{language\} \/>/,
  `<NextSteps businessPlan={businessPlan} language={language} sessionId={sessionId} />`
);

// 5. Add SMS handler and TTS handler
const handleWhatsAppRegex = /const handleWhatsApp = \(\) => \{[\s\S]*?\};/;
const newHandlers = `const handleWhatsApp = () => {
    const name = businessPlan?.title || businessPlan?.businessName || 'My New Business';
    const score = businessPlan?.localDemandScore || 85;
    const cost = financialData?.totalProjectCost ? "₹" + financialData.totalProjectCost.toLocaleString('en-IN') : "TBD";
    const revenue = (financialData?.monthlyRevenue || financialData?.projectedRevenue) ? "₹" + (financialData?.monthlyRevenue || financialData?.projectedRevenue).toLocaleString('en-IN') : "TBD";
    const text = \`🚀 Check out my new business plan!\\n\\n*\${name}*\\n\\n📈 Market Viability Score: \${score}/100\\n💰 Total Project Cost: \${cost}\\n💵 Monthly Revenue: \${revenue}\\n\\nGenerated using Unnati Advisor.\`;
    window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
  };

  const handleSMS = () => {
    const name = businessPlan?.title || businessPlan?.businessName || 'My New Business';
    const text = \`Check out my business plan for \${name}. Cost: ₹\${financialData?.totalProjectCost}, Rev: ₹\${financialData?.monthlyRevenue || financialData?.projectedRevenue}. Created with Unnati Advisor.\`;
    window.open(\`sms:?&body=\${encodeURIComponent(text)}\`, '_self');
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const handleTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const name = businessPlan?.title || businessPlan?.businessName;
    const summary = businessPlan?.summary || "";
    const textToSpeak = \`\${name}. \${summary}\`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    if (language === 'Hindi') utterance.lang = 'hi-IN';
    else if (language === 'Tamil') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };`;
content = content.replace(handleWhatsAppRegex, newHandlers);

// 6. Fix imports for SMS and TTS icons
content = content.replace(
  /import \{ FileText, PieChart, Landmark, Printer, MessageCircle, CheckSquare \} from 'lucide-react';/,
  `import { FileText, PieChart, Landmark, Printer, MessageCircle, CheckSquare, MessageSquare, Volume2, VolumeX } from 'lucide-react';\nimport { useState } from 'react';`
);

// 7. Render new buttons in the Action Bar
const actionBarRegex = /<button \n\s*onClick=\{handleWhatsApp\}[\s\S]*?<\/span>\n\s*<\/button>/;
const newButtons = `<button 
            onClick={handleTTS}
            className={\`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm dark:shadow-none \${isSpeaking ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'}\`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{(uiDict[language as keyof typeof uiDict] || uiDict.English).readAloud}</span>
          </button>
          
          <button 
            onClick={handleWhatsApp}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm dark:shadow-none"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{(uiDict[language as keyof typeof uiDict] || uiDict.English).share}</span>
          </button>

          <button 
            onClick={handleSMS}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm dark:shadow-none"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">{(uiDict[language as keyof typeof uiDict] || uiDict.English).sms}</span>
          </button>`;
content = content.replace(actionBarRegex, newButtons);

fs.writeFileSync('src/components/BusinessDashboard.tsx', content);
