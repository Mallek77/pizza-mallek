export function validateAlgerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  
  const algerianPatterns = [
    /^\+213[567]\d{8}$/,
    /^0[567]\d{8}$/,
    /^213[567]\d{8}$/,
  ];
  
  return algerianPatterns.some(pattern => pattern.test(cleaned));
}

export function formatAlgerianPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  
  if (cleaned.startsWith('+213')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('0')) {
    return '+213' + cleaned.slice(1);
  }
  
  if (cleaned.startsWith('213')) {
    return '+' + cleaned;
  }
  
  if (/^[567]\d{8}$/.test(cleaned)) {
    return '+213' + cleaned;
  }
  
  return cleaned;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCheckoutForm(
  locale: string,
  dict: Record<string, string>,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  orderType: string
): ValidationResult {
  const errors: string[] = [];
  
  if (!validateRequired(customerName)) {
    errors.push(dict.name + ' ' + (locale === 'ar' ? 'مطلوب' : locale === 'en' ? 'is required' : 'est requis'));
  }
  
  if (!validateRequired(customerPhone)) {
    errors.push(dict.phoneLabel + ' ' + (locale === 'ar' ? 'مطلوب' : locale === 'en' ? 'is required' : 'est requis'));
  } else if (!validateAlgerianPhone(customerPhone)) {
    errors.push(locale === 'ar' 
      ? 'رقم الهاتف غير صحيح (مثال: 05XXXXXXXX)' 
      : locale === 'en' 
        ? 'Invalid phone number (e.g., 05XXXXXXXX)' 
        : 'Numéro invalide (ex: 05XXXXXXXX)');
  }
  
  const isTakeaway = orderType === 'emporter';
  if (isTakeaway && !validateRequired(customerAddress)) {
    errors.push(dict.address + ' ' + (locale === 'ar' ? 'مطلوب' : locale === 'en' ? 'is required' : 'est requis'));
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}