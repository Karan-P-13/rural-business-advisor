const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!content.includes('Clear History')) {
  content = content.replace(
    /<div className="flex-1 overflow-y-auto p-3 space-y-2">/,
    `<div className="flex-1 overflow-y-auto p-3 space-y-2 flex flex-col">`
  );
  
  content = content.replace(
    /<\/div>\n          <\/div>\n        <\/div>\n      \)}/,
    `  <div className="p-4 border-t border-slate-200 mt-auto">
                <button onClick={() => { localStorage.removeItem('busidvice_sessions'); setSessions([]); }} className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors">
                  Clear History (For Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}`
  );
  fs.writeFileSync('src/app/page.tsx', content);
}
