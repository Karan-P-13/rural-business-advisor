'use client';

import React, { useState, useEffect, useRef } from 'react';
import LZString from 'lz-string';
import BusinessDashboard from '@/components/BusinessDashboard';
import SkeletonDashboard from '@/components/SkeletonDashboard';
import GlareHover from '@/components/GlareHover';
import { extraPrompts } from "../lib/t";
import { missingPrompts } from "../lib/t2";
import { MoreVertical, Edit2, Share2, Download, Volume2, Send, MapPin, Mic, Globe, Sparkles, User, Loader2, Plus, Menu, Moon, Sun, X, MessageSquare, Clock, Camera, Trash2 } from 'lucide-react';

type Language = string;
type Step = 'LOCATION' | 'BUDGET' | 'SKILLS' | 'INTEREST' | 'COMPLETED';

interface Message {
  id: string;
  text?: string;
  msgKey?: string;
  sender: 'bot' | 'user';
  isDashboard?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dashboardData?: any;
}

interface Session {
  id: string;
  title: string;
  date: number;
  messages: Message[];
}

const t: Record<string, any> = { ...extraPrompts, 
  English: {
    loc: "Welcome to BusiDvice. I am your AI business advisor.\n\nTo begin, please share your city or district so I can analyze hyper-local market opportunities for you.",
    budget: "Excellent. What is your estimated total capital for starting this business? (e.g., ₹10,000, ₹50,000, ₹1,00,000)",
    skills: "Perfect. What are your primary skills, trades, or background experiences? (e.g., Farming, Tailoring, Electronics Repair)",
    interest: "Understood. Finally, what specific type of business or sector are you most interested in exploring?",
    completed: "Generating your personalized business plan...",
    error: "Something went wrong. Please try again.",
    analyzingIdeas: "Analyzing your skills with AI...",
    sendLocation: "📍 Send My Current Location",
    locating: "Detecting location...",
    typeAnswer: "Type your answer or use a quick option above...",
    prevPlans: "Previous Plans",
    noPlans: "No saved plans yet.",
    planCompleted: "✅ Plan completed. Click + to restart.",
    you: "You",
  },
  Hindi: {
    loc: "BusiDvice में आपका स्वागत है। मैं आपका AI व्यापार सलाहकार हूँ।\n\nशुरू करने के लिए, कृपया अपना शहर या जिला साझा करें ताकि मैं आपके लिए स्थानीय बाजार के अवसरों का विश्लेषण कर सकूं।",
    budget: "उत्कृष्ट। इस व्यवसाय को शुरू करने के लिए आपकी अनुमानित कुल पूंजी कितनी है? (जैसे ₹10,000, ₹50,000, ₹1,00,000)",
    skills: "बिल्कुल सही। आपके प्राथमिक कौशल, व्यापार या पृष्ठभूमि अनुभव क्या हैं? (जैसे खेती, सिलाई, इलेक्ट्रॉनिक्स मरम्मत)",
    interest: "समझ गया। अंततः, आप किस विशिष्ट प्रकार का व्यवसाय शुरू करने में सबसे अधिक रुचि रखते हैं?",
    completed: "आपकी व्यक्तिगत व्यवसाय योजना तैयार की जा रही है...",
    error: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    analyzingIdeas: "AI के साथ आपके कौशल का विश्लेषण किया जा रहा है...",
    sendLocation: "📍 मेरा वर्तमान स्थान भेजें",
    locating: "स्थान का पता लगाया जा रहा है...",
    typeAnswer: "अपना उत्तर टाइप करें या ऊपर दिए विकल्प चुनें...",
    planCompleted: "✅ योजना पूरी हुई। पुनः शुरू करने के लिए + दबाएं।",
    you: "आप",
  },
  Tamil: {
    loc: "👋 BusiDvice-க்கு வரவேற்கிறோம்! நான் உங்கள் AI வணிக ஆலோசகர்.\n\nஉங்கள் இருப்பிடத்தை பகிர்ந்துகொள்ளுங்கள், நான் உங்களுக்கு உள்ளூர் வாய்ப்புகளை கண்டறிவேன்.",
    budget: "சிறப்பு. இந்த தொழிலை தொடங்க உங்கள் மதிப்பிடப்பட்ட மொத்த மூலதனம் என்ன? (எ.கா. ₹10,000, ₹50,000, ₹1,00,000)",
    skills: "சரியாக இருக்கிறது. உங்கள் முதன்மை திறன்கள், அல்லது பின்னணி அனுபவங்கள் என்ன? (எ.கா. விவசாயம், தையல், எலக்ட்ரானிக்ஸ் பழுது)",
    interest: "புரிந்தது. இறுதியாக, நீங்கள் எந்த குறிப்பிட்ட வகை தொழிலை தொடங்க மிகவும் ஆர்வமாக உள்ளீர்கள்?",
    completed: "உங்கள் தனிப்பயன் வணிகத் திட்டம் உருவாக்கப்படுகிறது...",
    error: "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
    analyzingIdeas: "AI மூலம் உங்கள் திறன்களை பகுப்பாய்வு செய்கிறது...",
    sendLocation: "📍 என் தற்போதைய இருப்பிடத்தை அனுப்பு",
    locating: "இருப்பிடம் கண்டறியப்படுகிறது...",
    typeAnswer: "உங்கள் பதிலை தட்டச்சு செய்யுங்கள் அல்லது மேலே விருப்பத்தை தேர்வு செய்யுங்கள்...",
    planCompleted: "✅ திட்டம் முடிந்தது. மீண்டும் தொடங்க + அழுத்துங்கள்.",
    you: "நீங்கள்",
  }
};

