
import React from "react";
import { Table, TableHeader, TableBody } from "@/components/ui/table";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceDocumentInfo from "@/components/invoice/InvoiceDocumentInfo";
import InvoiceTableHeader from "@/components/invoice/InvoiceTableHeader";
import InvoiceTableRows from "@/components/invoice/InvoiceTableRows";
import InvoiceTableFooter from "@/components/invoice/InvoiceTableFooter";
import InvoiceFooter from "@/components/invoice/InvoiceFooter";
import type { InvoiceData, InvoiceItem } from "@/types/invoice";

export type { InvoiceData, InvoiceItem } from "@/types/invoice";

interface InvoiceTableProps {
  data: InvoiceData;
  onDataChange?: (data: InvoiceData) => void;
  editable?: boolean;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  data, 
  onDataChange,
  editable = false 
}) => {
  // Initialize with at least one empty row if no items exist
  const tableItems = data.items && data.items.length > 0 
    ? data.items 
    : [{ 
        id: 1, 
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
      }];

  const handleItemsChange = (newItems: InvoiceItem[]) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        items: newItems
      });
    }
  };

  return (
    <div className="bg-white p-4 print:p-0 w-full max-w-[842px] mx-auto text-[10px] print:text-[8pt]">
      {/* Invoice Header */}
      <InvoiceHeader 
        data={data}
        onDataChange={onDataChange}
        editable={editable}
      />

      {/* Document Information (Number, Date, etc.) */}
      <InvoiceDocumentInfo 
        data={data}
        onDataChange={onDataChange}
        editable={editable}
      />

      {/* Main Table */}
      <div className="mt-2">
        <Table className="border border-black">
          <TableHeader>
            <InvoiceTableHeader />
          </TableHeader>
          <TableBody>
            <InvoiceTableRows 
              items={tableItems}
              onItemsChange={handleItemsChange}
              editable={editable}
            />
            <InvoiceTableFooter />
          </TableBody>
        </Table>
      </div>

      {/* Invoice Footer */}
      <InvoiceFooter 
        data={data}
        onDataChange={onDataChange}
        editable={editable}
      />
    </div>
  );
};

export default InvoiceTable;
