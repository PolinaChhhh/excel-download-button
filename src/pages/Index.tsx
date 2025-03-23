import React, { useState } from "react";
import InvoiceTable from "@/components/InvoiceTable";
import ExcelUploader from "@/components/ExcelUploader";
import InvoiceTemplateExporter from "@/components/InvoiceTemplateExporter";
import ModifiedExcelDownloader from "@/components/ModifiedExcelDownloader";
import { Button } from "@/components/ui/button";
import { Printer, Save, Plus, Trash, Download } from "lucide-react";
import { toast } from "sonner";

// Import the InvoiceData type from the InvoiceTable component
import type { InvoiceData } from "@/components/InvoiceTable";

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
  const [isEditable, setIsEditable] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleFileUploaded = (data: Partial<InvoiceData>) => {
    // Store the updated data with the special cell AD18 value
    setInvoiceData({
      ...emptyInvoiceData,
      ...data
    });
    setIsEditable(true);
    setIsDataLoaded(true);
    toast.success("Данные из Excel успешно загружены! Ячейка AD18 заполнена значением \"ПОПКА\"");
  };

  const handlePrint = () => {
    setIsEditable(false); // Switch to view mode for printing
    setTimeout(() => {
      window.print();
      // After printing, switch back to edit mode
      setTimeout(() => setIsEditable(true), 500);
    }, 300);
  };

  const handleSave = () => {
    toast.success("Форма сохранена!");
  };

  const addNewItem = () => {
    const newItems = [...(invoiceData.items || [])];
    const newId = newItems.length > 0 ? Math.max(...newItems.map(item => item.id)) + 1 : 1;
    
    newItems.push({
      id: newId,
      name: "",
      code: "",
      unit: "",
      unitCode: "",
      packageType: "",
      quantityInPackage: "",
      numberOfPackages: "",
      weight: "",
      totalWeight: "",
      price: "",
      sumWithoutVAT: "",
      vatRate: "",
      vatAmount: "",
      totalSum: ""
    });
    
    setInvoiceData({
      ...invoiceData,
      items: newItems
    });
    
    toast.success("Добавлена новая строка");
  };

  const removeLastItem = () => {
    if (invoiceData.items && invoiceData.items.length > 1) {
      const newItems = [...invoiceData.items];
      newItems.pop();
      
      setInvoiceData({
        ...invoiceData,
        items: newItems
      });
      
      toast.success("Последняя строка удалена");
    } else {
      toast.error("Должна остаться хотя бы одна строка");
    }
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
            {isDataLoaded && (
              <div className="mt-3">
                <p className="text-sm text-green-600 mb-3">
                  ✓ Данные загружены и ячейка AD18 заполнена значением "ПОПКА".
                </p>
                <ModifiedExcelDownloader 
                  data={invoiceData} 
                  filename="modified-torg12.xlsx"
                />
              </div>
            )}
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
              <p className="text-sm text-gray-500">
                {isEditable 
                  ? "Редактируйте данные напрямую в форме" 
                  : "Просмотр формы перед печатью"}
              </p>
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
        
        {/* Table row management controls */}
        {isEditable && (
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Управление строками таблицы</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={addNewItem}
                >
                  <Plus className="h-4 w-4" />
                  <span>Добавить строку</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                  onClick={removeLastItem}
                >
                  <Trash className="h-4 w-4" />
                  <span>Удалить строку</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Table */}
      <div className="container mx-auto mb-10 print:m-0 print:p-0">
        <div className="bg-white shadow-sm rounded-lg overflow-auto print:shadow-none print:rounded-none">
          <InvoiceTable 
            data={invoiceData} 
            onDataChange={(newData: InvoiceData) => setInvoiceData(newData)} 
            editable={isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
