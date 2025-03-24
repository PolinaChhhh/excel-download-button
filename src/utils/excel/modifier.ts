
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
        
        // Download the modified workbook
        await downloadWorkbook(workbook, filename);
        resolve();
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
