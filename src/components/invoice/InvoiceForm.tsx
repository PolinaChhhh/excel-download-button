
import React from 'react';
import ActionButtons from './ActionButtons';
import TableControls from './TableControls';
import InvoiceTable from '@/components/InvoiceTable';
import type { InvoiceData } from '@/components/InvoiceTable';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
  isEditable: boolean;
  onPrint: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  onDataChange,
  isEditable,
  onPrint
}) => {
  return (
    <>
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
          <ActionButtons onPrint={onPrint} />
        </div>
      </div>
      
      {isEditable && (
        <TableControls 
          invoiceData={invoiceData} 
          onDataChange={onDataChange}
        />
      )}
      
      <div className="bg-white shadow-sm rounded-lg overflow-auto print:shadow-none print:rounded-none print:overflow-visible">
        <InvoiceTable 
          data={invoiceData} 
          onDataChange={onDataChange} 
          editable={isEditable}
        />
      </div>
    </>
  );
};

export default InvoiceForm;
