import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Send,
  Check,
  Wrench,
  ShieldCheck,
  CreditCard,
  Calendar,
  User,
  MapPin,
  QrCode,
  FileDown,
} from 'lucide-react';
import { Quote, TechnicianProfile } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateQuotePDF } from '../utils/pdfGenerator';

interface QuoteSummaryModalProps {
  quote: Quote;
  technician: TechnicianProfile;
  isOpen: boolean;
  onClose: () => void;
  onSendWhatsApp: () => void;
  onCopyText: () => void;
  isCopied: boolean;
}

export const QuoteSummaryModal: React.FC<QuoteSummaryModalProps> = ({
  quote,
  technician,
  isOpen,
  onClose,
  onSendWhatsApp,
  onCopyText,
  isCopied,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      generateQuotePDF(quote, technician);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window.print if pdf generation fails
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:text-black">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:bg-white print:text-black">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Resumo do Orçamento</h3>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">#{quote.quoteNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="h-8 px-3 rounded-lg text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Baixar arquivo PDF no seu celular ou computador"
            >
              {pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>{isGeneratingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 text-slate-800 dark:text-slate-100 print:text-black print:overflow-visible print:p-4">
          {/* Company / Technician Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center print:border-slate-800 print:text-slate-900">
                  <Wrench className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase print:text-black">
                  {technician.companyName || 'ClimaTech Climatização'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                {technician.technicianName && `Responsável Técnico: ${technician.technicianName}`}
                {technician.city && ` · ${technician.city}`}
              </p>
              {technician.documentNumber && (
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
                  CNPJ/CPF: {technician.documentNumber}
                </p>
              )}
              {technician.phone && (
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
                  Contato: {technician.phone}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1 print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                Orçamento #{quote.quoteNumber}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Emissão: {formatDate(quote.createdAt)}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Válido por: {quote.validityDays} dias
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 print:bg-slate-50 print:border-slate-300 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 print:text-slate-700 block">
              Dados do Destinatário
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 print:text-slate-700">Cliente:</span>
                <strong className="text-slate-900 dark:text-white print:text-black">
                  {quote.clientName || 'Cliente não informado'}
                </strong>
              </div>

              {quote.clientPhone && (
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-600 dark:text-slate-300 print:text-slate-700">WhatsApp:</span>
                  <strong className="text-slate-900 dark:text-white print:text-black">{quote.clientPhone}</strong>
                </div>
              )}

              {quote.clientAddress && (
                <div className="sm:col-span-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300 print:text-slate-700">Local:</span>
                  <span className="text-slate-800 dark:text-slate-200 print:text-slate-900">{quote.clientAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-slate-700">
              Discriminação dos Serviços
            </h4>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border-slate-300">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-400 print:bg-slate-100 print:text-slate-700 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Serviço / Descrição</th>
                    <th className="py-2.5 px-2 text-center font-semibold">Qtd</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Valor Unit.</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 print:divide-slate-200 font-mono">
                  {quote.items.map((item, idx) => {
                    const lineTotal = item.unitPrice * item.quantity;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 print:hover:bg-transparent">
                        <td className="py-3 px-3">
                          <div className="font-sans font-semibold text-slate-900 dark:text-white print:text-black">
                            {item.name}
                          </div>
                          {item.btuCapacity && (
                            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 print:text-slate-600 font-sans">
                              Capacidade: {item.btuCapacity}
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 italic font-sans">
                              Obs: {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center text-slate-700 dark:text-slate-300 print:text-black">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 print:text-black">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white print:text-black">
                          {formatCurrency(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 print:text-slate-700">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 print:text-slate-800" />
                <span>
                  <strong>Condição:</strong> {quote.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 print:text-slate-800" />
                <span>
                  <strong>Garantia:</strong> {quote.warrantyPeriod}
                </span>
              </div>

              {technician.pixKey && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase font-bold">
                      Chave Pix para Pagamento
                    </span>
                    <span className="font-mono text-xs text-slate-900 dark:text-white print:text-black truncate block">
                      {technician.pixKey}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1.5 font-mono text-right">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>

              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 print:text-slate-800">
                  <span>Desconto ({quote.discountPercent}%):</span>
                  <span>- {formatCurrency(quote.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base sm:text-lg font-bold text-slate-900 dark:text-white print:text-black pt-2 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
                <span className="font-sans">VALOR TOTAL:</span>
                <span className="text-cyan-600 dark:text-cyan-400 print:text-black">{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Terms Footer / Signature line for print */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 print:border-slate-300 text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 space-y-4">
            <p>
              * O serviço inclui mão de obra qualificada, ferramentas especializadas e teste
              operacional. Não nos responsabilizamos por infraestrutura elétrica pré-existente
              inadequada no imóvel.
            </p>

            <div className="hidden print:flex items-center justify-between pt-12 text-center text-xs">
              <div className="w-56 border-t border-black pt-1">
                Assinatura do Técnico
              </div>
              <div className="w-56 border-t border-black pt-1">
                De Acordo do Cliente
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons in Modal Bottom (Hidden in Print) */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Download PDF CTA */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial h-11 px-4 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Arquivo PDF'}</span>
            </button>

            {/* Copy Text CTA */}
            <button
              type="button"
              onClick={onCopyText}
              className="flex-1 sm:flex-initial h-11 px-3.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto h-11 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={onSendWhatsApp}
              className="flex-1 sm:flex-initial h-11 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
