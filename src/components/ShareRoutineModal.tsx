import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Link2,
  ExternalLink,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DayOfWeek, DayRoutine, RoutineTask } from '../types';
import { DAY_NAMES } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { encodeRoutine, decodeRoutine, RoutinePayload } from '../utils/routineCodec';

interface ShareRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DayOfWeek;
  routines: Record<DayOfWeek, DayRoutine>;
  onImportRoutine: (
    importedData: { type: 'single' | 'all'; tasks?: RoutineTask[]; routines?: Record<DayOfWeek, DayRoutine> },
    targetDay: DayOfWeek
  ) => void;
}

export const ShareRoutineModal: React.FC<ShareRoutineModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  routines,
  onImportRoutine,
}) => {
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [hasCopiedWhatsApp, setHasCopiedWhatsApp] = useState(false);

  // Manual link open state (for opening a link received via text)
  const [showManualOpen, setShowManualOpen] = useState(false);
  const [manualLinkInput, setManualLinkInput] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDayName = DAY_NAMES[selectedDay].full;
  const currentTasks = routines[selectedDay]?.tasks || [];

  // Generate clean export payload
  const getExportData = (): RoutinePayload => {
    if (exportScope === 'current') {
      return {
        app: 'SynapsisKids',
        version: '3.0',
        type: 'single_day',
        dayOfWeek: selectedDay,
        dayName: currentDayName,
        tasks: currentTasks,
      };
    } else {
      return {
        app: 'SynapsisKids',
        version: '3.0',
        type: 'all_week',
        routines: routines,
      };
    }
  };

  // Generate 1-Click Magic Link (Ultra-Compact LZString)
  const getMagicLink = () => {
    const compressedCode = encodeRoutine(getExportData());
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#r=${compressedCode}`;
  };

  // Generate WhatsApp Message with Magic Link (Clean, human, friendly, NO code blocks!)
  const getWhatsAppMessage = () => {
    const magicLink = getMagicLink();

    if (exportScope === 'current') {
      const taskBullets = currentTasks
        .slice(0, 10)
        .map((t) => `• ${t.time} - ${t.title}`)
        .join('\n');
      const moreCount = currentTasks.length > 10 ? `\n• ... e mais ${currentTasks.length - 10} atividades` : '';

      return `Olá! Segue a rotina personalizada estruturada no app *Synapsis Kids* 🧸\n\n📅 *Rotina — ${currentDayName} (${currentTasks.length} atividades)*\n${taskBullets}${moreCount}\n\n📲 *Para abrir no celular ou tablet, toque no link:*\n${magicLink}\n\n*(A rotina carrega automaticamente com 1 toque)*\n\nCom carinho • Synapsis Kids ✨`;
    } else {
      let totalTasks = 0;
      Object.values(routines).forEach((r) => {
        totalTasks += r.tasks.length;
      });

      return `Olá! Segue a rotina semanal completa estruturada no app *Synapsis Kids* 🧸\n\n📅 *Programação da Semana Completa (7 dias)*\nTotal de ${totalTasks} atividades organizadas de Segunda a Domingo.\n\n📲 *Para abrir no celular ou tablet, toque no link:*\n${magicLink}\n\n*(A rotina carrega automaticamente com 1 toque)*\n\nCom carinho • Synapsis Kids ✨`;
    }
  };

  // Open WhatsApp directly
  const handleOpenWhatsAppDirect = () => {
    const message = getWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    soundManager.playSound('harp', 0.8);
  };

  // Copy WhatsApp friendly message
  const handleCopyWhatsApp = async () => {
    const text = getWhatsAppMessage();
    try {
      await navigator.clipboard.writeText(text);
      setHasCopiedWhatsApp(true);
      soundManager.playSound('harp', 0.8);
      setTimeout(() => setHasCopiedWhatsApp(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Copy just the Magic Link URL
  const handleCopyMagicLink = async () => {
    const link = getMagicLink();
    try {
      await navigator.clipboard.writeText(link);
      setHasCopiedLink(true);
      soundManager.playSound('chime', 0.8);
      setTimeout(() => setHasCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle manual link open
  const handleProcessManualLink = () => {
    setManualError(null);
    let clean = manualLinkInput.trim();
    if (!clean) {
      setManualError('Por favor, cole o link recebido.');
      return;
    }

    // Extract code from #r= or #rotina= or #import= if a full URL was pasted
    const hashMatch = clean.match(/#(r|rotina|import)=([^&]+)/);
    if (hashMatch && hashMatch[2]) {
      clean = decodeURIComponent(hashMatch[2]);
    }

    const parsed = decodeRoutine(clean);
    if (!parsed) {
      setManualError('Link não reconhecido. Certifique-se de colar o link do Synapsis Kids.');
      return;
    }

    if (parsed.type === 'all_week' && parsed.routines) {
      onImportRoutine({ type: 'all', routines: parsed.routines }, selectedDay);
      soundManager.playSound('marimba', 0.8);
      onClose();
    } else if (Array.isArray(parsed.tasks)) {
      onImportRoutine({ type: 'single', tasks: parsed.tasks }, selectedDay);
      soundManager.playSound('marimba', 0.8);
      onClose();
    } else {
      setManualError('Não foi possível carregar as tarefas do link.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 dark:bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="share-routine-modal"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                  Link Mágico de 1 Toque ✨
                </span>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                  Compartilhar Rotina
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
            {/* Scope selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                O que você deseja compartilhar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportScope('current')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    exportScope === 'current'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/40 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className="text-xs block font-extrabold">Dia Atual</span>
                  <span className="text-[11px] opacity-80 block">{currentDayName} ({currentTasks.length} tarefas)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    exportScope === 'all'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/40 font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className="text-xs block font-extrabold">Semana Completa</span>
                  <span className="text-[11px] opacity-80 block">Segunda a Domingo (7 dias)</span>
                </button>
              </div>
            </div>

            {/* Routine Preview Card */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {exportScope === 'current' ? `Rotina de ${currentDayName}` : 'Rotina da Semana Completa'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {exportScope === 'current' ? `${currentTasks.length} tarefas` : '7 dias organizados'}
                </span>
              </div>

              {exportScope === 'current' && currentTasks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentTasks.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-white dark:bg-stone-700/70 border border-stone-200 dark:border-stone-600 px-2 py-0.5 rounded-lg text-stone-600 dark:text-stone-300 truncate max-w-[160px]"
                    >
                      <Clock className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </span>
                  ))}
                  {currentTasks.length > 4 && (
                    <span className="text-[10px] text-stone-400 self-center">
                      +{currentTasks.length - 4} mais
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Primary Action Box: WhatsApp & 1-Click Magic Link */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wide">
                    Enviar para os Pais via WhatsApp
                  </h4>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700">
                  1 Toque ✨
                </span>
              </div>

              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                A família só precisará <strong>tocar no link no WhatsApp</strong> do celular ou tablet. A rotina abre e se aplica automaticamente no app, sem formulários nem complicações!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppDirect}
                  className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="py-3 px-3 bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  {hasCopiedWhatsApp ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Mensagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-600" />
                      <span>Copiar Mensagem</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyMagicLink}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 hover:bg-emerald-200/70 dark:hover:bg-emerald-900/70 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>
                  {hasCopiedLink ? '✓ Link Mágico Copiado com Sucesso!' : 'Copiar Apenas o Link Mágico (URL Curta)'}
                </span>
              </button>
            </div>

            {/* Friendly Explanation Card */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/80 dark:border-stone-700/80 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sem senhas e 100% seguro</span>
              </div>
              <p className="leading-snug">
                As tarefas são compactadas de forma segura diretamente no link. Ao tocar nele, os pais não precisam fazer cadastro nem login.
              </p>
            </div>

            {/* Optional Manual Paste Drawer (Subtle, for who received a link) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowManualOpen(!showManualOpen)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 mx-auto"
              >
                <span>{showManualOpen ? 'Ocultar abertura manual' : 'Recebeu um link e deseja abrir manualmente?'}</span>
              </button>

              {showManualOpen && (
                <div className="mt-2.5 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Cole o Link Mágico recebido:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://synapsis-kids.vercel.app/#r=..."
                      value={manualLinkInput}
                      onChange={(e) => setManualLinkInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-100"
                    />
                    <button
                      type="button"
                      onClick={handleProcessManualLink}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shrink-0"
                    >
                      <span>Abrir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  {manualError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{manualError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Synapsis Clínico Lead Magnet Banner for Psychologists */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 text-white border border-teal-500/30 space-y-2 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/synapsi_brain1.png"
                    alt="Synapsis Logo"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-xs font-black tracking-tight text-teal-300">
                    Synapsis Clínico
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Para Terapeutas
                </span>
              </div>

              <p className="text-[11.5px] text-slate-300 leading-snug">
                Atende em consultório? Conheça o <strong>Synapsis Clínico</strong>: prontuário digital, anamnese neuropsicológica e gestão da clínica.
              </p>

              <a
                href="https://synapsisclinico.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold shadow-xs active:scale-98 transition-all"
              >
                <span>Conhecer o Programa Synapsis Clínico</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-5 rounded-xl font-bold text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
