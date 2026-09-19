import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Remove the side-effect from triggerFallbackDashboard
old_fallback_set = """    setMessages((prev) => {
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
    });"""

new_fallback_set = """    setMessages((prev) => [...prev, fallbackMsg]);"""
content = content.replace(old_fallback_set, new_fallback_set)


# 2. Remove the side-effect from API success block
old_api_set = """        setMessages((prev) => {
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
        });"""

new_api_set = """        setMessages((prev) => [...prev, dashboardMsg]);"""
content = content.replace(old_api_set, new_api_set)


# 3. Add the clean useEffect for saving sessions
effect_hook = """  // Save Current Chat on Change
  useEffect(() => {
    if (messages.length > 1 || step !== 'LOCATION') {
      localStorage.setItem('unnati_current_chat', JSON.stringify({ 
        savedMessages: messages, 
        savedStep: step, 
        savedFormData: formData 
      }));
    }
  }, [messages, step, formData]);"""

new_effect_hook = """  // Save Current Chat on Change
  useEffect(() => {
    if (messages.length > 1 || step !== 'LOCATION') {
      localStorage.setItem('unnati_current_chat', JSON.stringify({ 
        savedMessages: messages, 
        savedStep: step, 
        savedFormData: formData 
      }));
    }
  }, [messages, step, formData]);

  // Clean Session Saving (React Strict Mode Safe)
  useEffect(() => {
    if (step === 'COMPLETED' && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.isDashboard && lastMsg.dashboardData) {
        setSessions(prev => {
          // Check if we already saved this exact dashboard message to avoid duplicates in Strict Mode
          if (prev.some(p => p.messages.length > 0 && p.messages[p.messages.length - 1].id === lastMsg.id)) {
            return prev;
          }
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const title = (lastMsg.dashboardData as any).plan?.title || 'Business Plan';
          const newSession = {
            id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
            title,
            date: Date.now(),
            messages: messages
          };
          
          const updated = [newSession, ...prev];
          localStorage.setItem('unnati_sessions', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [step, messages]);"""

content = content.replace(effect_hook, new_effect_hook)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
