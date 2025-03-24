
import ExcelJS from 'exceljs';
import type { CellStyle } from '@/types/excel';

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
        // @ts-ignore - ExcelJS internal structure
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
