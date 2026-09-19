import re

with open("src/components/RecommendationScreen.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'Tamil: { feas: "சாத்தியம் & தேவை", opp: "வளர்ச்சி வாய்ப்புகள்", risk: "ஆபத்து தணிப்பு அணி", riskLbl: "ஆபத்து", mitLbl: "தணிப்பு" }',
    'Tamil: { feas: "சாத்தியம் & தேவை", opp: "வளர்ச்சி வாய்ப்புகள்", risk: "ஆபத்து தணிப்பு அணி", riskLbl: "ஆபத்து", mitLbl: "தணிப்பு", score: "உள்ளூர் சாத்தியமான மதிப்பெண்" }'
)

with open("src/components/RecommendationScreen.tsx", "w") as f:
    f.write(content)
