import re

with open("src/components/BusinessDashboard.tsx", "r") as f:
    content = f.read()

# Make the wrapper card pop more
content = content.replace('bg-gray-100', 'bg-slate-50/50')
content = content.replace('bg-white px-6 py-4 border-b border-gray-200', 'bg-gradient-to-r from-white to-slate-50 px-6 py-5 border-b border-slate-200/80')
content = content.replace('text-gray-800', 'text-slate-900 tracking-tight')
content = content.replace('text-gray-500', 'text-slate-500 font-medium')

# Improve tabs
content = content.replace('bg-gray-100 flex-shrink-0', 'bg-slate-50/80 flex-shrink-0')
content = content.replace('border-b border-gray-300', 'border-b border-slate-200/80')

# Better Tab Active States
content = content.replace('border-emerald-600 text-emerald-700 bg-white rounded-t-lg', 'border-emerald-500 text-emerald-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]')
content = content.replace('border-blue-600 text-blue-700 bg-white rounded-t-lg', 'border-blue-500 text-blue-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]')
content = content.replace('border-purple-600 text-purple-700 bg-white rounded-t-lg', 'border-purple-500 text-purple-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]')
content = content.replace('border-transparent text-gray-600 hover:text-gray-900', 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-xl')

with open("src/components/BusinessDashboard.tsx", "w") as f:
    f.write(content)
