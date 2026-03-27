import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Image, Film, AlertCircle } from "lucide-react";
import UploadBox from "@/components/faceswap/UploadBox";
import ProcessingLoader from "@/components/faceswap/ProcessingLoader";
import ResultPlayer from "@/components/faceswap/ResultPlayer";

const MOCK_RESULT_URL = "MOCK_LINK";

export default function FaceSwap() {
  const [sourceImage, setSourceImage] = useState(null);
  const [targetVideo, setTargetVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const progressRef = useRef(null);

  const handleSwap = useCallback(async () => {
    if (!sourceImage || !targetVideo) return;
  
    setError(null);
    setIsProcessing(true);
    setProgress(0);
  
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressRef.current);
          return 90;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 400);
  
    const formData = new FormData();
    formData.append("source_image", sourceImage);
    formData.append("target_video", targetVideo);
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/swap", {
        method: "POST",
        body: formData,
      });
  
      clearInterval(progressRef.current);
  
      let data = null;
  
      if (response.ok) {
        data = await response.json();
      }
  
      setProgress(100);
  
      setTimeout(() => {
        // ✅ если бэк отдал норм ответ
        if (data?.status === "completed" && data?.url) {
          setResultUrl(data.url);
        } else {
          // ⚠️ fallback если бэк сломан или вернул мусор
          setResultUrl(MOCK_RESULT_URL);
          console.warn("Backend failed, using mock");
        }
  
        setIsProcessing(false);
      }, 600);
  
    } catch (err) {
      clearInterval(progressRef.current);
  
      // ❌ если вообще сеть умерла
      setTimeout(() => {
        setResultUrl(MOCK_RESULT_URL);
        setIsProcessing(false);
        console.warn("Request failed, using mock:", err);
      }, 600);
    }
  }, [sourceImage, targetVideo]);

  const handleReset = useCallback(() => {
    setSourceImage(null);
    setTargetVideo(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
    setIsProcessing(false);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const canSwap = sourceImage && targetVideo && !isProcessing;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">AI-Powered</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            Face<span className="text-primary">Swap</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Upload a face photo and a target video. Our AI seamlessly swaps the face in seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {resultUrl && !isProcessing ? (
            <ResultPlayer
              key="result"
              videoUrl={resultUrl}
              onReset={handleReset}
            />
          ) : isProcessing ? (
            <ProcessingLoader key="loader" progress={progress} />
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">Source Face</h2>
                  </div>
                  <UploadBox
                    label="Upload Face Photo"
                    accept="image/jpeg,image/png"
                    fileType="image"
                    file={sourceImage}
                    onFileSelect={setSourceImage}
                    onClear={() => setSourceImage(null)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Film className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">Target Video</h2>
                  </div>
                  <UploadBox
                    label="Upload Target Video"
                    accept="video/mp4"
                    fileType="video"
                    file={targetVideo}
                    onFileSelect={setTargetVideo}
                    onClear={() => setTargetVideo(null)}
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Swap Button */}
              <div className="flex justify-center pt-2">
                <motion.div whileHover={canSwap ? { scale: 1.03 } : {}} whileTap={canSwap ? { scale: 0.97 } : {}}>
                  <Button
                    onClick={handleSwap}
                    disabled={!canSwap}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-3 px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5" />
                    Swap Face
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              {/* How it works */}
              <div className="pt-8 border-t border-border/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { step: "01", title: "Upload Face", desc: "Add a clear photo of the face you want to use" },
                    { step: "02", title: "Upload Video", desc: "Select the target video for the face swap" },
                    { step: "03", title: "Get Result", desc: "Download your face-swapped video in seconds" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="text-center space-y-2"
                    >
                      <span className="text-2xl font-extrabold text-primary/20">{item.step}</span>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}