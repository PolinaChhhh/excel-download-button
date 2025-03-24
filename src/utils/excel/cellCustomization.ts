
import ExcelJS from 'exceljs';
import type { CellStyle } from '@/types/excel';

/**
 * Set custom text for a specific cell
 */
export function setCustomCellText(
  worksheet: ExcelJS.Worksheet, 
  cellAddress: string, 
  text: string
): void {
  const cell = worksheet.getCell(cellAddress);
  cell.value = text;
  console.log(`Set custom text in cell ${cellAddress}: "${text}"`);
}

/**
 * Apply Arial font size 9 to a cell
 */
export function applyArialFont(worksheet: ExcelJS.Worksheet, cellAddress: string): void {
  const cell = worksheet.getCell(cellAddress);
  cell.font = {
    name: 'Arial',
    size: 9,
    color: { argb: 'FF000000' }
  };
  console.log(`Applied Arial size 9 font to cell ${cellAddress}`);
}

/**
 * Apply styles from the original style list to the worksheet
 */
export function applyOriginalStyles(
  worksheet: ExcelJS.Worksheet, 
  cellStyles: CellStyle[], 
  skipCells: string[] = []
): void {
  cellStyles.forEach(cellStyle => {
    const cellAddress = cellStyle.address;
    
    // Skip cells that are explicitly styled elsewhere
    if (skipCells.includes(cellAddress)) {
      return;
    }
    
    const cell = worksheet.getCell(cellAddress);
    
    // Apply borders if needed
    if (cellStyle.borders) {
      if (!cell.border) {
        cell.border = {};
      }
      
      if (cellStyle.borders.top) {
        cell.border.top = { style: 'thin', color: { argb: 'FF000000' } };
      }
      
      if (cellStyle.borders.right) {
        cell.border.right = { style: 'thin', color: { argb: 'FF000000' } };
      }
      
      if (cellStyle.borders.bottom) {
        cell.border.bottom = { style: 'thin', color: { argb: 'FF000000' } };
      }
      
      if (cellStyle.borders.left) {
        cell.border.left = { style: 'thin', color: { argb: 'FF000000' } };
      }
    }
    
    // Apply font if needed
    if (cellStyle.font) {
      cell.font = {
        ...cell.font,
        name: cellStyle.font.name || cell.font?.name,
        size: cellStyle.font.size || cell.font?.size,
        bold: cellStyle.font.bold !== undefined ? cellStyle.font.bold : cell.font?.bold,
        italic: cellStyle.font.italic !== undefined ? cellStyle.font.italic : cell.font?.italic,
        underline: cellStyle.font.underline !== undefined ? cellStyle.font.underline : cell.font?.underline,
        color: cellStyle.font.color ? { argb: cellStyle.font.color } : cell.font?.color
      };
    }
    
    // Apply fill if needed
    if (cellStyle.fill) {
      cell.fill = cellStyle.fill;
    }
  });
}
