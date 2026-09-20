import React from 'react';

export default function SkeletonDashboard() {
  return (
    <div className="flex flex-col h-[500px] bg-slate-50/50 dark:bg-[#1A1D24] rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full max-w-4xl opacity-80">
      {/* Top Action Bar */}
      <div className="bg-gradient-to-r from-white dark:from-[#1A1D24] to-slate-50 dark:to-[#14161C] px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-slate-50/50 dark:bg-[#1A1D24] border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-4">
          <div className="h-10 w-32 bg-white dark:bg-[#20242D] rounded-t-xl animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-t-xl animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-t-xl animate-pulse"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 space-y-6 bg-white dark:bg-[#20242D]/50 animate-pulse">
        {/* Title & Summary */}
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="h-40 bg-slate-100 dark:bg-[#1A1D24] rounded-xl border border-slate-200 dark:border-slate-800"></div>
          <div className="h-40 bg-slate-100 dark:bg-[#1A1D24] rounded-xl border border-slate-200 dark:border-slate-800"></div>
        </div>
      </div>
    </div>
  );
}
