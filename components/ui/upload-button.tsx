"use client";

import { UploadButton as UploadButtonPrimitive } from "@uploadthing/react";
import { OurFileRouter } from "@/lib/uploadthing";
import { useState } from "react";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadButtonProps {
  onUploadComplete?: (res: { url: string; name: string }[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  buttonText?: string;
  maxFiles?: number;
  maxSize?: string;
}

export function UploadButton({
  onUploadComplete,
  onUploadError,
  className,
  buttonText = "رفع صورة",
  maxFiles = 5,
  maxSize = "4MB",
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className={cn("space-y-4", className)}>
      <UploadButtonPrimitive<OurFileRouter, "gameImage">
        endpoint="gameImage"
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          const files = res.map((file: { url: string; name: string }) => ({
            url: file.url,
            name: file.name,
          }));
          setUploadedFiles(files);
          if (onUploadComplete) {
            onUploadComplete(files);
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          console.error("Upload error:", error);
          if (onUploadError) {
            onUploadError(error);
          }
        }}
        config={{
          mode: "auto",
        }}
        appearance={{
          button: cn(
            "w-full bg-brand-deepest text-white hover:bg-brand-deep transition-colors",
            isUploading && "opacity-70 cursor-not-allowed"
          ),
          allowedContent: "text-xs text-gray-500 mt-1",
          container: "w-full",
        }}
        content={{
          button({ ready, isUploading }: { ready: boolean; isUploading: boolean }) {
            if (isUploading) {
              return (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري الرفع...</span>
                </div>
              );
            }
            return (
              <div className="flex items-center justify-center gap-2">
                <UploadCloud className="h-4 w-4" />
                <span>{buttonText}</span>
              </div>
            );
          },
          allowedContent({ ready, fileTypes, isUploading }: { 
            ready: boolean; 
            fileTypes: string[]; 
            isUploading: boolean 
          }) {
            if (!ready) return "جاري التحميل...";
            if (isUploading) return "جاري رفع الملفات...";
            return `يمكنك رفع حتى ${maxFiles} ملفات (${maxSize} لكل ملف)`;
          },
        }}
      />

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-brand-deepest">الملفات المرفوعة:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-deepest hover:underline"
                >
                  عرض
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload status */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>جاري رفع الملفات... يرجى الانتظار</span>
        </div>
      )}
    </div>
  );
}