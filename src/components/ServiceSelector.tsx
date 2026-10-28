import React, { useState } from 'react';
import {
  Wrench,
  Snowflake,
  Wind,
  Plus,
  Minus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { QuoteItem } from '../types';
import { BTU_OPTIONS } from '../data/services';
import { formatCurrency } from '../utils/formatters';

interface ServiceSelectorProps {
  items: QuoteItem[];
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onUpdateItem: (serviceId: string, updates: Partial<QuoteItem>) => void;
  onAddCustomItem: (name: string, price: number, quantity: number) => void;
  onRemoveItem: (serviceId: string) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  items,
  onUpdateQuantity,
  onUpdateItem,
  onAddCustomItem,
  onRemoveItem,
}) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(150);
  const [customQty, setCustomQty] = useState<number>(1);

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddCustomItem(customName.trim(), Number(customPrice) || 0, Math.max(1, customQty));
    setCustomName('');
    setCustomPrice(150);
    setCustomQty(1);
    setShowCustomModal(false);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'instalacao':
        return <Wrench className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      case 'manutencao':
        return <Snowflake className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'gas':
        return <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Serviços e Quantidades
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Use os botões grandes para ajustar a quantidade de cada serviço
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="h-9 px-3 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:text-cyan-950 dark:hover:text-white bg-cyan-50 dark:bg-slate-900 hover:bg-cyan-100 dark:hover:bg-slate-800 border border-cyan-200 dark:border-cyan-800/60 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Outro Serviço</span>
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = item.quantity > 0;
          const isExpanded = !!expandedDetails[item.id];
          const itemTotal = item.unitPrice * item.quantity;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-slate-900/95 border-cyan-500 shadow-md shadow-cyan-500/10 dark:shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {/* Main Card Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Info Column */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-600/50'
                        : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {getServiceIcon(item.serviceId)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                        {item.name}
                      </h3>
                      {item.btuCapacity && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
                          {item.btuCapacity}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Preço unitário:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 truncate">
                        Obs: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Big Button Quantity Stepper */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
                  {/* Total for this line */}
                  <div className="text-left md:text-right pr-2">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Subtotal
                    </span>
                    <span
                      className={`font-mono text-base sm:text-lg font-bold tabular-nums ${
                        isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>

                  {/* Big Stepper Buttons */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700/80 p-1">
                    {/* Minus Button */}
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      disabled={item.quantity === 0}
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 text-slate-800 dark:text-white flex items-center justify-center transition-colors active:scale-95 touch-manipulation cursor-pointer disabled:cursor-not-allowed shadow-xs"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    {/* Numeric Input */}
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(item.id, Math.max(0, parseInt(e.target.value) || 0))
                      }
                      aria-label={`Quantidade de ${item.name}`}
                      className="w-14 h-12 bg-transparent text-center font-mono text-lg font-bold text-slate-900 dark:text-white focus:outline-none tabular-nums"
                    />

                    {/* Plus Button */}
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Aumentar quantidade de ${item.name}`}
                      className="w-12 h-12 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white flex items-center justify-center transition-colors active:scale-95 shadow-md shadow-cyan-600/30 touch-manipulation cursor-pointer"
                    >
                      <Plus className="w-5 h-5 font-bold" />
                    </button>
                  </div>

                  {/* Expand details trigger */}
                  <button
                    type="button"
                    onClick={() => toggleDetails(item.id)}
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-950/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    title="Ajustar BTUs, observações ou preço"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Options: BTU, custom unit price, notes */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* BTU Capacity Select */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        Capacidade / Tipo do Aparelho
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {BTU_OPTIONS.map((btu) => (
                          <button
                            key={btu}
                            type="button"
                            onClick={() =>
                              onUpdateItem(item.id, {
                                btuCapacity: item.btuCapacity === btu ? undefined : btu,
                              })
                            }
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                              item.btuCapacity === btu
                                ? 'bg-cyan-600 text-white font-bold'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {btu}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Unit Price Customization */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Preço Unitário Personalizado (R$)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              unitPrice: Math.max(0, parseFloat(e.target.value) || 0),
                            })
                          }
                          className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono outline-none focus:border-cyan-500"
                        />
                        {item.serviceId.startsWith('custom-') && (
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="h-9 px-3 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1 text-xs cursor-pointer"
                            title="Remover serviço"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Observations */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Observação deste item (aparece no orçamento)
                    </label>
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => onUpdateItem(item.id, { notes: e.target.value })}
                      placeholder="Ex: Parede externa 3º andar, inclui suporte de inox, etc."
                      className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Service Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Adicionar Serviço Adicional
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Desinstalação / Ponto elétrico / Troca de capacitor"
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preço Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={customQty}
                    onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="h-10 px-4 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 cursor-pointer"
                >
                  Adicionar ao Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
