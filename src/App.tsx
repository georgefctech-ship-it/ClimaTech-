import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Send,
  Check,
  Zap,
  Download,
} from 'lucide-react';
import { Header } from './components/Header';
import { ClientForm } from './components/ClientForm';
import { ServiceSelector } from './components/ServiceSelector';
import { TotalPanel } from './components/TotalPanel';
import { QuoteSummaryModal } from './components/QuoteSummaryModal';
import { TechnicianProfileModal } from './components/TechnicianProfileModal';
import { HistoryModal } from './components/HistoryModal';
import { Footer } from './components/Footer';
import { DEFAULT_SERVICES, PAYMENT_METHODS, WARRANTY_OPTIONS } from './data/services';
import { Quote, QuoteItem, TechnicianProfile } from './types';
import {
  formatCurrency,
  generateQuoteNumber,
  buildWhatsAppMessage,
  getWhatsAppUrl,
} from './utils/formatters';
import { generateQuotePDF } from './utils/pdfGenerator';

const STORAGE_KEY_QUOTES = 'climacalc_saved_quotes_v1';
const STORAGE_KEY_PROFILE = 'climacalc_tech_profile_v1';
const STORAGE_KEY_THEME = 'climacalc_theme_v1';

export default function App() {
  // Theme state: dark by default, with easy light mode toggle
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Apply theme to document HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Technician Profile State
  const [technician, setTechnician] = useState<TechnicianProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      companyName: 'ClimaTech Climatização & Elétrica',
      technicianName: 'Técnico Especialista',
      phone: '(11) 99876-5432',
      documentNumber: '',
      pixKey: 'contato@climatech.com.br',
      city: 'São Paulo - SP',
    };
  });

  // Client Details State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [warrantyPeriod, setWarrantyPeriod] = useState(WARRANTY_OPTIONS[0]);
  const [validityDays, setValidityDays] = useState(10);

  // Quote Items State (Initialized with the 3 required services at 0 quantity)
  const [items, setItems] = useState<QuoteItem[]>(() =>
    DEFAULT_SERVICES.map((s) => ({
      id: s.id,
      serviceId: s.id,
      name: s.name,
      description: s.description,
      unitPrice: s.basePrice,
      quantity: 0,
      btuCapacity: undefined,
      notes: '',
    }))
  );

  // Discount & Totals
  const [discountPercent, setDiscountPercent] = useState(0);

  // Modals & Notifications
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved Quotes History
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Active Quote Reference ID
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState(generateQuoteNumber());

  // Save technician profile to localStorage
  const handleSaveProfile = (updated: TechnicianProfile) => {
    setTechnician(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('Dados do negócio atualizados com sucesso!');
  };

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Calculations: 100% Automatic in real-time
  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (discountPercent <= 0) return 0;
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, it) => acc + it.quantity, 0);
  }, [items]);

  // Selected items with quantity > 0
  const activeItems = useMemo(() => {
    return items.filter((it) => it.quantity > 0);
  }, [items]);

  // Update quantity for an item
  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, quantity } : item))
    );
  };

  // Update specific fields of an item
  const handleUpdateItem = (serviceId: string, updates: Partial<QuoteItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, ...updates } : item))
    );
  };

  // Add custom service item
  const handleAddCustomItem = (name: string, price: number, quantity: number) => {
    const newItem: QuoteItem = {
      id: `custom-${Date.now()}`,
      serviceId: `custom-${Date.now()}`,
      name,
      unitPrice: price,
      quantity,
    };
    setItems((prev) => [...prev, newItem]);
    showToast(`Serviço "${name}" adicionado!`);
  };

  // Remove a custom item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Quick preset helper
  const applyPreset = (type: 'instalacao_padrao' | 'manutencao_dupla' | 'combo_completo') => {
    if (type === 'instalacao_padrao') {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === 'instalacao') return { ...it, quantity: 1, btuCapacity: '12.000 BTUs' };
          return it;
        })
      );
      showToast('1x Instalação (12.000 BTUs) adicionada!');
    } else if (type === 'manutencao_dupla') {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === 'manutencao') return { ...it, quantity: 2 };
          return it;
        })
      );
      showToast('2x Manutenção/Higienização adicionada!');
    } else if (type === 'combo_completo') {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === 'instalacao') return { ...it, quantity: 1 };
          if (it.id === 'gas') return { ...it, quantity: 1 };
          return it;
        })
      );
      showToast('Combo: 1x Instalação + 1x Carga de Gás selecionado!');
    }
  };

  // Reset form
  const handleReset = () => {
    setClientName('');
    setClientPhone('');
    setClientAddress('');
    setDiscountPercent(0);
    setCurrentQuoteNumber(generateQuoteNumber());
    setItems(
      DEFAULT_SERVICES.map((s) => ({
        id: s.id,
        serviceId: s.id,
        name: s.name,
        description: s.description,
        unitPrice: s.basePrice,
        quantity: 0,
        btuCapacity: undefined,
        notes: '',
      }))
    );
    showToast('Novo orçamento iniciado!');
  };

  // Build the complete Quote object
  const currentQuoteObject: Quote = useMemo(
    () => ({
      id: currentQuoteNumber,
      quoteNumber: currentQuoteNumber,
      createdAt: new Date().toISOString(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientAddress: clientAddress.trim(),
      items: activeItems,
      discountPercent,
      discountAmount,
      paymentMethod,
      warrantyPeriod,
      validityDays,
      subtotal,
      total,
    }),
    [
      currentQuoteNumber,
      clientName,
      clientPhone,
      clientAddress,
      activeItems,
      discountPercent,
      discountAmount,
      paymentMethod,
      warrantyPeriod,
      validityDays,
      subtotal,
      total,
    ]
  );

  // Save current quote to history
  const persistQuoteToHistory = (quote: Quote) => {
    try {
      const existing = savedQuotes.filter((q) => q.id !== quote.id);
      const updated = [quote, ...existing].slice(0, 50); // limit to last 50
      setSavedQuotes(updated);
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Load a quote from history
  const handleLoadQuote = (quote: Quote) => {
    setClientName(quote.clientName || '');
    setClientPhone(quote.clientPhone || '');
    setClientAddress(quote.clientAddress || '');
    setPaymentMethod(quote.paymentMethod || PAYMENT_METHODS[0]);
    setWarrantyPeriod(quote.warrantyPeriod || WARRANTY_OPTIONS[0]);
    setValidityDays(quote.validityDays || 10);
    setDiscountPercent(quote.discountPercent || 0);
    setCurrentQuoteNumber(quote.quoteNumber);

    // Merge items
    const baseMap = new Map(DEFAULT_SERVICES.map((s) => [s.id, s.basePrice]));
    const loadedItems: QuoteItem[] = DEFAULT_SERVICES.map((s) => {
      const found = quote.items.find((i) => i.serviceId === s.id);
      return {
        id: s.id,
        serviceId: s.id,
        name: s.name,
        description: s.description,
        unitPrice: found ? found.unitPrice : s.basePrice,
        quantity: found ? found.quantity : 0,
        btuCapacity: found ? found.btuCapacity : undefined,
        notes: found ? found.notes : '',
      };
    });

    // Add any custom items that were in the quote
    quote.items.forEach((it) => {
      if (!baseMap.has(it.serviceId)) {
        loadedItems.push(it);
      }
    });

    setItems(loadedItems);
    showToast(`Orçamento #${quote.quoteNumber} carregado!`);
  };

  // Delete single quote from history
  const handleDeleteQuote = (id: string) => {
    const updated = savedQuotes.filter((q) => q.id !== id);
    setSavedQuotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('Orçamento removido do histórico.');
  };

  // Clear all quotes history
  const handleClearHistory = () => {
    setSavedQuotes([]);
    localStorage.removeItem(STORAGE_KEY_QUOTES);
    showToast('Histórico limpo.');
  };

  // Validation
  const isValid = activeItems.length > 0 && !!clientName.trim();
  const validationMessage = useMemo(() => {
    if (activeItems.length === 0) {
      return 'Selecione ao menos 1 serviço alterando a quantidade (+).';
    }
    if (!clientName.trim()) {
      return 'Por favor, informe o nome do cliente no campo acima.';
    }
    return '';
  }, [activeItems, clientName]);

  // ACTION 1: Gerar Resumo do Orçamento
  const handleGenerateSummary = () => {
    if (activeItems.length === 0) {
      showToast('Selecione ao menos um serviço para gerar o resumo.');
      return;
    }
    persistQuoteToHistory(currentQuoteObject);
    setIsSummaryOpen(true);
  };

  // ACTION 2: Copiar e Enviar no WhatsApp
  const handleSendWhatsApp = () => {
    if (activeItems.length === 0) {
      showToast('Selecione ao menos um serviço.');
      return;
    }

    const message = buildWhatsAppMessage(currentQuoteObject, technician);

    // Auto copy text to clipboard
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => console.error('Failed to copy', err));

    persistQuoteToHistory(currentQuoteObject);

    // Open WhatsApp
    const url = getWhatsAppUrl(clientPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');

    showToast('Mensagem copiada! Abrindo WhatsApp...');
  };

  // Direct Download PDF Action
  const handleDirectDownloadPDF = () => {
    if (activeItems.length === 0) {
      showToast('Selecione ao menos um serviço para gerar o PDF.');
      return;
    }
    try {
      persistQuoteToHistory(currentQuoteObject);
      generateQuotePDF(currentQuoteObject, technician);
      showToast('PDF gerado e baixado com sucesso!');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast('Erro ao gerar PDF. Abrindo visualização...');
      setIsSummaryOpen(true);
    }
  };

  // Copy text only
  const handleCopyOnly = () => {
    if (activeItems.length === 0) {
      showToast('Selecione ao menos um serviço.');
      return;
    }
    const message = buildWhatsAppMessage(currentQuoteObject, technician);
    navigator.clipboard.writeText(message).then(() => {
      setIsCopied(true);
      showToast('Texto do orçamento copiado para a área de transferência!');
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-24 lg:pb-12 transition-colors duration-200">
      {/* Top Header */}
      <Header
        technician={technician}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        savedCount={savedQuotes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Title & Rapid Presets */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400" />
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 tracking-wider uppercase">
                Calculadora Profissional de Climatização
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Orçamento de Ar-Condicionado
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Preencha os dados do cliente, ajuste as quantidades dos serviços com os botões
              grandes, gere o PDF timbrado e envie pelo WhatsApp.
            </p>
          </div>

          {/* Quick Presets Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              Atalhos:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('instalacao_padrao')}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              + 1x Instalação
            </button>
            <button
              type="button"
              onClick={() => applyPreset('manutencao_dupla')}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              + 2x Manutenção
            </button>
            <button
              type="button"
              onClick={() => applyPreset('combo_completo')}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 transition-colors shadow-xs cursor-pointer"
            >
              Combo Instalação + Gás
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Form + Services | Right Sticky Total Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Client Form + Services (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Client Info */}
            <ClientForm
              clientName={clientName}
              onClientNameChange={setClientName}
              clientPhone={clientPhone}
              onClientPhoneChange={setClientPhone}
              clientAddress={clientAddress}
              onClientAddressChange={setClientAddress}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              warrantyPeriod={warrantyPeriod}
              onWarrantyPeriodChange={setWarrantyPeriod}
              validityDays={validityDays}
              onValidityDaysChange={setValidityDays}
            />

            {/* Step 2: Services & Quantities */}
            <ServiceSelector
              items={items}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateItem={handleUpdateItem}
              onAddCustomItem={handleAddCustomItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Right Column: Total Panel & Action Buttons (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <TotalPanel
              subtotal={subtotal}
              total={total}
              totalItemsCount={totalItemsCount}
              discountPercent={discountPercent}
              onDiscountPercentChange={setDiscountPercent}
              discountAmount={discountAmount}
              onGenerateSummary={handleGenerateSummary}
              onSendWhatsApp={handleSendWhatsApp}
              onDownloadPDF={handleDirectDownloadPDF}
              onCopyOnly={handleCopyOnly}
              isCopied={isCopied}
              isValid={isValid}
              errorMessage={validationMessage}
            />

            {/* Price reference quick card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 p-4 text-xs text-slate-500 dark:text-slate-400 space-y-2 shadow-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block text-[10px]">
                Tabela Base dos Serviços
              </span>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Instalação de Split</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(450)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Manutenção / Limpeza</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(200)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Carga de Gás</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(100)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Creator Copyright & Social Contacts */}
      <Footer />

      {/* Mobile Ergonomic Sticky Bottom Bar (Thumb-zone optimized, <= 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Total ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'})
            </span>
            <span className="font-mono text-xl font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDirectDownloadPDF}
              disabled={totalItemsCount === 0}
              className="h-11 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar PDF"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={totalItemsCount === 0}
              className="h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-900 dark:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Resumo</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={totalItemsCount === 0}
              className="h-11 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 bg-slate-900 dark:bg-slate-900 text-white border border-cyan-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <QuoteSummaryModal
        quote={currentQuoteObject}
        technician={technician}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onSendWhatsApp={handleSendWhatsApp}
        onCopyText={handleCopyOnly}
        isCopied={isCopied}
      />

      <TechnicianProfileModal
        profile={technician}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <HistoryModal
        quotes={savedQuotes}
        technician={technician}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadQuote={handleLoadQuote}
        onDeleteQuote={handleDeleteQuote}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
