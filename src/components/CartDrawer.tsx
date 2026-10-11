'use client';

import { Locale, getDict } from '@/lib/i18n';

interface CartDrawerProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ locale, isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const dict = getDict(locale);
  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-bg-card shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-bg-card border-b border-border-subtle p-3 sm:p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-cream">{dict.cart}</h3>
          <button onClick={onClose} className="text-text-muted text-2xl p-2 -mr-2 -mt-1" aria-label={dict.remove}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3">PANIER</div>
              <p className="text-text-muted text-sm">{dict.cartEmpty}</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="bg-bg-secondary rounded-xl p-3 flex gap-3">
                <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-text-cream text-sm truncate">{item.product.name}</h4>
                  <p className="text-accent-cheese text-sm font-bold">{item.unitPrice} DA</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-accent-orange text-white flex items-center justify-center text-sm font-bold"
                    >-</button>
                    <span className="text-text-cream text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-accent-orange text-white flex items-center justify-center text-sm font-bold"
                    >+</button>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="ml-auto text-accent-tomato text-xs sm:text-sm"
                    >{dict.remove}</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-bg-card border-t border-border-subtle p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">{dict.cartTotal}</span>
              <span className="text-2xl sm:text-3xl font-bold text-accent-cheese">{total} <span className="text-base">DA</span></span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-3.5 sm:py-4 text-lg"
            >
              {dict.checkout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}