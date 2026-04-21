import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * PDF Service — Digital Receipt Generation
 */

export function generateReceipt(transaction) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200],
  });

  const pageWidth = 80;
  const margin = 6;
  const contentWidth = pageWidth - margin * 2;
  let y = 10;

  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SEBOS BOOK', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Mobile Phone Sales & Trade-Ins', pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Transaction Type
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const typeLabel = transaction.type === 'sale' ? 'SALE RECEIPT' : 'TRADE-IN RECEIPT';
  doc.text(typeLabel, pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Details
  const details = [
    ['Date', new Date(transaction.createdAt || transaction.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })],
    ['Time', new Date(transaction.createdAt || Date.now()).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit',
    })],
    ['Phone', transaction.phoneModel],
    ['IMEI', transaction.imei],
    ['Condition', transaction.condition],
    ['Brand', transaction.brand],
  ];

  if (transaction.type === 'sale') {
    details.push(['Sale Price', formatCurrency(transaction.salePrice)]);
  } else {
    details.push(['Trade-In Value', formatCurrency(transaction.costPrice)]);
  }

  doc.setFontSize(8);
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), pageWidth - margin, y, { align: 'right' });
    y += 5;
  });

  y += 3;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Total
  if (transaction.type === 'sale') {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', margin, y);
    doc.text(formatCurrency(transaction.salePrice), pageWidth - margin, y, { align: 'right' });
    y += 4;

    const profit = transaction.salePrice - transaction.costPrice;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Profit: ${formatCurrency(profit)}`, pageWidth - margin, y, { align: 'right' });
    y += 8;
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', margin, y);
    doc.text(formatCurrency(transaction.costPrice), pageWidth - margin, y, { align: 'right' });
    y += 8;
  }

  // Footer
  doc.setDrawColor(200);
  doc.setLineDashPattern([1, 1]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Ref: SB-${String(transaction.id || Date.now()).slice(-6)}`, pageWidth / 2, y, { align: 'center' });

  // Save
  const filename = `SebosBook_${transaction.type}_${transaction.imei || 'receipt'}.pdf`;
  doc.save(filename);
  return filename;
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
