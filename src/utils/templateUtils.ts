
import * as XLSX from 'xlsx';

export interface RowSetting {
  row: number;
  height: number;
}

export interface ColumnSetting {
  column: string;
  width: number;
}

export interface CellSetting {
  cell: string;
  value: string;
  style?: {
    font?: {
      name?: string;
      size?: number;
      bold?: boolean;
      italic?: boolean;
    };
    alignment?: {
      horizontal?: 'left' | 'center' | 'right';
      vertical?: 'top' | 'middle' | 'bottom';
    };
    border?: {
      top?: { style: string };
      right?: { style: string };
      bottom?: { style: string };
      left?: { style: string };
    };
  };
}

export interface TemplateStructure {
  sheetName: string;
  rowSettings: RowSetting[];
  columnSettings: ColumnSetting[];
  merges: string[];
  cells: CellSetting[];
}

// Default template structure based on provided JSON
export const defaultTemplateStructure: TemplateStructure = {
  sheetName: "Sheet1",
  rowSettings: [
    { row: 1, height: 5.75 },
    { row: 2, height: 10.5 },
    { row: 3, height: 11 },
    { row: 4, height: 11.75 },
    { row: 5, height: 5.75 },
    { row: 6, height: 15 }
  ],
  columnSettings: [
    { column: "A", width: 1.29 },
    { column: "B", width: 0.58 },
    { column: "C", width: 0.50 },
    { column: "D", width: 1.29 },
    { column: "E", width: 1.29 },
    { column: "F", width: 0.58 },
    { column: "G", width: 1.29 },
    { column: "H", width: 0.50 },
    { column: "I", width: 0.58 },
    { column: "J", width: 2.43 },
    { column: "K", width: 0.58 },
    { column: "L", width: 1.29 },
    { column: "M", width: 1.29 },
    { column: "N", width: 2.43 },
    { column: "O", width: 12.43 },
    { column: "P", width: 0.58 },
    { column: "Q", width: 0.58 },
    { column: "R", width: 0.58 },
    { column: "S", width: 0.58 },
    { column: "T", width: 1.29 },
    { column: "U", width: 0.50 },
    { column: "V", width: 0.58 },
    { column: "W", width: 3.43 },
    { column: "X", width: 2.14 },
    { column: "Y", width: 4.29 },
    { column: "Z", width: 0.58 },
    { column: "AA", width: 0.75 },
    { column: "AB", width: 0.42 },
    { column: "AC", width: 2.29 },
    { column: "AD", width: 3.43 },
    { column: "AE", width: 0.58 },
    { column: "AF", width: 0.58 },
    { column: "AG", width: 0.50 },
    { column: "AH", width: 2.43 },
    { column: "AI", width: 1.29 },
    { column: "AJ", width: 0.58 },
    { column: "AK", width: 0.58 },
    { column: "AL", width: 0.50 },
    { column: "AM", width: 2.43 },
    { column: "AN", width: 0.58 },
    { column: "AO", width: 1.29 },
    { column: "AP", width: 1.29 },
    { column: "AQ", width: 0.58 },
    { column: "AR", width: 0.58 },
    { column: "AS", width: 0.58 },
    { column: "AT", width: 0.58 },
    { column: "AU", width: 0.58 },
    { column: "AV", width: 0.58 },
    { column: "AW", width: 0.58 },
    { column: "AX", width: 1.29 },
    { column: "AY", width: 0.58 },
    { column: "AZ", width: 0.58 },
    { column: "BA", width: 1.29 },
    { column: "BB", width: 1.29 },
    { column: "BC", width: 1.29 },
    { column: "BD", width: 0.58 },
    { column: "BE", width: 1.29 },
    { column: "BF", width: 0.58 },
    { column: "BG", width: 0.58 },
    { column: "BH", width: 1.29 },
    { column: "BI", width: 0.58 },
    { column: "BJ", width: 0.58 },
    { column: "BK", width: 4.43 },
    { column: "BL", width: 2.29 },
    { column: "BM", width: 1.29 },
    { column: "BN", width: 1.29 },
    { column: "BO", width: 6.43 },
    { column: "BP", width: 7.43 },
    { column: "BQ", width: 0.58 },
    { column: "BR", width: 0.17 },
    { column: "BS", width: 1.29 }
  ],
  merges: [
    "A4:BE6",
    "BF4:BL4",
    "BM4:BS4",
    "BM5:BS7",
    "BJ6:BL6"
  ],
  cells: [
    {
      cell: "A4",
      value: "<Текст, указанный пользователем>",
      style: {
        alignment: {
          horizontal: "left",
          vertical: "middle"
        }
      }
    },
    {
      cell: "BF4",
      value: "Форма по ОКУД",
      style: {
        font: { name: "Arial", size: 9 },
        alignment: { horizontal: "center", vertical: "middle" }
      }
    },
    {
      cell: "BM4",
      value: "0330212",
      style: {
        font: { name: "Arial", size: 9 },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        }
      }
    },
    {
      cell: "BM5",
      value: "",
      style: {
        border: {
          top: { style: "thick" },
          left: { style: "thick" },
          bottom: { style: "thick" },
          right: { style: "thick" }
        }
      }
    },
    {
      cell: "BJ6",
      value: "по ОКПО",
      style: {
        font: { name: "Arial", size: 9 },
        alignment: { horizontal: "center", vertical: "middle" }
      }
    }
  ]
};

