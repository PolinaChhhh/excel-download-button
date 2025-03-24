
import ExcelJS from 'exceljs';
import type { CellStyle, MergedCellInfo } from '@/types/excel';
import type { ExcelAnalysisResult, SpecialCellConfig } from './types';

// Helper function to ensure a cell exists in the worksheet
export function ensureCellExists(worksheet: ExcelJS.Worksheet, cellAddress: string): ExcelJS.Cell {
  return worksheet.getCell(cellAddress);
}

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
              startRow: startCellRef.row,
              startCol: startCellRef.col,
              endRow: endCellRef.row,
              endCol: endCellRef.col
            });
          });
        }
        
        console.log("Merged cells information:", mergedCells);
        
        // Analyze cell styles and contents
        const styleCells: CellStyle[] = [];
        const cellContents: Record<string, any> = {};
        
        // Special cells with specific styling requirements
        const specialCells: Record<string, SpecialCellConfig> = {
          'BF4': { font: { name: 'Arial', size: 9 } },
          'BM4': { 
            border: {
              top: { style: 'thick', color: { argb: "FF000000" } },
              left: { style: 'thick', color: { argb: "FF000000" } },
              bottom: { style: 'thick', color: { argb: "FF000000" } },
              right: { style: 'thick', color: { argb: "FF000000" } }
            }
          },
          'BM5': { 
            border: {
              top: { style: 'thick', color: { argb: "FF000000" } },
              left: { style: 'thick', color: { argb: "FF000000" } },
              bottom: { style: 'thick', color: { argb: "FF000000" } },
              right: { style: 'thick', color: { argb: "FF000000" } }
            }
          },
          'BJ6': { font: { name: 'Arial', size: 9 } },
          'A3': { hasBottomBorder: true }
        };
        
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
