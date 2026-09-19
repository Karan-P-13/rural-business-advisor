import re

with open("src/app/page.tsx", "r") as f:
    page = f.read()

# Delete triggerFallbackDashboard function
page = re.sub(r'const triggerFallbackDashboard = \([\s\S]*?\} \];[\s\S]*?setMessages\(\(prev\) => \[\.\.\.prev, dashboardMsg\]\);\n  \};', '', page)

with open("src/app/page.tsx", "w") as f:
    f.write(page)
