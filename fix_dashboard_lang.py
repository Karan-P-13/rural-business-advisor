import re

with open("src/components/BusinessDashboard.tsx", "r") as f:
    content = f.read()

# Update Props
old_props = """  schemes: any[];
}

export default function BusinessDashboard({ businessPlan, financialData, schemes }: BusinessDashboardProps) {"""

new_props = """  schemes: any[];
  language?: 'English' | 'Hindi' | 'Tamil';
}

const uiDict = {
  English: { title: "Underwriting Portal", sub: "Auto-generated bank-ready assessment", pdf: "Download PDF Report", tab1: "Business Feasibility", tab2: "Loan & Finances", tab3: "Matched Schemes" },
  Hindi: { title: "अंडरराइटिंग पोर्टल", sub: "स्वचालित बैंक-तैयार मूल्यांकन", pdf: "पीडीएफ रिपोर्ट डाउनलोड करें", tab1: "व्यापार व्यवहार्यता", tab2: "ऋण और वित्त", tab3: "सुझाई गई योजनाएं" },
  Tamil: { title: "வழங்குதல் போர்டல்", sub: "தானியங்கி வங்கி மதிப்பீடு", pdf: "PDF அறிக்கை பதிவிறக்கு", tab1: "வணிக சாத்தியம்", tab2: "கடன் மற்றும் நிதி", tab3: "பொருத்தமான திட்டங்கள்" }
};

export default function BusinessDashboard({ businessPlan, financialData, schemes, language = 'English' }: BusinessDashboardProps) {"""

content = content.replace(old_props, new_props)

# Implement translation in JSX
content = content.replace(">Underwriting Portal</h1>", ">{uiDict[language].title}</h1>")
content = content.replace(">Auto-generated bank-ready assessment</p>", ">{uiDict[language].sub}</p>")
content = content.replace(">Download PDF Report</span>", ">{uiDict[language].pdf}</span>")
content = content.replace(">Business Feasibility</span>", ">{uiDict[language].tab1}</span>")
content = content.replace(">Loan & Finances</span>", ">{uiDict[language].tab2}</span>")
content = content.replace(">Matched Schemes</span>", ">{uiDict[language].tab3}</span>")

with open("src/components/BusinessDashboard.tsx", "w") as f:
    f.write(content)
