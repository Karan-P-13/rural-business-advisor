const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Find start and end of triggerFallbackDashboard
const startStr = "const triggerFallbackDashboard = (data: typeof formData) => {";
const startIdx = page.indexOf(startStr);

if (startIdx !== -1) {
  // Find the exact matching closing brace
  let braceCount = 0;
  let endIdx = -1;
  let started = false;
  
  for (let i = startIdx; i < page.length; i++) {
    if (page[i] === '{') {
      braceCount++;
      started = true;
    } else if (page[i] === '}') {
      braceCount--;
    }
    
    if (started && braceCount === 0) {
      endIdx = i;
      break;
    }
  }
  
  if (endIdx !== -1) {
    page = page.substring(0, startIdx) + page.substring(endIdx + 1);
  }
}

fs.writeFileSync('src/app/page.tsx', page);
