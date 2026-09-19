import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Update the Message type
old_type = """type Message = {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  isDashboard?: boolean;
  dashboardData?: unknown;
};"""

new_type = """type Message = {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  msgKey?: keyof typeof t['English'];
  isDashboard?: boolean;
  dashboardData?: unknown;
};"""
content = content.replace(old_type, new_type)

# 2. Update dictionaries to include fallbackWarning
eng_old = "you: 'You'\n  },"
eng_new = "you: 'You',\n    fallbackWarning: '⚠️ Note: Using Local Smart-Compute Mode (API Key missing).'\n  },"
content = content.replace(eng_old, eng_new)

hin_old = "you: 'आप'\n  },"
hin_new = "you: 'आप',\n    fallbackWarning: '⚠️ ध्यान दें: स्थानीय स्मार्ट-कंप्यूट मोड का उपयोग कर रहे हैं (API Key गायब है)।'\n  },"
content = content.replace(hin_old, hin_new)

tam_old = "you: 'நீங்கள்'\n  }\n};"
tam_new = "you: 'நீங்கள்',\n    fallbackWarning: '⚠️ குறிப்பு: உள்ளூர் ஸ்மார்ட்-கணினி முறை பயன்படுத்தப்படுகிறது (API Key இல்லை).'\n  }\n};"
content = content.replace(tam_old, tam_new)

# 3. Update Initial State & handleReset
old_init = "setMessages([{ id: '1', sender: 'bot', text: t[language].loc }]);"
new_init = "setMessages([{ id: '1', sender: 'bot', msgKey: 'loc' }]);"
content = content.replace("useState<Message[]>([\n    { id: '1', sender: 'bot', text: t[language].loc }\n  ]);", "useState<Message[]>([\n    { id: '1', sender: 'bot', msgKey: 'loc' }\n  ]);")
content = content.replace(old_init, new_init) # replaces in useEffect
content = content.replace("text: t[language].loc", "msgKey: 'loc'") # replaces in handleReset

# 4. Update handleSendAction timeouts
content = content.replace("text: t[language].budget }]), 500);", "msgKey: 'budget' }]), 500);")
content = content.replace("text: t[language].skills }]), 500);", "msgKey: 'skills' }]), 500);")
content = content.replace("text: t[language].interest }]), 200);", "msgKey: 'interest' }]), 200);")

# 5. Update Fallback Warning
old_fallback_msg = """text: "⚠️ Note: Using Local Smart-Compute Mode (API Key missing).","""
new_fallback_msg = """msgKey: 'fallbackWarning',"""
content = content.replace(old_fallback_msg, new_fallback_msg)

# 6. Update JSX to render dynamically
old_jsx = """                {msg.text ? (
                  <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-gray-100 inline-block px-4 py-2 rounded-2xl rounded-tl-sm' : 'text-gray-700'}`}>
                    {msg.text}
                  </div>
                ) : null}"""

new_jsx = """                {(msg.text || msg.msgKey) ? (
                  <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-gray-100 inline-block px-4 py-2 rounded-2xl rounded-tl-sm' : 'text-gray-700'}`}>
                    {msg.msgKey ? t[language][msg.msgKey] : msg.text}
                  </div>
                ) : null}"""
content = content.replace(old_jsx, new_jsx)

# Clean up redundant useEffect that hardcodes translation on location
old_redundant = """  useEffect(() => {
    // Only auto-translate the first message if we haven't loaded a history
    if (messages.length === 1 && step === 'LOCATION') {
      setMessages([{ id: '1', sender: 'bot', text: t[language].loc }]);
    }
  }, [language, step, messages.length]);"""

content = content.replace(old_redundant, "")

with open("src/app/page.tsx", "w") as f:
    f.write(content)
