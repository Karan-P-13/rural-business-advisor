"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Phone, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep(2);
  };

  const handleVerify = async () => {
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      phone,
      otp,
    });
    setLoading(false);
    if (res?.ok) {
      onClose();
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1D24] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white">Cloud Sync Access</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:scale-105 transition-all text-slate-500 dark:text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <h3 className="text-center font-semibold text-lg text-slate-800 dark:text-white mb-2">
            {step === 1 ? "Secure Your Business Plans" : "Verify Your Number"}
          </h3>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
            {step === 1 ? "Login to sync your action plans to the cloud forever." : `Enter the OTP sent to ${phone}`}
          </p>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D0F12] focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
              <button 
                onClick={handleSendOtp}
                disabled={phone.length < 10}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP (Use 1234)"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D0F12] focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white font-mono"
                maxLength={4}
              />
              <button 
                onClick={handleVerify}
                disabled={otp.length !== 4 || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
