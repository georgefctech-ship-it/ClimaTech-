import { Quote, TechnicianProfile } from '../types';

/**
 * Format a number to Brazilian Real (BRL) currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Clean phone string to only digits
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Apply Brazilian phone mask (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function maskPhone(value: string): string {
  const digits = cleanPhone(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Format date string to Brazilian format
 */
export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Format short date (DD/MM/YYYY)
 */
export function formatShortDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Generate a unique quote reference ID
 */
export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORC-${year}-${random}`;
}

/**
 * Build a structured WhatsApp formatted text for the quote
 */
export function buildWhatsAppMessage(quote: Quote, technician?: TechnicianProfile): string {
  const lines: string[] = [];

  const company = technician?.companyName || 'CLIMATIZAÇÃO & AR-CONDICIONADO';
  const techName = technician?.technicianName ? `Técnico: ${technician.technicianName}` : '';

  lines.push(`❄️ *${company.toUpperCase()}* ❄️`);
  if (techName) lines.push(techName);
  lines.push(`📋 *ORÇAMENTO DE SERVIÇOS* • ${quote.quoteNumber}`);
  lines.push(`📅 Data: ${formatDate(quote.createdAt)}`);
  lines.push('────────────────────────');
  lines.push(`👤 *Cliente:* ${quote.clientName || 'Cliente'}`);
  if (quote.clientAddress) {
    lines.push(`📍 *Local:* ${quote.clientAddress}`);
  }
  lines.push('');
  lines.push('🛠️ *SERVIÇOS SELECIONADOS:*');

  quote.items.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    const btuTag = item.btuCapacity ? ` (${item.btuCapacity})` : '';
    lines.push(
      `${index + 1}. *${item.name}${btuTag}*`
    );
    lines.push(
      `   Qtd: ${item.quantity}x ${formatCurrency(item.unitPrice)} = *${formatCurrency(itemTotal)}*`
    );
    if (item.notes) {
      lines.push(`   Obs: _${item.notes}_`);
    }
  });

  lines.push('────────────────────────');
  if (quote.discountAmount > 0) {
    lines.push(`Subtotal: ${formatCurrency(quote.subtotal)}`);
    lines.push(`Desconto: -${formatCurrency(quote.discountAmount)} (${quote.discountPercent}%)`);
  }
  lines.push(`💰 *VALOR TOTAL: ${formatCurrency(quote.total)}*`);
  lines.push('────────────────────────');

  lines.push(`💳 *Forma de Pagamento:* ${quote.paymentMethod || 'A combinar / Pix'}`);
  lines.push(`🛡️ *Garantia do Serviço:* ${quote.warrantyPeriod || '90 dias'}`);
  lines.push(`⏳ *Validade deste Orçamento:* ${quote.validityDays || 10} dias`);

  if (technician?.pixKey) {
    lines.push(`🔑 *Chave Pix:* \`${technician.pixKey}\``);
  }

  if (quote.notes) {
    lines.push('');
    lines.push(`📝 *Observações:*`);
    lines.push(`${quote.notes}`);
  }

  lines.push('');
  lines.push('Ficamos à disposição para agendamento! Responda esta mensagem para confirmar.');

  return lines.join('\n');
}

/**
 * Generate WhatsApp direct link
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleaned = cleanPhone(phone);
  const encodedText = encodeURIComponent(text);
  
  if (cleaned.length >= 10) {
    // Has area code and phone, prefix with Brazil country code 55 if not present
    const fullNumber = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    return `https://wa.me/${fullNumber}?text=${encodedText}`;
  }
  
  // Generic WhatsApp share URL without specific recipient
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}
