import re

with open("src/components/BusinessDashboard.tsx", "r") as f:
    content = f.read()

# Update the render calls in BusinessDashboard
old_renders = """        <div className="hidden print:block space-y-10">
           <div className="mb-8 border-b-2 border-gray-800 pb-4">
             <h1 className="text-3xl font-black text-gray-900">Project Appraisal Memo</h1>
             <p className="text-gray-600 mt-2 font-medium">Auto-generated via BusiDvice Fintech Advisor (SIH26091)</p>
           </div>
           <RecommendationScreen businessPlan={businessPlan} />
           <FinancialDashboard data={financialData} />
           <SchemeAdvisor schemes={schemes} />
        </div>

        {/* Screen Layout shows tabs */}
        <div className="block print:hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'plan' && <RecommendationScreen businessPlan={businessPlan} />}
          {activeTab === 'finance' && <FinancialDashboard data={financialData} />}
          {activeTab === 'schemes' && <SchemeAdvisor schemes={schemes} />}
        </div>"""

new_renders = """        <div className="hidden print:block space-y-10">
           <div className="mb-8 border-b-2 border-gray-800 pb-4">
             <h1 className="text-3xl font-black text-gray-900">Project Appraisal Memo</h1>
             <p className="text-gray-600 mt-2 font-medium">Auto-generated via BusiDvice Fintech Advisor (SIH26091)</p>
           </div>
           <RecommendationScreen businessPlan={businessPlan} language={language} />
           <FinancialDashboard data={financialData} language={language} />
           <SchemeAdvisor schemes={schemes} language={language} />
        </div>

        {/* Screen Layout shows tabs */}
        <div className="block print:hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'plan' && <RecommendationScreen businessPlan={businessPlan} language={language} />}
          {activeTab === 'finance' && <FinancialDashboard data={financialData} language={language} />}
          {activeTab === 'schemes' && <SchemeAdvisor schemes={schemes} language={language} />}
        </div>"""

content = content.replace(old_renders, new_renders)

with open("src/components/BusinessDashboard.tsx", "w") as f:
    f.write(content)


# 1. Update SchemeAdvisor.tsx
with open("src/components/SchemeAdvisor.tsx", "r") as f:
    sa = f.read()

sa_old_props = "export default function SchemeAdvisor({ schemes }: { schemes: SchemeProfile[] }) {"
sa_new_props = """const ui = {
  English: { title: "Recommended Schemes", sub: "Based on your project cost and location, you are highly eligible for the following banking schemes.", central: "Central Govt Scheme", state: "State Scheme", free: "Collateral Free", max: "Max Loan Amount", subPct: "Capital Subsidy", elig: "Eligibility Criteria", doc: "Mandatory Documents", btn: "Apply on Official Portal" },
  Hindi: { title: "अनुशंसित योजनाएं", sub: "आपकी परियोजना लागत और स्थान के आधार पर, आप निम्नलिखित बैंक योजनाओं के लिए पात्र हैं।", central: "केंद्र सरकार की योजना", state: "राज्य योजना", free: "संपार्श्विक मुक्त (बिना गारंटी)", max: "अधिकतम ऋण राशि", subPct: "पूंजीगत सब्सिडी", elig: "पात्रता मापदंड", doc: "अनिवार्य दस्तावेज़", btn: "आधिकारिक पोर्टल पर आवेदन करें" },
  Tamil: { title: "பரிந்துரைக்கப்படும் திட்டங்கள்", sub: "உங்கள் திட்டச் செலவு மற்றும் இருப்பிடத்தின் அடிப்படையில், பின்வரும் வங்கித் திட்டங்களுக்கு நீங்கள் தகுதி பெற்றுள்ளீர்கள்.", central: "மத்திய அரசு திட்டம்", state: "மாநில திட்டம்", free: "பிணையம் தேவையில்லை", max: "அதிகபட்ச கடன்", subPct: "மூலதன மானியம்", elig: "தகுதிக்கான அளவுகோல்கள்", doc: "கட்டாய ஆவணங்கள்", btn: "அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்கவும்" }
};
export default function SchemeAdvisor({ schemes, language = 'English' }: { schemes: SchemeProfile[], language?: 'English'|'Hindi'|'Tamil' }) {"""

sa = sa.replace(sa_old_props, sa_new_props)
sa = sa.replace(">Recommended Schemes</h2>", ">{ui[language].title}</h2>")
sa = sa.replace(">Based on your project cost and location, you are highly eligible for the following banking schemes.</p>", ">{ui[language].sub}</p>")
sa = sa.replace("? `${scheme.state} State Scheme` : 'Central Govt Scheme'", "? `${scheme.state} ${ui[language].state}` : ui[language].central")
sa = sa.replace(">Collateral Free", ">{ui[language].free}")
sa = sa.replace(">Max Loan Amount</p>", ">{ui[language].max}</p>")
sa = sa.replace(">Capital Subsidy</p>", ">{ui[language].subPct}</p>")
sa = sa.replace("> Eligibility Criteria", "> {ui[language].elig}")
sa = sa.replace("> Mandatory Documents", "> {ui[language].doc}")
sa = sa.replace(">Apply on Official Portal</span>", ">{ui[language].btn}</span>")

with open("src/components/SchemeAdvisor.tsx", "w") as f:
    f.write(sa)
