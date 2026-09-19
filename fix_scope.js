const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// The floating code should be inside the useEffect for saving sessions
// Let's find it.
const floatingCode = `      if (lastMsg.isDashboard && lastMsg.dashboardData) {
        setSessions(prev => {`;

const correctCode = `
  useEffect(() => {
    if (step === 'COMPLETED' && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.isDashboard && lastMsg.dashboardData) {
        setSessions(prev => {`;

page = page.replace(floatingCode, correctCode);

fs.writeFileSync('src/app/page.tsx', page);
