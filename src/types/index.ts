export interface ServicePreset {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: 'instalacao' | 'manutencao' | 'gas' | 'personalizado';
  icon: 'wrench' | 'wind' | 'flame' | 'snowflake' | 'shield-check';
}

export interface QuoteItem {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  btuCapacity?: string;
  notes?: string;
}

export interface TechnicianProfile {
  companyName: string;
  technicianName: string;
  phone: string;
  documentNumber: string; // CPF or CNPJ
  pixKey: string;
  city: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  items: QuoteItem[];
  discountPercent: number;
  discountAmount: number;
  paymentMethod: string;
  warrantyPeriod: string;
  validityDays: number;
  notes?: string;
  subtotal: number;
  total: number;
}
