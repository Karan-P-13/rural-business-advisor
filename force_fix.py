import re

# Fix page.tsx
with open("src/app/page.tsx", "r") as f:
    page = f.read()

page = re.sub(r'const \[isListening, setIsListening\] = useState\(false\);\n+', 'const [isListening, setIsListening] = useState(false);\n', page)
# Find the startListening function block and only keep the first one
parts = page.split('const startListening = () => {')
if len(parts) > 2:
    # It exists multiple times
    new_page = parts[0] + 'const startListening = () => {' + parts[1]
    # The second one goes until the next function
    rest = 'const fetchLocation = () => {' + parts[-1].split('const fetchLocation = () => {')[1]
    page = new_page + rest

with open("src/app/page.tsx", "w") as f:
    f.write(page)


# Fix FinancialDashboard.tsx
with open("src/components/FinancialDashboard.tsx", "r") as f:
    fin = f.read()

fin = fin.replace('className="font-bold" className="flex items-center"', 'className="font-bold flex items-center"')
fin = fin.replace('className="font-bold text-emerald-700" className="flex items-center"', 'className="font-bold text-emerald-700 flex items-center"')
fin = fin.replace('className="font-bold text-blue-700" className="flex items-center"', 'className="font-bold text-blue-700 flex items-center"')
fin = fin.replace('className="font-bold text-purple-700" className="flex items-center"', 'className="font-bold text-purple-700 flex items-center"')
fin = fin.replace('className="text-xl font-bold text-gray-800" className="flex items-center justify-center"', 'className="text-xl font-bold text-gray-800 flex items-center justify-center"')

with open("src/components/FinancialDashboard.tsx", "w") as f:
    f.write(fin)