const budgetOptions = {
  English: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000', '₹5,00,000'],
  Hindi: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000', '₹5,00,000'],
  Tamil: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000', '₹5,00,000'],
};

const skillOptions: Record<string, string[]> = {
  English: ["Agriculture & Farming", "Handicrafts & Tailoring", "Retail & Food", "Electronics & Repair", "Construction & Carpentry", "Beauty & Wellness"],
  Hindi: ["कृषि और खेती", "हस्तशिल्प और सिलाई", "खुदरा और भोजन", "इलेक्ट्रॉनिक्स और मरम्मत", "निर्माण और बढ़ईगीरी", "सौंदर्य और कल्याण"],
  Tamil: ["விவசாயம்", "கைவினை மற்றும் தையல்", "சில்லறை மற்றும் உணவு", "மின்னணு மற்றும் பழுதுபார்ப்பு", "கட்டுமானம் மற்றும் தச்சு", "அழகு மற்றும் ஆரோக்கியம்"]
};

Object.keys(missingPrompts).forEach(lang => {
  skillOptions[lang] = missingPrompts[lang].skills;
  if(t[lang]) {
    t[lang].sendLocation = missingPrompts[lang].sendLocation;
    t[lang].locating = missingPrompts[lang].locating;
    t[lang].prevPlans = missingPrompts[lang].prevPlans;
    t[lang].noPlans = missingPrompts[lang].noPlans;
  }
});


