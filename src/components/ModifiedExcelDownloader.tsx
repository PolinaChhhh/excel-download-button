
import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ModifiedExcelDownloaderProps {
  data: any;
  originalFile?: File;
  filename?: string;
  className?: string;
}

const ModifiedExcelDownloader: React.FC<ModifiedExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = async () => {
    if (downloadState === "loading" || !originalFile) return;
    
    setDownloadState("loading");
    toast.info("Подготовка документа с изменениями...");
    
    try {
      // Read the original file
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Parse the Excel file
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          
          // Get the first worksheet
          const wsName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsName];
          
          // Set the value of cell AD18 to "ПОПКА"
          XLSX.utils.sheet_add_aoa(worksheet, [["ПОПКА"]], { origin: "AD18" });
          
          // Write the modified workbook to an array buffer
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
          console.error("Failed to process Excel file:", error);
          setDownloadState("error");
          toast.error("Ошибка при обработке файла");
          
          setTimeout(() => {
            setDownloadState("idle");
          }, 2000);
        }
      };
      
      fileReader.onerror = () => {
        console.error("Failed to read file");
        setDownloadState("error");
        toast.error("Ошибка при чтении файла");
        
        setTimeout(() => {
          setDownloadState("idle");
        }, 2000);
      };
      
      fileReader.readAsArrayBuffer(originalFile);
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
      disabled={downloadState === "loading" || !originalFile}
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
