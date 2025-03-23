
import React, { useState } from "react";
import type { InvoiceData } from "@/components/InvoiceTable";
import Header from "@/components/invoice/Header";
import UploadSection from "@/components/invoice/UploadSection";
import TemplateSection from "@/components/invoice/TemplateSection";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

// Default empty invoice data with required fields
const emptyInvoiceData: InvoiceData = {
  form: "ТОРГ-12",
  code: "0330212",
  okud: "0330212",
  okpo: "",
  items: []
};

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(emptyInvoiceData);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [customCellText, setCustomCellText] = useState("ПОПКА");
  const isMobile = useIsMobile();

  const handleFileUploaded = (data: Partial<InvoiceData>, file: File) => {
    // Store the updated data with the special cell AD18 value
    setInvoiceData({
      ...emptyInvoiceData,
      ...data
    });
    setOriginalFile(file);
    setIsEditable(true);
    setIsDataLoaded(true);
    toast.success(`Данные из Excel успешно загружены! Ячейка AD18 будет заполнена текстом "${customCellText}"`);
  };

  const handlePrint = () => {
    setIsEditable(false); // Switch to view mode for printing
    setTimeout(() => {
      window.print();
      // After printing, switch back to edit mode
      setTimeout(() => setIsEditable(true), 500);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header with buttons - hidden when printing */}
      <div className={`container mx-auto py-6 px-4 sm:px-6 ${isMobile ? 'space-y-4' : 'space-y-6'} print:hidden`}>
        <Header 
          title="Товарная накладная (ТОРГ-12)" 
          description="Заполните форму вручную или загрузите данные из Excel файла"
        />

        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'} mb-6`}>
          <UploadSection 
            onFileUploaded={handleFileUploaded}
            invoiceData={invoiceData}
            originalFile={originalFile}
            isDataLoaded={isDataLoaded}
            customCellText={customCellText}
            onCustomCellTextChange={setCustomCellText}
          />
          
          <TemplateSection />
        </div>

        <InvoiceForm 
          invoiceData={invoiceData}
          onDataChange={setInvoiceData}
          isEditable={isEditable}
          onPrint={handlePrint}
        />
      </div>

      {/* Invoice Table for print view */}
      <div className="container mx-auto mb-10 print:m-0 print:p-0 hidden print:block">
        <div className="bg-white print:shadow-none print:rounded-none">
          <InvoiceForm 
            invoiceData={invoiceData}
            onDataChange={setInvoiceData}
            isEditable={false}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
