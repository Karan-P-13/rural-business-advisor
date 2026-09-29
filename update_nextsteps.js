const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface NextStepsProps {
  businessPlan: any;
  language: string;
  sessionId?: string;
}

const uiDict: Record<string, any> = {
  English: {
    title: "Launch Action Plan",
    desc: "Your guided checklist to get started today.",
    progress: "Progress",
    steps: [
      { title: "Register Business", desc: "Apply for Udyam Aadhaar to get MSME benefits." },
      { title: "Secure Funding", desc: "Gather required documents and apply for the recommended government schemes." },
      { title: "Bank Account", desc: "Open a Current Account for official business transactions." },
      { title: "Sourcing", desc: "Establish contact with 2-3 local suppliers for raw materials." },
      { title: "First Sale", desc: "Reach out to your first 5 potential customers or set up a local stall." }
    ]
  },
  Hindi: {
    title: "लॉन्च एक्शन प्लान",
    desc: "आज ही शुरू करने के लिए आपकी निर्देशित चेकलिस्ट।",
    progress: "प्रगति",
    steps: [
      { title: "व्यवसाय पंजीकरण", desc: "MSME लाभ प्राप्त करने के लिए उद्यम आधार के लिए आवेदन करें।" },
      { title: "फंडिंग सुरक्षित करें", desc: "आवश्यक दस्तावेज एकत्र करें और अनुशंसित सरकारी योजनाओं के लिए आवेदन करें।" },
      { title: "बैंक खाता", desc: "आधिकारिक व्यावसायिक लेनदेन के लिए चालू खाता खोलें।" },
      { title: "सोर्सिंग", desc: "कच्चे माल के लिए 2-3 स्थानीय आपूर्तिकर्ताओं से संपर्क स्थापित करें।" },
      { title: "पहली बिक्री", desc: "अपने पहले 5 संभावित ग्राहकों तक पहुंचें या एक स्थानीय स्टाल स्थापित करें।" }
    ]
  },
  Tamil: {
    title: "செயல் திட்டம் தொடங்கு",
    desc: "இன்றே தொடங்க உங்களுக்கு வழிகாட்டும் சரிபார்ப்புப் பட்டியல்.",
    progress: "முன்னேற்றம்",
    steps: [
      { title: "வணிக பதிவு", desc: "MSME நன்மைகளைப் பெற உதயம் ஆதாரிற்கு விண்ணப்பிக்கவும்." },
      { title: "நிதி திரட்டல்", desc: "தேவையான ஆவணங்களை சேகரித்து பரிந்துரைக்கப்பட்ட அரசு திட்டங்களுக்கு விண்ணப்பிக்கவும்." },
      { title: "வங்கி கணக்கு", desc: "அதிகாரப்பூர்வ வணிக பரிவர்த்தனைகளுக்கு நடப்புக் கணக்கைத் திறக்கவும்." },
      { title: "மூலப்பொருள் கொள்முதல்", desc: "கச்சாப் பொருட்களுக்கு 2-3 உள்ளூர் சப்ளையர்களுடன் தொடர்பு கொள்ளவும்." },
      { title: "முதல் விற்பனை", desc: "உங்கள் முதல் 5 வாடிக்கையாளர்களைத் தொடர்பு கொள்ளவும் அல்லது உள்ளூர் கடையை அமைக்கவும்." }
    ]
  }
};

const NextSteps = ({ businessPlan, language, sessionId = "default-session" }: NextStepsProps) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const ui = uiDict[language] || uiDict.English;
  const steps = ui.steps;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(\`busidvice_action_plan_\${sessionId}\`);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading checklist", e);
      }
    }
    setIsLoaded(true);
  }, [sessionId]);

  const toggleCheck = (index: number) => {
    const newChecked = { ...checked, [index]: !checked[index] };
    setChecked(newChecked);
    localStorage.setItem(\`busidvice_action_plan_\${sessionId}\`, JSON.stringify(newChecked));
  };

  const progress = Math.round((Object.values(checked).filter(Boolean).length / steps.length) * 100);

  if (!isLoaded) return null;

  return (
    <div className="bg-white dark:bg-[#1A1D24] p-5 md:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{ui.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ui.desc}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-50 dark:bg-[#20242D] px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{ui.progress}</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">{progress}%</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800/50"></div>
        <div className="space-y-6 relative">
          {steps.map((step: any, idx: number) => {
            const isDone = !!checked[idx];
            return (
              <div 
                key={idx} 
                className={\`flex items-start space-x-4 p-4 rounded-xl transition-all cursor-pointer border \${isDone ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-white dark:bg-[#20242D] border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'}\`}
                onClick={() => toggleCheck(idx)}
              >
                <div className="mt-0.5 relative z-10 bg-white dark:bg-[#20242D] rounded-full flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={\`font-semibold \${isDone ? 'text-emerald-800 dark:text-emerald-400 line-through opacity-70' : 'text-slate-900 dark:text-slate-200'}\`}>
                    {step.title}
                  </h3>
                  <p className={\`text-sm mt-1 \${isDone ? 'text-emerald-600/70 dark:text-emerald-500/50' : 'text-slate-500 dark:text-slate-400'}\`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
`;

fs.writeFileSync('src/components/NextSteps.tsx', content);
