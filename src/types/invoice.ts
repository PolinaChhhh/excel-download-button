
// Define interface for invoice items
export interface InvoiceItem {
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
}

// Define the main invoice data interface
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
  items?: InvoiceItem[];
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
