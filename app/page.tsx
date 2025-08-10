"use client"
import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Download, Calculator } from 'lucide-react';
import { generateInvoicePDF } from './utils/pdfGenerator';

// Types
interface InvoiceItem {
  id: string;
  description: string;
  date: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

interface CompanyInfo {
  name: string;
  contact: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface ClientInfo {
  name: string;
  company: string;
}

interface InvoiceData {
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

// Utilitaires
const calculateAmount = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND`;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SL-${year}${month}-${random}`;
};

const InvoiceGenerator: React.FC = () => {
  const [company, setCompany] = useState<CompanyInfo>({
    name: 'SINAI DESIGN',
    contact: 'Christian LUBOYA kasengulu',
    address: '9RUE OTHMANE EL GHARBI',
    city: '1003 TUNIS',
    phone: '+21651609674',
    email: 'christiansinailuboya11@gmail.com'
  });

  const [client, setClient] = useState<ClientInfo>({
    name: 'Stéphane TSHIKADI',
    company: 'Betterchoice firm'
  });

  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'amount'>[]>([
    {
      description: 'AFFICHE',
      date: formatDate(new Date()),
      quantity: 1,
      unit: 'pcs',
      unitPrice: 80
    }
  ]);

  const [discount, setDiscount] = useState<number>(0);

  const addItem = useCallback(() => {
    setItems(prev => [...prev, {
      description: '',
      date: formatDate(new Date()),
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0
    }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, field: keyof Omit<InvoiceItem, 'id' | 'amount'>, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const processedItems: InvoiceItem[] = items.map((item, index) => ({
    ...item,
    id: `item-${index + 1}`,
    amount: calculateAmount(item.quantity, item.unitPrice)
  }));

  const subtotal = calculateSubtotal(processedItems);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const generatePDF = () => {
    const invoiceData: InvoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: formatDate(new Date()),
      dueDate: formatDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
      company,
      client,
      items: processedItems,
      subtotal,
      discount,
      discountAmount,
      total
    };

    // Simuler la génération PDF (dans une vraie app, utilisez jsPDF)
   generateInvoicePDF(invoiceData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">SL</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Générateur de Devis</h1>
              <p className="text-blue-100">Créez vos devis professionnels</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Informations entreprise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations de l&apos;entreprise</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de l'entreprise"
                  value={company.name}
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={company.contact}
                  onChange={(e) => setCompany(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={company.address}
                  onChange={(e) => setCompany(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={company.city}
                  onChange={(e) => setCompany(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={company.phone}
                  onChange={(e) => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={company.email}
                  onChange={(e) => setCompany(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Informations client */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations du client</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du client"
                  value={client.name}
                  onChange={(e) => setClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Entreprise du client"
                  value={client.company}
                  onChange={(e) => setClient(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Articles</h2>
              <button
                onClick={addItem}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Ajouter un article</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Qté</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Unité</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Prix unitaire</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Montant</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Description"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={item.date.split('/').reverse().join('-')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            updateItem(index, 'date', formatDate(date));
                          }}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                          step="1"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pcs">pcs</option>
                          <option value="m">m</option>
                          <option value="m²">m²</option>
                          <option value="kg">kg</option>
                          <option value="h">h</option>
                          <option value="jour">jour</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          min="0"
                          step="0.001"
                        />
                      </td>
                      <td className="p-3 text-right font-semibold text-gray-800">
                        {formatCurrency(calculateAmount(item.quantity, item.unitPrice))}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-80 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sous-total TTC:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Remise:</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-16 p-1 border border-gray-300 rounded text-center"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="text-gray-700">%</span>
                </div>
                <span className="font-semibold text-gray-800">{formatCurrency(discountAmount)}</span>
              </div>

              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-800">Net à payer:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Download size={20} />
              <span>Générer PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;