'use client';

import { extraPrompts } from '../lib/t';
import React, { useState, useEffect } from "react";
import { Volume2, Play, Square, Landmark, CheckCircle2, FileText, ExternalLink, MapPin, DollarSign, Tag } from 'lucide-react';
import { SchemeProfile } from '@/data/schemesData';

const ui: Record<string, any> = {
  English: {
    title: "Eligible Government Schemes",
    sub: "Based on your business type, location, and project cost — you qualify for these schemes.",
    noSchemes: "No schemes currently matched your profile. Consider increasing your budget or exploring a different business sector.",
    central: "Central Govt",
    state: "State Scheme",
    free: "Collateral Free",
    max: "Max Loan",
    subPct: "Subsidy / Rate",
    elig: "Eligibility Criteria",
    doc: "Documents Required",
    btn: "Apply on Official Portal",
    whyMatch: "Why You Matched",
    costMatch: "Cost within limit",
    locMatch: "Location eligible",
    sectorMatch: "Sector covered",
  },
  Hindi: {
    title: "पात्र सरकारी योजनाएं",
    sub: "आपके व्यवसाय प्रकार, स्थान और परियोजना लागत के आधार पर — आप इन योजनाओं के लिए पात्र हैं।",
    noSchemes: "कोई योजना आपकी प्रोफाइल से मेल नहीं खाई। बजट बढ़ाने या अलग क्षेत्र आज़माने पर विचार करें।",
    central: "केंद्र सरकार",
    state: "राज्य योजना",
    free: "संपार्श्विक मुक्त",
    max: "अधिकतम ऋण",
    subPct: "सब्सिडी / दर",
    elig: "पात्रता मापदंड",
    doc: "आवश्यक दस्तावेज़",
    btn: "आधिकारिक पोर्टल पर आवेदन करें",
    whyMatch: "आप क्यों पात्र हैं",
    costMatch: "लागत सीमा के अंदर",
    locMatch: "स्थान पात्र है",
    sectorMatch: "क्षेत्र शामिल है",
  },
  Tamil: {
    title: "தகுதியான அரசு திட்டங்கள்",
    sub: "உங்கள் வணிக வகை, இருப்பிடம் மற்றும் திட்டச் செலவின் அடிப்படையில் — இந்த திட்டங்களுக்கு நீங்கள் தகுதி பெற்றுள்ளீர்கள்.",
    noSchemes: "உங்கள் சுயவிவரத்துடன் எந்த திட்டமும் பொருந்தவில்லை. பட்ஜெட்டை அதிகரிக்கவும் அல்லது வேறு துறையை முயற்சிக்கவும்.",
    central: "மத்திய அரசு",
    state: "மாநில திட்டம்",
    free: "பிணையம் தேவையில்லை",
    max: "அதிகபட்ச கடன்",
    subPct: "மானியம் / வட்டி",
    elig: "தகுதிக்கான அளவுகோல்கள்",
    doc: "தேவையான ஆவணங்கள்",
    btn: "அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்கவும்",
    whyMatch: "நீங்கள் ஏன் தகுதியானவர்",
    costMatch: "செலவு வரம்பிற்குள்",
    locMatch: "இருப்பிடம் தகுதியானது",
    sectorMatch: "துறை உள்ளடங்கியது",
  },
};
Object.keys(extraPrompts).forEach(lang => { ui[lang] = extraPrompts[lang].scheme; });

export default function SchemeAdvisor({
  schemes,
  language = "English",
}: {
  schemes: SchemeProfile[];
  language?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = schemes.map(s => s.name + ". " + s.eligibility.join(". ")).join(". ");
      const utterance = new SpeechSynthesisUtterance(t.title + ". " + text);
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

      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const t = ui[language as keyof typeof ui] || ui.English;

  if (!schemes || schemes.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <Landmark className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="text-amber-800 font-semibold">{t.noSchemes}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white dark:bg-[#1A1D24] p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm dark:shadow-none">
        <div className="flex items-center space-x-3 mb-2">
          <Landmark className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{t.sub}</p>
        <p className="text-xs text-emerald-700 font-semibold mt-2">
          {schemes.length} scheme{schemes.length > 1 ? 's' : ''} matched ✅
        </p>
      </div>

      {/* Scheme Cards */}
      <div className="grid gap-6">
        {schemes.map((scheme, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-indigo-50 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-900/50 p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold rounded mb-2">
                    {scheme.level === 'State'
                      ? `${scheme.state} ${t.state}`
                      : `🇮🇳 ${t.central}`}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{scheme.name}</h3>
                </div>
                {scheme.collateralFree && (
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded">
                    ✅ {t.free}
                  </span>
                )}
              </div>

              {/* Why You Matched Badges */}
              <div className="mt-3">
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {t.whyMatch}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-full font-semibold">
                    <DollarSign className="w-3 h-3" />
                    <span>{t.costMatch}</span>
                  </span>
                  {scheme.level === 'State' && (
                    <span className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-semibold">
                      <MapPin className="w-3 h-3" />
                      <span>{t.locMatch}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-semibold">
                    <Tag className="w-3 h-3" />
                    <span>{t.sectorMatch}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 dark:bg-[#14161C] p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold mb-1">{t.max}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    ₹{scheme.maxLoan.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#14161C] p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold mb-1">{t.subPct}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-xs leading-snug">{scheme.subsidyPercentage}</p>
                </div>
              </div>

              {/* Eligibility */}
              <div className="mb-4">
                <h4 className="flex items-center text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5 flex-shrink-0" />
                  {t.elig}
                </h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {scheme.eligibility?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div className="mb-5">
                <h4 className="flex items-center text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                  <FileText className="w-4 h-4 text-blue-500 mr-1.5 flex-shrink-0" />
                  {t.doc}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scheme.documents?.map((doc: string, i: number) => (
                    <span
                      key={i}
                      className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-2 py-1 rounded border border-gray-200 dark:border-slate-800"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm print:hidden"
              >
                <span>{t.btn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
