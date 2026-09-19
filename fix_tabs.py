import re

with open("src/components/BusinessDashboard.tsx", "r") as f:
    content = f.read()

# 1. Add horizontal scrolling to the tabs container
old_tab_container = '<div className="flex space-x-2 border-b border-gray-300">'
new_tab_container = '<div className="flex space-x-2 border-b border-gray-300 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>'
content = content.replace(old_tab_container, new_tab_container)

# 2. Prevent the buttons from shrinking and force text to stay on one line
content = content.replace(
    'className={`flex items-center space-x-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors',
    'className={`flex-shrink-0 whitespace-nowrap flex items-center space-x-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors'
)

with open("src/components/BusinessDashboard.tsx", "w") as f:
    f.write(content)
