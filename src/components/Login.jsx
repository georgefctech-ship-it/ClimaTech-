import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  Chrome, 
  X, 
  Check, 
  KeyRound,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Estados do formulário de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados de erro
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estados do fluxo de envio
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estados do Modal de Esqueci a Senha
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Regras de validação do e-mail
  const validateEmail = (val) => {
    if (!val) return 'O e-mail é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Digite um e-mail válido';
    return '';
  };

  // Regras de validação da senha
  const validatePassword = (val) => {
    if (!val) return 'A senha é obrigatória';
    if (val.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
    return '';
  };

  // Manipulação de blur (campo focado e saído)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
    if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  // Manipuladores de alteração com validação em tempo real
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
    }
  };

  // Envio do Formulário de Login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos os campos antes de enviar
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passwordErr });

    if (!emailErr && !passwordErr) {
      setIsLoading(true);
      
      // Simulação de requisição à API
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1800);
    }
  };

  // Resetar o login para tentar novamente
  const handleResetLogin = () => {
    setIsSuccess(false);
    setEmail('');
    setPassword('');
    setTouched({});
    setErrors({});
  };

  // Envio da recuperação de senha
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(forgotEmail);
    if (err) {
      setForgotEmailError(err);
      return;
    }

    setForgotEmailError('');
    setForgotLoading(true);

    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 1500);
  };

  // Fechar Modal de Esqueceu Senha
  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotEmail('');
    setForgotEmailError('');
    setForgotSuccess(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans overflow-hidden p-4 sm:p-6 md:p-8">
      {/* Elementos de Fundo Ambientais (Orbes Brilhantes Animados) */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-indigo-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>

      {/* Padrão de Grade Geométrica Suave */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Container Principal Glassmorphism */}
      <div className="relative w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-white/[0.07] border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-white/30">
          
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-white/20 shadow-inner mb-4 text-purple-300">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Insira suas credenciais para acessar a plataforma
            </p>
          </div>

          {/* Tela de Sucesso de Login */}
          {isSuccess ? (
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-2">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Login Realizado!</h3>
                <p className="text-slate-300 text-sm mt-1">
                  Autenticado com sucesso como <span className="text-purple-300 font-medium">{email}</span>
                </p>
              </div>
              <button
                onClick={handleResetLogin}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10"
              >
                Voltar ao formulário
              </button>
            </div>
          ) : (
            /* Formulário de Login */
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Campo E-mail */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="seu@email.com"
                    className={`w-full pl-11 pr-10 py-3 bg-slate-900/40 border ${
                      touched.email && errors.email 
                        ? 'border-red-500/80 focus:ring-red-500/30' 
                        : touched.email && !errors.email 
                          ? 'border-emerald-500/50 focus:ring-emerald-500/20' 
                          : 'border-white/10 focus:border-purple-400/50 focus:ring-purple-500/20'
                    } rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 outline-none focus:ring-4`}
                  />
                  {touched.email && errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  {touched.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-purple-300 hover:text-purple-200 font-medium transition-colors hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 bg-slate-900/40 border ${
                      touched.password && errors.password 
                        ? 'border-red-500/80 focus:ring-red-500/30' 
                        : touched.password && !errors.password 
                          ? 'border-emerald-500/50 focus:ring-emerald-500/20' 
                          : 'border-white/10 focus:border-purple-400/50 focus:ring-purple-500/20'
                    } rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 outline-none focus:ring-4`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Opções Secundárias (Lembrar de Mim) */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : 'bg-slate-900/50 border-white/20 group-hover:border-white/40'
                    }`}>
                      {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <span className="ml-2.5 text-xs text-slate-300 group-hover:text-white transition-colors">
                    Lembrar de mim
                  </span>
                </label>
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden mt-2 py-3.5 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-purple-600/25 border border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar na conta</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Divisor */}
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-slate-900/60 backdrop-blur-md px-3 text-[11px] font-medium text-slate-400 uppercase tracking-widest absolute rounded-full border border-white/5">
                  Ou continue com
                </span>
              </div>

              {/* Logins Sociais */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 active:scale-95"
                >
                  <Chrome className="w-4 h-4 text-rose-400" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 active:scale-95"
                >
                  <Github className="w-4 h-4 text-slate-200" />
                  <span>GitHub</span>
                </button>
              </div>

            </form>
          )}

          {/* Rodapé */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Ainda não tem uma conta?{' '}
            <a href="#" className="text-purple-300 font-medium hover:text-purple-200 hover:underline transition-colors">
              Criar conta gratuita
            </a>
          </div>

        </div>
      </div>

      {/* MODAL: Esqueci Minha Senha */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md backdrop-blur-2xl bg-slate-900/80 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Botão Fechar Modal */}
            <button
              onClick={closeForgotModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {forgotSuccess ? (
              /* Sucesso Modal */
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-1">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-white">E-mail Enviado!</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Enviamos as instruções de recuperação de senha para <span className="text-purple-300 font-medium">{forgotEmail}</span>. Verifique sua caixa de entrada.
                </p>
                <button
                  onClick={closeForgotModal}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/20"
                >
                  Entendi
                </button>
              </div>
            ) : (
              /* Formulário Modal */
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Recuperar Senha</h3>
                    <p className="text-xs text-slate-400">Enviaremos um link de redefinição</p>
                  </div>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4 mt-4" noValidate>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                      E-mail Cadastrado
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotEmailError) setForgotEmailError('');
                      }}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/20 transition-all"
                    />
                    {forgotEmailError && (
                      <p className="text-xs text-red-400 mt-1">{forgotEmailError}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-purple-600/20 flex items-center justify-center"
                    >
                      {forgotLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Enviar Link'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}