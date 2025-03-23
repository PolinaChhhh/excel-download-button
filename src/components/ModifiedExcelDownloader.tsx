
import React, { useState } from 'react';
import { toast } from 'sonner';
import { analyzeExcelFile, modifyAndDownloadExcel } from '@/utils/excelUtils';
import AnalyzeButton from '@/components/excel/AnalyzeButton';
import DownloadButton from '@/components/excel/DownloadButton';
import StyleInfo from '@/components/excel/StyleInfo';
import type { CellStyle, ExcelDownloaderProps } from '@/types/excel';

const ModifiedExcelDownloader: React.FC<ExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "analyzing" | "success" | "error">("idle");
  const [cellStyles, setCellStyles] = useState<CellStyle[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeDocument = async () => {
    if (!originalFile) return;
    
    setDownloadState("analyzing");
    toast.info("Анализ стилей документа...");
    
    try {
      const { cellStyles: styles } = await analyzeExcelFile(originalFile);
      
      setCellStyles(styles);
      setHasAnalyzed(true);
      setDownloadState("idle");
      
      // Log cells with borders
      const cellsWithBorders = styles.filter(cell => 
        cell.borders?.top || cell.borders?.right || 
        cell.borders?.bottom || cell.borders?.left
      );
      
      console.log("Ячейки с границами:", cellsWithBorders.map((c: CellStyle) => c.address));
      
      // Check cell A3 specifically
      const a3Cell = styles.find((cell: CellStyle) => cell.address === 'A3');
      if (a3Cell) {
        console.log("Стиль ячейки A3:", a3Cell);
      } else {
        console.log("Ячейка A3 не имеет специальных стилей");
      }
      
      toast.success("Анализ документа завершен. Найдено " + styles.length + " ячеек со стилями.");
      
    } catch (error) {
      console.error("Ошибка при анализе Excel файла:", error);
      setDownloadState("error");
      toast.error("Ошибка при анализе файла");
      
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  const handleDownload = async () => {
    if (downloadState === "loading" || !originalFile) return;
    
    setDownloadState("loading");
    toast.info("Подготовка документа с изменениями...");
    
    try {
      await modifyAndDownloadExcel(
        originalFile,
        cellStyles,
        filename,
        customCellText
      );
      
      setDownloadState("success");
      toast.success(`Документ успешно скачан с сохранением всех стилей и границ. Ячейка AD18: "${customCellText}"`);
      
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
      
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      setDownloadState("error");
      toast.error("Ошибка при скачивании файла");
      
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }
  };

  return (
    <div className="space-y-3">
      {!hasAnalyzed && originalFile && (
        <AnalyzeButton 
          onClick={analyzeDocument}
          isAnalyzing={downloadState === "analyzing"}
          disabled={downloadState !== "idle" || !originalFile}
          className={className}
        />
      )}
      
      {(hasAnalyzed || !originalFile) && (
        <DownloadButton 
          onClick={handleDownload}
          downloadState={downloadState === "analyzing" ? "loading" : downloadState}
          disabled={downloadState === "loading" || !originalFile || (!!originalFile && !hasAnalyzed)}
          className={className}
        />
      )}
      
      {hasAnalyzed && <StyleInfo stylesCount={cellStyles.length} />}
    </div>
  );
};

export default ModifiedExcelDownloader;
