'use client';

import { extraPrompts } from '../lib/t';
import React, { useState } from 'react';
import { IndianRupee, TrendingUp, AlertTriangle, ShieldCheck, PieChart as PieIcon, SlidersHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tips = {
  English: {
    dscrInfo: "Debt Service Coverage Ratio: A score above 1.25 means your business makes enough profit to comfortably pay the loan EMI.",
    ueInfo: "User Equity: The portion of the project cost you must pay from your own pocket (usually 10%).",
    capexInfo: "CapEx: Money spent on buying physical assets like machinery, equipment, or building renovations.",
    breakInfo: "Break-Even: The number of months it will take for your accumulated profits to pay off the initial loan."
  },
  Hindi: {
    dscrInfo: "ऋण सेवा कवरेज अनुपात: 1.25 से ऊपर के स्कोर का मतलब है कि आपका व्यवसाय ऋण EMI चुकाने के लिए पर्याप्त लाभ कमाता है।",
    ueInfo: "उपयोगकर्ता इक्विटी: परियोजना लागत का वह हिस्सा जो आपको अपनी जेब से देना होगा (आमतौर पर 10%)।",
    capexInfo: "CapEx: मशीनरी, उपकरण या भवन नवीनीकरण जैसी भौतिक संपत्ति खरीदने पर खर्च किया गया पैसा।",
    breakInfo: "ब्रेक-ईवन: प्रारंभिक ऋण का भुगतान करने में आपके संचित मुनाफे में लगने वाले महीनों की संख्या।"
  },
  Tamil: {
    dscrInfo: "DSCR: 1.25 க்கு மேலான மதிப்பெண் என்றால், உங்கள் தொழில் கடன் EMI-ஐ எளிதாக செலுத்தும் அளவுக்கு லாபம் ஈட்டுகிறது.",
    ueInfo: "பயனர் பங்கு: திட்டச் செலவில் நீங்கள் சொந்தமாக செலுத்த வேண்டிய தொகை (பொதுவாக 10%).",
    capexInfo: "CapEx: இயந்திரங்கள் அல்லது உபகரணங்கள் போன்ற நிரந்தர சொத்துக்களை வாங்க செலவிடப்படும் பணம்.",
    breakInfo: "முறிவுப்புள்ளி: நீங்கள் வாங்கிய கடனை முழுமையாக அடைக்க உங்கள் லாபத்திற்கு தேவைப்படும் மாதங்கள்."
  }
};

const ui: Record<string, any> = {
  English: { verdict: "Loan Underwriting Verdict", tp: "Total Project", ue: "User Equity (Margin)", emi: "Est. EMI (60 mo)", dscr: "DSCR", capex: "Capital Expenditure (CapEx)", rev: "Revenue vs OpEx (6 mo)", month: "Month", stress: "Stress Test: Sales Volume", adjust: "Adjust projected sales to see impact on break-even.", worst: "Worst Case (0.5x)", expect: "Expected (1.0x)", best: "Best Case (1.5x)", adjProfit: "Adjusted Monthly Profit", estBreak: "Estimated Break-Even", months: "Months", never: "Never (Loss)" },
  Hindi: { verdict: "ऋण हामीदारी (अंडरराइटिंग) निर्णय", tp: "कुल परियोजना", ue: "उपयोगकर्ता इक्विटी (मार्जिन)", emi: "अनुमानित ईएमआई (60 महीने)", dscr: "DSCR", capex: "पूंजीगत व्यय (CapEx)", rev: "राजस्व बनाम परिचालन व्यय (6 महीने)", month: "महीना", stress: "तनाव परीक्षण: बिक्री की मात्रा", adjust: "ब्रेक-ईवन पर प्रभाव देखने के लिए अनुमानित बिक्री को समायोजित करें।", worst: "सबसे खराब स्थिति (0.5x)", expect: "अपेक्षित (1.0x)", best: "सर्वोत्तम स्थिति (1.5x)", adjProfit: "समायोजित मासिक लाभ", estBreak: "अनुमानित ब्रेक-ईवन", months: "महीने", never: "कभी नहीं (नुकसान)" },
  Tamil: { verdict: "கடன் மதிப்பீடு முடிவு", tp: "மொத்த திட்டம்", ue: "பயனர் பங்கு (விளிம்பு)", emi: "மதிப்பிடப்பட்ட EMI (60 மாதம்)", dscr: "DSCR", capex: "மூலதன செலவு (CapEx)", rev: "வருவாய் vs இயக்க செலவு (6 மாதம்)", month: "மாதம்", stress: "அழுத்த சோதனை: விற்பனை அளவு", adjust: "முறிவுப் புள்ளியில் ஏற்படும் தாக்கத்தைப் பார்க்க மதிப்பிடப்பட்ட விற்பனையைச் சரிசெய்யவும்.", worst: "மோசமான நிலை (0.5x)", expect: "எதிர்பார்க்கப்படும் (1.0x)", best: "சிறந்த நிலை (1.5x)", adjProfit: "சரிசெய்யப்பட்ட மாதாந்திர லாபம்", estBreak: "மதிப்பிடப்பட்ட முறிவுப்புள்ளி", months: "மாதங்கள்", never: "ஒருபோதும் இல்லை (இழப்பு)" }
};
Object.keys(extraPrompts).forEach(lang => { ui[lang] = extraPrompts[lang].fin; });

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center justify-center ml-1 cursor-help">
    <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold border border-slate-300">?</div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl dark:shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export default function FinancialDashboard({ data, language = "English" }: { data: any, language?: string }) {
  const [revenueMultiplier, setRevenueMultiplier] = useState(1.0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899'];

  // Project Cost Pie Chart
  const capExData = data.capexBreakdown || [];

  // Revenue Projections
  const baseRevenue = data.monthlyRevenue || data.projectedRevenue || 0;
  const baseOpEx = data.monthlyOperatingExpenses || data.totalOpEx || 0;
  
  const adjustedRevenue = baseRevenue * revenueMultiplier;
  const adjustedProfit = adjustedRevenue - baseOpEx;
  const adjustedBreakEven = (data.netBankLoan || data.totalProjectCost) / (adjustedProfit > 0 ? adjustedProfit : 1);

  const profitLossData = Array.from({ length: 6 }).map((_, i) => ({
    name: `${(ui[language as keyof typeof ui] || ui.English).month} ${i + 1}`,
    Revenue: Math.round(adjustedRevenue),
    Expenses: baseOpEx,
  }));

  const getVerdictStyle = (verdict: string) => {
    if (verdict?.includes('Highly')) return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300';
    if (verdict?.includes('Moderate')) return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-300';
    return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Affordability Verdict */}
      <div className={`p-5 rounded-xl border ${getVerdictStyle(data.verdict)}`}>
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            {data.verdict?.includes('Highly') ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className={`w-6 h-6 ${data.verdict?.includes('Moderate') ? 'text-yellow-600' : 'text-red-600'}`} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{(ui[language as keyof typeof ui] || ui.English).verdict}</h3>
            <p className="text-sm font-medium mb-3">{data.verdictDescription}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/60 dark:bg-[#20242D]/60 p-3 rounded-lg border border-black/5 dark:border-white/5">
                <p className="text-xs uppercase tracking-wider opacity-70">{(ui[language as keyof typeof ui] || ui.English).tp}</p>
                <p className="font-bold">{formatCurrency(data.totalProjectCost)}</p>
              </div>
              <div className="bg-white/60 dark:bg-[#20242D]/60 p-3 rounded-lg border border-black/5 dark:border-white/5">
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">{(ui[language as keyof typeof ui] || ui.English).ue} <InfoTooltip text={(tips[language as keyof typeof tips] || tips.English).ueInfo} /></div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(data.userEquity)}</p>
              </div>
              <div className="bg-white/60 dark:bg-[#20242D]/60 p-3 rounded-lg border border-black/5 dark:border-white/5">
                <p className="text-xs uppercase tracking-wider opacity-70">{(ui[language as keyof typeof ui] || ui.English).emi}</p>
                <p className="font-bold text-blue-700 dark:text-blue-400">{formatCurrency(data.monthlyEMI)}</p>
              </div>
              <div className="bg-white/60 dark:bg-[#20242D]/60 p-3 rounded-lg border border-black/5 dark:border-white/5">
                <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">{(ui[language as keyof typeof ui] || ui.English).dscr} <InfoTooltip text={(tips[language as keyof typeof tips] || tips.English).dscrInfo} /></div>
                <p className="font-bold text-purple-700 dark:text-purple-400">{data.dscr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CapEx Breakdown */}
        <div className="bg-white dark:bg-[#20242D] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
            <PieIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h3 className="font-bold flex items-center">{(ui[language as keyof typeof ui] || ui.English).capex} <InfoTooltip text={(tips[language as keyof typeof tips] || tips.English).capexInfo} /></h3>
          </div>
          <div className="h-80">
            <div className="w-full h-full flex items-center justify-center overflow-hidden print:block print:w-[500px] print:mx-auto">
            <PieChart width={500} height={300}>
                <Pie isAnimationActive={false}
                  data={capExData}
                  cx="50%"
                  cy="40%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="item"
                >
                  {capExData.map((_: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="bg-white dark:bg-[#20242D] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              <h3 className="font-bold text-gray-800 dark:text-slate-200">{(ui[language as keyof typeof ui] || ui.English).rev}</h3>
            </div>
          </div>
          <div className="h-80">
            <div className="w-full h-full flex items-center justify-center overflow-hidden print:block print:w-[500px] print:mx-auto">
            <BarChart width={500} height={300} data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tickFormatter={(value) => `₹${value/1000}k`} tick={{fontSize: 12}} />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar isAnimationActive={false} dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar isAnimationActive={false} dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>

      </div>

      {/* Break Even Slider */}
      <div className="bg-white dark:bg-[#20242D] border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-none print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-slate-200">{(ui[language as keyof typeof ui] || ui.English).stress}</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400">{(ui[language as keyof typeof ui] || ui.English).adjust}</p>
            </div>
          </div>
          <div className="flex-1 max-w-md mx-auto md:mx-0 md:ml-8 w-full">
            <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
              <span>{(ui[language as keyof typeof ui] || ui.English).worst}</span>
              <span className="text-blue-600">{(ui[language as keyof typeof ui] || ui.English).expect}</span>
              <span>{(ui[language as keyof typeof ui] || ui.English).best}</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.1"
              value={revenueMultiplier}
              onChange={(e) => setRevenueMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
        <div className="mt-6 bg-gray-50 dark:bg-[#14161C] rounded-lg p-4 flex flex-col md:flex-row justify-around items-center border border-gray-100 dark:border-slate-800 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{(ui[language as keyof typeof ui] || ui.English).adjProfit}</p>
            <p className={`text-xl font-bold ${adjustedProfit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(adjustedProfit)}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">{(ui[language as keyof typeof ui] || ui.English).estBreak} <InfoTooltip text={(tips[language as keyof typeof tips] || tips.English).breakInfo} /></div>
            <p className="text-xl font-bold text-gray-800 dark:text-slate-200">
              {adjustedProfit > 0 ? `${Math.ceil(adjustedBreakEven)} ${(ui[language as keyof typeof ui] || ui.English).months}` : (ui[language as keyof typeof ui] || ui.English).never}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
