const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const newButton = `<button onClick={() => { if(window.confirm('Are you sure you want to delete all saved plans?')) { localStorage.removeItem('busidvice_sessions'); setSessions([]); } }} className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-xl font-medium text-sm hover:bg-red-50 flex items-center justify-center gap-2 transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" />
                  Clear Saved Plans
                </button>`;

content = content.replace(/<button onClick=\{\(\) => \{ localStorage.removeItem\('busidvice_sessions'\); setSessions\(\[\]\); \}\} className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors">\s*Clear History \(For Demo\)\s*<\/button>/, newButton);

fs.writeFileSync('src/app/page.tsx', content);
