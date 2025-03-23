
import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ModifiedExcelDownloaderProps {
  data: any;
  filename?: string;
  className?: string;
}

const ModifiedExcelDownloader: React.FC<ModifiedExcelDownloaderProps> = ({
  data,
  filename = "modified-document.xlsx",
  className,
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = async () => {
    if (downloadState === "loading") return;
    
    setDownloadState("loading");
    toast.info("Подготовка документа с изменениями...");
    
    try {
      // In a real application, you would use a library like xlsx or exceljs
      // to create an Excel file with the modified data.
      // For this demo, we'll mock the file creation.
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock Excel file (in a real app, this would be a properly formatted Excel file)
      const mockExcelContent = JSON.stringify({
        ...data,
        cellAD18: "ПОПКА", // Ensure the cell value is in the downloaded file
        _note: "In a real app, this would be an Excel file with the cell AD18 containing 'ПОПКА'"
      }, null, 2);
      
      const blob = new Blob(
        [mockExcelContent], 
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      );
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setDownloadState("success");
      toast.success("Документ успешно скачан с заполненной ячейкой AD18");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadState("error");
      toast.error("Ошибка при скачивании файла");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloadState === "loading" || !data}
      className={className}
      variant="default"
    >
      {downloadState === "idle" && (
        <>
          <Download className="mr-2 h-4 w-4" />
          Скачать документ с изменениями
        </>
      )}
      
      {downloadState === "loading" && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Подготовка файла...
        </>
      )}
      
      {downloadState === "success" && (
        <>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Документ скачан
        </>
      )}
      
      {downloadState === "error" && (
        "Ошибка скачивания"
      )}
    </Button>
  );
};

export default ModifiedExcelDownloader;
