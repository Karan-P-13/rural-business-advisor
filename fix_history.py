import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Add new lucide-react icons
content = content.replace("from 'lucide-react';", ", X, MessageSquare, Clock } from 'lucide-react';")
content = content.replace("Menu, X, MessageSquare, Clock", "Menu") # cleanup if multiple runs

import_icons = "import { Send, MapPin, Mic, Globe, Bot, User, Loader2, Plus, Menu, X, MessageSquare, Clock } from 'lucide-react';"
content = re.sub(r"import \{ .* \} from 'lucide-react';", import_icons, content)

# Add states
state_block = """  const [isLocating, setIsLocating] = useState(false);
  const [dynamicIdeas, setDynamicIdeas] = useState<string[]>([]);"""

new_state_block = """  const [isLocating, setIsLocating] = useState(false);
  const [dynamicIdeas, setDynamicIdeas] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<{id:string, title:string, date:number, messages:Message[]}[]>([]);"""
content = content.replace(state_block, new_state_block)

# Add useEffects for localStorage
effect_block = """  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 1 && step === 'LOCATION') {
      setMessages([{ id: '1', sender: 'bot', text: t[language].loc }]);
    }
  }, [language, step, messages.length]);"""

new_effect_block = """  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('unnati_sessions');
    if (saved) setSessions(JSON.parse(saved));
    
    const currentChat = localStorage.getItem('unnati_current_chat');
    if (currentChat) {
      try {
        const { savedMessages, savedStep, savedFormData } = JSON.parse(currentChat);
        if (savedMessages && savedMessages.length > 0) setMessages(savedMessages);
        if (savedStep) setStep(savedStep);
        if (savedFormData) setFormData(savedFormData);
      } catch (e) {
        console.error("Failed to parse local storage");
      }
    }
  }, []);

  // Save Current Chat on Change
  useEffect(() => {
    if (messages.length > 1 || step !== 'LOCATION') {
      localStorage.setItem('unnati_current_chat', JSON.stringify({ 
        savedMessages: messages, 
        savedStep: step, 
        savedFormData: formData 
      }));
    }
  }, [messages, step, formData]);

  useEffect(() => {
    // Only auto-translate the first message if we haven't loaded a history
    if (messages.length === 1 && step === 'LOCATION') {
      setMessages([{ id: '1', sender: 'bot', text: t[language].loc }]);
    }
  }, [language, step, messages.length]);"""
content = content.replace(effect_block, new_effect_block)

# Add loadSession function
reset_fn = """  const handleReset = () => {
    setStep('LOCATION');
    setFormData({ location: '', budget: '', skills: '', interest: '' });
    setDynamicIdeas([]);
    setMessages([{
      id: Date.now().toString(),
      sender: 'bot',
      text: t[language].loc
    }]);
  };"""

new_reset_fn = """  const handleReset = () => {
    localStorage.removeItem('unnati_current_chat');
    setStep('LOCATION');
    setFormData({ location: '', budget: '', skills: '', interest: '' });
    setDynamicIdeas([]);
    setMessages([{
      id: Date.now().toString(),
      sender: 'bot',
      text: t[language].loc
    }]);
  };

  const loadSession = (session: {id:string, title:string, date:number, messages:Message[]}) => {
    setMessages(session.messages);
    setStep('COMPLETED');
    setIsSidebarOpen(false);
  };"""
content = content.replace(reset_fn, new_reset_fn)

# Save sessions when dashboard triggers (in triggerFallbackDashboard)
old_fallback_set = """    setMessages((prev) => [...prev, fallbackMsg]);
    setStep('COMPLETED');
  };"""

new_fallback_set = """    setMessages((prev) => {
      const newMessages = [...prev, fallbackMsg];
      const newSession = {
        id: Date.now().toString(),
        title: planTitle || 'Offline Business Plan',
        date: Date.now(),
        messages: newMessages
      };
      setSessions(s => {
        const updated = [newSession, ...s];
        localStorage.setItem('unnati_sessions', JSON.stringify(updated));
        return updated;
      });
      return newMessages;
    });
    setStep('COMPLETED');
  };"""
content = content.replace(old_fallback_set, new_fallback_set)

# Save sessions when dashboard triggers (in API success)
old_api_set = """        setMessages((prev) => [...prev, dashboardMsg]);
      } catch (e) {"""

new_api_set = """        setMessages((prev) => {
          const newMessages = [...prev, dashboardMsg];
          const newSession = {
            id: Date.now().toString(),
            title: result.plan.businessName || 'Business Plan',
            date: Date.now(),
            messages: newMessages
          };
          setSessions(s => {
            const updated = [newSession, ...s];
            localStorage.setItem('unnati_sessions', JSON.stringify(updated));
            return updated;
          });
          return newMessages;
        });
      } catch (e) {"""
content = content.replace(old_api_set, new_api_set)

# Update Menu button to open sidebar
menu_old = """<Menu className="w-6 h-6 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition" />"""
menu_new = """<Menu onClick={() => setIsSidebarOpen(true)} className="w-8 h-8 text-gray-600 cursor-pointer hover:bg-gray-200 rounded-full p-1.5 transition" />"""
content = content.replace(menu_old, menu_new)

# Add sidebar JSX right before <header>
header_old = """<header className="flex items-center"""
sidebar_jsx = """      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
           <h2 className="font-semibold text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4"/> Chat History</h2>
           <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition"><X className="w-5 h-5 text-gray-500"/></button>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
           {sessions.length === 0 ? (
             <div className="text-sm text-gray-400 text-center mt-10">No saved plans yet.</div>
           ) : (
             sessions.map(s => (
               <button key={s.id} onClick={() => loadSession(s)} className="w-full text-left p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl transition flex items-start gap-3 group border border-gray-100 hover:border-emerald-200 shadow-sm">
                 <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 mt-0.5 flex-shrink-0" />
                 <div className="overflow-hidden">
                   <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 truncate">{s.title}</p>
                   <p className="text-xs text-gray-400 mt-1">{new Date(s.date).toLocaleDateString()} • {new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
               </button>
             ))
           )}
         </div>
         <div className="p-4 border-t bg-gray-50">
            <button onClick={() => { handleReset(); setIsSidebarOpen(false); }} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> New Business Plan
            </button>
         </div>
      </div>

      <header className="flex items-center"""
content = content.replace(header_old, sidebar_jsx)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
