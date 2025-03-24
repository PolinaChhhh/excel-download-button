
import { useState } from 'react';
import { toast } from 'sonner';
import { analyzeExcelFile, modifyAndDownloadExcel, validateCellStyles } from '@/utils/excel';
import type { CellStyle, ValidationSummary } from '@/types/excel';

export interface ExcelDownloaderState {
  downloadState: "idle" | "loading" | "analyzing" | "validating" | "success" | "error";
  cellStyles: CellStyle[];
  cellContents: Record<string, any>;
  mergedCells: any[];
  hasAnalyzed: boolean;
  hasValidated: boolean;
  validationResults: ValidationSummary | null;
}

export function useExcelDownloader(filename = "modified-document.xlsx") {
  const [state, setState] = useState<ExcelDownloaderState>({
    downloadState: "idle",
    cellStyles: [],
    cellContents: {},
    mergedCells: [],
    hasAnalyzed: false,
    hasValidated: false,
    validationResults: null
  });

  const analyzeDocument = async (originalFile: File) => {
    if (!originalFile) return;
    
    setState(prev => ({ ...prev, downloadState: "analyzing" }));
    toast.info("Анализ стилей документа...");
    
    try {
      const { cellStyles, cellContents, mergedCells } = await analyzeExcelFile(originalFile);
      
      setState(prev => ({
        ...prev,
        cellStyles,
        cellContents,
        mergedCells,
        hasAnalyzed: true,
        downloadState: "idle"
      }));
      
      // Log cells with borders
      const cellsWithBorders = cellStyles.filter(cell => 
        cell.borders?.top || cell.borders?.right || 
        cell.borders?.bottom || cell.borders?.left
      );
      
      console.log("Ячейки с границами:", cellsWithBorders.map((c: CellStyle) => c.address));
      
      // Log merged cells information
      if (mergedCells && mergedCells.length > 0) {
        console.log("Найдены объединенные ячейки:", mergedCells.length);
        mergedCells.forEach((merge, index) => {
          console.log(`Объединение #${index + 1}: ${merge.startCell}:${merge.endCell}`);
        });
      }
      
      // Check cell A3 specifically
      const a3Cell = cellStyles.find((cell: CellStyle) => cell.address === 'A3');
      if (a3Cell) {
        console.log("Стиль ячейки A3:", a3Cell);
      } else {
        console.log("Ячейка A3 не имеет специальных стилей");
      }
      
      toast.success("Анализ документа завершен. Найдено " + cellStyles.length + " ячеек со стилями.");
      
    } catch (error) {
      console.error("Ошибка при анализе Excel файла:", error);
      setState(prev => ({ ...prev, downloadState: "error" }));
      toast.error("Ошибка при анализе файла");
      
      setTimeout(() => {
        setState(prev => ({ ...prev, downloadState: "idle" }));
      }, 2000);
    }
  };

  const validateDocument = async (originalFile: File) => {
    if (!originalFile) return;
    
    setState(prev => ({ ...prev, downloadState: "validating" }));
    toast.info("Проверка стилей документа...");
    
    try {
      // Validate the modified document
      const results = await validateCellStyles(originalFile, state.cellStyles);
      
      setState(prev => ({
        ...prev,
        validationResults: results,
        hasValidated: true,
        downloadState: "idle"
      }));
      
      if (results.isValid) {
        toast.success("Проверка документа завершена успешно. Все стили соответствуют ожиданиям.");
      } else {
        toast.warning(`Обнаружены различия в ${results.invalidCells} ячейках из ${results.totalCells}.`);
      }
    } catch (error) {
      console.error("Ошибка при валидации Excel файла:", error);
      setState(prev => ({ ...prev, downloadState: "error" }));
      toast.error("Ошибка при проверке файла");
      
      setTimeout(() => {
        setState(prev => ({ ...prev, downloadState: "idle" }));
      }, 2000);
    }
  };

  const handleDownload = async (originalFile: File, customCellText: string) => {
    if (state.downloadState === "loading" || !originalFile) return;
    
    setState(prev => ({ ...prev, downloadState: "loading" }));
    toast.info("Подготовка документа с изменениями...");
    
    try {
      await modifyAndDownloadExcel(
        originalFile,
        state.cellStyles,
        filename,
        customCellText
      );
      
      setState(prev => ({ ...prev, downloadState: "success" }));
      toast.success(`Документ успешно скачан с сохранением всех стилей, границ и объединений ячеек. Ячейка AD18: "${customCellText}"`);
      
      setTimeout(() => {
        setState(prev => ({ ...prev, downloadState: "idle" }));
      }, 2000);
      
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      setState(prev => ({ ...prev, downloadState: "error" }));
      toast.error("Ошибка при скачивании файла");
      
      setTimeout(() => {
        setState(prev => ({ ...prev, downloadState: "idle" }));
      }, 2000);
    }
  };

  return {
    state,
    analyzeDocument,
    validateDocument,
    handleDownload
  };
}
