
import React from 'react';
import ExcelUploader from "@/components/ExcelUploader";
import ModifiedExcelDownloader from "@/components/ModifiedExcelDownloader";
import type { InvoiceData } from "@/components/InvoiceTable";

interface UploadSectionProps {
  onFileUploaded: (data: Partial<InvoiceData>, file: File) => void;
  invoiceData: InvoiceData;
  originalFile: File | null;
  isDataLoaded: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onFileUploaded,
  invoiceData,
  originalFile,
  isDataLoaded
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4">Загрузка данных</h2>
      <ExcelUploader onFileUploaded={onFileUploaded} />
      {isDataLoaded && (
        <div className="mt-3">
          <p className="text-sm text-green-600 mb-3">
            ✓ Данные загружены и ячейка AD18 будет заполнена значением "ПОПКА".
          </p>
          <ModifiedExcelDownloader 
            data={invoiceData} 
            originalFile={originalFile}
            filename="modified-document.xlsx"
          />
        </div>
      )}
    </div>
  );
};

export default UploadSection;
