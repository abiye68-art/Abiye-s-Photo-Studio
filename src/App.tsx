import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Loader2, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ModeSelector } from './components/ModeSelector';
import { ResultView } from './components/ResultView';
import { processImage } from './services/ai';

export default function App() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'passport' | 'studio'>('passport');
  const [studioPrompt, setStudioPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalImageUrl(URL.createObjectURL(selectedFile));
    setStep(2);
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const base64 = await base64Promise;
      const result = await processImage(base64, mode, studioPrompt);
      setProcessedImage(result);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while processing your image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setProcessedImage(null);
    setOriginalImageUrl(null);
    setStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Camera size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Abiye's<span className="text-blue-600">PhotoStudio</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4">
            <StepIndicator num={1} active={step >= 1} completed={step > 1} label="Upload" />
            <div className={`w-12 h-1 rounded-full ${step > 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <StepIndicator num={2} active={step >= 2} completed={step > 2} label="Configure" />
            <div className={`w-12 h-1 rounded-full ${step > 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <StepIndicator num={3} active={step >= 3} completed={step > 3} label="Result" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12 text-center"
            >
              <div className="max-w-2xl mx-auto space-y-4">
                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  Professional Photos <br />
                  <span className="text-blue-600">Made Simple.</span>
                </h1>
                <p className="text-xl text-slate-600">
                  Create official UK passport photos or stunning studio portraits in seconds. 
                  No technical skills required.
                </p>
              </div>

              <FileUpload 
                onFileSelect={handleFileSelect} 
                selectedFile={file} 
                onClear={() => setFile(null)} 
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
                <FeatureCard 
                  icon={<Check className="text-green-500" />} 
                  title="UK Compliant" 
                  desc="Meets all official HM Passport Office standards." 
                />
                <FeatureCard 
                  icon={<Sparkles className="text-blue-500" />} 
                  title="AI Powered" 
                  desc="Instant background removal and lighting correction." 
                />
                <FeatureCard 
                  icon={<Camera className="text-purple-500" />} 
                  title="Studio Quality" 
                  desc="Choose from professional photoshoot backdrops." 
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">Choose Your Style</h2>
                <p className="text-slate-600">Select the type of photo you want to create.</p>
              </div>

              <ModeSelector mode={mode} setMode={setMode} />

              {mode === 'studio' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="max-w-2xl mx-auto space-y-4"
                >
                  <label className="block text-sm font-semibold text-slate-700">
                    Describe your studio background (Optional)
                  </label>
                  <textarea
                    value={studioPrompt}
                    onChange={(e) => setStudioPrompt(e.target.value)}
                    placeholder="e.g. A warm wooden library, a minimalist white studio, a lush garden at sunset..."
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all min-h-[100px]"
                  />
                </motion.div>
              )}

              <div className="flex justify-center gap-4">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button 
                  onClick={handleProcess} 
                  disabled={isProcessing}
                  className="btn-primary min-w-[200px] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Photo
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && processedImage && originalImageUrl && (
            <ResultView 
              originalImage={originalImageUrl} 
              processedImage={processedImage} 
              onReset={reset} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Camera size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Abiye'sPhotoStudio</span>
            </div>
            <p className="text-sm text-slate-500">
              The world's easiest way to create professional ID and studio photos.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Passport Maker</a></li>
              <li><a href="#" className="hover:text-blue-600">Studio Portraits</a></li>
              <li><a href="#" className="hover:text-blue-600">Background Removal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
          © 2026 Abiye's Photo Studio App. All rights reserved. <span className="ml-2 opacity-50">v2.0.1</span>
        </div>
      </footer>
    </div>
  );
}

function StepIndicator({ num, active, completed, label }: { num: number, active: boolean, completed: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
        completed ? 'bg-blue-600 text-white' : 
        active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
        'bg-slate-200 text-slate-500'
      }`}>
        {completed ? <Check size={20} /> : num}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
