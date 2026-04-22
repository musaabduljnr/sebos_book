import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Check, 
  ShoppingCart, RefreshCcw, Camera, 
  Smartphone, Hash, DollarSign 
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import IMEIScanner from '../components/IMEIScanner';
import Modal from '../components/Modal';
import './TransactionForm.css';

const BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Tecno', 'Infinix', 'itel', 'Oppo', 'Redmi', 'Other'];
const CONDITIONS = ['New', 'Used'];

export default function TransactionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { create } = useTransactions();
  
  const [step, setStep] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sale',
    brand: 'Apple',
    phoneModel: '',
    imei: '',
    condition: 'Used',
    costPrice: '',
    salePrice: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });

  // Pre-fill if coming from inventory
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({ ...prev, ...location.state }));
      setStep(2); // Jump to details if we already have some info
    }
  }, [location.state]);

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleScan = (imei) => {
    updateForm('imei', imei);
    setIsScannerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await create({
        ...formData,
        costPrice: Number(formData.costPrice),
        salePrice: formData.type === 'sale' ? Number(formData.salePrice) : 0,
        date: new Date().toISOString().split('T')[0],
      });
      navigate('/');
    } catch (e) {
      // Error handled by hook
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2 className="form-step__title">Transaction Type</h2>
            <div className="type-selector">
              <div 
                className={`type-card ${formData.type === 'sale' ? 'selected' : ''}`}
                onClick={() => updateForm('type', 'sale')}
              >
                <ShoppingCart className="type-card__icon" size={32} />
                <span>Sale</span>
              </div>
              <div 
                className={`type-card ${formData.type === 'trade-in' ? 'selected' : ''}`}
                onClick={() => updateForm('type', 'trade-in')}
              >
                <RefreshCcw className="type-card__icon" size={32} />
                <span>Trade-In</span>
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Date</label>
              <input type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} disabled />
            </div>

            <div className="form-actions">
              <button 
                className="btn btn--primary btn--full" 
                onClick={nextStep}
                disabled={!formData.type}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2 className="form-step__title">Phone Details</h2>
            
            <div className="input-group">
              <label className="input-label">Brand</label>
              <select 
                className="select" 
                value={formData.brand}
                onChange={e => updateForm('brand', e.target.value)}
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Model Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. iPhone 15 Pro Max"
                  value={formData.phoneModel}
                  onChange={e => updateForm('phoneModel', e.target.value)}
                  autoFocus
                />
                <Smartphone size={18} className="text-muted" style={{ position: 'absolute', right: '12px', top: '12px' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">IMEI Number (15 Digits)</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Enter IMEI"
                    value={formData.imei}
                    maxLength={15}
                    onChange={e => updateForm('imei', e.target.value.replace(/\D/g, ''))}
                  />
                  <Hash size={18} className="text-muted" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                </div>
                <button 
                  className="btn btn--secondary btn--icon"
                  onClick={() => setIsScannerOpen(true)}
                  title="Scan IMEI"
                  type="button"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Condition</label>
              <div className="type-selector">
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`btn btn--secondary ${formData.condition === c ? 'btn--primary' : ''}`}
                    onClick={() => updateForm('condition', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn--ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
              <button 
                className="btn btn--primary btn--full" 
                onClick={nextStep}
                disabled={!formData.phoneModel || formData.imei.length < 14}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case 3:
        const isTradeIn = formData.type === 'trade-in';
        return (
          <div className="form-step">
            <h2 className="form-step__title">{isTradeIn ? 'Purchase Price' : 'Sales Pricing'}</h2>
            
            <div className="input-group">
              <label className="input-label">{isTradeIn ? 'Price Paid' : 'Cost Price (Internal)'}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={e => updateForm('costPrice', e.target.value)}
                  autoFocus
                />
                <DollarSign size={18} className="text-muted" style={{ position: 'absolute', right: '12px', top: '12px' }} />
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Amount spent obtaining this device.
              </p>
            </div>
            
            <div className="divider" style={{ margin: 'var(--space-6) 0' }}></div>
            
            <h3 className="form-step__subtitle" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
              Customer Information
            </h3>

            <div className="input-group">
              <label className="input-label">Customer Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Full Name"
                value={formData.customerName}
                onChange={e => updateForm('customerName', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number *</label>
              <input 
                type="tel" 
                className="input" 
                placeholder="e.g. 08012345678"
                value={formData.customerPhone}
                onChange={e => updateForm('customerPhone', e.target.value.replace(/\D/g, ''))}
                required
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                This field is mandatory.
              </p>
            </div>

            <div className="input-group">
              <label className="input-label">Address</label>
              <textarea 
                className="input" 
                placeholder="Customer's physical address"
                value={formData.customerAddress}
                onChange={e => updateForm('customerAddress', e.target.value)}
                rows={2}
                style={{ resize: 'none', padding: '12px' }}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn--ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
              <button 
                className="btn btn--primary btn--full" 
                onClick={nextStep}
                disabled={!formData.costPrice || (formData.type === 'sale' && !formData.salePrice) || !formData.customerPhone}
              >
                Review <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2 className="form-step__title">Review & Submit</h2>
            <div className="card card--flat">
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-item__label">Type</span>
                  <span className="review-item__value" style={{ color: formData.type === 'sale' ? 'var(--color-success)' : 'var(--color-info)' }}>
                    {formData.type.toUpperCase()}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-item__label">Device</span>
                  <span className="review-item__value">{formData.brand} {formData.phoneModel}</span>
                </div>
                <div className="review-item">
                  <span className="review-item__label">IMEI</span>
                  <span className="review-item__value mono">{formData.imei}</span>
                </div>
                <div className="review-item">
                  <span className="review-item__label">Condition</span>
                  <span className="review-item__value">{formData.condition}</span>
                </div>
                <div className="review-item">
                  <span className="review-item__label">Cost</span>
                  <span className="review-item__value">₦{Number(formData.costPrice).toLocaleString()}</span>
                </div>
                {formData.type === 'sale' && (
                  <div className="review-item">
                    <span className="review-item__label">Sale Price</span>
                    <span className="review-item__value">₦{Number(formData.salePrice).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="review-divider" style={{ gridColumn: 'span 2', height: '1px', background: 'var(--color-border)', margin: 'var(--space-2) 0' }}></div>
                
                <div className="review-item">
                  <span className="review-item__label">Customer</span>
                  <span className="review-item__value">{formData.customerName || 'N/A'}</span>
                </div>
                <div className="review-item">
                  <span className="review-item__label">Phone</span>
                  <span className="review-item__value">{formData.customerPhone}</span>
                </div>
                <div className="review-item" style={{ borderBottom: 'none' }}>
                  <span className="review-item__label">Address</span>
                  <span className="review-item__value" style={{ fontSize: 'var(--text-xs)' }}>{formData.customerAddress || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn--ghost" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
              <button 
                className="btn btn--primary btn--full btn--lg" 
                onClick={handleSubmit}
              >
                Confirm & Record <Check size={20} />
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="tx-form page-enter">
      <div className="step-indicator">
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`} 
          />
        ))}
      </div>

      <div className="form-container">
        {renderStep()}
      </div>

      <Modal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        title="Scan IMEI"
      >
        <IMEIScanner onScan={handleScan} />
        <p style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)' }}>
          Simulation: Holds still for 3 seconds to "scan"
        </p>
      </Modal>
    </div>
  );
}
