
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
 * Improved to ensure font is applied correctly
 */
export function applyArialFont(worksheet: ExcelJS.Worksheet, cellAddress: string): void {
  const cell = worksheet.getCell(cellAddress);
  
  // Make sure to apply the font consistently
  cell.font = {
    name: 'Arial',
    size: 9,
    color: { argb: 'FF000000' },
    bold: false,
    italic: false
  };
  
  // Check if this cell is part of a merged range
  // @ts-ignore - ExcelJS internal structure
  const merges = worksheet.mergeCells?._merges || {};
  
  let isMergedCell = false;
  let mergeAddress = '';
  
  // Check all merged cell ranges to see if this cell is part of one
  Object.keys(merges).forEach(key => {
    const range = key.split(':');
    const start = worksheet.getCell(range[0]);
    const end = worksheet.getCell(range[1]);
    
    // Check if the current cell is within this merged range
    const cellRef = worksheet.getCell(cellAddress);
    if (cellRef.row >= start.row && cellRef.row <= end.row &&
        cellRef.col >= start.col && cellRef.col <= end.col) {
      isMergedCell = true;
      mergeAddress = key;
    }
  });
  
  // If this is a merged cell, we need to ensure the font is applied to all cells in the range
  if (isMergedCell && mergeAddress) {
    console.log(`Cell ${cellAddress} is part of merged range ${mergeAddress}, applying font to all cells in range`);
    const [startCell, endCell] = mergeAddress.split(':');
    const start = worksheet.getCell(startCell);
    const end = worksheet.getCell(endCell);
    
    // Apply font to all cells in the merged range
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.col; col <= end.col; col++) {
        const rangeCell = worksheet.getCell(row, col);
        rangeCell.font = {
          name: 'Arial',
          size: 9,
          color: { argb: 'FF000000' },
          bold: false,
          italic: false
        };
      }
    }
  }
  
  console.log(`Applied Arial size 9 font to cell ${cellAddress} with full font object:`, cell.font);
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
