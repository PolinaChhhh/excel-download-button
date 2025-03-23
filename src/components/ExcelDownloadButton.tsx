
import React, { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExcelDownloadButtonProps {
  filename?: string;
  onDownload?: () => Promise<Blob>;
  className?: string;
  data?: any;
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({
  filename = "data.xlsx",
  onDownload,
  className,
  data,
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = async () => {
    if (downloadState === "loading") return;
    
    setDownloadState("loading");
    
    try {
      let blob: Blob;
      
      if (onDownload) {
        // Use the provided download function
        blob = await onDownload();
      } else if (data) {
        // Mock function - in a real app, you would convert your data to Excel here
        // using a library like xlsx or exceljs
        blob = new Blob(
          [JSON.stringify(data, null, 2)], 
          { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );
      } else {
        // Mock blob if no data is provided
        blob = new Blob(
          [JSON.stringify({ message: "Sample data" }, null, 2)], 
          { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );
      }
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setDownloadState("success");
      toast.success("File downloaded successfully");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadState("error");
      toast.error("Failed to download file");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={cn(
        "excel-button excel-button-primary group",
        {
          "cursor-not-allowed opacity-70": downloadState === "loading",
        },
        className
      )}
      disabled={downloadState === "loading"}
      aria-label="Download Excel file"
    >
      <span className="relative flex items-center gap-2">
        {downloadState === "idle" && (
          <>
            <Download className="excel-button-icon h-4 w-4 transition-transform duration-300 group-hover:translate-y-[1px]" />
            <span className="animate-slide-up">Download Excel</span>
          </>
        )}
        
        {downloadState === "loading" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Downloading...</span>
          </>
        )}
        
        {downloadState === "success" && (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span>Downloaded</span>
          </>
        )}
        
        {downloadState === "error" && (
          <span className="text-red-500">Download failed</span>
        )}
      </span>
    </button>
  );
};

export default ExcelDownloadButton;
