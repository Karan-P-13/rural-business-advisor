import re

with open("src/components/FinancialDashboard.tsx", "r") as f:
    content = f.read()

# Add tooltip dictionary
old_ui_dict = "const ui = {"
new_ui_dict = """const tips = {
  English: {
    dscrInfo: "Debt Service Coverage Ratio: A score above 1.25 means your business makes enough profit to comfortably pay the loan EMI.",
    ueInfo: "User Equity: The portion of the project cost you must pay from your own pocket (usually 10%).",
    capexInfo: "CapEx: Money spent on buying physical assets like machinery, equipment, or building renovations.",
    breakInfo: "Break-Even: The number of months it will take for your accumulated profits to pay off the initial loan."
  },
  Hindi: {
    dscrInfo: "ऋण सेवा कवरेज अनुपात: 1.25 से ऊपर के स्कोर का मतलब है कि आपका व्यवसाय ऋण EMI चुकाने के लिए पर्याप्त लाभ कमाता है।",
    ueInfo: "उपयोगकर्ता इक्विटी: परियोजना लागत का वह हिस्सा जो आपको अपनी जेब से देना होगा (आमतौर पर 10%)।",
    capexInfo: "CapEx: मशीनरी, उपकरण या भवन नवीनीकरण जैसी भौतिक संपत्ति खरीदने पर खर्च किया गया पैसा।",
    breakInfo: "ब्रेक-ईवन: प्रारंभिक ऋण का भुगतान करने में आपके संचित मुनाफे में लगने वाले महीनों की संख्या।"
  },
  Tamil: {
    dscrInfo: "DSCR: 1.25 க்கு மேலான மதிப்பெண் என்றால், உங்கள் தொழில் கடன் EMI-ஐ எளிதாக செலுத்தும் அளவுக்கு லாபம் ஈட்டுகிறது.",
    ueInfo: "பயனர் பங்கு: திட்டச் செலவில் நீங்கள் சொந்தமாக செலுத்த வேண்டிய தொகை (பொதுவாக 10%).",
    capexInfo: "CapEx: இயந்திரங்கள் அல்லது உபகரணங்கள் போன்ற நிரந்தர சொத்துக்களை வாங்க செலவிடப்படும் பணம்.",
    breakInfo: "முறிவுப்புள்ளி: நீங்கள் வாங்கிய கடனை முழுமையாக அடைக்க உங்கள் லாபத்திற்கு தேவைப்படும் மாதங்கள்."
  }
};

const ui = {"""
content = content.replace(old_ui_dict, new_ui_dict)

# Add Tooltip Component
content = content.replace("export default function FinancialDashboard", """const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center justify-center ml-1 cursor-help">
    <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold border border-slate-300">?</div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export default function FinancialDashboard""")

# Replace labels with tooltips
content = content.replace(">{ui[language].ue}</p>", " className=\"flex items-center\">{ui[language].ue} <Tooltip text={tips[language].ueInfo} /></p>")
content = content.replace(">{ui[language].dscr}</p>", " className=\"flex items-center\">{ui[language].dscr} <Tooltip text={tips[language].dscrInfo} /></p>")
content = content.replace(">{ui[language].capex}</h3>", " className=\"flex items-center\">{ui[language].capex} <Tooltip text={tips[language].capexInfo} /></h3>")
content = content.replace(">{ui[language].estBreak}</p>", " className=\"flex items-center justify-center\">{ui[language].estBreak} <Tooltip text={tips[language].breakInfo} /></p>")

with open("src/components/FinancialDashboard.tsx", "w") as f:
    f.write(content)
