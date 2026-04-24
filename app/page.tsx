"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ViewpointController, { ViewpointType } from "@/components/ViewpointController";
import ResultViewer from "@/components/ResultViewer";
import FeedbackInput from "@/components/FeedbackInput";

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [viewpoint, setViewpoint] = useState<ViewpointType | null>(null);
  const [result, setResult] = useState<{
    imageBase64: string;
    mimeType: string;
    analysis: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!image || !viewpoint || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("viewpoint", viewpoint);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "생성 중 오류가 발생했습니다.");
      }

      setResult({
        imageBase64: data.image,
        mimeType: data.mimeType,
        analysis: data.analysis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerate = async (feedbackText: string) => {
    if (!result || !image || !viewpoint || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("viewpoint", viewpoint);
      formData.append("feedback", feedbackText);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "재생성 중 오류가 발생했습니다.");
      }

      setResult({
        imageBase64: data.image,
        mimeType: data.mimeType,
        analysis: data.analysis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !image || !viewpoint || isLoading;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 lg:p-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">VIEWPOINT</h1>
        <p className="text-neutral-500 mt-1">건축 시점 시뮬레이터</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 좌측 컨트롤 패널 */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
          <ImageUploader 
            onImageSelect={setImage} 
            disabled={isLoading} 
          />
          
          <ViewpointController
            selected={viewpoint}
            onViewpointSelect={setViewpoint}
            disabled={!image || isLoading}
          />
          
          <button
            onClick={generate}
            disabled={isSubmitDisabled}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-200
              ${isSubmitDisabled 
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-40" 
                : "bg-neutral-100 text-neutral-950 hover:bg-white active:scale-[0.98]"
              }`}
          >
            {isLoading && !result ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-neutral-950 rounded-full animate-spin" />
                <span>처리 중...</span>
              </div>
            ) : (
              "시뮬레이션 시작"
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 우측 결과 패널 */}
        <div className="flex-1 flex flex-col gap-4">
          <ResultViewer
            imageBase64={result?.imageBase64 || null}
            mimeType={result?.mimeType || null}
            isLoading={isLoading}
            analysis={result?.analysis || null}
          />
          
          <FeedbackInput
            onSubmit={regenerate}
            isLoading={isLoading}
            disabled={!result}
          />
        </div>
      </div>
    </div>
  );
}
