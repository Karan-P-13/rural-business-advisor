const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix duplicate isListening
page = page.replace(/const \[isListening, setIsListening\] = useState\(false\);\n  const \[isListening, setIsListening\] = useState\(false\);/g, 'const [isListening, setIsListening] = useState(false);');

fs.writeFileSync('src/app/page.tsx', page);

let fin = fs.readFileSync('src/components/FinancialDashboard.tsx', 'utf8');

fin = fin.replace(/className="font-bold"\s+className="flex items-center"/g, 'className="font-bold flex items-center"');
fin = fin.replace(/className="font-bold text-emerald-700"\s+className="flex items-center"/g, 'className="font-bold text-emerald-700 flex items-center"');
fin = fin.replace(/className="text-xl font-bold text-gray-800"\s+className="flex items-center justify-center"/g, 'className="text-xl font-bold text-gray-800 flex items-center justify-center"');
fin = fin.replace(/className="text-xl font-bold text-gray-800 flex items-center justify-center"\s+className="flex items-center justify-center"/g, 'className="text-xl font-bold text-gray-800 flex items-center justify-center"');

fs.writeFileSync('src/components/FinancialDashboard.tsx', fin);
