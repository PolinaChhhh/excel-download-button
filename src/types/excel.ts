
export interface CellStyle {
  address: string;
  style: any;
  borders?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
  font?: any;
  fill?: any;
  value?: any; // Cell value
}

export interface ExcelDownloaderProps {
  data: any;
  originalFile?: File | null;
  filename?: string;
  className?: string;
  customCellText?: string;
}

export interface CellValidationResult {
  address: string;
  isValid: boolean;
  issues?: string[];
}

export interface ValidationSummary {
  isValid: boolean;
  totalCells: number;
  validCells: number;
  invalidCells: number;
  cellResults: CellValidationResult[];
}