export const generateTemplateExcel = (
  templateStructure: TemplateStructure = defaultTemplateStructure,
  customText: string = "Пример текста пользователя"
): Blob => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create a new worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
  
  // Set the sheet name
  XLSX.utils.book_append_sheet(workbook, worksheet, templateStructure.sheetName);
  
  // Set row heights - precise conversion to Excel's internal units
  worksheet['!rows'] = [];
  templateStructure.rowSettings.forEach(rowSetting => {
    worksheet['!rows'][rowSetting.row - 1] = { hpt: rowSetting.height * 4 }; // Convert to points
  });
  
  // Set column widths with explicit pixel values
  worksheet['!cols'] = [];
  templateStructure.columnSettings.forEach(colSetting => {
    const colIndex = XLSX.utils.decode_col(colSetting.column);
    // Use explicit pixel widths (wpx) for better precision
    worksheet['!cols'][colIndex] = { 
      wpx: Math.round(colSetting.width * 10 * 7), // Adjusted multiplier for better precision
      width: colSetting.width, // Store original width for reference
      hidden: false // Mark column as visible
    };
  });
  
  // Log column widths for verification
  console.log("Template column widths:", worksheet['!cols']);
  
  // Set merged cells
  worksheet['!merges'] = templateStructure.merges.map(merge => {
    const [start, end] = merge.split(':');
    return {
      s: XLSX.utils.decode_cell(start),
      e: XLSX.utils.decode_cell(end)
    };
  });
  
  // Add cells with values and styles
  templateStructure.cells.forEach(cellSetting => {
    const cellAddress = cellSetting.cell;
    let cellValue = cellSetting.value;
    
    // Replace placeholder with custom text if it's the A4 cell
    if (cellAddress === 'A4' && cellValue.includes('<Текст, указанный пользователем>')) {
      cellValue = cellValue.replace('<Текст, указанный пользователем>', customText);
    }
    
    // Create the cell
    const cell: XLSX.CellObject = {
      t: 's', // 's' for string
      v: cellValue,
      s: {} // Style object
    };
    
    // Apply styles if defined
    if (cellSetting.style) {
      // Font settings
      if (cellSetting.style.font) {
        cell.s.font = {
          name: cellSetting.style.font.name || "Arial",
          sz: cellSetting.style.font.size || 11, // Convert from points to the format XLSX expects
          bold: cellSetting.style.font.bold || false,
          italic: cellSetting.style.font.italic || false,
          color: { rgb: "000000" } // Default to black
        };
      }
      
      // Alignment
      if (cellSetting.style.alignment) {
        cell.s.alignment = {
          horizontal: cellSetting.style.alignment.horizontal || "general",
          vertical: cellSetting.style.alignment.vertical || "bottom",
          wrapText: true // Enable text wrapping
        };
      }
      
      // Borders - special handling to ensure proper styles
      if (cellSetting.style.border) {
        cell.s.border = {};
        
        const mapBorderStyle = (style: string) => {
          // Map border style to XLSX border style
          switch(style) {
            case "thin": return "thin";
            case "medium": return "medium";
            case "thick": return "thick";
            case "double": return "double";
            default: return "thin";
          }
        };
        
        if (cellSetting.style.border.top) {
          cell.s.border.top = {
            style: mapBorderStyle(cellSetting.style.border.top.style),
            color: { rgb: "000000" }
          };
        }
        
        if (cellSetting.style.border.right) {
          cell.s.border.right = {
            style: mapBorderStyle(cellSetting.style.border.right.style),
            color: { rgb: "000000" }
          };
        }
        
        if (cellSetting.style.border.bottom) {
          cell.s.border.bottom = {
            style: mapBorderStyle(cellSetting.style.border.bottom.style),
            color: { rgb: "000000" }
          };
        }
        
        if (cellSetting.style.border.left) {
          cell.s.border.left = {
            style: mapBorderStyle(cellSetting.style.border.left.style),
            color: { rgb: "000000" }
          };
        }
      }
    }
    
    // Add cell to worksheet
    worksheet[cellAddress] = cell;
  });
  
  // Define column visibility and worksheet range
  const lastCol = XLSX.utils.decode_col("BS");
  const range = {
    s: { r: 0, c: 0 },
    e: { r: 10, c: lastCol }
  };
  worksheet['!ref'] = XLSX.utils.encode_range(range);
  
  // Add wsDimension property for better Excel compatibility
  worksheet['!dimensions'] = worksheet['!ref'];
  
  // Write to binary string with maximum style and format preservation
  const wbout = XLSX.write(workbook, { 
    bookType: 'xlsx',
    type: 'binary',
    cellStyles: true,
    bookSST: false,
    compression: true,
    Props: {}
  });
  
  // Convert binary string to ArrayBuffer
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xFF;
  }
  
  // Create Blob
  return new Blob([buf], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
};
