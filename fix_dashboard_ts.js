const fs = require('fs');
let content = fs.readFileSync('src/components/BusinessDashboard.tsx', 'utf8');

// Fix duplicate useState
content = content.replace(/import \{ useState \} from 'react';\n/, '');

// Fix function signature to accept sessionId
content = content.replace(
  /export default function BusinessDashboard\(\{ businessPlan, financialData, schemes, language = "English" \}: BusinessDashboardProps\) \{/,
  `export default function BusinessDashboard({ businessPlan, financialData, schemes, language = "English", sessionId }: BusinessDashboardProps) {`
);

fs.writeFileSync('src/components/BusinessDashboard.tsx', content);
