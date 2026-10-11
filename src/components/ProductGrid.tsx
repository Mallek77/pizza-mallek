'use client';

import { useState } from 'react';
import { Locale, getDict, dir } from '@/lib/i18n';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import CustomizationDrawer from '@/components/CustomizationDrawer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import { useCart } from '@/context/CartContext';

interface ProductGridProps {
  locale: Locale;
  orderType: string;
  timeSlot: string;
}

const categoryOrder = [
  { key: 'pizzas', label: 'pizzas' },
  { key: 'burgers', label: 'burgers' },
  { key: 'sandwiches', label: 'sandwiches' },
  { key: 'paninis', label: 'paninis' },
  { key: 'sides', label: 'sides' },
  { key: 'drinks', label: 'drinks' },
];

export default function ProductGrid({ locale, orderType, timeSlot }: ProductGridProps) {
  const dict = getDict(locale);
  const direction = dir[locale];
  const { cart, isCartOpen, addToCart, updateQuantity, removeItem, clearCart, openCart, closeCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCartClick = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    setIsDrawerOpen(false);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
    closeCart();
  };

  const handleConfirmOrder = () => {
    closeCart();
    setIsCheckoutOpen(false);
  };

  const productsByCategory = categoryOrder.map(({ key, label }) => {
    const categoryProducts = products.filter(p => p.category === key);
    if (categoryProducts.length === 0) return null;
    return {
      key,
      label: dict[label as keyof typeof dict] || label,
      products: categoryProducts,
    };
  }).filter(Boolean);

  return (
    <>
      <style jsx>{`
        .category-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1400px) {
          .category-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .category-grid > * {
          container-name: product-card;
          container-type: inline-size;
        }
        .category-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .category-divider {
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
        }
      `}</style>

      <div className="space-y-8 pb-10" dir={direction}>
        {productsByCategory.map((cat: any) => (
          <section key={cat.key} className="space-y-4">
            <header className="category-header px-1">
              <span className="text-text-muted text-xs uppercase tracking-wider font-medium">
                {cat.label}
              </span>
              <div className="category-divider" />
            </header>
            <div className="category-grid">
              {cat.products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  locale={locale}
                  product={{
                    ...product,
                    price: product.base_price,
                  }}
                  onAddToCart={handleAddToCartClick}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CustomizationDrawer
        locale={locale}
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddToCart={handleAddToCart}
        orderType={orderType}
        timeSlot={timeSlot}
      />

      <CartDrawer
        locale={locale}
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        locale={locale}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        orderType={orderType}
        timeSlot={timeSlot}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
}