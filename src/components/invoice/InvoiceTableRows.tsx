
import React from "react";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceTableRowsProps {
  items: InvoiceItem[];
  onItemsChange?: (newItems: InvoiceItem[]) => void;
  editable: boolean;
}

const InvoiceTableRows: React.FC<InvoiceTableRowsProps> = ({ 
  items, 
  onItemsChange, 
  editable 
}) => {
  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    if (onItemsChange) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      onItemsChange(newItems);
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <TableRow key={index} className="border border-black">
          <TableCell className="border border-black text-center">{index + 1}</TableCell>
          <TableCell className="border border-black">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.name || ""}
                onChange={(e) => updateItem(index, "name", e.target.value)}
              />
            ) : (
              item.name || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.unit || ""}
                onChange={(e) => updateItem(index, "unit", e.target.value)}
              />
            ) : (
              item.unit || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.unitCode || ""}
                onChange={(e) => updateItem(index, "unitCode", e.target.value)}
              />
            ) : (
              item.unitCode || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.packageType || ""}
                onChange={(e) => updateItem(index, "packageType", e.target.value)}
              />
            ) : (
              item.packageType || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.quantityInPackage || ""}
                onChange={(e) => updateItem(index, "quantityInPackage", e.target.value)}
              />
            ) : (
              item.quantityInPackage || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.numberOfPackages || ""}
                onChange={(e) => updateItem(index, "numberOfPackages", e.target.value)}
              />
            ) : (
              item.numberOfPackages || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.weight || ""}
                onChange={(e) => updateItem(index, "weight", e.target.value)}
              />
            ) : (
              item.weight || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.totalWeight || ""}
                onChange={(e) => updateItem(index, "totalWeight", e.target.value)}
              />
            ) : (
              item.totalWeight || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.price || ""}
                onChange={(e) => updateItem(index, "price", e.target.value)}
              />
            ) : (
              item.price || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.sumWithoutVAT || ""}
                onChange={(e) => updateItem(index, "sumWithoutVAT", e.target.value)}
              />
            ) : (
              item.sumWithoutVAT || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.vatRate || ""}
                onChange={(e) => updateItem(index, "vatRate", e.target.value)}
              />
            ) : (
              item.vatRate || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.vatAmount || ""}
                onChange={(e) => updateItem(index, "vatAmount", e.target.value)}
              />
            ) : (
              item.vatAmount || ""
            )}
          </TableCell>
          <TableCell className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={item.totalSum || ""}
                onChange={(e) => updateItem(index, "totalSum", e.target.value)}
              />
            ) : (
              item.totalSum || ""
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default InvoiceTableRows;
