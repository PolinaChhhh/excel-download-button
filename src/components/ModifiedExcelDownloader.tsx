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
  customCellText?: string;
}

const ModifiedExcelDownloader: React.FC<ModifiedExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
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
          
          // Parse the Excel file with all possible formatting options enabled
          const workbook = XLSX.read(arrayBuffer, { 
            type: 'array',
            cellStyles: true,   // Important for cell styling
            cellDates: true,    // Preserve date formats
            cellNF: true,       // Preserve number formats
            cellFormula: true,  // Preserve formulas
            bookVBA: true,      // Preserve VBA
            WTF: true           // Parse all unknown and non-standard properties
          });
          
          // Get the first worksheet
          const wsName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[wsName];
          
          // Log worksheet details for debugging
          console.log("Worksheet structure:", Object.keys(worksheet));
          console.log("Cell AD18 before:", worksheet["AD18"]);
          
          // Get the cell AD18 properties before modifying it
          const cellAddress = "AD18";
          const originalCell = worksheet[cellAddress] || {};
          
          // Preserve ALL original properties
          // Ensure we keep every style property
          const cellStyle = originalCell.s || {}; 
          
          // Create a complete cell object that preserves everything
          worksheet[cellAddress] = {
            ...originalCell,       // Keep all original properties
            v: customCellText,     // Set the raw value
            w: customCellText,     // Set the formatted text
            t: 's',                // Type: string
            s: cellStyle,          // Style: preserve original style including borders, font, etc.
          };
          
          // Log the modified cell for debugging
          console.log("Cell AD18 after:", worksheet[cellAddress]);
          
          // Ensure worksheet properties are preserved
          if (!worksheet['!cols']) {
            console.warn("Column widths not found in original file");
          }
          if (!worksheet['!rows']) {
            console.warn("Row heights not found in original file");
          }
          if (!worksheet['!merges']) {
            console.warn("Merged cells not found in original file");
          }
          
          // Write the modified workbook to an array buffer with full formatting preservation
          const excelBuffer = XLSX.write(workbook, { 
            bookType: 'xlsx', 
            type: 'array',
            cellStyles: true,     // Very important for preserving styles
            compression: true
          });
          
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
          toast.success(`Документ успешно скачан с заполненной ячейкой AD18: "${customCellText}"`);
          
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
