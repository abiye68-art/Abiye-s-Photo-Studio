import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  if (selectedFile) {
    return (
      <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-blue-100 bg-white shadow-inner group">
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white text-sm backdrop-blur-sm">
          {selectedFile.name}
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full aspect-square max-w-md mx-auto rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center",
        isDragActive 
          ? "border-blue-500 bg-blue-50 scale-[1.02]" 
          : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
        <Upload size={32} />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload your photo</h3>
      <p className="text-slate-500 max-w-[240px]">
        Drag and drop your image here, or click to browse
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
        <ImageIcon size={14} />
        Supports JPG, PNG
      </div>
    </div>
  );
};
