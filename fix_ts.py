import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Fix import
content = re.sub(r'useRef(?:,\s*useRef)+', 'useRef', content)

# Fix duplicate states
content = re.sub(r'(const \[isListening, setIsListening\] = useState\(false\);\s*){2,}', r'const [isListening, setIsListening] = useState(false);\n  ', content)

# Fix duplicate startListening
content = re.sub(r'(const startListening = \(\) => \{.*?\n  \};\n\n  )(const startListening = \(\) => \{.*?\n  \};\n\n  )', r'\1', content, flags=re.DOTALL)

with open("src/app/page.tsx", "w") as f:
    f.write(content)

with open("src/components/FinancialDashboard.tsx", "r") as f:
    fin = f.read()

# Fix Tooltip name clash
fin = fin.replace("const Tooltip = ({ text }", "const InfoTooltip = ({ text }")
fin = fin.replace("<Tooltip text=", "<InfoTooltip text=")

# Fix duplicate classNames
fin = re.sub(r'className="font-bold(?:[^"]*)"\s+className="flex items-center"', 'className="font-bold flex items-center"', fin)
fin = re.sub(r'className="font-bold(?:[^"]*)"\s+className="flex items-center justify-center"', 'className="font-bold flex items-center justify-center"', fin)
fin = re.sub(r'className="text-xl font-bold text-gray-800"\s+className="flex items-center justify-center"', 'className="text-xl font-bold text-gray-800 flex items-center justify-center"', fin)
fin = re.sub(r'className="font-bold"\s+className="flex items-center"', 'className="font-bold flex items-center"', fin)
fin = re.sub(r'className="font-bold text-blue-700"\s+className="flex items-center"', 'className="font-bold text-blue-700 flex items-center"', fin)
fin = re.sub(r'className="font-bold text-emerald-700"\s+className="flex items-center"', 'className="font-bold text-emerald-700 flex items-center"', fin)
fin = re.sub(r'className="font-bold text-purple-700"\s+className="flex items-center"', 'className="font-bold text-purple-700 flex items-center"', fin)
fin = re.sub(r'className="font-bold text-gray-800"\s+className="flex items-center"', 'className="font-bold text-gray-800 flex items-center"', fin)
fin = re.sub(r'className="text-xl font-bold[^"]*"\s+className="flex items-center justify-center"', 'className="text-xl font-bold flex items-center justify-center"', fin)

with open("src/components/FinancialDashboard.tsx", "w") as f:
    f.write(fin)
