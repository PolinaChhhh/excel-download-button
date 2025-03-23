
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import type { InvoiceData } from "@/components/InvoiceTable";

interface TableControlsProps {
  invoiceData: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
}

const TableControls: React.FC<TableControlsProps> = ({ invoiceData, onDataChange }) => {
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
    
    onDataChange({
      ...invoiceData,
      items: newItems
    });
    
    toast.success("Добавлена новая строка");
  };

  const removeLastItem = () => {
    if (invoiceData.items && invoiceData.items.length > 1) {
      const newItems = [...invoiceData.items];
      newItems.pop();
      
      onDataChange({
        ...invoiceData,
        items: newItems
      });
      
      toast.success("Последняя строка удалена");
    } else {
      toast.error("Должна остаться хотя бы одна строка");
    }
  };

  return (
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
  );
};

export default TableControls;
