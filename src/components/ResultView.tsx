import React from 'react';
import { motion } from 'motion/react';
import { Download, Share2, RefreshCw } from 'lucide-react';

interface ResultViewProps {
  originalImage: string;
  processedImage: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImage, processedImage, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'abiye-photo-studio.png';
    link.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original</h4>
          <div className="rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm">
            <img src={originalImage} alt="Original" className="w-full h-auto" referrerPolicy="no-referrer" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Processed</h4>
          <div className="rounded-2xl overflow-hidden border-4 border-blue-600 bg-white shadow-2xl shadow-blue-200">
            <img src={processedImage} alt="Processed" className="w-full h-auto" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
          <Download size={20} />
          Download Photo
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Share2 size={20} />
          Share
        </button>
        <button onClick={onReset} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={20} />
          Try Another
        </button>
      </div>

      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-slate-600 italic">
          "Your photo has been optimized for UK Passport standards. Background removed and lighting balanced."
        </p>
      </div>
    </motion.div>
  );
};
