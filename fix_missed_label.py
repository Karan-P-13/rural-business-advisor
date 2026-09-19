import re

with open("src/components/RecommendationScreen.tsx", "r") as f:
    content = f.read()

# Add translation for "Hyper-Local Viability Score"
content = content.replace(
    'English: { feas: "Feasibility & Demand", opp: "Growth Opportunities", risk: "Risk Mitigation Matrix", riskLbl: "Risk", mitLbl: "Mitigation" },',
    'English: { feas: "Feasibility & Demand", opp: "Growth Opportunities", risk: "Risk Mitigation Matrix", riskLbl: "Risk", mitLbl: "Mitigation", score: "Hyper-Local Viability Score" },'
)
content = content.replace(
    'Hindi: { feas: "व्यवहार्यता और मांग", opp: "विकास के अवसर", risk: "जोखिम न्यूनीकरण मैट्रिक्स", riskLbl: "जोखिम", mitLbl: "न्यूनीकरण" },',
    'Hindi: { feas: "व्यवहार्यता और मांग", opp: "विकास के अवसर", risk: "जोखिम न्यूनीकरण मैट्रिक्स", riskLbl: "जोखिम", mitLbl: "न्यूनीकरण", score: "हाइपर-लोकल व्यवहार्यता स्कोर" },'
)
content = content.replace(
    'Tamil: { feas: "சாத்தியம் & தேவை", opp: "வளர்ச்சி வாய்ப்புகள்", risk: "ஆபத்து தணிப்பு அணி", riskLbl: "ஆபத்து", mitLbl: "தணிப்பு" },',
    'Tamil: { feas: "சாத்தியம் & தேவை", opp: "வளர்ச்சி வாய்ப்புகள்", risk: "ஆபத்து தணிப்பு அணி", riskLbl: "ஆபத்து", mitLbl: "தணிப்பு", score: "உள்ளூர் சாத்தியமான மதிப்பெண்" },'
)

# Apply it in JSX
content = content.replace('>Hyper-Local Viability Score</p>', '>{ui[language].score}</p>')

with open("src/components/RecommendationScreen.tsx", "w") as f:
    f.write(content)
