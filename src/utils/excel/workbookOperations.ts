
import ExcelJS from 'exceljs';

/**
 * Creates and returns an Excel workbook from a file's array buffer
 */
export async function createWorkbookFromFile(arrayBuffer: ArrayBuffer): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  return workbook;
}

/**
 * Gets the first worksheet or throws an error if none exists
 */
export function getFirstWorksheet(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("No worksheet found in Excel file");
  }
  
  // Log original column widths and merged cells for debugging
  console.log("Original column widths before modification:", worksheet.columns);
  // @ts-ignore - ExcelJS internal structure
  console.log("Merged cells before modification:", worksheet.mergeCells);
  
  return worksheet;
}

/**
 * Generate a download for the modified Excel workbook
 * Enhanced to ensure styles are properly saved
 */
export async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
  // Important: Force calculation mode to ensure all formulas are calculated
  workbook.calcProperties = {
    fullCalcOnLoad: true
  };
  
  // Write to a buffer with proper awaiting
  console.log("Generating Excel buffer...");
  const buffer = await workbook.xlsx.writeBuffer({
    // Add proper compression options to ensure better compatibility
    useStyles: true,
    useSharedStrings: true
  });
  
  console.log("Excel buffer generated, creating download...");
  
  // Convert to blob and download
  const blob = new Blob([buffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  
  // Trigger download
  console.log(`Downloading Excel file as ${filename}...`);
  link.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log("URL object revoked");
  }, 100);
}
