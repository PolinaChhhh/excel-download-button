
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export interface InvoiceData {
  // Header data
  form?: string;
  code?: string;
  okud?: string;
  okpo?: string;
  consignor?: string;
  supplier?: string;
  payer?: string;
  basis?: string;
  // Document data
  documentNumber?: string;
  documentDate?: string;
  waybillNumber?: string;
  waybillDate?: string;
  operationType?: string;
  activityType?: string;
  // Table items
  items?: Array<{
    id: number;
    name: string;
    code: string;
    unit: string;
    unitCode: string;
    packageType: string;
    quantityInPackage: string;
    numberOfPackages: string;
    weight: string;
    totalWeight: string;
    price: string;
    sumWithoutVAT: string;
    vatRate: string;
    vatAmount: string;
    totalSum: string;
  }>;
  // Footer data
  totalPages?: string;
  totalItems?: string;
  totalWeight?: string;
  grossWeight?: string;
  attachment?: string;
  attachmentPages?: string;
  totalShipped?: string;
  shipmentAuthorized?: string;
  chiefAccountant?: string;
  dispatchedBy?: string;
  receivedBy?: string;
  cargoReceived?: string;
}

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
  const handleInputChange = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        [field]: value
      });
    }
  };

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

  return (
    <div className="bg-white p-4 print:p-0 w-full max-w-[842px] mx-auto text-[10px] print:text-[8pt]">
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

      {/* Document number and date */}
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

      {/* Main table */}
      <div className="mt-2">
        <Table className="border border-black">
          <TableHeader>
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
          </TableHeader>
          <TableBody>
            {tableItems.map((item, index) => (
              <TableRow key={index} className="border border-black">
                <TableCell className="border border-black text-center">{index + 1}</TableCell>
                <TableCell className="border border-black">
                  {editable ? (
                    <Input 
                      className="h-6 p-1 text-[10px]" 
                      value={item.name || ""}
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].name = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].unit = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].unitCode = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].packageType = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].quantityInPackage = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].numberOfPackages = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].weight = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].totalWeight = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].price = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].sumWithoutVAT = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].vatRate = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].vatAmount = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
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
                      onChange={(e) => {
                        const newItems = [...tableItems];
                        newItems[index].totalSum = e.target.value;
                        onDataChange?.({ ...data, items: newItems });
                      }}
                    />
                  ) : (
                    item.totalSum || ""
                  )}
                </TableCell>
              </TableRow>
            ))}
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
          </TableBody>
        </Table>
      </div>

      {/* Footer section */}
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
    </div>
  );
};

export default InvoiceTable;
