
import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";

const InvoiceTableHeader: React.FC = () => {
  return (
    <>
      <TableRow className="border border-black">
        <TableHead rowSpan={2} className="border border-black text-center w-10">№ п/п</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center">
          <div>Товар</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center">наименование, характеристика, сорт, артикул товара</div>
            <div className="text-center">код</div>
          </div>
        </TableHead>
        <TableHead colSpan={2} className="border border-black text-center">Единица измерения</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Вид упаковки</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Количество в одном месте</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Кол-во мест, штук</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Масса брутто</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Количество (масса нетто)</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Цена, руб. коп.</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Сумма без учета НДС, руб. коп.</TableHead>
        <TableHead colSpan={2} className="border border-black text-center">НДС</TableHead>
        <TableHead rowSpan={2} className="border border-black text-center w-16">Сумма с учетом НДС, руб. коп.</TableHead>
      </TableRow>
      <TableRow className="border border-black">
        <TableHead className="border border-black text-center w-16">наиме-нование</TableHead>
        <TableHead className="border border-black text-center w-16">код по ОКЕИ</TableHead>
        <TableHead className="border border-black text-center w-16">ставка, %</TableHead>
        <TableHead className="border border-black text-center w-16">сумма, руб. коп.</TableHead>
      </TableRow>
      <TableRow className="border border-black">
        {Array.from({ length: 15 }).map((_, i) => (
          <TableHead key={i} className="border border-black text-center">
            {i + 1}
          </TableHead>
        ))}
      </TableRow>
    </>
  );
};

export default InvoiceTableHeader;
