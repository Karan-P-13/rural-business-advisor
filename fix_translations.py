import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Update English Dictionary
eng_old = "analyzingIdeas: 'Analyzing your unique skills using AI to suggest the best ideas...'\n  },"
eng_new = """analyzingIdeas: 'Analyzing your unique skills using AI to suggest the best ideas...',
    sendLocation: 'Send My Current Location',
    locating: 'Locating...',
    typeAnswer: 'Type your answer or select an option above...',
    planCompleted: 'Plan completed. Click + to restart.',
    you: 'You'
  },"""
content = content.replace(eng_old, eng_new)

# 2. Update Hindi Dictionary
hin_old = "analyzingIdeas: 'सर्वोत्तम विचारों का सुझाव देने के लिए AI का उपयोग करके आपके कौशल का विश्लेषण कर रही हूँ...'\n  },"
hin_new = """analyzingIdeas: 'सर्वोत्तम विचारों का सुझाव देने के लिए AI का उपयोग करके आपके कौशल का विश्लेषण कर रही हूँ...',
    sendLocation: 'मेरा वर्तमान स्थान भेजें',
    locating: 'स्थान खोजा जा रहा है...',
    typeAnswer: 'अपना उत्तर टाइप करें या ऊपर से एक विकल्प चुनें...',
    planCompleted: 'योजना पूरी हुई। पुनः आरंभ करने के लिए + पर क्लिक करें।',
    you: 'आप'
  },"""
content = content.replace(hin_old, hin_new)

# 3. Update Tamil Dictionary
tam_old = "analyzingIdeas: 'உங்கள் திறன்களை AI மூலம் பகுப்பாய்வு செய்கிறேன்...'\n  }\n};"
tam_new = """analyzingIdeas: 'உங்கள் திறன்களை AI மூலம் பகுப்பாய்வு செய்கிறேன்...',
    sendLocation: 'என் தற்போதைய இருப்பிடத்தை அனுப்பு',
    locating: 'தேடப்படுகிறது...',
    typeAnswer: 'பதிலை உள்ளிடவும் அல்லது விருப்பத்தை தேர்ந்தெடுக்கவும்...',
    planCompleted: 'திட்டம் முடிந்தது. மீண்டும் தொடங்க + கிளிக் செய்யவும்.',
    you: 'நீங்கள்'
  }
};"""
content = content.replace(tam_old, tam_new)

# 4. Replace JSX Location String
content = content.replace("<span>{isLocating ? 'Locating...' : 'Send My Current Location'}</span>", "<span>{isLocating ? t[language].locating : t[language].sendLocation}</span>")

# 5. Replace JSX Placeholder String
content = content.replace("""placeholder={step === 'COMPLETED' ? "Plan completed. Click + to restart." : "Type your answer or select an option above..."}""", """placeholder={step === 'COMPLETED' ? t[language].planCompleted : t[language].typeAnswer}""")

# 6. Replace 'You' Label String
content = content.replace("{msg.sender === 'bot' ? 'Unnati Advisor' : 'You'}", "{msg.sender === 'bot' ? 'Unnati Advisor' : t[language].you}")

with open("src/app/page.tsx", "w") as f:
    f.write(content)
