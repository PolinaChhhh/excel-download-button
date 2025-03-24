
import ExcelJS from 'exceljs';
import type { CellStyle } from '@/types/excel';
import { specialCells } from './helpers';

export function extractCellStyles(worksheet: ExcelJS.Worksheet): { 
  styleCells: CellStyle[], 
  cellContents: Record<string, any> 
} {
  // Analyze cell styles and contents
  const styleCells: CellStyle[] = [];
  const cellContents: Record<string, any> = {};
  
  // Process all cells in the worksheet
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      const cellAddress = cell.address;
      
      // Store cell content
      cellContents[cellAddress] = {
        value: cell.value,
        type: cell.type,
        formula: cell.formula,
        formattedValue: cell.text
      };
      
      // Handle cell style
      let cellStyle: CellStyle = {
        address: cellAddress,
        style: {},
        borders: {
          top: false,
          right: false,
          bottom: false,
          left: false
        },
        value: cell.value
      };
      
      // Extract border information
      if (cell.border) {
        cellStyle.borders = {
          top: !!cell.border.top,
          right: !!cell.border.right,
          bottom: !!cell.border.bottom,
          left: !!cell.border.left
        };
      }
      
      // Store font and fill information
      if (cell.font) {
        cellStyle.font = {
          name: cell.font.name,
          size: cell.font.size,
          bold: cell.font.bold,
          italic: cell.font.italic,
          underline: cell.font.underline,
          color: cell.font.color ? cell.font.color.argb : undefined
        };
        
        // Log font details for debugging
        console.log(`Cell ${cellAddress} font:`, JSON.stringify(cellStyle.font));
      }
      
      if (cell.fill) {
        cellStyle.fill = cell.fill;
      }
      
      // Apply special styling for known cells
      if (specialCells[cellAddress]) {
        const specialCell = specialCells[cellAddress];
        
        // Apply font settings
        if (specialCell.font) {
          cellStyle.font = { ...cellStyle.font, ...specialCell.font };
        }
        
        // Apply bottom border if specified
        if (specialCell.hasBottomBorder) {
          cellStyle.borders.bottom = true;
        }
        
        // Apply thick borders if specified
        if (specialCell.border) {
          // Apply each border side
          if (specialCell.border.top) {
            cellStyle.borders.top = true;
          }
          
          if (specialCell.border.right) {
            cellStyle.borders.right = true;
          }
          
          if (specialCell.border.bottom) {
            cellStyle.borders.bottom = true;
          }
          
          if (specialCell.border.left) {
            cellStyle.borders.left = true;
          }
        }
      }
      
      styleCells.push(cellStyle);
    });
  });
  
  // Debug output for special cells
  for (const cellAddr of Object.keys(specialCells)) {
    const cell = styleCells.find(cell => cell.address === cellAddr);
    console.log(`Enhanced ${cellAddr} cell style:`, cell);
  }
  
  // Log some cells with font styles for debugging
  const cellsWithFonts = styleCells.filter(cell => cell.font);
  console.log(`Found ${cellsWithFonts.length} cells with font styles`);
  if (cellsWithFonts.length > 0) {
    console.log("Sample cell with font:", cellsWithFonts[0]);
  }
  
  return { styleCells, cellContents };
}
