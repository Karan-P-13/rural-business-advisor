import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

content = content.replace("Bot, User", "Bot, User, Sparkles")
content = content.replace('<Bot className="w-5 h-5 text-white" />', '<Sparkles className="w-5 h-5 text-white" />')
content = content.replace('<Bot className="w-5 h-5" />', '<Sparkles className="w-5 h-5" />')

with open("src/app/page.tsx", "w") as f:
    f.write(content)
