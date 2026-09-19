import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Update the chat area padding to clear a solid footer properly
old_chat_area = 'className="flex-1 overflow-y-auto pb-56 pt-4 px-4 sm:px-0"'
new_chat_area = 'className="flex-1 overflow-y-auto pb-40 pt-4 px-4 sm:px-0"'
content = content.replace(old_chat_area, new_chat_area)

# 2. Rebuild the fixed footer to be structurally simple and solid (no pointer-event hacks)
old_footer_start = 'className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-4 pointer-events-none"'
new_footer_start = 'className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 sm:py-4 z-20" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}'
content = content.replace(old_footer_start, new_footer_start)

# 3. Remove pointer-events-auto from the form
old_form = 'className="flex items-end bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all pointer-events-auto"'
new_form = 'className="flex items-end bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all"'
content = content.replace(old_form, new_form)

# 4. Add touch-manipulation to all action pill buttons to prevent 300ms mobile tap delay
content = content.replace('className="flex items-center space-x-1.5 bg-blue-50', 'className="touch-manipulation flex items-center space-x-1.5 bg-blue-50')
content = content.replace('className="bg-emerald-50 text-emerald-700', 'className="touch-manipulation bg-emerald-50 text-emerald-700')
content = content.replace('className="bg-amber-50 text-amber-700', 'className="touch-manipulation bg-amber-50 text-amber-700')
content = content.replace('className="bg-purple-50 text-purple-700', 'className="touch-manipulation bg-purple-50 text-purple-700')

with open("src/app/page.tsx", "w") as f:
    f.write(content)
