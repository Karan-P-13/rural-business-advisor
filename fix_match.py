import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

old_match = """            const matchedCategory = skillCategories.find(c => 
              c.name.toLowerCase() === lowerInput || 
              c.keywords.some(k => lowerInput.includes(k))
            )?.name || 'Agriculture & Farming';"""

new_match = """            const matchedCategory = skillCategories.find(c => 
              c.name.toLowerCase() === lowerInput || 
              (c.labelHindi && c.labelHindi.toLowerCase() === lowerInput) ||
              (c.labelTamil && c.labelTamil.toLowerCase() === lowerInput) ||
              c.keywords.some(k => lowerInput.includes(k))
            )?.name || 'Agriculture & Farming';"""

content = content.replace(old_match, new_match)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
