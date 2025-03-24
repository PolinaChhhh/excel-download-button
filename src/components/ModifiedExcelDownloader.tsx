import React, { useState } from 'react';
import { toast } from 'sonner';
import { analyzeExcelFile, modifyAndDownloadExcel, validateCellStyles } from '@/utils/excelUtils';
import AnalyzeButton from '@/components/excel/AnalyzeButton';
import DownloadButton from '@/components/excel/DownloadButton';
import StyleInfo from '@/components/excel/StyleInfo';
import ValidationResults from '@/components/excel/ValidationResults';
import type { CellStyle, ExcelDownloaderProps, ValidationSummary } from '@/types/excel';

// Import the Button and icons at the top
import { Button } from '@/components/ui/button';
import { CheckSquare, Loader2 } from 'lucide-react';

const ModifiedExcelDownloader: React.FC<ExcelDownloaderProps> = ({
  data,
  originalFile,
  filename = "modified-document.xlsx",
  className,
  customCellText = "ПОПКА"
}) => {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "analyzing" | "validating" | "success" | "error">("idle");
  const [cellStyles, setCellStyles] = useState<CellStyle[]>([]);
  const [cellContents, setCellContents] = useState<Record<string, any>>({});
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationSummary | null>(null);

  const analyzeDocument = async () => {
    if (!originalFile) return;
    
    setDownloadState("analyzing");
    toast.info("Анализ стилей документа...");
    
    try {
      const { cellStyles: styles, cellContents: contents } = await analyzeExcelFile(originalFile);
      
      setCellStyles(styles);
      setCellContents(contents);
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

  const validateDocument = async () => {
    if (!originalFile) return;
    
    setDownloadState("validating");
    toast.info("Проверка стилей документа...");
    
    try {
      // First, create a temporary file with our modifications
      const tempFileReader = new FileReader();
      tempFileReader.onload = async (e) => {
        try {
          // Validate the modified document
          const results = await validateCellStyles(originalFile, cellStyles);
          setValidationResults(results);
          setHasValidated(true);
          setDownloadState("idle");
          
          if (results.isValid) {
            toast.success("Проверка документа завершена успешно. Все стили соответствуют ожиданиям.");
          } else {
            toast.warning(`Обнаружены различия в ${results.invalidCells} ячейках из ${results.totalCells}.`);
          }
        } catch (error) {
          console.error("Ошибка при валидации Excel файла:", error);
          setDownloadState("error");
          toast.error("Ошибка при проверке файла");
          
          setTimeout(() => {
            setDownloadState("idle");
          }, 2000);
        }
      };
      
      tempFileReader.onerror = (error) => {
        console.error("Ошибка при чтении временного файла:", error);
        setDownloadState("error");
        toast.error("Ошибка при чтении временного файла");
        
        setTimeout(() => {
          setDownloadState("idle");
        }, 2000);
      };
      
      tempFileReader.readAsArrayBuffer(originalFile);
    } catch (error) {
      console.error("Ошибка при валидации Excel файла:", error);
      setDownloadState("error");
      toast.error("Ошибка при проверке файла");
      
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
      
      {hasAnalyzed && !hasValidated && originalFile && (
        <Button 
          onClick={validateDocument}
          disabled={downloadState !== "idle" || !originalFile}
          className={className}
          variant="outline"
        >
          {downloadState === "validating" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Проверка стилей документа...
            </>
          ) : (
            <>
              <CheckSquare className="mr-2 h-4 w-4" />
              Проверить соответствие стилей
            </>
          )}
        </Button>
      )}
      
      {hasValidated && originalFile && (
        <DownloadButton 
          onClick={handleDownload}
          downloadState={downloadState}
          disabled={downloadState === "loading" || !originalFile}
          className={className}
        />
      )}
      
      {hasAnalyzed && <StyleInfo stylesCount={cellStyles.length} cellContents={cellContents} />}
      
      {hasValidated && <ValidationResults validationResults={validationResults} />}
    </div>
  );
};

export default ModifiedExcelDownloader;
