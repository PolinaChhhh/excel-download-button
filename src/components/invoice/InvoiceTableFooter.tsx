
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { InvoiceData } from "@/types/invoice";

interface InvoiceTableFooterProps {
  data?: InvoiceData;
}

const InvoiceTableFooter: React.FC<InvoiceTableFooterProps> = ({ data }) => {
  // Расчет итоговых значений по накладной
  const calculateTotals = () => {
    if (!data?.items || data.items.length === 0) {
      return {
        totalWeight: "-",
        totalSumWithoutVAT: "-",
        totalVAT: "-",
        grandTotal: "-"
      };
    }

    try {
      const totalWeight = data.items.reduce((sum, item) => {
        const weight = parseFloat(item.totalWeight || "0") || 0;
        return sum + weight;
      }, 0).toFixed(2);

      const totalSumWithoutVAT = data.items.reduce((sum, item) => {
        const amount = parseFloat(item.sumWithoutVAT || "0") || 0;
        return sum + amount;
      }, 0).toFixed(2);

      const totalVAT = data.items.reduce((sum, item) => {
        const vat = parseFloat(item.vatAmount || "0") || 0;
        return sum + vat;
      }, 0).toFixed(2);

      const grandTotal = data.items.reduce((sum, item) => {
        const total = parseFloat(item.totalSum || "0") || 0;
        return sum + total;
      }, 0).toFixed(2);

      return {
        totalWeight,
        totalSumWithoutVAT,
        totalVAT,
        grandTotal
      };
    } catch (error) {
      console.error("Ошибка при расчете итогов:", error);
      return {
        totalWeight: "-",
        totalSumWithoutVAT: "-",
        totalVAT: "-",
        grandTotal: "-"
      };
    }
  };

  const totals = calculateTotals();

  return (
    <>
      <TableRow className="border border-black print:border-[1px] print:border-black">
        <TableCell colSpan={8} className="border border-black print:border-[1px] print:border-black text-right font-medium">Итого</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalWeight}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">-</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalSumWithoutVAT}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">-</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalVAT}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.grandTotal}</TableCell>
      </TableRow>
      <TableRow className="border border-black print:border-[1px] print:border-black">
        <TableCell colSpan={8} className="border border-black print:border-[1px] print:border-black text-right font-medium">Всего по накладной</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalWeight}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">-</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalSumWithoutVAT}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">-</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.totalVAT}</TableCell>
        <TableCell className="border border-black print:border-[1px] print:border-black text-center">{totals.grandTotal}</TableCell>
      </TableRow>
    </>
  );
};

export default InvoiceTableFooter;
