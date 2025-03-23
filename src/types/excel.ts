
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
}

export interface ExcelDownloaderProps {
  data: any;
  originalFile?: File | null;
  filename?: string;
  className?: string;
  customCellText?: string;
}
