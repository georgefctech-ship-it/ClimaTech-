import React, { useState } from 'react';
import {
  FileText,
  Send,
  Copy,
  Check,
  Percent,
  Calculator,
  Download,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface TotalPanelProps {
  subtotal: number;
  total: number;
  totalItemsCount: number;
  discountPercent: number;
  onDiscountPercentChange: (percent: number) => void;
  discountAmount: number;
  onGenerateSummary: () => void;
  onSendWhatsApp: () => void;
  onDownloadPDF?: () => void;
  onCopyOnly: () => void;
  isCopied: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export const TotalPanel: React.FC<TotalPanelProps> = ({
  subtotal,
  total,
  totalItemsCount,
  discountPercent,
  onDiscountPercentChange,
  discountAmount,
  onGenerateSummary,
  onSendWhatsApp,
  onDownloadPDF,
  onCopyOnly,
  isCopied,
  isValid,
  errorMessage,
}) => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl border-2 border-cyan-500/40 p-5 sm:p-6 shadow-xl dark:shadow-2xl shadow-cyan-950/10 dark:shadow-cyan-950/30 space-y-5 relative overflow-hidden transition-colors">
      {/* Ambient background glow */}
      <div className="absolute -right-20 -top-20 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Item Counter */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              Cálculo Automático
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Painel do Orçamento</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Itens selecionados</span>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {totalItemsCount} {totalItemsCount === 1 ? 'aparelho/serviço' : 'aparelhos/serviços'}
          </span>
        </div>
      </div>

      {/* Breakdown: Subtotal & Discount */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal dos Serviços</span>
          <span className="font-mono text-slate-900 dark:text-slate-200 tabular-nums">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Discount section */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDiscountInput(!showDiscountInput)}
            className="text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            <Percent className="w-3 h-3" />
            {discountPercent > 0
              ? `Desconto aplicado (${discountPercent}%)`
              : '+ Adicionar Desconto'}
          </button>

          {discountAmount > 0 && (
            <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm font-medium tabular-nums">
              - {formatCurrency(discountAmount)}
            </span>
          )}
        </div>

        {showDiscountInput && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <span className="text-xs text-slate-700 dark:text-slate-300">Porcentagem:</span>
            <div className="flex items-center gap-1.5">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onDiscountPercentChange(pct)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    discountPercent === pct
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <div className="relative w-16">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) =>
                    onDiscountPercentChange(
                      Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                    )
                  }
                  className="w-full h-7 px-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-mono text-right text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grand Total Highlight Box */}
      <div className="bg-slate-950 rounded-2xl border border-cyan-500/40 p-4 sm:p-5 flex items-center justify-between text-white shadow-inner">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 block mb-0.5">
            Valor Total
          </span>
          <span className="text-xs text-cyan-400 font-medium">À vista ou parcelado</span>
        </div>

        <div className="text-right">
          <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums flex items-center justify-end gap-1">
            <span className="text-cyan-400">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Validation Message if client name or services are missing */}
      {!isValid && errorMessage && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* THE MAIN ACTION BUTTONS */}
      <div className="space-y-3 pt-1">
        {/* Botão 1: Gerar Resumo do Orçamento */}
        <button
          type="button"
          onClick={onGenerateSummary}
          disabled={totalItemsCount === 0}
          className="w-full min-h-[52px] sm:min-h-[56px] px-6 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-950 border border-slate-800 dark:border-slate-700 disabled:opacity-40 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md shadow-black/20 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
        >
          <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="tracking-tight">Gerar Resumo do Orçamento</span>
        </button>

        {/* Botão 2: Copiar e Enviar pelo WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onSendWhatsApp}
            disabled={totalItemsCount === 0}
            className="sm:col-span-3 w-full min-h-[52px] sm:min-h-[56px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/30 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
          >
            <Send className="w-5 h-5 shrink-0" />
            <span className="tracking-tight">Copiar e Enviar no WhatsApp</span>
          </button>

          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={onCopyOnly}
            disabled={totalItemsCount === 0}
            title="Apenas copiar o texto para a área de transferência"
            className="sm:col-span-1 min-h-[52px] sm:min-h-[56px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Direct PDF Download CTA */}
        {onDownloadPDF && (
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={totalItemsCount === 0}
            className="w-full h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800/60 disabled:opacity-40 text-cyan-800 dark:text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Diretamente em PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
