import re

with open("src/components/FinancialDashboard.tsx", "r") as f:
    content = f.read()

# Fix Props
old_props = """export default function FinancialDashboard({ data }: { data: any }) {"""
new_props = """const ui = {
  English: { verdict: "Loan Underwriting Verdict", tp: "Total Project", ue: "User Equity (Margin)", emi: "Est. EMI (60 mo)", dscr: "DSCR", capex: "Capital Expenditure (CapEx)", rev: "Revenue vs OpEx (6 mo)", month: "Month", stress: "Stress Test: Sales Volume", adjust: "Adjust projected sales to see impact on break-even.", worst: "Worst Case (0.5x)", expect: "Expected (1.0x)", best: "Best Case (1.5x)", adjProfit: "Adjusted Monthly Profit", estBreak: "Estimated Break-Even", months: "Months", never: "Never (Loss)" },
  Hindi: { verdict: "ऋण हामीदारी (अंडरराइटिंग) निर्णय", tp: "कुल परियोजना", ue: "उपयोगकर्ता इक्विटी (मार्जिन)", emi: "अनुमानित ईएमआई (60 महीने)", dscr: "DSCR", capex: "पूंजीगत व्यय (CapEx)", rev: "राजस्व बनाम परिचालन व्यय (6 महीने)", month: "महीना", stress: "तनाव परीक्षण: बिक्री की मात्रा", adjust: "ब्रेक-ईवन पर प्रभाव देखने के लिए अनुमानित बिक्री को समायोजित करें।", worst: "सबसे खराब स्थिति (0.5x)", expect: "अपेक्षित (1.0x)", best: "सर्वोत्तम स्थिति (1.5x)", adjProfit: "समायोजित मासिक लाभ", estBreak: "अनुमानित ब्रेक-ईवन", months: "महीने", never: "कभी नहीं (नुकसान)" },
  Tamil: { verdict: "கடன் மதிப்பீடு முடிவு", tp: "மொத்த திட்டம்", ue: "பயனர் பங்கு (விளிம்பு)", emi: "மதிப்பிடப்பட்ட EMI (60 மாதம்)", dscr: "DSCR", capex: "மூலதன செலவு (CapEx)", rev: "வருவாய் vs இயக்க செலவு (6 மாதம்)", month: "மாதம்", stress: "அழுத்த சோதனை: விற்பனை அளவு", adjust: "முறிவுப் புள்ளியில் ஏற்படும் தாக்கத்தைப் பார்க்க மதிப்பிடப்பட்ட விற்பனையைச் சரிசெய்யவும்.", worst: "மோசமான நிலை (0.5x)", expect: "எதிர்பார்க்கப்படும் (1.0x)", best: "சிறந்த நிலை (1.5x)", adjProfit: "சரிசெய்யப்பட்ட மாதாந்திர லாபம்", estBreak: "மதிப்பிடப்பட்ட முறிவுப்புள்ளி", months: "மாதங்கள்", never: "ஒருபோதும் இல்லை (இழப்பு)" }
};

export default function FinancialDashboard({ data, language = 'English' }: { data: any, language?: 'English'|'Hindi'|'Tamil' }) {"""

content = content.replace(old_props, new_props)
content = content.replace("name: `Month ${i + 1}`", "name: `${ui[language].month} ${i + 1}`")
content = content.replace(">Loan Underwriting Verdict</h3>", ">{ui[language].verdict}</h3>")
content = content.replace(">Total Project</p>", ">{ui[language].tp}</p>")
content = content.replace(">User Equity (Margin)</p>", ">{ui[language].ue}</p>")
content = content.replace(">Est. EMI (60 mo)</p>", ">{ui[language].emi}</p>")
content = content.replace(">DSCR</p>", ">{ui[language].dscr}</p>")
content = content.replace(">Capital Expenditure (CapEx)</h3>", ">{ui[language].capex}</h3>")
content = content.replace(">Revenue vs OpEx (6 mo)</h3>", ">{ui[language].rev}</h3>")
content = content.replace(">Stress Test: Sales Volume</h4>", ">{ui[language].stress}</h4>")
content = content.replace(">Adjust projected sales to see impact on break-even.</p>", ">{ui[language].adjust}</p>")
content = content.replace(">Worst Case (0.5x)</span>", ">{ui[language].worst}</span>")
content = content.replace(">Expected (1.0x)</span>", ">{ui[language].expect}</span>")
content = content.replace(">Best Case (1.5x)</span>", ">{ui[language].best}</span>")
content = content.replace(">Adjusted Monthly Profit</p>", ">{ui[language].adjProfit}</p>")
content = content.replace(">Estimated Break-Even</p>", ">{ui[language].estBreak}</p>")
content = content.replace("? `${Math.ceil(adjustedBreakEven)} Months` : 'Never (Loss)'", "? `${Math.ceil(adjustedBreakEven)} ${ui[language].months}` : ui[language].never")

with open("src/components/FinancialDashboard.tsx", "w") as f:
    f.write(content)
