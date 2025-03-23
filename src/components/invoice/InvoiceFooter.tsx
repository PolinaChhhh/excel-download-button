
import React from "react";
import { Input } from "@/components/ui/input";
import type { InvoiceData } from "@/types/invoice";

interface InvoiceFooterProps {
  data: InvoiceData;
  onDataChange?: (data: InvoiceData) => void;
  editable: boolean;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ 
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
    <div className="mt-4 grid grid-cols-6 gap-2">
      <div className="col-span-3">
        <div className="flex items-center">
          <span>Товарная накладная имеет приложение на</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.attachmentPages || ""}
                onChange={(e) => handleInputChange("attachmentPages", e.target.value)}
              />
            ) : (
              data.attachmentPages || ""
            )}
          </div>
          <span>листах и содержит</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.totalItems || ""}
                onChange={(e) => handleInputChange("totalItems", e.target.value)}
              />
            ) : (
              data.totalItems || ""
            )}
          </div>
          <span>порядковых номеров записей</span>
        </div>

        <div className="flex items-center mt-2">
          <span>Всего мест</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.totalPages || ""}
                onChange={(e) => handleInputChange("totalPages", e.target.value)}
              />
            ) : (
              data.totalPages || ""
            )}
          </div>
          <span>Масса груза (нетто)</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.totalWeight || ""}
                onChange={(e) => handleInputChange("totalWeight", e.target.value)}
              />
            ) : (
              data.totalWeight || ""
            )}
          </div>
          <span>Масса груза (брутто)</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.grossWeight || ""}
                onChange={(e) => handleInputChange("grossWeight", e.target.value)}
              />
            ) : (
              data.grossWeight || ""
            )}
          </div>
        </div>

        <div className="flex items-center mt-4">
          <span>Приложение (паспорта, сертификаты и т.п.) на</span>
          <div className="border-b border-black w-32 mx-1 text-center">
            {editable ? (
              <Input 
                className="h-6 p-1 text-[10px] border-none" 
                value={data.attachment || ""}
                onChange={(e) => handleInputChange("attachment", e.target.value)}
              />
            ) : (
              data.attachment || ""
            )}
          </div>
          <span>листах</span>
        </div>

        <div className="flex items-center mt-4">
          <span>Всего отпущено на сумму</span>
          <div className="border-b border-black w-64 mx-1 text-center">(прописью)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>Отпуск разрешил</span>
          <div className="border-b border-black w-16 mx-1 text-center">(должность)</div>
          <div className="border-b border-black w-16 mx-1 text-center">(подпись)</div>
          <div className="border-b border-black w-64 mx-1 text-center">(расшифровка подписи)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>Главный (старший) бухгалтер</span>
          <div className="border-b border-black w-16 mx-1 text-center">(подпись)</div>
          <div className="border-b border-black w-64 mx-1 text-center">(расшифровка подписи)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>Отпуск произвел</span>
          <div className="border-b border-black w-16 mx-1 text-center">(должность)</div>
          <div className="border-b border-black w-16 mx-1 text-center">(подпись)</div>
          <div className="border-b border-black w-64 mx-1 text-center">(расшифровка подписи)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>М.П.</span>
        </div>
      </div>

      <div className="col-span-3">
        <div className="flex items-center mt-4">
          <span>По доверенности №</span>
          <div className="border-b border-black w-32 mx-1 text-center"></div>
          <span>от "_____"</span>
          <div className="border-b border-black w-16 mx-1 text-center"></div>
          <span>20___г.</span>
        </div>

        <div className="flex items-center mt-2">
          <span>выданной</span>
          <div className="border-b border-black w-64 mx-1 text-center">(кем, кому (организация, должность, фамилия, и., о.))</div>
        </div>

        <div className="flex items-center mt-6">
          <span>Груз принял</span>
          <div className="border-b border-black w-16 mx-1 text-center">(должность)</div>
          <div className="border-b border-black w-16 mx-1 text-center">(подпись)</div>
          <div className="border-b border-black w-64 mx-1 text-center">(расшифровка подписи)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>Груз получил</span>
          <div className="border-b border-black w-16 mx-1 text-center">(должность)</div>
          <div className="border-b border-black w-16 mx-1 text-center">(подпись)</div>
          <div className="border-b border-black w-64 mx-1 text-center">(расшифровка подписи)</div>
        </div>

        <div className="flex items-center mt-4">
          <span>М.П.</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
