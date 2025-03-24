
import type { CellStyle, ValidationSummary, CellValidationResult, MergedCellInfo } from '@/types/excel';
import ExcelJS from 'exceljs';

export interface ExcelAnalysisResult {
  cellStyles: CellStyle[];
  workbook: ExcelJS.Workbook;
  worksheet: ExcelJS.Worksheet;
  cellContents: Record<string, any>;
  mergedCells: MergedCellInfo[];
}

// We're no longer exporting SpecialCellConfig here since it's now in helpers.ts
