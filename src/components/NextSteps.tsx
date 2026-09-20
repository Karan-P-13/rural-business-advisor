import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface NextStepsProps {
  businessPlan: any;
  language: string;
}

const NextSteps = ({ businessPlan, language }: NextStepsProps) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggleCheck = (index: number) => {
    setChecked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const steps = [
    { title: "Register Business", desc: "Apply for Udyam Aadhaar to get MSME benefits." },
    { title: "Secure Funding", desc: "Gather required documents and apply for the recommended government schemes." },
    { title: "Bank Account", desc: "Open a Current Account for official business transactions." },
    { title: "Sourcing", desc: "Establish contact with 2-3 local suppliers for raw materials." },
    { title: "First Sale", desc: "Reach out to your first 5 potential customers or set up a local stall." }
  ];

  const progress = Math.round((Object.values(checked).filter(Boolean).length / steps.length) * 100);

  return (
    <div className="bg-white dark:bg-[#1A1D24] p-5 md:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Launch Action Plan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your guided checklist to get started today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-50 dark:bg-[#20242D] px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">{progress}%</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800/50"></div>
        <div className="space-y-6 relative">
          {steps.map((step, idx) => {
            const isDone = !!checked[idx];
            return (
              <div 
                key={idx} 
                className={`flex items-start space-x-4 p-4 rounded-xl transition-all cursor-pointer border ${isDone ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-white dark:bg-[#20242D] border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'}`}
                onClick={() => toggleCheck(idx)}
              >
                <div className="mt-0.5 relative z-10 bg-white dark:bg-[#20242D] rounded-full">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDone ? 'text-emerald-800 dark:text-emerald-400 line-through opacity-70' : 'text-slate-900 dark:text-slate-200'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mt-1 ${isDone ? 'text-emerald-600/70 dark:text-emerald-500/50' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.desc}
                  </p>
                </div>
                {!isDone && (
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
