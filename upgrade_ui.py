import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Upgrade overall background and header
content = content.replace('bg-[#f3f4f6]', 'bg-slate-50/50')
content = content.replace('bg-white border-b border-gray-200', 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm')
content = content.replace('text-gray-600 tracking-wide', 'text-slate-800 font-bold tracking-tight')

# 2. Upgrade Chat Message Bubbles and Avatars
old_msg_render = """              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.sender === 'bot' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[13px] text-gray-800 block mb-2">
                  {msg.sender === 'bot' ? 'BusiDvice' : t[language].you}
                </span>
                {(msg.text || msg.msgKey) ? (
                  <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-gray-100 inline-block px-4 py-2 rounded-2xl rounded-tl-sm' : 'text-gray-700'}`}>
                    {msg.msgKey ? t[language][msg.msgKey] : msg.text}
                  </div>
                ) : null}"""

new_msg_render = """              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.sender === 'bot' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-600 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-indigo-500 text-white'}`}>
                {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block mb-2">
                  {msg.sender === 'bot' ? 'BusiDvice' : t[language].you}
                </span>
                {(msg.text || msg.msgKey) ? (
                  <div className={`text-base leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-white border border-slate-100 shadow-sm inline-block px-5 py-3 rounded-2xl rounded-tl-sm text-slate-700' : 'text-slate-800'}`}>
                    {msg.msgKey ? t[language][msg.msgKey] : msg.text}
                  </div>
                ) : null}"""
content = content.replace(old_msg_render, new_msg_render)

# 3. Upgrade Action Pills (Make them pop with shadow and transforms)
content = content.replace('className="touch-manipulation bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 border border-blue-200 transition"', 
                          'className="touch-manipulation bg-white shadow-sm border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300 hover:text-blue-700 transition-all"')

content = content.replace('className="touch-manipulation bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-100 border border-emerald-200 transition"',
                          'className="touch-manipulation bg-white shadow-sm border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300 hover:text-emerald-700 transition-all"')

content = content.replace('className="touch-manipulation bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-100 border border-amber-200 transition"',
                          'className="touch-manipulation bg-white shadow-sm border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md hover:border-amber-400 hover:text-amber-800 transition-all"')

content = content.replace('className="touch-manipulation bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-100 border border-purple-200 transition"',
                          'className="touch-manipulation bg-white shadow-sm border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md hover:border-purple-300 hover:text-purple-700 transition-all"')

# 4. Upgrade Input Footer
old_footer = 'bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 sm:py-4 z-20'
new_footer = 'bg-white/80 backdrop-blur-xl border-t border-slate-200/60 px-4 py-3 sm:py-4 z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]'
content = content.replace(old_footer, new_footer)

old_form = 'bg-gray-100 border border-gray-200 rounded-[2rem] px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-200 focus-within:bg-white transition-all'
new_form = 'bg-slate-100/80 border border-slate-200/60 rounded-full px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/40 focus-within:bg-white transition-all duration-300'
content = content.replace(old_form, new_form)

content = content.replace('text-gray-700 text-sm sm:text-base', 'text-slate-800 text-base font-medium placeholder:text-slate-400')

with open("src/app/page.tsx", "w") as f:
    f.write(content)
