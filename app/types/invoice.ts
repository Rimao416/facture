// types/invoice.ts
export interface InvoiceItem {
  id: string;
  description: string;
  date: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface CompanyInfo {
  name: string;
  contact: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface ClientInfo {
  name: string;
  company: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
}

export interface InvoiceFormData {
  company: CompanyInfo;
  client: ClientInfo;
  items: Omit<InvoiceItem, 'id' | 'amount'>[];
  discount: number;
}