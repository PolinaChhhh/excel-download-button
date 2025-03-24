
import type { CellStyle, ValidationSummary, CellValidationResult, MergedCellInfo } from '@/types/excel';
import ExcelJS from 'exceljs';

export interface ExcelAnalysisResult {
  cellStyles: CellStyle[];
  workbook: ExcelJS.Workbook;
  worksheet: ExcelJS.Worksheet;
  cellContents: Record<string, any>;
  mergedCells: MergedCellInfo[];
}

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
