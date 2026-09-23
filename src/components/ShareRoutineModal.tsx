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
  Download,
  ClipboardPaste,
  AlertCircle,
  ArrowRight,
  Info,
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
  initialTab?: 'share' | 'import';
}

export const ShareRoutineModal: React.FC<ShareRoutineModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  routines,
  onImportRoutine,
  initialTab = 'share',
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'import'>(initialTab);
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [hasCopiedWhatsApp, setHasCopiedWhatsApp] = useState(false);

  // Import Tab State
  const [manualLinkInput, setManualLinkInput] = useState('');
  const [parsedRoutine, setParsedRoutine] = useState<RoutinePayload | null>(null);
  const [importError, setManualError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

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

      return `Olá! Segue a rotina personalizada estruturada no app *Synapsis Kids* 🧸\n\n📅 *Rotina — ${currentDayName} (${currentTasks.length} atividades)*\n${taskBullets}${moreCount}\n\n📲 *Para abrir no seu celular:*\n• Se já usa o app instalado: Copie o link e abra no Synapsis Kids em *Enviar / Importar* > *Colar Link*.\n• Ou toque direto no link para abrir:\n${magicLink}\n\nCom carinho • Synapsis Kids ✨`;
    } else {
      let totalTasks = 0;
      Object.values(routines).forEach((r: DayRoutine) => {
        totalTasks += r.tasks.length;
      });

      return `Olá! Segue a rotina semanal completa estruturada no app *Synapsis Kids* 🧸\n\n📅 *Programação da Semana Completa (7 dias)*\nTotal de ${totalTasks} atividades organizadas de Segunda a Domingo.\n\n📲 *Para abrir no seu celular:*\n• Se já usa o app instalado: Copie o link e abra no Synapsis Kids em *Enviar / Importar* > *Colar Link*.\n• Ou toque direto no link para abrir:\n${magicLink}\n\nCom carinho • Synapsis Kids ✨`;
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

  // Process text or link input
  const processInputText = (text: string) => {
    setManualError(null);
    setImportSuccess(null);
    let clean = text.trim();
    if (!clean) {
      setParsedRoutine(null);
      return;
    }

    // Extract code from #r= or #rotina= or #import= if a full URL or WhatsApp message was pasted
    const hashMatch = clean.match(/#(r|rotina|import)=([^&\s]+)/);
    if (hashMatch && hashMatch[2]) {
      clean = decodeURIComponent(hashMatch[2]);
    }

    const parsed = decodeRoutine(clean);
    if (!parsed) {
      setManualError('Link não reconhecido. Certifique-se de copiar o link do Synapsis Kids.');
      setParsedRoutine(null);
      return;
    }

    setParsedRoutine(parsed);
    soundManager.playSound('chime', 0.6);
  };

  // Paste from clipboard with 1 touch
  const handlePasteClipboard = async () => {
    setManualError(null);
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setManualError('Toque no campo abaixo e cole o link copiado.');
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setManualError('A área de transferência está vazia. Copie o link no WhatsApp primeiro.');
        return;
      }
      setManualLinkInput(text);
      processInputText(text);
    } catch {
      setManualError('Permissão para ler clipboard negada. Toque no campo e cole o link manualmente.');
    }
  };

  // Confirm and apply parsed routine to this app instance
  const handleConfirmImport = () => {
    if (!parsedRoutine) return;

    if (parsedRoutine.type === 'all_week' && parsedRoutine.routines) {
      onImportRoutine({ type: 'all', routines: parsedRoutine.routines }, selectedDay);
      soundManager.playSound('marimba', 0.8);
      setImportSuccess('Semana completa importada com sucesso!');
      setTimeout(() => onClose(), 1200);
    } else if (Array.isArray(parsedRoutine.tasks)) {
      const targetDay = parsedRoutine.dayOfWeek ?? selectedDay;
      onImportRoutine({ type: 'single', tasks: parsedRoutine.tasks }, targetDay);
      soundManager.playSound('marimba', 0.8);
      setImportSuccess(`Rotina de ${parsedRoutine.dayName || DAY_NAMES[targetDay]?.full || 'Dia'} importada com sucesso!`);
      setTimeout(() => onClose(), 1200);
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
                {activeTab === 'share' ? (
                  <Share2 className="w-5 h-5 text-white" />
                ) : (
                  <Download className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                  Link Mágico Synapsis ✨
                </span>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                  {activeTab === 'share' ? 'Compartilhar Rotina' : 'Importar Rotina no App'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Compartilhar vs Importar) */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 px-4 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('share')}
              className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'share'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar (Link Mágico)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'import'
                  ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Importar no Meu App</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
            {activeTab === 'share' ? (
              /* TAB 1: COMPARTILHAR */
              <>
                {/* Scope selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    O que você deseja compartilhar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExportScope('current')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
              </>
            ) : (
              /* TAB 2: IMPORTAR NO APP CONFIGURADO */
              <div className="space-y-4">
                {/* Explanation Card */}
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
                  <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Recebeu uma rotina no WhatsApp? Cole o link abaixo para aplicar as tarefas <strong>diretamente neste aplicativo já configurado</strong>, mantendo seu modo escuro, alarmes e preferências intactos!
                  </p>
                </div>

                {/* 1-Tap Paste Button */}
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>Colar Link Copiado do WhatsApp</span>
                </button>

                {/* Manual Link Input */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    Ou cole o link ou texto da mensagem aqui:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://synapsis-kids.vercel.app/#r=..."
                      value={manualLinkInput}
                      onChange={(e) => {
                        setManualLinkInput(e.target.value);
                        processInputText(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => processInputText(manualLinkInput)}
                      className="px-3.5 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Verificar
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {importError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* Success message */}
                {importSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="font-bold">{importSuccess}</span>
                  </div>
                )}

                {/* Parsed Routine Preview Card */}
                {parsedRoutine && (
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wide">
                          Rotina Encontrada no Link!
                        </h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        {parsedRoutine.type === 'all_week' ? 'Semana Completa' : '1 Dia'}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {parsedRoutine.type === 'all_week'
                        ? 'Todas as rotinas de segunda a domingo serão atualizadas.'
                        : `Rotina de ${parsedRoutine.dayName || DAY_NAMES[parsedRoutine.dayOfWeek ?? selectedDay]?.full || 'Dia'} com ${parsedRoutine.tasks?.length || 0} atividades.`}
                    </p>

                    {parsedRoutine.tasks && parsedRoutine.tasks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {parsedRoutine.tasks.slice(0, 5).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-lg text-emerald-900 dark:text-emerald-200 truncate max-w-[150px]"
                          >
                            <Clock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{t.title}</span>
                          </span>
                        ))}
                        {parsedRoutine.tasks.length > 5 && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 self-center font-bold">
                            +{parsedRoutine.tasks.length - 5} mais
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar e Aplicar no Meu Celular</span>
                    </button>
                  </div>
                )}
              </div>
            )}

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
