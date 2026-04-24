"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Props {
  onSubmit: (feedback: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function FeedbackInput({ onSubmit, isLoading, disabled = false }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea (min 2 lines, max 5 lines)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to recalculate
    textarea.style.height = 'auto';
    
    // minHeight ~56px (2 lines), maxHeight ~128px (5 lines)
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(Math.max(scrollHeight, 56), 128)}px`;
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || isLoading || disabled) return;
    onSubmit(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = disabled || isLoading;
  const isSubmitDisabled = isDisabled || !text.trim();

  return (
    <div className={`w-full flex flex-col gap-3 transition-all duration-200 ${disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}>
      <div className={`relative flex items-end gap-2 p-2 rounded-xl border ${disabled ? 'border-neutral-800' : 'border-neutral-700 focus-within:border-neutral-500'} bg-neutral-950 transition-all duration-150`}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder="추가 수정 사항을 입력하세요 (예: 조금 더 높은 각도로, 저녁 조명으로)"
          className={`w-full resize-none bg-transparent text-neutral-100 placeholder-neutral-500 p-2 outline-none text-sm leading-relaxed ${isDisabled ? 'cursor-not-allowed' : ''}`}
          style={{ minHeight: '56px', maxHeight: '128px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`shrink-0 px-4 h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-150
            ${isSubmitDisabled 
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-40' 
              : 'bg-neutral-100 text-neutral-950 hover:bg-white active:scale-95'
            }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-950 rounded-full animate-spin" />
          ) : (
            '재생성'
          )}
        </button>
      </div>
    </div>
  );
}
