import * as XLSX from 'xlsx';

export const analyzeExcelFile = async (file: File): Promise<{ 
  cellStyles: any[], 
  workbook: any, 
  worksheet: any 
}> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Convert to binary string for better compatibility
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i < data.length; i++) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join("");
        
        // Parse Excel file with maximum formatting preservation
        const workbook = XLSX.read(bstr, { 
          type: 'binary',
          cellStyles: true,
          cellDates: true,
          cellNF: true,
          cellFormula: true,
          bookVBA: true,
          WTF: true
        });
        
        // Get the first worksheet
        const wsName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[wsName];
        
        // Analyze cell styles
        const styleCells: any[] = [];
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z100');
        
        for (let r = range.s.r; r <= range.e.r; r++) {
          for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = XLSX.utils.encode_cell({r: r, c: c});
            const cell = worksheet[cellAddress];
            
            if (cell && cell.s) {
              const borders = {
                top: cell.s.border?.top?.style !== undefined,
                right: cell.s.border?.right?.style !== undefined,
                bottom: cell.s.border?.bottom?.style !== undefined,
                left: cell.s.border?.left?.style !== undefined
              };
              
              styleCells.push({
                address: cellAddress,
                style: cell.s,
                borders: borders,
                font: cell.s.font,
                fill: cell.s.fill
              });
            }
          }
        }
        
        resolve({ cellStyles: styleCells, workbook, worksheet });
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
  cellStyles: any[],
  filename: string,
  customCellText: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Convert to binary string for better compatibility
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i < data.length; i++) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join("");
        
        // Parse the Excel file with maximum formatting preservation
        const workbook = XLSX.read(bstr, { 
          type: 'binary',
          cellStyles: true,
          cellDates: true,
          cellNF: true,
          cellFormula: true,
          bookVBA: true,
          WTF: true
        });
        
        // Get the first worksheet
        const wsName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[wsName];
        
        // Apply special styles
        cellStyles.forEach(cellStyle => {
          const cell = worksheet[cellStyle.address];
          if (cell) {
            // Keep all styles
            cell.s = cellStyle.style;
          }
        });
        
        // Special attention to cell A3
        if (worksheet['A3']) {
          console.log("Checking cell A3 before saving:", worksheet['A3']);
          // Ensure the bottom border is preserved
          if (worksheet['A3'].s && !worksheet['A3'].s.border) {
            worksheet['A3'].s.border = {
              bottom: { style: 'thin', color: { rgb: "000000" } }
            };
          }
        }
        
        // Get all properties of cell AD18
        const cellAddress = "AD18";
        const originalCell = worksheet[cellAddress] || {};
        
        // Keep all original properties and metadata
        const cellStyle = originalCell.s || {};
        
        // Create a complete cell object preserving all properties
        worksheet[cellAddress] = {
          ...originalCell,
          v: customCellText,
          w: customCellText,
          t: 's',
          s: cellStyle,
        };
        
        // Write the modified workbook to buffer with full format preservation
        const wbout = XLSX.write(workbook, { 
          bookType: 'xlsx', 
          type: 'binary',
          cellStyles: true,
          compression: true
        });
        
        // Convert binary string to byte array
        const s2ab = (s: string) => {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
          }
          return buf;
        };
        
        // Create blob from buffer
        const blob = new Blob([s2ab(wbout)], { 
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        
        // Clean up resources
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
