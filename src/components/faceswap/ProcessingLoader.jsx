import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Analyzing facial features...",
  "Mapping face geometry...",
  "Aligning face to target...",
  "Rendering frames...",
  "Blending edges...",
  "Finalizing output...",
];

export default function ProcessingLoader({ progress }) {
  const messageIndex = Math.min(
    Math.floor((progress / 100) * MESSAGES.length),
    MESSAGES.length - 1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        <Progress value={progress} className="h-1.5 bg-secondary" />
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground text-center font-medium"
        >
          {MESSAGES[messageIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
}