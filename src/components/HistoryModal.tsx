import React, { useState } from 'react';
import { X, Search, Trash2, ArrowUpRight, Send, Clock, User, Download } from 'lucide-react';
import { Quote, TechnicianProfile } from '../types';
import { formatCurrency, formatDate, getWhatsAppUrl, buildWhatsAppMessage } from '../utils/formatters';
import { generateQuotePDF } from '../utils/pdfGenerator';

interface HistoryModalProps {
  quotes: Quote[];
  technician: TechnicianProfile;
  isOpen: boolean;
  onClose: () => void;
  onLoadQuote: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  quotes,
  technician,
  isOpen,
  onClose,
  onLoadQuote,
  onDeleteQuote,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = quotes.filter((q) =>
    (q.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDirectWhatsApp = (quote: Quote) => {
    const text = buildWhatsAppMessage(quote, technician);
    const url = getWhatsAppUrl(quote.clientPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectDownloadPDF = (quote: Quote) => {
    try {
      generateQuotePDF(quote, technician);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Histórico de Orçamentos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {quotes.length} {quotes.length === 1 ? 'orçamento salvo' : 'orçamentos salvos'} neste dispositivo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {quotes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza que deseja apagar todo o histórico de orçamentos?')) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2 py-1 cursor-pointer"
              >
                Limpar Todos
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome do cliente ou número do orçamento..."
              className="w-full h-10 pl-9 pr-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Quotes List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
              Nenhum orçamento encontrado no histórico.
            </div>
          ) : (
            filtered.map((quote) => (
              <div
                key={quote.id}
                className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        #{quote.quoteNumber}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(quote.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {quote.clientName || 'Cliente não informado'}
                    </h4>

                    {quote.clientPhone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{quote.clientPhone}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Total
                    </span>
                    <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(quote.total)}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quote.items.map((it, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {it.quantity}x {it.name}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => onDeleteQuote(quote.id)}
                    className="h-8 px-2.5 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Excluir do histórico"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectDownloadPDF(quote)}
                    className="h-8 px-2.5 rounded-lg text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Baixar PDF deste orçamento"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectWhatsApp(quote)}
                    className="h-8 px-3 rounded-lg text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadQuote(quote);
                      onClose();
                    }}
                    className="h-8 px-3 rounded-lg text-white dark:text-slate-950 bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Carregar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
