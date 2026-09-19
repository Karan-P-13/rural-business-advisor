const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// I suspect my triggerFallbackDashboard replacement deleted too much or too little.
// Let's count { and }
let open = 0, close = 0;
for (let char of page) {
    if (char === '{') open++;
    if (char === '}') close++;
}
console.log("Open:", open, "Close:", close);

if (close > open) {
    // Remove extra closing braces at the end
    let diff = close - open;
    while(diff > 0) {
        page = page.replace(/}\s*$/, '');
        diff--;
    }
} else if (open > close) {
    let diff = open - close;
    while(diff > 0) {
        page += '\n}';
        diff--;
    }
}
fs.writeFileSync('src/app/page.tsx', page);
