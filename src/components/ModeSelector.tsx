import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';

interface ModeSelectorProps {
  mode: 'passport' | 'studio';
  setMode: (mode: 'passport' | 'studio') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      <button
        onClick={() => setMode('passport')}
        className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
          mode === 'passport' 
            ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-100' 
            : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${mode === 'passport' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <CheckCircle2 size={24} />
          </div>
          {mode === 'passport' && (
            <motion.div layoutId="active-pill" className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
              Selected
            </motion.div>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">UK Passport ID</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Plain light grey background, perfect lighting, and official dimensions.
        </p>
        <div className="mt-4 flex items-center gap-2 text-blue-600 text-xs font-medium">
          <Info size={14} />
          Guaranteed compliance
        </div>
      </button>

      <button
        onClick={() => setMode('studio')}
        className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
          mode === 'studio' 
            ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-100' 
            : 'border-slate-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${mode === 'studio' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <ImageIcon size={24} />
          </div>
          {mode === 'studio' && (
            <motion.div layoutId="active-pill" className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
              Selected
            </motion.div>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Studio Portrait</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Transform your photo with professional photoshoot backgrounds.
        </p>
        <div className="mt-4 flex items-center gap-2 text-blue-600 text-xs font-medium">
          <Info size={14} />
          Creative & Artistic
        </div>
      </button>
    </div>
  );
};

const ImageIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);
