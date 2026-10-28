import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Instagram,
  MessageCircle,
  Copy,
  Check,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const currentYear = new Date().getFullYear();
  const creatorName = 'George Ferreira Costa';
  const email = 'georgefctech@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/?text=Ol%C3%A1%20George,%20vi%20seu%20aplicativo%20ClimaCalc!',
      color: 'hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10',
      label: 'Falar no WhatsApp',
    },
    {
      name: 'E-mail',
      icon: Mail,
      href: `mailto:${email}?subject=Contato%20sobre%20o%20ClimaCalc`,
      color: 'hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/10',
      label: 'Enviar e-mail para georgefctech@gmail.com',
      onClick: handleCopyEmail,
      isCopy: true,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/george-ferreira-costa',
      color: 'hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10',
      label: 'Ver perfil no LinkedIn',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
      color: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400 hover:bg-slate-500/10',
      label: 'Ver repositórios no GitHub',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com',
      color: 'hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10',
      label: 'Seguir no Instagram',
    },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm transition-colors py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Copyright & Creator Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>© {currentYear} ClimaCalc</span>
            <span>·</span>
            <span>Todos os direitos reservados</span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center justify-center md:justify-start gap-1.5">
            <span>Desenvolvido por</span>
            <strong className="text-slate-900 dark:text-white font-bold tracking-tight">
              {creatorName}
            </strong>
          </p>
        </div>

        {/* Social & Contact Channels */}
        <div className="flex flex-col items-center md:items-end gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Canais de Contato & Redes Sociais
          </span>

          <div className="flex items-center gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={item.isCopy ? handleCopyEmail : undefined}
                  className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs ${item.color}`}
                  title={item.label}
                  aria-label={item.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {copiedEmail && (
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1 animate-in fade-in">
              <Check className="w-3 h-3" />
              <span>E-mail ({email}) copiado para a área de transferência!</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
