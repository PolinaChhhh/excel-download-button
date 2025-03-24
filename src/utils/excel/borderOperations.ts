
import ExcelJS from 'exceljs';

/**
 * Apply thick borders to a specified range of cells
 */
export function applyThickBordersToRange(
  worksheet: ExcelJS.Worksheet, 
  startCell: string, 
  endCell: string
): void {
  // Get start and end cell references
  const startRef = worksheet.getCell(startCell);
  const endRef = worksheet.getCell(endCell);
  
  // Check if the range is already merged
  const mergeRanges: string[] = [];
  // @ts-ignore - ExcelJS internal structure
  if (worksheet.mergeCells && worksheet.mergeCells._merges) {
    // @ts-ignore - ExcelJS internal structure
    mergeRanges.push(...Object.keys(worksheet.mergeCells._merges));
  }
  const isMerged = mergeRanges.includes(`${startCell}:${endCell}`);
  
  if (!isMerged) {
    // Merge the range if not already merged
    worksheet.mergeCells(`${startCell}:${endCell}`);
  }
  
  // Apply borders to all cells in the merged range
  for (let row = Number(startRef.row); row <= Number(endRef.row); row++) {
    for (let col = Number(startRef.col); col <= Number(endRef.col); col++) {
      const cell = worksheet.getCell(row, col);
      
      // Set border styles based on position in the range
      cell.border = {
        top: { style: 'thick', color: { argb: 'FF000000' } },
        bottom: { style: 'thick', color: { argb: 'FF000000' } }
      };
      
      // Left border only for leftmost cells
      if (col === Number(startRef.col)) {
        cell.border.left = { style: 'thick', color: { argb: 'FF000000' } };
      }
      
      // Right border only for rightmost cells
      if (col === Number(endRef.col)) {
        cell.border.right = { style: 'thick', color: { argb: 'FF000000' } };
      }
    }
  }
  
  console.log(`Applied borders to range ${startCell}:${endCell}`);
}

/**
 * Apply a medium bottom border to a cell
 */
export function applyBottomBorder(worksheet: ExcelJS.Worksheet, cellAddress: string): void {
  const cell = worksheet.getCell(cellAddress);
  if (!cell.border) {
    cell.border = {};
  }
  cell.border.bottom = { style: 'medium', color: { argb: 'FF000000' } };
  console.log(`Applied bottom border to cell ${cellAddress}`);
}
