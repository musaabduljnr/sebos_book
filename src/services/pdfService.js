import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * PDF Service — Digital Receipt Generation
 */

export function generateReceipt(transaction, options = {}) {
  const doc = createReceiptDoc(transaction);
  
  if (options.preview) {
    return doc.output('dataurlstring');
  }

  const filename = `SebosBook_${transaction.type}_${transaction.imei || 'receipt'}.pdf`;
  doc.save(filename);
  return filename;
}

function createReceiptDoc(transaction) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200], // Small roll format for mobile/thermal
  });

  const pageWidth = 80;
  const margin = 8;
  let y = 12;

  // --- Header & Branding ---
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 204); // Accent Blue
  doc.setFont('helvetica', 'bold');
  doc.text('SEBOS BOOK', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'normal');
  doc.text('DIGITAL BUSINESS SOLUTIONS', pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Header Divider
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Receipt Identification
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.setFont('helvetica', 'bold');
  const typeLabel = transaction.type === 'sale' ? 'SALES RECEIPT' : 'TRADE-IN RECEIPT';
  doc.text(typeLabel, pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: #SB-${String(transaction.id || Date.now()).slice(-6).toUpperCase()}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // --- Customer Information ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', margin, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const customerFields = [
    ['Name', transaction.customerName || 'N/A'],
    ['Phone', transaction.customerPhone || 'N/A'],
    ['Address', transaction.customerAddress || 'N/A'],
  ];

  customerFields.forEach(([label, value]) => {
    doc.text(`${label}:`, margin, y);
    doc.text(String(value), margin + 15, y);
    y += 4;
  });
  y += 4;

  // --- Transaction Details ---
  doc.setDrawColor(240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', margin, y);
  y += 6;

  const details = [
    ['Date', new Date(transaction.createdAt || transaction.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })],
    ['Brand', transaction.brand],
    ['Model', transaction.phoneModel],
    ['IMEI', transaction.imei],
    ['Condition', transaction.condition],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), pageWidth - margin, y, { align: 'right' });
    y += 5;
  });

  y += 4;
  doc.setDrawColor(30);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // --- Pricing Summary ---
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  
  if (transaction.type === 'sale') {
    doc.text('TOTAL AMOUNT', margin, y);
    doc.text(formatCurrency(transaction.salePrice), pageWidth - margin, y, { align: 'right' });
  } else {
    doc.text('PAID TO CUSTOMER', margin, y);
    doc.text(formatCurrency(transaction.costPrice), pageWidth - margin, y, { align: 'right' });
  }
  
  y += 12;

  // --- Professional Footer ---
  doc.setDrawColor(200);
  doc.setLineDashPattern([1, 1]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Sebos Book.', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Terms: All sales are final. 7 days warranty included.', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('This is a computer-generated receipt.', pageWidth / 2, y, { align: 'center' });

  return doc;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default { generateReceipt };
