const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// There are probably multiple lines of isListening
let lines = page.split('\n');
let filteredLines = [];
let foundIsListening = false;
for (let line of lines) {
  if (line.includes('const [isListening, setIsListening] = useState(false)')) {
    if (foundIsListening) continue; // skip duplicates
    foundIsListening = true;
  }
  filteredLines.push(line);
}
fs.writeFileSync('src/app/page.tsx', filteredLines.join('\n'));

let fin = fs.readFileSync('src/components/FinancialDashboard.tsx', 'utf8');
fin = fin.replace(/className="[^"]*"\s+className="([^"]*)"/g, 'className="$1"');
fs.writeFileSync('src/components/FinancialDashboard.tsx', fin);
