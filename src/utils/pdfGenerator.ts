import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote, TechnicianProfile } from '../types';
import { formatCurrency, formatDate } from './formatters';

export function generateQuotePDF(quote: Quote, technician?: TechnicianProfile): void {
  // Create jsPDF document in A4 portrait format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Colors
  const primaryColor: [number, number, number] = [8, 145, 178]; // cyan-600
  const darkTextColor: [number, number, number] = [15, 23, 42]; // slate-900
  const mutedTextColor: [number, number, number] = [100, 116, 139]; // slate-500
  const lightBgColor: [number, number, number] = [248, 250, 252]; // slate-50

  // 1. Header background banner
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(margin, 12, pageWidth - margin * 2, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 12, pageWidth - margin * 2, 28, 3, 3, 'S');

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  const companyName = (technician?.companyName || 'CLIMATECH CLIMATIZAÇÃO').toUpperCase();
  doc.text(companyName, margin + 4, 20);

  // Technician details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedTextColor);
  let techDetails = [];
  if (technician?.technicianName) techDetails.push(`Técnico: ${technician.technicianName}`);
  if (technician?.phone) techDetails.push(`Tel/WhatsApp: ${technician.phone}`);
  if (technician?.city) techDetails.push(`Local: ${technician.city}`);
  if (technician?.documentNumber) techDetails.push(`CNPJ/CPF: ${technician.documentNumber}`);

  doc.text(techDetails.slice(0, 2).join('  |  '), margin + 4, 26);
  if (techDetails.length > 2) {
    doc.text(techDetails.slice(2).join('  |  '), margin + 4, 32);
  }

  // Quote info right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkTextColor);
  doc.text(`ORÇAMENTO #${quote.quoteNumber}`, pageWidth - margin - 4, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedTextColor);
  doc.text(`Emissão: ${formatDate(quote.createdAt)}`, pageWidth - margin - 4, 26, { align: 'right' });
  doc.text(`Validade: ${quote.validityDays} dias`, pageWidth - margin - 4, 32, { align: 'right' });

  // 2. Client Card
  const clientCardY = 44;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, clientCardY, pageWidth - margin * 2, 22, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, clientCardY, pageWidth - margin * 2, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('DADOS DO CLIENTE / LOCAL DE ATENDIMENTO', margin + 4, clientCardY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkTextColor);
  doc.text(`Cliente: ${quote.clientName || 'Cliente não informado'}`, margin + 4, clientCardY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedTextColor);
  const phoneText = quote.clientPhone ? `WhatsApp: ${quote.clientPhone}` : '';
  const addressText = quote.clientAddress ? `Endereço: ${quote.clientAddress}` : '';

  if (phoneText && addressText) {
    doc.text(`${phoneText}   |   ${addressText}`, margin + 4, clientCardY + 17);
  } else if (phoneText || addressText) {
    doc.text(phoneText || addressText, margin + 4, clientCardY + 17);
  } else {
    doc.text('Atendimento local agendado conforme necessidade', margin + 4, clientCardY + 17);
  }

  // 3. Services Table via autoTable
  const tableRows = quote.items.map((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    let desc = item.name;
    if (item.btuCapacity) desc += ` (${item.btuCapacity})`;
    if (item.notes) desc += `\nObs: ${item.notes}`;

    return [
      (index + 1).toString(),
      desc,
      `${item.quantity}`,
      formatCurrency(item.unitPrice),
      formatCurrency(itemTotal),
    ];
  });

  autoTable(doc, {
    startY: 70,
    margin: { left: margin, right: margin },
    head: [['#', 'Serviço / Descrição do Trabalho', 'Qtd', 'Valor Unit.', 'Total']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 3.5,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 3.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Position after table
  const finalY = (doc as any).lastAutoTable?.finalY || 140;

  // 4. Financial Summary & Conditions (side-by-side or stacked)
  const totalsY = finalY + 8;
  const colWidth = (pageWidth - margin * 2) / 2;

  // Left column: Payment & Warranty
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(margin, totalsY, colWidth - 4, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, totalsY, colWidth - 4, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('CONDIÇÕES COMERCIAIS & GARANTIA', margin + 4, totalsY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkTextColor);
  doc.text(`• Forma de Pagamento: ${quote.paymentMethod}`, margin + 4, totalsY + 12);
  doc.text(`• Garantia do Serviço: ${quote.warrantyPeriod}`, margin + 4, totalsY + 17);
  doc.text(`• Validade da Proposta: ${quote.validityDays} dias`, margin + 4, totalsY + 22);

  if (technician?.pixKey) {
    doc.setFont('helvetica', 'bold');
    doc.text(`• Chave Pix: ${technician.pixKey}`, margin + 4, totalsY + 28);
  }

  // Right column: Financial Totals
  const rightX = margin + colWidth + 4;
  doc.setFillColor(...lightBgColor);
  doc.roundedRect(rightX, totalsY, colWidth - 4, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightX, totalsY, colWidth - 4, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('Subtotal:', rightX + 4, totalsY + 8);
  doc.text(formatCurrency(quote.subtotal), pageWidth - margin - 4, totalsY + 8, { align: 'right' });

  if (quote.discountAmount > 0) {
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text(`Desconto (${quote.discountPercent}%):`, rightX + 4, totalsY + 15);
    doc.text(`- ${formatCurrency(quote.discountAmount)}`, pageWidth - margin - 4, totalsY + 15, { align: 'right' });
  }

  // Grand Total Highlight
  doc.setFillColor(8, 145, 178); // cyan-600
  doc.roundedRect(rightX + 2, totalsY + 22, colWidth - 8, 13, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('VALOR TOTAL:', rightX + 6, totalsY + 30);
  doc.setFontSize(11);
  doc.text(formatCurrency(quote.total), pageWidth - margin - 6, totalsY + 30, { align: 'right' });

  // 5. Terms & Signatures
  const termsY = totalsY + 44;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  const termsText =
    'Nota: O serviço inclui teste de estanqueidade, verificação elétrica e funcionamento operacional. Infraestruturas elétricas pré-existentes são de responsabilidade do contratante.';
  doc.text(termsText, margin, termsY, { maxWidth: pageWidth - margin * 2 });

  // Signatures
  const sigY = pageHeight - 22;
  const sigWidth = 65;

  doc.setDrawColor(148, 163, 184);
  doc.line(margin, sigY, margin + sigWidth, sigY);
  doc.line(pageWidth - margin - sigWidth, sigY, pageWidth - margin, sigY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkTextColor);
  doc.text('Assinatura do Técnico', margin + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.text('De Acordo do Cliente', pageWidth - margin - sigWidth / 2, sigY + 4, { align: 'center' });

  // Save / Trigger Download directly
  const safeClient = (quote.clientName || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Orcamento_${quote.quoteNumber}_${safeClient}.pdf`;
  doc.save(filename);
}
