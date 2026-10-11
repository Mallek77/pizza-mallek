'use client';

import { useState } from 'react';
import { Locale, getDict } from '@/lib/i18n';

interface CheckoutModalProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  orderType: string;
  timeSlot: string;
  onConfirm: () => void;
}

const RESTAURANT_PHONE = '+2135XXXXXXXX';
const RESTAURANT_NAME = 'Mc Mallek';
const RESTAURANT_ADDRESS = 'Draâ Ben Khedda, Tizi Ouzou, Algérie';

export default function CheckoutModal({
  locale,
  isOpen,
  onClose,
  cart,
  orderType,
  timeSlot,
  onConfirm
}: CheckoutModalProps) {
  const dict = getDict(locale);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [sendMethod, setSendMethod] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isTakeaway = orderType === 'emporter';
  const isDineIn = orderType === 'sur-place';

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const formatOrderForMessage = () => {
    const lines = [
      `🍕 *${RESTAURANT_NAME} - Nouvelle commande*`,
      '',
      `📋 *${dict.orderDetails}:*`,
    ];

    cart.forEach((item, index) => {
      const variantText = item.variant ? ` (${dict[item.variant.name.toLowerCase() as keyof typeof dict] || item.variant.name})` : '';
      lines.push(`${index + 1}. ${item.product.name}${variantText} x${item.quantity} - ${item.unitPrice * item.quantity} DA`);
      
      if (item.options) {
        Object.entries(item.options).forEach(([groupId, quantities]) => {
          const group = item.product.optionGroups?.find((g: any) => g.id === groupId);
          if (group) {
            Object.entries(quantities as Record<string, number>).forEach(([optId, qty]) => {
              const opt = group.options?.find((o: any) => o.id === optId);
              if (opt && qty > 0) {
                lines.push(`   + ${opt.name} x${qty} (+${opt.price_supplement * qty} DA)`);
              }
            });
          }
        });
      }
    });

    lines.push('');
    lines.push(`💰 *${dict.total}: ${total} DA*`);
    lines.push('');

    if (isTakeaway) {
      lines.push(`📦 *${dict.orderTypeLabel}: ${dict.takeawayTitle}*`);
    } else {
      lines.push(`🍽️ *${dict.orderTypeLabel}: ${dict.dineTitle}*`);
      lines.push(`⏰ *${dict.timeSlotLabel}: ${timeSlot} min*`);
    }

    lines.push('');
    lines.push(`👤 *${dict.customerInfo}:*`);
    lines.push(`${dict.name}: ${customerName || 'Non fourni'}`);
    lines.push(`${dict.phoneLabel}: ${customerPhone || 'Non fourni'}`);
    
    if (customerAddress) {
      lines.push(`${dict.address}: ${customerAddress}`);
    }

    return lines.join('\n');
  };

  const sendSms = () => {
    const message = formatOrderForMessage();
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = `sms:${RESTAURANT_PHONE}?body=${encodedMessage}`;
    window.location.href = smsUrl;
  };

  const sendWhatsapp = () => {
    const message = formatOrderForMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(dict.error);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isTakeaway) {
        if (sendMethod === 'sms') {
          sendSms();
        } else {
          sendWhatsapp();
        }
      }
      setShowSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 2000);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-bg-card rounded-3xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-bg-card border-b border-border-subtle p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-cream">{dict.confirmOrder}</h3>
          <button onClick={onClose} className="text-text-muted text-2xl p-2">×</button>
        </div>

        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-accent-cheese/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-accent-cheese" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-text-cream mb-2">{dict.orderSent}</h4>
            <p className="text-text-muted">{isTakeaway ? 'Votre commande a été envoyée au restaurant' : 'Votre table est réservée'}</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="bg-bg-secondary rounded-2xl p-4">
              <h4 className="font-bold text-text-cream mb-3">{dict.orderDetails}</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-text-cream">{item.product.name} x{item.quantity}</span>
                    <span className="text-accent-cheese">{item.unitPrice * item.quantity} DA</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border-subtle mt-3 pt-3 flex justify-between font-bold">
                <span className="text-text-cream">{dict.total}</span>
                <span className="text-accent-cheese">{total} DA</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-text-cream">{dict.customerInfo}</h4>
              
              <input
                type="text"
                placeholder={dict.name}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-cream placeholder-text-muted focus:border-accent-orange focus:outline-none"
                autoFocus
              />
              
              <input
                type="tel"
                placeholder={dict.phoneLabel}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-cream placeholder-text-muted focus:border-accent-orange focus:outline-none"
              />

              {isTakeaway && (
                <input
                  type="text"
                  placeholder={dict.address}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-subtle rounded-xl px-4 py-3 text-text-cream placeholder-text-muted focus:border-accent-orange focus:outline-none"
                />
              )}
            </div>

            <div className="bg-bg-secondary rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isTakeaway ? 'bg-accent-orange/20' : 'bg-accent-cheese/20'}`}>
                  <span className="text-xl">{isTakeaway ? '📦' : '🍽️'}</span>
                </div>
                <div>
                  <p className="font-medium text-text-cream">
                    {isTakeaway ? dict.takeawayTitle : dict.dineTitle}
                  </p>
                  {!isTakeaway && (
                    <p className="text-text-muted text-sm">
                      {dict.timeSlotLabel}: {timeSlot} min
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isTakeaway && (
              <div className="space-y-3">
                <h4 className="font-bold text-text-cream">Envoyer la commande</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSendMethod('whatsapp')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                      sendMethod === 'whatsapp'
                        ? 'bg-green-600 text-white'
                        : 'bg-bg-secondary text-text-cream border border-border-subtle'
                    }`}
                  >
                    💬 {dict.sendWhatsapp}
                  </button>
                  <button
                    onClick={() => setSendMethod('sms')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                      sendMethod === 'sms'
                        ? 'bg-blue-600 text-white'
                        : 'bg-bg-secondary text-text-cream border border-border-subtle'
                    }`}
                  >
                    📱 {dict.sendSms}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !customerName.trim() || !customerPhone.trim()}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? dict.loading : isTakeaway ? `${dict.sendWhatsapp} / ${dict.sendSms}` : dict.confirmOrder}
            </button>

            <button
              onClick={onClose}
              className="w-full btn-secondary py-3"
              disabled={isSubmitting}
            >
              {dict.cancel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}