// src/app/page.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size exceeds 5MB limit');
          return;
        }
        handleImageUpload(file);
      } else {
        setError('Please select an image file (JPG/PNG)');
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);
    setProcessedImage(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      setOriginalImage(e.target?.result as string);

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/remove', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setProcessedImage(data.imageUrl);
        } else {
          setError(data.error || 'Failed to process image');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Background Remover
        </h1>
        <p className="text-slate-400 text-lg">
          AI-powered background removal, 100% free
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {/* Upload Section */}
        {!originalImage && (
          <div className="max-w-xl mx-auto">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                disabled={isLoading}
              />
              
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <p className="text-white text-lg font-medium mb-2">
                Drop your image here
              </p>
              <p className="text-slate-400 text-sm mb-4">
                or click to browse from your device
              </p>
              <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Select Image
              </span>
              <p className="text-slate-500 text-xs mt-4">
                Supports JPG, PNG • Max 5MB
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Result Section */}
        {originalImage && (
          <div className="space-y-6">
            {/* Images Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Original</span>
                </div>
                <div className="p-4">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-64 object-contain rounded-lg bg-slate-900/50"
                  />
                </div>
              </div>

              {/* Processed */}
              <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Result</span>
                  {processedImage && (
                    <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                      ✓ Done
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {processedImage ? (
                    <div className="relative">
                      <div 
                        className="absolute inset-0 rounded-lg opacity-30"
                        style={{
                          backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                          backgroundSize: '16px 16px',
                          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                        }}
                      />
                      <img
                        src={processedImage}
                        alt="Result"
                        className="relative w-full h-64 object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center rounded-lg bg-slate-900/50">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-slate-400">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              {processedImage && (
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
              >
                Upload New Image
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-sm">
        Powered by AI • No registration required
      </footer>
    </div>
  );
}