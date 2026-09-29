const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /<BusinessDashboard\n\s*businessPlan=\{msg\.dashboardData\.plan\}\n\s*financialData=\{msg\.dashboardData\.financials\}\n\s*schemes=\{msg\.dashboardData\.schemes\}\n\s*language=\{language as 'English' \| 'Hindi' \| 'Tamil'\}\n\s*\/>/g;

const replacement = `<BusinessDashboard
                    businessPlan={msg.dashboardData.plan}
                    financialData={msg.dashboardData.financials}
                    schemes={msg.dashboardData.schemes}
                    language={language as 'English' | 'Hindi' | 'Tamil'}
                    sessionId={msg.id}
                  />`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/page.tsx', content);
