"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({ onImageSelect, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "relative w-full rounded-xl border-2 border-dashed transition-all duration-200",
          "flex flex-col items-center justify-center overflow-hidden",
          preview ? "aspect-video" : "aspect-video min-h-[220px]",
          disabled
            ? "cursor-not-allowed opacity-40 border-neutral-700"
            : isDragging
            ? "cursor-copy border-neutral-300 bg-neutral-800"
            : "cursor-pointer border-neutral-600 bg-neutral-900 hover:border-neutral-400 hover:bg-neutral-800",
        ].join(" ")}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="uploaded"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-sm text-white font-medium transition-opacity duration-200">
                이미지 변경
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center pointer-events-none">
            <UploadIcon dragging={isDragging} />
            <p className="text-neutral-300 text-sm font-medium">
              {isDragging ? "여기에 놓으세요" : "이미지를 드래그하거나 클릭하세요"}
            </p>
            <p className="text-neutral-600 text-xs">JPG · PNG · WEBP</p>
          </div>
        )}
      </div>

      {fileName && (
        <p className="text-neutral-500 text-xs truncate px-1">{fileName}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />
    </div>
  );
}

function UploadIcon({ dragging }: { dragging: boolean }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-colors duration-200 ${
        dragging ? "text-neutral-200" : "text-neutral-500"
      }`}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
