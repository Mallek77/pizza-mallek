'use client';

import { useState, useEffect } from 'react';
import { Locale, getDict, dir } from '@/lib/i18n';

interface CustomizationDrawerProps {
  locale: Locale;
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  orderType?: string;
  timeSlot?: string;
}

export default function CustomizationDrawer({ 
  locale, 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  orderType,
  timeSlot
}: CustomizationDrawerProps) {
  const dict = getDict(locale);
  const direction = dir[locale];
  const [selectedVariant, setSelectedVariant] = useState<any>(product?.variants?.[0] || null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, number>>>({});
  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (product) {
      setCurrentStep(0);
      setSelectedOptions({});
      setQuantity(1);
      setSelectedVariant(product.variants?.[0] || null);
    }
  }, [product?.id, isOpen]);

  if (!isOpen || !product) return null;

  const optionGroups = product.optionGroups || [];
  const hasVariants = product.variants && product.variants.length > 0;
  
  const steps = [
    ...(hasVariants ? ['variant'] : []),
    ...optionGroups.map((_g: any, i: number) => `option-${i}`),
    'drinks',
    'quantity',
  ];

  const currentStepKey = steps[currentStep];
  const isVariantStep = currentStepKey === 'variant';
  const isDrinkStep = currentStepKey === 'drinks';
  const isQuantityStep = currentStepKey === 'quantity';
  const currentOptionGroupIndex = (isVariantStep || isQuantityStep) ? -1 : parseInt(currentStepKey.replace('option-', ''));
  const currentOptionGroup = currentOptionGroupIndex >= 0 ? optionGroups[currentOptionGroupIndex] : null;

  const basePrice = selectedVariant?.price_override || product.base_price;
  const optionsPrice = Object.entries(selectedOptions).reduce((sum, [groupId, quantities]) => {
    const group = product.optionGroups?.find((g: any) => g.id === groupId);
    if (!group) return sum;
    return sum + Object.entries(quantities).reduce((v, [optId, qty]) => {
      const opt = group.options?.find((o: any) => o.id === optId);
      return v + (opt?.price_supplement || 0) * qty;
    }, 0);
  }, 0);

  const unitPrice = basePrice + optionsPrice;
  const total = unitPrice * quantity;

  const incrementOption = (groupId: string, optId: string) => {
    setSelectedOptions(prev => {
      const groupQuantities = prev[groupId] || {};
      const currentQty = groupQuantities[optId] || 0;
      const group = product.optionGroups?.find((g: any) => g.id === groupId);
      const opt = group?.options?.find((o: any) => o.id === optId);
      const maxSelections = group?.max_selections || 999;
      
      if (currentQty >= maxSelections) return prev;
      
      return {
        ...prev,
        [groupId]: {
          ...groupQuantities,
          [optId]: currentQty + 1
        }
      };
    });
  };

  const decrementOption = (groupId: string, optId: string) => {
    setSelectedOptions(prev => {
      const groupQuantities = prev[groupId] || {};
      const currentQty = groupQuantities[optId] || 0;
      
      if (currentQty <= 0) return prev;
      
      const newQuantities = { ...groupQuantities };
      if (currentQty === 1) {
        delete newQuantities[optId];
      } else {
        newQuantities[optId] = currentQty - 1;
      }
      
      return {
        ...prev,
        [groupId]: newQuantities
      };
    });
  };

  const getOptionQuantity = (groupId: string, optId: string) => {
    return selectedOptions[groupId]?.[optId] || 0;
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const incrementDrink = (drinkId: string) => {
    setSelectedDrinks(prev => ({
      ...prev,
      [drinkId]: (prev[drinkId] || 0) + 1
    }));
  };

  const decrementDrink = (drinkId: string) => {
    setSelectedDrinks(prev => {
      const currentQty = prev[drinkId] || 0;
      if (currentQty <= 0) return prev;
      const newDrinks = { ...prev };
      if (currentQty === 1) {
        delete newDrinks[drinkId];
      } else {
        newDrinks[drinkId] = currentQty - 1;
      }
      return newDrinks;
    });
  };

  const getDrinkQuantity = (drinkId: string) => {
    return selectedDrinks[drinkId] || 0;
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    goNext();
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={`fixed inset-0 z-50 flex ${isOpen ? 'flex' : 'hidden'}`} dir={direction}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 bg-bg-card flex flex-col animate-slide-up w-full max-w-2xl mx-auto" dir={direction}>
        <div className="sticky top-0 bg-bg-card border-b border-border-subtle p-4 flex items-center justify-between z-10">
          <button 
            onClick={isFirstStep ? onClose : goPrev}
            className="text-text-muted text-2xl p-2 -ml-2" 
            aria-label={isFirstStep ? dict.remove : dict.remove}
          >
            {isFirstStep ? '×' : '←'}
          </button>
          <div className="flex-1 text-center px-8">
            <h3 className="font-bold text-text-cream truncate">{product.translationKey ? dict[product.translationKey] || product.displayName : product.displayName}</h3>
            <div className="flex justify-center gap-1 mt-1">
              {steps.map((_step, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-accent-orange' : 'bg-border-subtle'
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted text-2xl p-2 -mr-2" aria-label={dict.remove}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6" dir={direction}>
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-56 object-cover rounded-2xl"
            />
            {selectedVariant && (
              <div className="absolute bottom-3 right-3 bg-accent-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                {dict[selectedVariant.name.toLowerCase() as keyof typeof dict] || selectedVariant.name}
              </div>
            )}
          </div>

          {isVariantStep && (
            <div className="space-y-4">
              <h4 className="text-text-muted text-sm font-medium">{dict.size}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants?.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v)}
                    className={`p-4 rounded-2xl text-center transition-all min-h-[100px] flex flex-col items-center justify-center ${
                      selectedVariant?.id === v.id
                        ? 'bg-accent-orange text-white border-2 border-accent-orange'
                        : 'bg-bg-secondary text-text-cream border-2 border-border-subtle hover:border-accent-orange'
                    }`}
                  >
                    <span className="text-lg font-bold">
                      {dict[v.name.toLowerCase() as keyof typeof dict] || v.name}
                    </span>
                    <span className="text-sm mt-1 opacity-80">
                      {v.price_override ? `${v.price_override} DA` : `${product.base_price} DA`}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={goNext}
                className="w-full btn-primary py-3 text-lg mt-4"
                disabled={!selectedVariant}
              >
                {isLastStep ? dict.addToCart : `${dict.addToCart} →`}
              </button>
            </div>
          )}

          {currentOptionGroup && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-text-cream text-lg font-bold">
                  {currentOptionGroup.translationKey ? dict[currentOptionGroup.translationKey] : currentOptionGroup.name}
                </h4>
                <span className="text-text-muted text-sm">
                  {dict.quantity}: {currentStep} / {steps.length}
                </span>
              </div>

              <div className="space-y-3">
                {currentOptionGroup.options?.map((opt: any) => {
                  const qty = getOptionQuantity(currentOptionGroup.id, opt.id);
                  const isRequired = currentOptionGroup.is_required && qty === 0;
                  
                  return (
                    <div
                      key={opt.id}
                      className="bg-bg-secondary rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-text-cream truncate">
                            {opt.translationKey ? dict[opt.translationKey] : opt.name}
                          </span>
                          {opt.price_supplement > 0 && (
                            <span className="text-accent-cheese text-sm font-bold whitespace-nowrap">
                              +{opt.price_supplement} DA/unité
                            </span>
                          )}
                        </div>
                        {opt.price_supplement > 0 && qty > 0 && (
                          <div className="text-xs text-text-muted mt-1">
                            {dict.total}: {opt.price_supplement * qty} DA
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => decrementOption(currentOptionGroup.id, opt.id)}
                          className="w-12 h-12 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold touch-target"
                          disabled={qty <= 0}
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <div className="w-16 text-center">
                          <span className="text-2xl font-bold text-text-cream">{qty}</span>
                        </div>
                        <button
                          onClick={() => incrementOption(currentOptionGroup.id, opt.id)}
                          className="w-12 h-12 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold touch-target"
                          disabled={
                            currentOptionGroup.max_selections > 0 && 
                            Object.values(selectedOptions[currentOptionGroup.id] || {}).reduce((a, b) => a + b, 0) >= currentOptionGroup.max_selections
                          }
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={goPrev}
                  className="flex-1 btn-secondary py-3"
                  disabled={isFirstStep}
                >
                  ← {dict.remove}
                </button>
                <button
                  onClick={goNext}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                    isLastStep
                      ? 'bg-accent-cheese text-bg-primary'
                      : 'bg-accent-orange text-white hover:bg-accent-tomato'
                  }`}
                >
                  {isLastStep ? dict.addToCart : 'Suivant →'}
                </button>
              </div>
            </div>
          )}

          {isDrinkStep && product.drinks && product.drinks.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-text-muted text-sm font-medium">{dict.drinks || 'Boissons'}</h4>
              <div className="space-y-3">
                {product.drinks.map((drink: any) => {
                  const qty = getDrinkQuantity(drink.id);
                  return (
                    <div
                      key={drink.id}
                      className="bg-bg-secondary rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-text-cream truncate">
                            {drink.translationKey ? dict[drink.translationKey] : drink.name}
                          </span>
                          {drink.price > 0 && (
                            <span className="text-accent-cheese text-sm font-bold whitespace-nowrap">
                              +{drink.price} DA/unité
                            </span>
                          )}
                        </div>
                        {drink.price > 0 && qty > 0 && (
                          <div className="text-xs text-text-muted mt-1">
                            {dict.total}: {drink.price * qty} DA
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => decrementDrink(drink.id)}
                          className="w-12 h-12 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold touch-target"
                          disabled={qty <= 0}
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <div className="w-16 text-center">
                          <span className="text-2xl font-bold text-text-cream">{qty}</span>
                        </div>
                        <button
                          onClick={() => incrementDrink(drink.id)}
                          className="w-12 h-12 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold touch-target"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={goPrev}
                  className="flex-1 btn-secondary py-3"
                  disabled={isFirstStep}
                >
                  ← {dict.remove}
                </button>
                <button
                  onClick={goNext}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                    isLastStep
                      ? 'bg-accent-cheese text-bg-primary'
                      : 'bg-accent-orange text-white hover:bg-accent-tomato'
                  }`}
                >
                  {isLastStep ? dict.addToCart : 'Suivant →'}
                </button>
              </div>
            </div>
          )}

          {isQuantityStep && (
            <div className="space-y-4">
              <h4 className="text-text-muted text-sm font-medium">{dict.quantity}</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold"
                >−</button>
                <span className="text-3xl font-bold text-text-cream min-w-[4rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 rounded-xl bg-accent-orange text-white flex items-center justify-center text-2xl font-bold"
                >+</button>
              </div>

              <div className="bg-bg-secondary rounded-2xl p-4 flex items-center justify-between border border-accent-cheese/30">
                <span className="text-text-muted">{dict.total}</span>
                <span className="text-3xl font-bold text-accent-cheese">{total} <span className="text-base">DA</span></span>
              </div>

              <button
                onClick={() => {
                  onAddToCart({ product, variant: selectedVariant, options: selectedOptions, quantity, unitPrice, orderType, timeSlot });
                  onClose();
                }}
                className="w-full btn-primary py-4 text-xl"
              >
                {dict.addToCart} — {total} DA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}