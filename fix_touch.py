import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Fix h-screen to h-[100dvh] for mobile browsers
content = content.replace('className="flex flex-col h-screen bg-[#f3f4f6]', 'className="flex flex-col h-[100dvh] bg-[#f3f4f6]')

# 2. Fix the pointer-events blocking issue on the bottom gradient
old_footer = 'className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-4"'
new_footer = 'className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-4 pointer-events-none"'
content = content.replace(old_footer, new_footer)

old_form = 'className="flex items-end bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all"'
new_form = 'className="flex items-end bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all pointer-events-auto"'
content = content.replace(old_form, new_form)

# 3. Increase bottom padding on the chat container so it scrolls well above the fixed footer
old_chat_area = 'className="flex-1 overflow-y-auto pb-48 pt-4 px-4 sm:px-0"'
new_chat_area = 'className="flex-1 overflow-y-auto pb-56 pt-4 px-4 sm:px-0"'
content = content.replace(old_chat_area, new_chat_area)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
