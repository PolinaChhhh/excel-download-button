
import ExcelJS from 'exceljs';
import type { ExcelAnalysisResult } from './types';
import { ensureCellExists } from './helpers';
import { extractMergedCells } from './mergedCells';
import { extractCellStyles } from './cellStyles';

// Export the ensureCellExists helper function
export { ensureCellExists };

export const analyzeExcelFile = async (file: File): Promise<ExcelAnalysisResult> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        
        // Get the first worksheet
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error("No worksheet found in Excel file");
        }
        
        // Store column widths for debugging and verification
        console.log("Original column widths from file:", worksheet.columns);
        
        // Get merged cells information
        const mergedCells = extractMergedCells(worksheet);
        
        // Extract cell styles and contents
        const { styleCells, cellContents } = extractCellStyles(worksheet);
        
        resolve({ 
          cellStyles: styleCells, 
          workbook, 
          worksheet, 
          cellContents,
          mergedCells
        });
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      reject(error);
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};
