import re
import os

# 1. Update layout.tsx
with open("src/app/layout.tsx", "r") as f:
    layout = f.read()
layout = layout.replace('title: "Unnati Advisor",', 'title: "BusiDvice",')
layout = layout.replace('title: "Unnati",', 'title: "BusiDvice",')
with open("src/app/layout.tsx", "w") as f:
    f.write(layout)

# 2. Update page.tsx
with open("src/app/page.tsx", "r") as f:
    page = f.read()
# English
page = page.replace("I am Unnati, your", "I am BusiDvice, your")
# Hindi (नमस्ते! मैं उन्नति हूँ,)
page = page.replace("मैं उन्नति हूँ", "मैं BusiDvice हूँ")
# Tamil (வணக்கம்! நான் உன்னதி,)
page = page.replace("நான் உன்னதி,", "நான் BusiDvice,")

# UI Elements
page = page.replace(">Unnati</h1>", ">BusiDvice</h1>")
page = page.replace("? 'Unnati Advisor' :", "? 'BusiDvice' :")
page = page.replace(">Unnati Advisor</span>", ">BusiDvice</span>")
with open("src/app/page.tsx", "w") as f:
    f.write(page)

# 3. Update BusinessDashboard.tsx
with open("src/components/BusinessDashboard.tsx", "r") as f:
    dashboard = f.read()
dashboard = dashboard.replace("Unnati Fintech Advisor", "BusiDvice Fintech Advisor")
with open("src/components/BusinessDashboard.tsx", "w") as f:
    f.write(dashboard)

# 4. Update manifest.json
if os.path.exists("public/manifest.json"):
    with open("public/manifest.json", "r") as f:
        manifest = f.read()
    manifest = manifest.replace('"Unnati Advisor"', '"BusiDvice"')
    manifest = manifest.replace('"Unnati"', '"BusiDvice"')
    with open("public/manifest.json", "w") as f:
        f.write(manifest)

# 5. Update Chatbot.tsx (leftover/obsolete but good practice)
if os.path.exists("src/components/Chatbot.tsx"):
    with open("src/components/Chatbot.tsx", "r") as f:
        chatbot = f.read()
    chatbot = chatbot.replace("Unnati Advisory", "BusiDvice")
    chatbot = chatbot.replace("Unnati", "BusiDvice")
    with open("src/components/Chatbot.tsx", "w") as f:
        f.write(chatbot)

