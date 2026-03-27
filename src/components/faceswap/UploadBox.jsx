import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadBox({ label, accept, icon: IconType, file, onFileSelect, onClear, fileType }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const Icon = IconType || (fileType === "image" ? Image : Film);

  const validateFile = useCallback((f) => {
    if (fileType === "image") {
      return f.type === "image/jpeg" || f.type === "image/png";
    }
    if (fileType === "video") {
      return f.type === "video/mp4";
    }
    return false;
  }, [fileType]);

  const handleFile = useCallback((f) => {
    if (!validateFile(f)) {
      const allowed = fileType === "image" ? "JPG or PNG" : "MP4";
      alert(`Invalid file type. Please upload a ${allowed} file.`);
      return;
    }
    onFileSelect(f);
  }, [validateFile, onFileSelect, fileType]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-secondary border border-border group"
      >
        {fileType === "image" ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Source face"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
            controls
            muted
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs text-white/70 font-medium truncate max-w-48">{file.name}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        relative w-full aspect-video rounded-xl cursor-pointer
        border-2 border-dashed transition-all duration-300
        flex flex-col items-center justify-center gap-4 p-6
        ${isDragging
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <motion.div
        animate={isDragging ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        {isDragging ? (
          <Upload className="w-6 h-6 text-primary" />
        ) : (
          <Icon className="w-6 h-6 text-primary" />
        )}
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isDragging ? "Release to upload" : "Drag & drop or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {fileType === "image" ? "JPG, PNG" : "MP4"}
        </p>
      </div>
    </motion.div>
  );
}