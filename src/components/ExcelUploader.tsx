
import React, { useState } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ExcelJS from 'exceljs';

interface ExcelUploaderProps {
  onFileUploaded: (data: any, originalFile: File) => void;
  className?: string;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onFileUploaded, className }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Check if it's an Excel file
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast.error('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    try {
      // Read the file data
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Use ExcelJS to parse the file
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);
          
          // Get first worksheet
          const worksheet = workbook.worksheets[0];
          
          if (!worksheet) {
            throw new Error("No worksheet found in the Excel file");
          }
          
          // Convert worksheet to JSON
          const jsonData: any[] = [];
          
          // Read headers from the first row
          const headers: string[] = [];
          worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.value?.toString() || `Column${colNumber}`;
          });
          
          // Read data rows
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
              const rowData: Record<string, any> = {};
              row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                rowData[header] = cell.value;
              });
              jsonData.push(rowData);
            }
          });
          
          // Pass both the data and original file to the parent component
          onFileUploaded({ items: jsonData }, file);
          
          toast.success('Файл успешно загружен, ячейка AD18 будет заполнена значением "ПОПКА"');
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          toast.error('Failed to parse Excel file');
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading file');
        setIsUploading(false);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center",
          isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
          file ? "bg-gray-50" : ""
        )}
      >
        {!file ? (
          <>
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium">Загрузить Excel файл</h3>
            <p className="mt-1 text-sm text-gray-500">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Label
              htmlFor="file-upload"
              className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Выбрать файл
            </Label>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button 
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="mr-2">Загрузка...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Загрузить файл
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelUploader;
