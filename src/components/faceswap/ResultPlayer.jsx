import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Play } from "lucide-react";

export default function ResultPlayer({ videoUrl, onReset }) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "faceswap-result.mp4";
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-primary">Processing Complete</span>
        </motion.div>
        <h3 className="text-xl font-bold text-foreground">Your Result</h3>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-secondary border border-border shadow-2xl shadow-primary/5">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full aspect-video object-contain bg-black"
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handleDownload}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6"
        >
          <Download className="w-4 h-4" />
          Download Video
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 border-border hover:bg-secondary"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}