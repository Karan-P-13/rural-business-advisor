import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Use regex to safely inject the language prop right after schemes prop
content = re.sub(
    r'(schemes=\{\(msg\.dashboardData as any\)\.schemes\})',
    r'\1\n                      language={language}',
    content
)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
