
import React, { useState } from "react";
import InvoiceTable from "@/components/InvoiceTable";
import ExcelUploader from "@/components/ExcelUploader";
import InvoiceTemplateExporter from "@/components/InvoiceTemplateExporter";
import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import { toast } from "sonner";

// Default empty invoice data
const emptyInvoiceData = {
  form: "ТОРГ-12",
  code: "0330212",
  okud: "0330212",
  okpo: "",
  items: []
};

const Index = () => {
  const [invoiceData, setInvoiceData] = useState(emptyInvoiceData);
  const [isEditable, setIsEditable] = useState(true);

  const handleFileUploaded = (data: any) => {
    setInvoiceData({
      ...emptyInvoiceData,
      ...data
    });
  };

  const handlePrint = () => {
    setIsEditable(false); // Switch to view mode for printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleSave = () => {
    toast.success("Форма сохранена!");
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header with buttons - hidden when printing */}
      <div className="container mx-auto py-6 print:hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Товарная накладная (ТОРГ-12)</h1>
          <p className="text-gray-600">
            Заполните форму вручную или загрузите данные из Excel файла
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-4">Загрузка данных</h2>
            <ExcelUploader onFileUploaded={handleFileUploaded} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-4">Скачать шаблоны</h2>
            <InvoiceTemplateExporter />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Форма ТОРГ-12</h2>
              <p className="text-sm text-gray-500">Редактируйте данные напрямую в форме</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                <span>Печать</span>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span>Сохранить</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="container mx-auto mb-10 print:m-0 print:p-0">
        <div className="bg-white shadow-sm rounded-lg overflow-auto print:shadow-none print:rounded-none">
          <InvoiceTable 
            data={invoiceData} 
            onDataChange={setInvoiceData} 
            editable={isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
