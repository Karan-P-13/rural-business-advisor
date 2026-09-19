import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Change items-end to items-center on the form wrapper for better alignment
old_form = 'className="flex items-end bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2'
new_form = 'className="flex items-center bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2'
content = content.replace(old_form, new_form)

# 2. Convert textarea to input to prevent the placeholder from wrapping and clipping vertically
old_textarea = """<textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step === 'COMPLETED' ? t[language].planCompleted : t[language].typeAnswer}
            disabled={isLoading || step === 'COMPLETED'}
            className="flex-1 bg-transparent outline-none px-3 py-1.5 text-gray-700 resize-none max-h-32 text-sm sm:text-base disabled:opacity-50"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendAction();
              }
            }}
          />"""

new_input = """<input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step === 'COMPLETED' ? t[language].planCompleted : t[language].typeAnswer}
            disabled={isLoading || step === 'COMPLETED'}
            className="flex-1 bg-transparent outline-none px-3 py-2 text-gray-700 text-sm sm:text-base disabled:opacity-50 min-w-0"
          />"""

content = content.replace(old_textarea, new_input)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
