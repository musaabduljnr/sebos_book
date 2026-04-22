import React from 'react';
import { Download, X, Printer, Share2 } from 'lucide-react';
import Modal from './Modal';
import { generateReceipt } from '../services/pdfService';
import './ReceiptPreview.css';

export default function ReceiptPreview({ isOpen, onClose, transaction }) {
  if (!transaction) return null;

  const dataUrl = generateReceipt(transaction, { preview: true });

  const handleDownload = () => {
    generateReceipt(transaction);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Receipt Preview"
      footer={
        <div className="receipt-preview__actions">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn--primary" onClick={handleDownload}>
            <Download size={18} /> Download PDF
          </button>
        </div>
      }
    >
      <div className="receipt-preview__container">
        <div className="receipt-preview__toolbar">
          <div className="receipt-preview__info">
            <span className="badge badge--success">Official Receipt</span>
            <span className="text-muted">SB-{String(transaction.id).slice(-6)}</span>
          </div>
          <div className="receipt-preview__btns">
            <button className="btn btn--ghost btn--icon-sm" title="Print (Coming Soon)">
              <Printer size={16} />
            </button>
            <button className="btn btn--ghost btn--icon-sm" title="Share">
              <Share2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="receipt-preview__paper">
          <iframe 
            src={dataUrl} 
            title="Receipt PDF" 
            className="receipt-preview__iframe"
          />
        </div>
        
        <p className="receipt-preview__hint">
          Previewing on mobile? Tap download to save the high-quality PDF.
        </p>
      </div>
    </Modal>
  );
}
