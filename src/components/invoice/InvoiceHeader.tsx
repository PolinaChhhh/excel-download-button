
import React from "react";
import { Input } from "@/components/ui/input";
import type { InvoiceData } from "@/types/invoice";

interface InvoiceHeaderProps {
  data: InvoiceData;
  onDataChange?: (data: InvoiceData) => void;
  editable: boolean;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ 
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
    <>
      {/* Header section */}
      <div className="grid grid-cols-3 gap-1 border-b pb-2 text-right">
        <div className="col-span-2"></div>
        <div className="grid grid-cols-2 gap-1">
          <div className="text-right">Унифицированная форма№ ТОРГ-12, утверждена постановлением Госкомстата России от 25.12.</div>
          <div className="border border-black text-center">Форма</div>
          <div className="border border-black text-center">Код</div>
          <div className="border border-black text-center">по ОКУД</div>
          <div className="border border-black text-center">0330212</div>
          <div className="border border-black text-center">по ОКПО</div>
          <div className="border border-black text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px]" 
                value={data.okpo || ""}
                onChange={(e) => handleInputChange("okpo", e.target.value)}
              />
            ) : (
              data.okpo || ""
            )}
          </div>
        </div>
      </div>

      {/* Consignor, Supplier, Payer, Basis */}
      <div className="grid grid-cols-6 gap-1 mt-2">
        <div className="flex items-center">Грузополучатель</div>
        <div className="col-span-4 border-b border-black">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.consignor || ""}
              onChange={(e) => handleInputChange("consignor", e.target.value)}
              placeholder="(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
            />
          ) : (
            data.consignor || "(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
          )}
        </div>
        <div className="text-right">по ОКПО</div>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-2">
        <div className="flex items-center">Поставщик</div>
        <div className="col-span-4 border-b border-black">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.supplier || ""}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              placeholder="(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
            />
          ) : (
            data.supplier || "(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
          )}
        </div>
        <div className="text-right">по ОКПО</div>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-2">
        <div className="flex items-center">Плательщик</div>
        <div className="col-span-4 border-b border-black">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.payer || ""}
              onChange={(e) => handleInputChange("payer", e.target.value)}
              placeholder="(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
            />
          ) : (
            data.payer || "(полное наименование организации, адрес, номер телефона, банковские реквизиты)"
          )}
        </div>
        <div className="text-right">по ОКПО</div>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-2">
        <div className="flex items-center">Основание</div>
        <div className="col-span-4 border-b border-black">
          {editable ? (
            <Input 
              className="h-6 p-1 text-[10px]" 
              value={data.basis || ""}
              onChange={(e) => handleInputChange("basis", e.target.value)}
              placeholder="(наименование документа: договор, контракт, заказ-наряд)"
            />
          ) : (
            data.basis || "(наименование документа: договор, контракт, заказ-наряд)"
          )}
        </div>
        <div className="text-right">номер</div>
      </div>
    </>
  );
};

export default InvoiceHeader;
