"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, File, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE, ACCEPTED_MIME_TYPES } from "@/lib/constants";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
}

export function ResumeUploadCard({ onFileSelect }: ResumeUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const f = acceptedFiles[0] ?? null;
      setFile(f);
      onFileSelect(f);
    },
    onDropRejected: () => {
      // File rejected (wrong type or too large)
    },
  });

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Upload className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Upload Resume
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            PDF, DOCX, or TXT — max 10 MB
          </p>
        </div>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 px-4 cursor-pointer transition-colors",
            isDragActive && !isDragReject
              ? "border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-500/5"
              : isDragReject
              ? "border-red-400 bg-red-50/50 dark:border-red-500 dark:bg-red-500/5"
              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                isDragActive
                  ? "bg-blue-100 dark:bg-blue-500/10"
                  : "bg-zinc-100 dark:bg-zinc-800"
              )}
            >
              <Upload
                className={cn(
                  "w-5 h-5 transition-colors",
                  isDragActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-400"
                )}
              />
            </div>
            <div className="text-center">
              {isDragActive ? (
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Drop your file here
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 p-3"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 shrink-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
