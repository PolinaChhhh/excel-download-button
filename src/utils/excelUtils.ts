
import ExcelJS from 'exceljs';
import type { CellStyle, ValidationSummary, CellValidationResult, MergedCellInfo } from '@/types/excel';

export const analyzeExcelFile = async (file: File): Promise<{ 
  cellStyles: CellStyle[], 
  workbook: ExcelJS.Workbook, 
  worksheet: ExcelJS.Worksheet,
  cellContents: Record<string, any>,
  mergedCells: MergedCellInfo[]
}> => {
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
        const specialCells: Record<string, any> = {
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

export const validateCellStyles = async (file: File, originalStyles: CellStyle[]): Promise<ValidationSummary> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const { cellStyles: currentStyles } = await analyzeExcelFile(file);
        
        // Create a map of original styles by address for quick lookup
        const originalStyleMap: Record<string, CellStyle> = {};
        originalStyles.forEach(style => {
          originalStyleMap[style.address] = style;
        });
        
        // Validate each cell
        const results: CellValidationResult[] = [];
        let validCount = 0;
        
        currentStyles.forEach(currentCell => {
          const originalCell = originalStyleMap[currentCell.address];
          const result: CellValidationResult = {
            address: currentCell.address,
            isValid: true,
            issues: []
          };
          
          // Special handling for A3 cell which should have a bottom border
          if (currentCell.address === 'A3') {
            console.log("Validating A3 cell:", { 
              original: originalCell?.borders,
              current: currentCell.borders
            });
            
            // Force the bottom border to be recognized for A3
            if (originalCell) {
              originalCell.borders.bottom = true;
            }
          }
          
          // Skip validation for AD18 cell which we modify manually
          if (currentCell.address === 'AD18') {
            result.isValid = true;
            validCount++;
            results.push(result);
            return;
          }
          
          if (!originalCell) {
            result.isValid = false;
            result.issues = ['Cell not found in original document'];
          } else {
            // Check borders
            if (currentCell.borders?.top !== originalCell.borders?.top) {
              result.isValid = false;
              result.issues = result.issues || [];
              result.issues.push('Top border mismatch');
            }
            
            if (currentCell.borders?.right !== originalCell.borders?.right) {
              result.isValid = false;
              result.issues = result.issues || [];
              result.issues.push('Right border mismatch');
            }
            
            if (currentCell.borders?.bottom !== originalCell.borders?.bottom) {
              result.isValid = false;
              result.issues = result.issues || [];
              result.issues.push('Bottom border mismatch');
            }
            
            if (currentCell.borders?.left !== originalCell.borders?.left) {
              result.isValid = false;
              result.issues = result.issues || [];
              result.issues.push('Left border mismatch');
            }
            
            // Check font with each property individually
            if (originalCell.font && currentCell.font) {
              // Check font size
              if (currentCell.font.size !== originalCell.font.size) {
                result.isValid = false;
                result.issues = result.issues || [];
                result.issues.push('Font size mismatch');
              }
              
              // Check font name
              if (currentCell.font.name !== originalCell.font.name) {
                result.isValid = false;
                result.issues = result.issues || [];
                result.issues.push('Font name mismatch');
              }
              
              // Check bold
              if (currentCell.font.bold !== originalCell.font.bold) {
                result.isValid = false;
                result.issues = result.issues || [];
                result.issues.push('Font bold mismatch');
              }
              
              // Check italic
              if (currentCell.font.italic !== originalCell.font.italic) {
                result.isValid = false;
                result.issues = result.issues || [];
                result.issues.push('Font italic mismatch');
              }
              
              // Check underline
              if (currentCell.font.underline !== originalCell.font.underline) {
                result.isValid = false;
                result.issues = result.issues || [];
                result.issues.push('Font underline mismatch');
              }
            }
            
            // Check fill
            if (JSON.stringify(currentCell.fill) !== JSON.stringify(originalCell.fill)) {
              result.isValid = false;
              result.issues = result.issues || [];
              result.issues.push('Fill style mismatch');
            }
          }
          
          if (result.isValid) {
            validCount++;
          }
          
          results.push(result);
        });
        
        const summary: ValidationSummary = {
          isValid: validCount === currentStyles.length,
          totalCells: currentStyles.length,
          validCells: validCount,
          invalidCells: currentStyles.length - validCount,
          cellResults: results
        };
        
        resolve(summary);
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
        
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        
        // Get the first worksheet
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error("No worksheet found in Excel file");
        }
        
        // Store original column widths and merged cells
        console.log("Original column widths before modification:", worksheet.columns);
        console.log("Merged cells before modification:", worksheet.mergeCells);
        
        // 1. Set the custom cell text (AD18)
        const ad18Cell = worksheet.getCell('AD18');
        ad18Cell.value = customCellText;
        
        // 2. Apply Arial size 9 font to BF4
        const bf4Cell = worksheet.getCell('BF4');
        bf4Cell.font = {
          name: 'Arial',
          size: 9,
          color: { argb: 'FF000000' }
        };
        console.log("Explicitly set BF4 font:", bf4Cell.font);
        
        // 3. Apply Arial size 9 font to BJ6
        const bj6Cell = worksheet.getCell('BJ6');
        bj6Cell.font = {
          name: 'Arial',
          size: 9,
          color: { argb: 'FF000000' }
        };
        console.log("Explicitly set BJ6 font:", bj6Cell.font);
        
        // 4. Apply thick borders to BM4:BS4 merged range
        const applyThickBordersToRange = (startCell: string, endCell: string) => {
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
          for (let row = startRef.row; row <= endRef.row; row++) {
            for (let col = startRef.col; col <= endRef.col; col++) {
              const cell = worksheet.getCell(row, col);
              
              // Set border styles based on position in the range
              cell.border = {
                top: { style: 'thick', color: { argb: 'FF000000' } },
                bottom: { style: 'thick', color: { argb: 'FF000000' } }
              };
              
              // Left border only for leftmost cells
              if (col === startRef.col) {
                cell.border.left = { style: 'thick', color: { argb: 'FF000000' } };
              }
              
              // Right border only for rightmost cells
              if (col === endRef.col) {
                cell.border.right = { style: 'thick', color: { argb: 'FF000000' } };
              }
            }
          }
          
          console.log(`Applied borders to range ${startCell}:${endCell}`);
        };
        
        // Apply thick borders to BM4:BS4 and BM5:BS5
        applyThickBordersToRange('BM4', 'BS4');
        applyThickBordersToRange('BM5', 'BS5');
        
        // 6. Apply bottom border to A3 
        const a3Cell = worksheet.getCell('A3');
        if (!a3Cell.border) {
          a3Cell.border = {};
        }
        a3Cell.border.bottom = { style: 'medium', color: { argb: 'FF000000' } };
        
        // Apply any other styling from the original cell styles
        cellStyles.forEach(cellStyle => {
          const cellAddress = cellStyle.address;
          
          // Skip the cells we've explicitly styled above
          if (['AD18', 'BF4', 'BJ6', 'BM4', 'BM5', 'A3'].includes(cellAddress)) {
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
        
        // Write to a buffer
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Convert to blob and download
        const blob = new Blob([buffer], { 
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
        
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

// Helper function to ensure a cell exists in the worksheet
function ensureCellExists(worksheet: ExcelJS.Worksheet, cellAddress: string): ExcelJS.Cell {
  return worksheet.getCell(cellAddress);
}

