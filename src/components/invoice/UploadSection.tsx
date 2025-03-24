
import React from 'react';
import ExcelUploader from "@/components/ExcelUploader";
import ModifiedExcelDownloader from "@/components/ModifiedExcelDownloader";
import TemplateDownloader from "@/components/excel/TemplateDownloader";
import type { InvoiceData } from "@/components/InvoiceTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UploadSectionProps {
  onFileUploaded: (data: Partial<InvoiceData>, file: File) => void;
  invoiceData: InvoiceData;
  originalFile: File | null;
  isDataLoaded: boolean;
  customCellText: string;
  onCustomCellTextChange: (text: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onFileUploaded,
  invoiceData,
  originalFile,
  isDataLoaded,
  customCellText,
  onCustomCellTextChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4">Загрузка данных</h2>
      
      <div className="mb-4">
        <Label htmlFor="cell-text" className="mb-2 block">
          Текст для ячейки AD18:
        </Label>
        <Input
          id="cell-text"
          type="text"
          value={customCellText}
          onChange={(e) => onCustomCellTextChange(e.target.value)}
          placeholder="Введите текст для ячейки AD18"
          className="w-full"
        />
      </div>

      <ExcelUploader onFileUploaded={onFileUploaded} />
      
      {isDataLoaded && (
        <div className="mt-3">
          <p className="text-sm text-green-600 mb-1">
            ✓ Данные загружены и ячейка AD18 будет заполнена значением "{customCellText}".
          </p>
          <p className="text-sm text-gray-600 mb-3">
            Все шрифты (Arial, 9pt), границы и стили оформления будут сохранены.
          </p>
          <ModifiedExcelDownloader 
            data={invoiceData} 
            originalFile={originalFile}
            filename="modified-document.xlsx"
            customCellText={customCellText}
          />
        </div>
      )}
      
      <Separator className="my-4" />
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-3">Шаблон формы ТОРГ-12</h3>
        <TemplateDownloader className="w-full" />
        <p className="text-xs text-gray-600 mt-2">
          Шаблон создается с правильными шрифтами (Arial, 9pt) и границами ячеек.
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
