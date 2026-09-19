import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Update skillCategories to include translations
old_cats = """const skillCategories = [
  { name: 'Agriculture & Farming', keywords: ['farm', 'agri', 'crop', 'soil', 'tractor', 'plant'] },
  { name: 'Handicrafts & Tailoring', keywords: ['sew', 'tailor', 'stitch', 'craft', 'weave', 'cloth', 'pottery'] },
  { name: 'Retail & Food', keywords: ['cook', 'shop', 'sell', 'food', 'bake', 'grocery'] },
  { name: 'Manufacturing', keywords: ['make', 'factory', 'assemble', 'machine', 'produce'] },
  { name: 'Electronics & Repair', keywords: ['fix', 'repair', 'phone', 'tv', 'electric', 'wire'] },
  { name: 'Construction & Carpentry', keywords: ['build', 'wood', 'carpenter', 'mason', 'cement', 'paint'] },
  { name: 'Beauty & Wellness', keywords: ['salon', 'hair', 'makeup', 'beauty', 'spa'] },
  { name: 'IT & Digital Services', keywords: ['computer', 'type', 'print', 'online', 'data', 'internet'] },
  { name: 'Transport & Logistics', keywords: ['drive', 'car', 'truck', 'deliver', 'transport'] }
];"""

new_cats = """const skillCategories = [
  { name: 'Agriculture & Farming', labelHindi: 'कृषि और खेती', labelTamil: 'விவசாயம் & பண்ணை', keywords: ['farm', 'agri', 'crop', 'soil', 'tractor', 'plant'] },
  { name: 'Handicrafts & Tailoring', labelHindi: 'हस्तशिल्प और सिलाई', labelTamil: 'கைவினைப் பொருட்கள் & தையல்', keywords: ['sew', 'tailor', 'stitch', 'craft', 'weave', 'cloth', 'pottery'] },
  { name: 'Retail & Food', labelHindi: 'रिटेल और भोजन', labelTamil: 'சில்லறை & உணவு', keywords: ['cook', 'shop', 'sell', 'food', 'bake', 'grocery'] },
  { name: 'Manufacturing', labelHindi: 'विनिर्माण', labelTamil: 'உற்பத்தி', keywords: ['make', 'factory', 'assemble', 'machine', 'produce'] },
  { name: 'Electronics & Repair', labelHindi: 'इलेक्ट्रॉनिक्स और मरम्मत', labelTamil: 'எலக்ட்ரானிக்ஸ் & பழுதுபார்ப்பு', keywords: ['fix', 'repair', 'phone', 'tv', 'electric', 'wire'] },
  { name: 'Construction & Carpentry', labelHindi: 'निर्माण और बढ़ईगीरी', labelTamil: 'கட்டுமானம் & தச்சு', keywords: ['build', 'wood', 'carpenter', 'mason', 'cement', 'paint'] },
  { name: 'Beauty & Wellness', labelHindi: 'सौंदर्य और कल्याण', labelTamil: 'அழகு & நல்வாழ்வு', keywords: ['salon', 'hair', 'makeup', 'beauty', 'spa'] },
  { name: 'IT & Digital Services', labelHindi: 'आईटी और डिजिटल सेवाएं', labelTamil: 'ஐடி & டிஜிட்டல் சேவைகள்', keywords: ['computer', 'type', 'print', 'online', 'data', 'internet'] },
  { name: 'Transport & Logistics', labelHindi: 'परिवहन और रसद', labelTamil: 'போக்குவரத்து & தளவாடங்கள்', keywords: ['drive', 'car', 'truck', 'deliver', 'transport'] }
];"""

content = content.replace(old_cats, new_cats)

# Update the JSX rendering
old_jsx = """                    {step === 'SKILLS' ? skillCategories.map(c => (
                      <button key={c.name} onClick={() => handleSendAction(c.name)} className="touch-manipulation bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-100 border border-amber-200 transition">
                        {c.name}
                      </button>
                    )) : null}"""

new_jsx = """                    {step === 'SKILLS' ? skillCategories.map(c => {
                      const label = language === 'Hindi' ? (c.labelHindi || c.name) : language === 'Tamil' ? (c.labelTamil || c.name) : c.name;
                      return (
                      <button key={c.name} onClick={() => handleSendAction(label)} className="touch-manipulation bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-100 border border-amber-200 transition">
                        {label}
                      </button>
                    )}) : null}"""

content = content.replace(old_jsx, new_jsx)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
