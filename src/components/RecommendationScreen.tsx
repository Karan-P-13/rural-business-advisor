'use client';

import { extraPrompts } from '../lib/t';
import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, AlertTriangle, Play, Square, Activity, TrendingUp } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ui: Record<string, any> = {
  English: {
    feas: "Feasibility & Demand Analysis",
    opp: "Growth Opportunities",
    risk: "Risk Mitigation Matrix",
    mitLbl: "Mitigation",
    score: "Hyper-Local Market Viability Score",
    demandLbl: "Local Market Assessment",
    low: "Low Demand",
    high: "High Demand",
    readAloud: "Read Aloud",
  },
  Hindi: {
    feas: "व्यवहार्यता और मांग विश्लेषण",
    opp: "विकास के अवसर",
    risk: "जोखिम न्यूनीकरण मैट्रिक्स",
    mitLbl: "न्यूनीकरण",
    score: "हाइपर-लोकल बाजार व्यवहार्यता स्कोर",
    demandLbl: "स्थानीय बाजार मूल्यांकन",
    low: "कम मांग",
    high: "अधिक मांग",
    readAloud: "ज़ोर से पढ़ें",
  },
  Tamil: {
    feas: "சாத்தியம் & தேவை பகுப்பாய்வு",
    opp: "வளர்ச்சி வாய்ப்புகள்",
    risk: "ஆபத்து தணிப்பு அணி",
    mitLbl: "தணிப்பு",
    score: "உள்ளூர் சந்தை சாத்தியமான மதிப்பெண்",
    demandLbl: "உள்ளூர் சந்தை மதிப்பீடு",
    low: "குறைந்த தேவை",
    high: "அதிக தேவை",
    readAloud: "声に出して読む",
  },
};
Object.keys(extraPrompts).forEach(lang => { ui[lang] = extraPrompts[lang].rec; });

function DemandScoreBar({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score || 0));
  const color =
    clampedScore >= 70 ? '#10b981' : clampedScore >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-3xl font-black" style={{ color }}>{clampedScore}</span>
        <span className="text-lg font-bold text-gray-400">/100</span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${clampedScore}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function RecommendationScreen({
  businessPlan,
  language = "English",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  businessPlan: any;
  language?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = ui[language as keyof typeof ui] || ui.English;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToSpeak = `${businessPlan.title}. ${businessPlan.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
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

  // Support both old (targetMarket string) and new (localDemandScore int) field names
  const rawScore =
    businessPlan.localDemandScore ??
    parseInt((businessPlan.targetMarket || '0').replace(/[^0-9]/g, ''), 10);

  const demandAssessment =
    businessPlan.localDemandAssessment || businessPlan.demandAssessment || null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="bg-emerald-700 p-6 text-white relative">
        <div className="flex justify-between items-start">
          <div className="pr-14">
            <h2 className="text-2xl font-bold mb-2">{businessPlan.title || businessPlan.businessName}</h2>
            <p className="text-emerald-100 leading-relaxed text-sm">{businessPlan.summary}</p>
          </div>
          <button
            onClick={toggleSpeech}
            className={`absolute top-6 right-6 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors print:hidden ${
              isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-emerald-700 hover:bg-gray-100'
            }`}
            title={t.readAloud}
          >
            {isPlaying ? (
              <Square className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Column */}
        <div className="space-y-6">

          {/* Demand Score */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-800">{t.feas}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">{t.score}</p>
            <DemandScoreBar score={rawScore} />

            {/* Local demand assessment text */}
            {demandAssessment && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t.demandLbl}</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{demandAssessment}</p>
              </div>
            )}
          </div>

          {/* Growth Opportunities */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-gray-800">{t.opp}</h3>
            </div>
            <ul className="space-y-2">
              {(businessPlan.opportunities || []).map((opp: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-amber-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-gray-700 text-sm leading-snug">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column — Risks */}
        <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-800">{t.risk}</h3>
          </div>
          <div className="space-y-4">
            {(businessPlan.risks || businessPlan.keyRisks || []).map(
              (riskObj: { risk: string; mitigation: string }, idx: number) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-red-100">
                  <div className="flex items-start space-x-2 mb-2">
                    <Target className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-bold text-red-800">{riskObj.risk}</p>
                  </div>
                  <p className="text-sm text-gray-700 border-l-2 border-emerald-400 pl-2 ml-5">
                    <span className="font-semibold text-emerald-700">{t.mitLbl}: </span>
                    {riskObj.mitigation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