// Normalize skill from translated input back to English for API
const skillNormalize = (input: string): string => {
  const map: Record<string, string> = {
    'கைவினை & தையல்': 'Handicrafts & Tailoring', 'கைவினைப் பொருட்கள் & தையல்': 'Handicrafts & Tailoring',
    'விவசாயம் & பண்ணை': 'Agriculture & Farming',
    'சில்லறை & உணவு': 'Retail & Food',
    'எலக்ட்ரானிக்ஸ் & பழுதுபார்ப்பு': 'Electronics & Repair',
    'கட்டுமானம் & தச்சு': 'Construction & Carpentry',
    'அழகு & நல்வாழ்வு': 'Beauty & Wellness',
    'कृषि और खेती': 'Agriculture & Farming',
    'हस्तशिल्प और सिलाई': 'Handicrafts & Tailoring',
    'रिटेल और भोजन': 'Retail & Food',
    'इलेक्ट्रॉनिक्स और मरम्मत': 'Electronics & Repair',
    'निर्माण और बढ़ईगीरी': 'Construction & Carpentry',
    'सौंदर्य और कल्याण': 'Beauty & Wellness',
  };
  return map[input] || input;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', msgKey: 'loc' }
  ]);
  const [step, setStep] = useState<Step>('LOCATION');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ location: '', budget: '', skills: '', interest: '' });
  const [dynamicIdeas, setDynamicIdeas] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const handleBeforePrint = () => document.documentElement.classList.remove('dark');
    const handleAfterPrint = () => {
      if (isDarkMode) document.documentElement.classList.add('dark');
    };
    
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    window.addEventListener('preparePrint', handleBeforePrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      window.removeEventListener('preparePrint', handleBeforePrint);
    };
  }, [isDarkMode]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('busidvice_sessions');
      if (saved) setSessions(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync language for initial message
  useEffect(() => {
    if (messages.length === 1 && step === 'LOCATION') {
      setMessages([{ id: '1', sender: 'bot', msgKey: 'loc' }]);
    }
  }, [language]);

  // Save session when completed
  useEffect(() => {
    if (step === 'COMPLETED' && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.isDashboard && lastMsg.dashboardData) {
        setSessions(prev => {
          if (prev.some(p => p.messages.length > 0 && p.messages[p.messages.length - 1].id === lastMsg.id)) {
            return prev;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const title = (lastMsg.dashboardData as any).plan?.title || 'Business Plan';
          const newSession = {
            id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
            title,
            date: Date.now(),
            messages
          };
          const updated = [newSession, ...prev];
          try { localStorage.setItem('busidvice_sessions', JSON.stringify(updated)); } catch (_) {}
          return updated;
        });
      }
    }
  }, [step, messages]);

  const resolveText = (msg: Message): string => {
    if (msg.msgKey) return (t[language as keyof typeof t] || t.English)[msg.msgKey as keyof typeof t.English] || '';
    return msg.text || '';
  };

  // Voice dictation
  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice recognition not supported in this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Tamil' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => { console.error('Speech error', event.error); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Document scanner
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: language === 'Hindi' ? '[दस्तावेज़ अपलोड किया गया] विश्लेषण...' : language === 'Tamil' ? '[ஆவணம் பதிவேற்றப்பட்டது] பகுப்பாய்வு...' : '[Document Uploaded] Analyzing...',
      sender: 'user'
    }]);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, language })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { id: Date.now().toString(), text: data.message || 'Failed to analyze.', sender: 'bot' }]);
      } catch (_) {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Error analyzing document.', sender: 'bot' }]);
      } finally { setIsLoading(false); }
    };
    reader.readAsDataURL(file);
    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // IP-based + GPS Location
  const fetchLocation = () => {
    setIsLocating(true);

    const fallbackToIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city && data.region) {
          handleSend(`${data.city}, ${data.region}`);
        } else {
          alert('Could not detect location. Please type it manually.');
        }
      } catch (_) {
        alert('Location detection failed. Please type it manually.');
      }
      setIsLocating(false);
    };

    if (!navigator.geolocation) { fallbackToIP(); return; }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address;
          const city = addr.village || addr.town || addr.city || addr.suburb || '';
          const district = addr.state_district || '';
          const state = addr.state || '';
          // Deduplicate: skip district if it's the same as city
          const parts = [city, district !== city ? district : '', state].filter(Boolean);
          const loc = [...new Set(parts)].join(', ');
          handleSend(loc);
        } catch (_) { await fallbackToIP(); }
        setIsLocating(false);
      },
      () => fallbackToIP()
    );
  };

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend ?? input.trim();
    if (!msg) return;
    setInput('');

    const newMsg: Message = { id: Date.now().toString(), text: msg, sender: 'user' };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);

    const newFormData = { ...formData };

    if (step === 'LOCATION') {
      newFormData.location = msg;
      setFormData(newFormData);
      setStep('BUDGET');
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', msgKey: 'budget' }]), 400);

    } else if (step === 'BUDGET') {
      newFormData.budget = msg;
      setFormData(newFormData);
      setStep('SKILLS');
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', msgKey: 'skills' }]), 400);

    } else if (step === 'SKILLS') {
      newFormData.skills = msg;
      setFormData(newFormData);

      setIsLoading(true);
      setLoadingText((t[language as keyof typeof t] || t.English).analyzingIdeas);
      try {
        const res = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newFormData, language })
        });
        if (!res.ok) throw new Error('Ideas API failed');
        const data = await res.json();
        setDynamicIdeas(data.ideas || []);
      } catch (e) {
        console.error('AI Idea Generation failed:', e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi'
            ? 'त्रुटि: AI से कनेक्ट करने में विफल। कृपया अपनी API कुंजी जांचें।'
            : language === 'Tamil'
            ? 'பிழை: AI உடன் இணைக்க முடியவில்லை. API விசையை சரிபார்க்கவும்.'
            : 'Error: Failed to connect to AI. Please check your API key.',
          sender: 'bot'
        }]);
        setStep('SKILLS');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setStep('INTEREST');
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', msgKey: 'interest' }]), 400);

    } else if (step === 'INTEREST') {
      newFormData.interest = msg;
      setFormData(newFormData);
      setStep('COMPLETED');
      setIsLoading(true);
      setLoadingText((t[language as keyof typeof t] || t.English).completed);

      try {
        const response = await fetch('/api/advisory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newFormData,
            skills: skillNormalize(newFormData.skills),
            language
          })
        });
        if (!response.ok) throw new Error('Advisory API Failed');
        const result = await response.json();

        const dashboardMsg: Message = {
          id: Date.now().toString(),
          sender: 'bot',
          isDashboard: true,
          dashboardData: {
            plan: {
              title: result.plan.businessName,
              summary: result.plan.summary,
              localDemandScore: result.plan.localDemandScore,
              localDemandAssessment: result.plan.localDemandAssessment,
              opportunities: result.plan.opportunities,
              risks: result.plan.keyRisks,
            },
            financials: result.financials,
            schemes: result.schemes
          }
        };
        setMessages(prev => [...prev, dashboardMsg]);
      } catch (e) {
        console.error('AI Generation failed:', e);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: language === 'Hindi'
            ? 'त्रुटि: व्यवसाय योजना बनाने में विफल। कृपया अपनी API कुंजी जांचें।'
            : language === 'Tamil'
            ? 'பிழை: வணிகத் திட்டத்தை உருவாக்க முடியவில்லை. API விசையை சரிபார்க்கவும்.'
            : 'Error: Failed to generate business plan. Please check your API key.',
          sender: 'bot'
        }]);
        setStep('INTEREST');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (playingMessageId === id) {
      setPlayingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    const langMap: Record<string, string> = { English: 'en-IN', Hindi: 'hi-IN', Bengali: 'bn-IN', Telugu: 'te-IN', Marathi: 'mr-IN', Tamil: 'ta-IN', Urdu: 'ur-IN', Gujarati: 'gu-IN', Malayalam: 'ml-IN', Kannada: 'kn-IN', Odia: 'or-IN', Punjabi: 'pa-IN', Assamese: 'as-IN', Maithili: 'mai-IN', Sanskrit: 'sa-IN', Sindhi: 'sd-IN', Kashmiri: 'ks-IN', Konkani: 'kok-IN', Nepali: 'ne-IN', Manipuri: 'mni-IN', Bodo: 'brx-IN', Dogri: 'doi-IN', Santali: 'sat-IN' };
    const targetLang = langMap[language] || "en-IN";
    utterance.lang = targetLang;
    const voices = window.speechSynthesis.getVoices();
    const prefix = targetLang.split('-')[0].toLowerCase();
    const langName = language.toLowerCase();
    
    // Aggressive matching: Match exact BCP-47 tag, prefix, or the actual english name of the language (e.g. "Google Marathi")
    const voice = voices.find(v => {
      const vLang = v.lang.replace('_', '-').toLowerCase();
      const vName = v.name.toLowerCase();
      return vLang === targetLang.toLowerCase() || vLang.startsWith(prefix) || vName.includes(langName) || vName.includes(prefix);
    });
    
    if (voice) {
      utterance.voice = voice;
    } else {
      // Fallback: If no regional voice exists, try to find a generic Indian English voice so it at least has an Indian accent
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
      if (indianVoice) utterance.voice = indianVoice;
    }

    utterance.onend = () => setPlayingMessageId(null);
    window.speechSynthesis.speak(utterance);
    setPlayingMessageId(id);
  };

  const handleReset = () => {
    setMessages([{ id: Date.now().toString(), sender: 'bot', msgKey: 'loc' }]);
    setStep('LOCATION');
    setInput('');
    setFormData({ location: '', budget: '', skills: '', interest: '' });
    setDynamicIdeas([]);
  };

  const deleteSession = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);
      localStorage.setItem('busidvice_sessions', JSON.stringify(updated));
      
    }
  };

  const renameSession = (id: string, currentTitle: string) => {
    const newTitle = window.prompt("Enter new name for this plan:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      const updated = sessions.map(s => s.id === id ? { ...s, title: newTitle.trim() } : s);
      setSessions(updated);
      localStorage.setItem('busidvice_sessions', JSON.stringify(updated));
    }
  };

  const shareSession = async (s: Session) => {
    try {
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(s));
      const shareUrl = `${window.location.origin}/?share=${compressed}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! Anyone can use this link to view the full chat.');
    } catch (err) {
      console.log('Share failed:', err);
      alert('Failed to copy link.');
    }
  };

  const downloadSession = (session: Session) => {
    loadSession(session);
    window.dispatchEvent(new Event('preparePrint'));
    setTimeout(() => {
      const originalTitle = document.title;
      document.title = session.title;
      
      const afterPrint = () => {
        document.title = originalTitle;
        window.dispatchEvent(new Event('afterPrint'));
        window.removeEventListener('afterprint', afterPrint);
      };
      window.addEventListener('afterprint', afterPrint);
      
      window.print();
    }, 500);
  };

  const loadSession = (session: Session) => {
    setMessages(session.messages);
    setStep('COMPLETED');
    setIsSidebarOpen(false);
  };

  const quickOptions: string[] = (() => {
    if (step === 'LOCATION') return [];
    if (step === 'BUDGET') return (budgetOptions[language as keyof typeof budgetOptions] || budgetOptions.English);
    if (step === 'SKILLS') return (skillOptions[language as keyof typeof skillOptions] || skillOptions.English);
    if (step === 'INTEREST') return dynamicIdeas;
    return [];
  })();

  return (
    <div className="flex h-dvh print:h-auto bg-slate-100 dark:bg-[#0D0F12] overflow-hidden print:overflow-visible print:block" onClick={() => setOpenMenuId(null)}>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-[#1A1D24] h-full shadow-2xl dark:shadow-none flex flex-col z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-[#14161C] dark:text-white">{(t[language as keyof typeof t] || t.English).prevPlans}</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-[#14161C]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 flex flex-col">
              {sessions.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-8">{(t[language as keyof typeof t] || t.English).noPlans}</p>
              ) : sessions.map(s => (
                <GlareHover 
                  key={s.id} 
                  onClick={() => loadSession(s)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#14161C] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all cursor-pointer group"
                  glareColor={isDarkMode ? '#ffffff' : '#10b981'}
                  glareOpacity={isDarkMode ? 0.08 : 0.15}
                  transitionDuration={600}
                >
                  <div className="w-full flex items-start justify-between relative h-full">
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2 mb-1">
                      
                      <p className="text-sm font-semibold text-[#14161C] dark:text-white truncate">{s.title}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(s.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Three Dot Menu Button */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setOpenMenuId(openMenuId === s.id ? null : s.id); 
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
                    title="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === s.id && (
                    <div className="absolute right-2 top-10 mt-1 w-36 bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl dark:shadow-none py-1 z-50 overflow-hidden">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); renameSession(s.id, s.title); }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#14161C] flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Rename
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); shareSession(s); }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#14161C] flex items-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-400" /> Share
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); downloadSession(s); }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#14161C] flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" /> Download
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-[#0D0F12] my-1"></div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); deleteSession(s.id); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" /> Clear
                      </button>
                    </div>
                  )}
                  </div>
                </GlareHover>
              ))}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <button onClick={() => { if(window.confirm('Are you sure you want to delete all saved plans?')) { localStorage.removeItem('busidvice_sessions'); setSessions([]); } }} className="w-full py-2.5 px-4 bg-white dark:bg-[#1A1D24] border border-red-200 text-red-600 rounded-xl font-medium text-sm hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center gap-2 transition-all shadow-sm dark:shadow-none">
                  <Trash2 className="w-4 h-4" />
                  Clear Saved Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 print:block print:overflow-visible">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#1A1D24]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-none flex-shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#14161C] flex items-center justify-center shadow-md dark:shadow-none">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">BusiDvice</span>
            </div>
            
            
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A1D24] transition-colors mr-2"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Moon className="w-5 h-5" strokeWidth={1.5} /> : <Sun className="w-5 h-5" />}
            </button>
            
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as Language)}
              className="text-sm bg-transparent text-slate-700 dark:text-slate-300 font-medium border-none outline-none cursor-pointer pr-1"
            >
              {["English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Malayalam", "Kannada", "Odia", "Punjabi", "Assamese", "Maithili", "Sanskrit", "Sindhi", "Kashmiri", "Konkani", "Nepali", "Manipuri", "Bodo", "Dogri", "Santali"].map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 print:overflow-visible print:block">
          {messages.map((msg, index) => {
            if (msg.isDashboard && msg.dashboardData) {
              return (
                <div key={msg.id} className={`w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-[#1A1D24] ${index === messages.findLastIndex(m => m.isDashboard) ? 'print:overflow-visible print:block' : 'print:hidden'}`} style={{ minHeight: 500 }}>
                  <BusinessDashboard
                    businessPlan={msg.dashboardData.plan}
                    financialData={msg.dashboardData.financials}
                    schemes={msg.dashboardData.schemes}
                    language={language as 'English' | 'Hindi' | 'Tamil'}
                  />
                </div>
              );
            }

            const isBot = msg.sender === 'bot';
            const text = resolveText(msg);

            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isBot ? "" : "flex-row-reverse"} print:hidden`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm dark:shadow-none ${isBot ? 'bg-[#14161C]' : 'bg-[#6366F1]'}`}>
                  {isBot ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className={`px-4 py-3 rounded-2xl shadow-[0_1px_2px_rgba(20,22,28,0.05)] text-[14px] leading-relaxed whitespace-pre-wrap ${isBot ? 'bg-white dark:bg-[#1A1D24] text-[#14161C] dark:text-white rounded-bl-sm border border-[#E8E8E4] dark:border-slate-800' : 'bg-[#6366F1] text-white rounded-br-sm'}`}>
                    {text}
                  </div>
                  {isBot && (
                    <button 
                      onClick={() => handleSpeak(text || '', msg.id)}
                      className={`self-start flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${playingMessageId === msg.id ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' : 'text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-950/30'}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {playingMessageId === msg.id ? (t[language as keyof typeof t] || t.English).stop || 'Stop' : (t[language as keyof typeof t] || t.English).readAloud || 'Read Aloud'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex flex-col space-y-4 mt-4 mb-4 w-full">
              <div className="flex justify-start space-x-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#14161C] flex items-center justify-center shadow-sm dark:shadow-none">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-[#1A1D24] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm dark:shadow-none inline-flex items-center space-x-2 max-w-fit">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-mono flex items-baseline">
                    {loadingText || 'Thinking'}
                    <span className="inline-block w-[1ch] h-[2px] bg-emerald-600 ml-[2px] animate-blink" style={{ transform: 'translateY(-2px)' }} />
                  </span>
                </div>
              </div>
              
              <div className="pl-11 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SkeletonDashboard />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Options Pills */}
        {quickOptions.length > 0 && step !== 'COMPLETED' && !isLoading && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
            {quickOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSend(opt)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-[#1A1D24] border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:hover:bg-emerald-900/30 hover:border-emerald-500 dark:hover:border-emerald-500 active:scale-95 transition-all shadow-sm dark:shadow-none whitespace-nowrap"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Location Button */}
        {step === 'LOCATION' && !isLoading && (
          <div className="px-4 pb-2 flex-shrink-0">
            <button
              onClick={fetchLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#14161C] text-white font-semibold text-sm shadow-lg dark:shadow-none hover:from-emerald-600 hover:to-teal-600 active:scale-98 transition-all disabled:opacity-60"
            >
              {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span>{isLocating ? (t[language as keyof typeof t] || t.English).locating : (t[language as keyof typeof t] || t.English).sendLocation}</span>
            </button>
          </div>
        )}

        {/* Bottom Input Bar */}
        <div className="flex-shrink-0 bg-white/80 dark:bg-[#1A1D24]/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3 pb-safe">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">

            {step === 'COMPLETED' ? (
              <button type="button" onClick={handleReset}
                className="p-2.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex-1 flex items-center bg-slate-100 dark:bg-[#0D0F12] rounded-2xl px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={(t[language as keyof typeof t] || t.English).typeAnswer}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-[#14161C] dark:text-white placeholder-[#6B7080] outline-none min-w-0"
                />

                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="p-1 rounded-full text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </button>
                <button type="button" onClick={startListening}
                  className={`p-1 rounded-full transition-all flex-shrink-0 ${isListening ? 'text-red-600 animate-pulse' : 'text-slate-400 hover:text-emerald-600'}`}>
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            )}

            {step !== 'COMPLETED' && (
              <button type="submit" disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full transition-all flex-shrink-0 disabled:opacity-40 bg-[#14161C] text-white shadow-md dark:shadow-none hover:bg-[#2b2f3a] active:scale-95">
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
