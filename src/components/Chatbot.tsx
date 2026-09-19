'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, IndianRupee, Wrench, Lightbulb, Bot, Mic, Loader2, LocateFixed } from 'lucide-react';

type Step = 'LOCATION' | 'BUDGET' | 'SKILLS' | 'INTEREST' | 'COMPLETED';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface ChatbotProps {
  onComplete: (data: { location: string; budget: string; skills: string; interest: string }) => void;
}

export default function Chatbot({ onComplete }: ChatbotProps) {
  const [step, setStep] = useState<Step>('LOCATION');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am BusiDvice, your fintech advisor. To find the right banking schemes, please tell me your specific village, town, or district.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    budget: '',
    skills: '',
    interest: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        const address = data.address;
        const villageOrTown = address.village || address.town || address.city || address.suburb;
        const district = address.county || address.state_district;
        const state = address.state;

        const locString = `${villageOrTown ? villageOrTown + ', ' : ''}${district ? district + ', ' : ''}${state}`;
        setInput(locString || "Detected Location");
      } catch (error) {
        console.error("Geocoding failed", error);
        alert("Failed to retrieve location details. Please type manually.");
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert("Unable to retrieve your location");
      setIsLocating(false);
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const newFormData = { ...formData };
    
    let nextStep: Step = 'COMPLETED';
    let botResponse = '';

    switch (step) {
      case 'LOCATION':
        newFormData.location = input;
        nextStep = 'BUDGET';
        botResponse = 'Great! What is your total estimated budget for starting this business? (e.g., Rs. 50,000)';
        break;
      case 'BUDGET':
        newFormData.budget = input;
        nextStep = 'SKILLS';
        botResponse = 'Noted. What are your primary skills or past work experiences? (e.g., weaving, farming, retail)';
        break;
      case 'SKILLS':
        newFormData.skills = input;
        nextStep = 'INTEREST';
        botResponse = 'Excellent. Finally, what specific business idea or product are you interested in starting?';
        break;
      case 'INTEREST':
        newFormData.interest = input;
        nextStep = 'COMPLETED';
        botResponse = 'Thank you! Generating your hyper-local business plan and checking your loan affordability now...';
        onComplete(newFormData);
        break;
    }

    setFormData(newFormData);
    setStep(nextStep);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-6 shadow-md flex-shrink-0">
        <h2 className="text-xl font-bold tracking-tight mb-1">BusiDvice</h2>
        <p className="text-emerald-100 text-sm opacity-90">SIH26091 - Micro-Enterprise Assistant</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
            }`}>
              {msg.sender === 'bot' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-sm text-emerald-800">BusiDvice</span>
                </div>
              )}
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        {step === 'LOCATION' && (
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={useDeviceLocation}
              disabled={isLocating}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
            >
              {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
              <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={step === 'COMPLETED'}
            placeholder={step === 'COMPLETED' ? "Processing..." : "Type or speak your answer..."}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-emerald-600 text-sm bg-gray-50 disabled:bg-gray-100 pr-12 transition-colors"
          />
          <button
            type="button"
            onClick={startListening}
            disabled={step === 'COMPLETED'}
            className={`absolute right-[3.25rem] p-2 rounded-full transition-colors flex items-center justify-center ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-emerald-600'}`}
            title="Dictate answer"
          >
            <Mic className="w-5 h-5" />
            {isListening && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button
            type="submit"
            disabled={step === 'COMPLETED' || !input.trim()}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Demo Presets */}
        {step === 'LOCATION' && (
          <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-gray-100 justify-center">
            <button
              type="button"
              onClick={() => onComplete({ location: "Madurai, Tamil Nadu", budget: "50000", skills: "Farming, Animal Husbandry", interest: "Poultry Farming" })}
              className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-200 transition-colors"
            >
              Poultry in TN (₹50k)
            </button>
            <button
              type="button"
              onClick={() => onComplete({ location: "Varanasi, Uttar Pradesh", budget: "25000", skills: "Weaving, Design", interest: "Handicrafts" })}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors"
            >
              Handicrafts in UP (₹25k)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
