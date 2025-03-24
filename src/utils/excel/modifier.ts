
import ExcelJS from 'exceljs';
import type { CellStyle } from '@/types/excel';
import { applyThickBordersToRange, applyBottomBorder } from './borderOperations';
import { setCustomCellText, applyArialFont, applyOriginalStyles } from './cellCustomization';
import { createWorkbookFromFile, getFirstWorksheet, downloadWorkbook } from './workbookOperations';

export const modifyAndDownloadExcel = async (
  file: File,
  cellStyles: CellStyle[],
  filename: string,
  customCellText: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Create a new workbook and get first worksheet
        const workbook = await createWorkbookFromFile(arrayBuffer);
        const worksheet = getFirstWorksheet(workbook);
        
        console.log("Starting Excel modifications...");
        
        // Apply modifications in order of operations for best results
        
        // 1. Set the custom cell text (AD18)
        setCustomCellText(worksheet, 'AD18', customCellText);
        
        // 2. Apply Arial size 9 font to BF4
        applyArialFont(worksheet, 'BF4');
        
        // 3. Apply Arial size 9 font to BJ6
        applyArialFont(worksheet, 'BJ6');
        
        // 4. Apply thick borders to ranges
        applyThickBordersToRange(worksheet, 'BM4', 'BS4');
        applyThickBordersToRange(worksheet, 'BM5', 'BS5');
        
        // 5. Apply bottom border to A3
        applyBottomBorder(worksheet, 'A3');
        
        // 6. Apply remaining styles from the original cell styles
        applyOriginalStyles(
          worksheet, 
          cellStyles, 
          ['AD18', 'BF4', 'BJ6', 'BM4', 'BM5', 'A3']
        );
        
        // 7. Validate critical cells to ensure styles were applied
        const criticalCells = ['BF4', 'BJ6', 'BM4'];
        criticalCells.forEach(cellAddr => {
          const cell = worksheet.getCell(cellAddr);
          console.log(`Final state of cell ${cellAddr}:`, {
            value: cell.value,
            font: cell.font,
            border: cell.border
          });
        });
        
        console.log("Excel modifications complete, preparing download...");
        
        // Download the modified workbook
        await downloadWorkbook(workbook, filename);
        console.log("Download completed");
        
        resolve();
      } catch (error) {
        console.error("Error modifying Excel file:", error);
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      console.error("File reading error:", error);
      reject(error);
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};
