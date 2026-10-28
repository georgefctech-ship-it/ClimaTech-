import React from 'react';
import { User, Phone, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { PAYMENT_METHODS, WARRANTY_OPTIONS } from '../data/services';
import { maskPhone } from '../utils/formatters';

interface ClientFormProps {
  clientName: string;
  onClientNameChange: (val: string) => void;
  clientPhone: string;
  onClientPhoneChange: (val: string) => void;
  clientAddress: string;
  onClientAddressChange: (val: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  warrantyPeriod: string;
  onWarrantyPeriodChange: (val: string) => void;
  validityDays: number;
  onValidityDaysChange: (val: number) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  clientName,
  onClientNameChange,
  clientPhone,
  onClientPhoneChange,
  clientAddress,
  onClientAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  warrantyPeriod,
  onWarrantyPeriodChange,
  validityDays,
  onValidityDaysChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Dados do Cliente</h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Campos do orçamento</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Cliente */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Nome do Cliente <span className="text-cyan-600 dark:text-cyan-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Ex: Carlos Eduardo / Mariana Souza"
              className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
            />
            <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* WhatsApp / Telefone */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            WhatsApp / Celular do Cliente
          </label>
          <div className="relative">
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => onClientPhoneChange(maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono transition-all outline-none"
            />
            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Endereço / Local */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Endereço / Local do Serviço (Opcional)
          </label>
          <div className="relative">
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => onClientAddressChange(e.target.value)}
              placeholder="Ex: Av. Paulista, 1000 - Apto 82, Bela Vista"
              className="w-full h-11 pl-11 pr-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none"
            />
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Condições comerciais adicionais */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Forma de Pagamento
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white transition-all outline-none"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              Garantia
            </label>
            <select
              value={warrantyPeriod}
              onChange={(e) => onWarrantyPeriodChange(e.target.value)}
              className="w-full h-11 px-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs text-slate-900 dark:text-white transition-all outline-none"
            >
              {WARRANTY_OPTIONS.map((warranty) => (
                <option key={warranty} value={warranty} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {warranty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 truncate">
              Validade (dias)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={validityDays}
              onChange={(e) => onValidityDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
