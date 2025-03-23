
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ExcelDownloadButton from '@/components/ExcelDownloadButton';

const InvoiceTemplateExporter: React.FC = () => {
  const handleDownloadTemplate = async (): Promise<Blob> => {
    // In a real app, this would generate a proper Excel template
    // For demo purposes, we're creating a simple blob
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return new Blob(
      [JSON.stringify({
        template: "ТОРГ-12",
        version: "1.0",
        instruction: "Please fill in all required fields"
      }, null, 2)], 
      { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      }
    );
  };

  const handleDownloadPDF = () => {
    // In a real app, this would trigger PDF generation
    toast.info("Подготовка PDF файла...");
    
    setTimeout(() => {
      toast.success("PDF файл готов к скачиванию");
      
      // Create a dummy PDF file and trigger download
      const blob = new Blob(["PDF content would go here"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice-form-TORG-12.pdf";
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <ExcelDownloadButton
          filename="invoice-template-TORG-12.xlsx"
          onDownload={handleDownloadTemplate}
          className="flex-1"
        />
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 flex-1"
          onClick={handleDownloadPDF}
        >
          <FileText className="h-4 w-4" />
          <span>Скачать PDF</span>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Скачайте шаблон Excel для заполнения формы ТОРГ-12. После заполнения загрузите файл обратно для автоматического заполнения формы.
      </p>
    </div>
  );
};

export default InvoiceTemplateExporter;
