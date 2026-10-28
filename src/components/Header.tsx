import React from 'react';
import { Wrench, History, UserCheck, RotateCcw, Sun, Moon } from 'lucide-react';
import { TechnicianProfile } from '../types';

interface HeaderProps {
  technician: TechnicianProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  technician,
  theme,
  onToggleTheme,
  onOpenProfile,
  onOpenHistory,
  onReset,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                ClimaCalc
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/50">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-xs">
              {technician.companyName || 'Orçamento de Ar-Condicionado'}
            </p>
          </div>
        </div>

        {/* Actions Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="h-10 w-10 sm:w-auto sm:px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            aria-label="Alternar tema claro/escuro"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-600" />
                <span className="hidden sm:inline">Escuro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Limpar formulário e iniciar novo orçamento"
            className="h-10 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Novo</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="h-10 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors active:scale-95 relative whitespace-nowrap cursor-pointer"
            title="Histórico de orçamentos salvos"
          >
            <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Histórico</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 ml-0.5">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="h-10 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-cyan-800 dark:text-cyan-300 hover:text-cyan-950 dark:hover:text-white bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 border border-cyan-200 dark:border-cyan-800/60 flex items-center gap-1.5 transition-colors active:scale-95 whitespace-nowrap cursor-pointer"
            title="Dados da sua empresa e Pix para o orçamento"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Meus Dados</span>
          </button>
        </div>
      </div>
    </header>
  );
};
