
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

const InvoiceTableFooter: React.FC = () => {
  return (
    <>
      <TableRow className="border border-black">
        <TableCell colSpan={8} className="border border-black text-right">Итого</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
      </TableRow>
      <TableRow className="border border-black">
        <TableCell colSpan={8} className="border border-black text-right">Всего по накладной</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
        <TableCell className="border border-black text-center">-</TableCell>
      </TableRow>
    </>
  );
};

export default InvoiceTableFooter;
