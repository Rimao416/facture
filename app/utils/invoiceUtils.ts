// utils/invoiceUtils.ts
import { InvoiceItem, InvoiceData, InvoiceFormData } from '../types/invoice';

export const calculateAmount = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateDiscountAmount = (subtotal: number, discountPercent: number): number => {
  return (subtotal * discountPercent) / 100;
};

export const calculateTotal = (subtotal: number, discountAmount: number): number => {
  return subtotal - discountAmount;
};

export const formatCurrency = (amount: number, currency: string = 'TND'): string => {
  return `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} ${currency}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}-${random}`;
};

export const processInvoiceData = (formData: InvoiceFormData): InvoiceData => {
  const now = new Date();
  const dueDate = new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 jours
  
  const processedItems: InvoiceItem[] = formData.items.map((item, index) => ({
    ...item,
    id: `item-${index + 1}`,
    amount: calculateAmount(item.quantity, item.unitPrice)
  }));

  const subtotal = calculateSubtotal(processedItems);
  const discountAmount = calculateDiscountAmount(subtotal, formData.discount);
  const total = calculateTotal(subtotal, discountAmount);

  return {
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: formatDate(now),
    dueDate: formatDate(dueDate),
    company: formData.company,
    client: formData.client,
    items: processedItems,
    subtotal,
    discount: formData.discount,
    discountAmount,
    total
  };
};