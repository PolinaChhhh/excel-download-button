
import React from "react";
import { Input } from "@/components/ui/input";
import type { InvoiceData } from "@/types/invoice";

interface InvoiceDocumentInfoProps {
  data: InvoiceData;
  onDataChange?: (data: InvoiceData) => void;
  editable: boolean;
}

const InvoiceDocumentInfo: React.FC<InvoiceDocumentInfoProps> = ({ 
  data, 
  onDataChange, 
  editable 
}) => {
  const handleInputChange = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1 mt-4">
      <div className="text-center font-bold text-lg">ТОВАРНАЯ НАКЛАДНАЯ</div>
      <div className="grid grid-cols-2 border border-black">
        <div className="border-r border-black p-1 text-center">Номер документа</div>
        <div className="p-1 text-center">Дата составления</div>
        <div className="border-r border-t border-black p-1 text-center">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.documentNumber || ""}
              onChange={(e) => handleInputChange("documentNumber", e.target.value)}
            />
          ) : (
            data.documentNumber || ""
          )}
        </div>
        <div className="border-t border-black p-1 text-center">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.documentDate || ""}
              onChange={(e) => handleInputChange("documentDate", e.target.value)}
            />
          ) : (
            data.documentDate || ""
          )}
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="text-right p-1">Транспортная накладная</div>
        <div className="grid grid-rows-2">
          <div className="grid grid-cols-2 border border-black">
            <div className="text-center p-1">номер</div>
            <div className="text-center p-1 border-l border-black">
              {editable ? (
                <Input 
                  className="h-6 p-1 text-[10px]" 
                  value={data.waybillNumber || ""}
                  onChange={(e) => handleInputChange("waybillNumber", e.target.value)}
                />
              ) : (
                data.waybillNumber || ""
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-black border-t-0">
            <div className="text-center p-1">дата</div>
            <div className="text-center p-1 border-l border-black">
              {editable ? (
                <Input 
                  className="h-6 p-1 text-[10px]" 
                  value={data.waybillDate || ""}
                  onChange={(e) => handleInputChange("waybillDate", e.target.value)}
                />
              ) : (
                data.waybillDate || ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDocumentInfo;
