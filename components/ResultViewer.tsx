"use client";

import React, { useState } from 'react';

interface Props {
  imageBase64: string | null;
  mimeType: string | null;
  isLoading: boolean;
  analysis: string | null;
}

export default function ResultViewer({ imageBase64, mimeType, isLoading, analysis }: Props) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleDownload = () => {
    if (!imageBase64 || !mimeType) return;
    const a = document.createElement('a');
    a.href = `data:${mimeType};base64,${imageBase64}`;
    a.download = `result-${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full aspect-video rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center transition-all duration-200">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-neutral-700 border-t-neutral-100 rounded-full animate-spin" />
            <span className="text-neutral-500 text-sm">생성 중...</span>
          </div>
        ) : imageBase64 ? (
          <>
            <img 
              src={`data:${mimeType || 'image/jpeg'};base64,${imageBase64}`} 
              alt="Generated result" 
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleDownload}
              className="absolute top-3 right-3 p-2 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-300 hover:text-neutral-100 transition-all duration-150 backdrop-blur-sm"
              title="이미지 다운로드"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </>
        ) : (
          <div className="w-full h-full border-2 border-dashed border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500">
            이미지 결과가 여기에 표시됩니다
          </div>
        )}
      </div>

      {analysis && (
        <div className="w-full rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden transition-all duration-200">
          <button 
            onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
            className="w-full flex items-center justify-between p-4 text-neutral-300 hover:bg-neutral-900 transition-all duration-150"
          >
            <span className="font-medium text-sm">AI 분석 결과</span>
            <svg 
              className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isAnalysisOpen ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isAnalysisOpen && (
            <div className="p-4 pt-0 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50 mt-1">
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
