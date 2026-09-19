'use client';

import { extraPrompts } from '../lib/t';
import React, { useState } from 'react';
import RecommendationScreen from './RecommendationScreen';
import FinancialDashboard from './FinancialDashboard';
import SchemeAdvisor from './SchemeAdvisor';
import { FileText, PieChart, Landmark, Printer } from 'lucide-react';

interface BusinessDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  businessPlan: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  financialData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemes: any[];
  language?: string;
}

const uiDict: Record<string, any> = {
  English: { title: "Underwriting Portal", sub: "Auto-generated bank-ready assessment", pdf: "Download PDF Report", tab1: "Business Feasibility", tab2: "Loan & Finances", tab3: "Matched Schemes" },
  Hindi: { title: "अंडरराइटिंग पोर्टल", sub: "स्वचालित बैंक-तैयार मूल्यांकन", pdf: "पीडीएफ रिपोर्ट डाउनलोड करें", tab1: "व्यापार व्यवहार्यता", tab2: "ऋण और वित्त", tab3: "सुझाई गई योजनाएं" },
  Tamil: { title: "வழங்குதல் போர்டல்", sub: "தானியங்கி வங்கி மதிப்பீடு", pdf: "PDF அறிக்கை பதிவிறக்கு", tab1: "வணிக சாத்தியம்", tab2: "கடன் மற்றும் நிதி", tab3: "பொருத்தமான திட்டங்கள்" }
};
Object.keys(extraPrompts).forEach(lang => { uiDict[lang] = extraPrompts[lang].dash; });

export default function BusinessDashboard({ businessPlan, financialData, schemes, language = "English" }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'finance' | 'schemes'>('plan');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      
      {/* Top Action Bar */}
      <div className="bg-gradient-to-r from-white to-slate-50 px-6 py-5 border-b border-slate-200/80 flex justify-between items-center shadow-sm flex-shrink-0 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{(uiDict[language as keyof typeof uiDict] || uiDict.English).title}</h1>
          <p className="text-xs text-slate-500 font-medium">{(uiDict[language as keyof typeof uiDict] || uiDict.English).sub}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>{(uiDict[language as keyof typeof uiDict] || uiDict.English).pdf}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-slate-50/50 flex-shrink-0 print:hidden">
        <div className="flex space-x-2 border-b border-slate-200/80 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-shrink-0 whitespace-nowrap flex items-center space-x-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'plan' ? 'border-emerald-500 text-emerald-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-xl'}`}
          >
            <FileText className="w-4 h-4" />
            <span>{(uiDict[language as keyof typeof uiDict] || uiDict.English).tab1}</span>
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`flex-shrink-0 whitespace-nowrap flex items-center space-x-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'finance' ? 'border-blue-500 text-blue-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-xl'}`}
          >
            <PieChart className="w-4 h-4" />
            <span>{(uiDict[language as keyof typeof uiDict] || uiDict.English).tab2}</span>
          </button>
          <button 
            onClick={() => setActiveTab('schemes')}
            className={`flex-shrink-0 whitespace-nowrap flex items-center space-x-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'schemes' ? 'border-purple-500 text-purple-700 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-t-xl'}`}
          >
            <Landmark className="w-4 h-4" />
            <span>{(uiDict[language as keyof typeof uiDict] || uiDict.English).tab3}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Print Layout shows everything sequentially */}
        <div className="hidden print:block space-y-10">
           <div className="mb-8 border-b-2 border-gray-800 pb-4">
             <h1 className="text-3xl font-black text-gray-900">Project Appraisal Memo</h1>
             <p className="text-gray-600 mt-2 font-medium">Auto-generated via BusiDvice Fintech Advisor (SIH26091)</p>
           </div>
           <RecommendationScreen businessPlan={businessPlan} language={language} />
           <FinancialDashboard data={financialData} language={language} />
           <SchemeAdvisor schemes={schemes} language={language} />
        </div>

        {/* Screen Layout shows tabs */}
        <div className="block print:hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'plan' && <RecommendationScreen businessPlan={businessPlan} language={language} />}
          {activeTab === 'finance' && <FinancialDashboard data={financialData} language={language} />}
          {activeTab === 'schemes' && <SchemeAdvisor schemes={schemes} language={language} />}
        </div>
      </div>

    </div>
  );
}
