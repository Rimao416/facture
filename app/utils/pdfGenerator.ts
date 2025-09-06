// utils/pdfGenerator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceData } from '../types/invoice';

// Déclaration de module TypeScript pour les types
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const formatCurrency = (amount: number, currency: Currency): string => {
  return `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} ${currency.code}`;
};

export const generateInvoicePDF = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
 
  // En-tête avec logo stylisé
  doc.setFillColor(30, 64, 175);
  doc.roundedRect(20, 20, 25, 25, 5, 5, 'F');
 
  // Initiales du logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SL', 32.5, 35, { align: 'center' });
 
  // Titre facture avec nouveau format
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`Factures-SL-${invoiceData.invoiceNumber}`, 55, 35);
 
  // Informations de date (modifiables)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Date de facturation: ${invoiceData.invoiceDate}`, 55, 45);
  doc.text(`Échéance: ${invoiceData.dueDate}`, 55, 52);
 
  // Informations de l'entreprise (gauche)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceData.company.name.toUpperCase(), 20, 70);
 
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoiceData.company.contact, 20, 78);
  doc.text(invoiceData.company.address, 20, 85);
  doc.text(invoiceData.company.city, 20, 92);
  doc.text(invoiceData.company.phone, 20, 99);
  doc.text(invoiceData.company.email, 20, 106);
 
  // Informations client (droite)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(invoiceData.client.name, 140, 70);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoiceData.client.company, 140, 78);
 
  // Tableau des articles
  const tableData = invoiceData.items.map(item => [
    item.description,
    item.date,
    item.quantity.toString(),
    item.unit,
    formatCurrency(item.unitPrice, invoiceData.currency),
    formatCurrency(item.amount, invoiceData.currency)
  ]);
 
  // Utilisation correcte d'autoTable
  autoTable(doc, {
    startY: 125,
    head: [['Description', 'Date', 'Qté', 'Unité', 'Prix unitaire', 'Montant']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Description
      1: { cellWidth: 25 }, // Date
      2: { cellWidth: 15, halign: 'center' }, // Qté
      3: { cellWidth: 20 }, // Unité
      4: { cellWidth: 30, halign: 'right' }, // Prix unitaire
      5: { cellWidth: 35, halign: 'right' } // Montant
    },
    margin: { left: 20, right: 20 }
  });
 
  // Position Y après le tableau
  const finalY = doc.lastAutoTable.finalY + 20;
 
  // Totaux avec devise personnalisée
  const totalsX = 130;
 
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
 
  // Sous-total
  doc.text('Sous-total TTC', totalsX, finalY);
  doc.text(formatCurrency(invoiceData.subtotal, invoiceData.currency), totalsX + 50, finalY, { align: 'right' });
 
  // Remise
  if (invoiceData.discount > 0) {
    doc.text(`Remise (${invoiceData.discount}%)`, totalsX, finalY + 8);
    doc.text(formatCurrency(invoiceData.discountAmount, invoiceData.currency), totalsX + 50, finalY + 8, { align: 'right' });
  }
 
  // Net à payer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const netY = invoiceData.discount > 0 ? finalY + 16 : finalY + 8;
  doc.text('Net à payer', totalsX, netY);
  doc.text(formatCurrency(invoiceData.total, invoiceData.currency), totalsX + 50, netY, { align: 'right' });
 
  // Signature
  const signatureY = netY + 30;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoiceData.client.name, 20, signatureY);
  doc.text(`${invoiceData.client.name} (${invoiceData.invoiceDate})`, 20, signatureY + 5);
 
  // Pied de page simplifié (sans adresse redondante)
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Notre rapidité à vous satisfaire équivaut à la célérité', 105, 270, { align: 'center' });
  doc.text(`Merci d'avoir fait confiance à ${invoiceData.company.name}`, 105, 278, { align: 'center' });
 
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceData.company.name.toUpperCase(), 105, 290, { align: 'center' });
 
  // Télécharger le PDF avec le nouveau nom
  doc.save(`Factures-${invoiceData.invoiceNumber}.pdf`);
};