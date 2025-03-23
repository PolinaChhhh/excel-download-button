
import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
      // Create a workbook with the data
      const workbook = XLSX.utils.book_new();
      
      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet([
        { "Cell_AD18": "ПОПКА" },
        ...Array.isArray(data.items) 
          ? data.items.map(item => ({ ...item }))
          : [{ "Data": JSON.stringify(data) }]
      ]);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Modified Data");
      
      // Write the workbook to an array buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create a blob from the buffer
      const blob = new Blob([excelBuffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
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
