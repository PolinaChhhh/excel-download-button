
import ExcelJS from 'exceljs';

// Helper function to ensure a cell exists in the worksheet
export function ensureCellExists(worksheet: ExcelJS.Worksheet, cellAddress: string): ExcelJS.Cell {
  return worksheet.getCell(cellAddress);
}

// Special cells with specific styling requirements
export const specialCells: Record<string, SpecialCellConfig> = {
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

export interface SpecialCellConfig {
  font?: {
    name?: string;
    size?: number;
  };
  border?: {
    top?: { style: string; color: { argb: string } };
    left?: { style: string; color: { argb: string } };
    bottom?: { style: string; color: { argb: string } };
    right?: { style: string; color: { argb: string } };
  };
  hasBottomBorder?: boolean;
}
