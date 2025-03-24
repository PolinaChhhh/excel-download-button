
import ExcelJS from 'exceljs';
import type { MergedCellInfo } from '@/types/excel';

export function extractMergedCells(worksheet: ExcelJS.Worksheet): MergedCellInfo[] {
  const mergedCells: MergedCellInfo[] = [];
  
  // Using direct access to the mergeCells property
  // @ts-ignore - ExcelJS internal structure
  const merges = worksheet.mergeCells;
  
  // Check if there are any merged cells
  if (merges) {
    // Get array of merge cell ranges from worksheet
    const mergeRanges: string[] = [];
    
    // Access the _merges property safely (it might be private but we need it)
    // @ts-ignore - ExcelJS internal structure
    if (worksheet.mergeCells && worksheet.mergeCells._merges) {
      // @ts-ignore - ExcelJS internal structure
      mergeRanges.push(...Object.keys(worksheet.mergeCells._merges));
    }
    
    mergeRanges.forEach(mergeRange => {
      // Split range into start and end cell references
      const [startCell, endCell] = mergeRange.split(':');
      
      // Get cell references
      const startCellRef = worksheet.getCell(startCell);
      const endCellRef = worksheet.getCell(endCell);
      
      mergedCells.push({
        startCell,
        endCell,
        startRow: Number(startCellRef.row),
        startCol: Number(startCellRef.col),
        endRow: Number(endCellRef.row),
        endCol: Number(endCellRef.col)
      });
    });
  }
  
  console.log("Merged cells information:", mergedCells);
  return mergedCells;
}
