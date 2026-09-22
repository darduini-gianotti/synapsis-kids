import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Upload,
  Copy,
  Check,
  MessageCircle,
  FileCode,
  AlertCircle,
  Sparkles,
  Info,
  Link2,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [hasCopied, setHasCopied] = useState(false);
  const [hasCopiedWhatsApp, setHasCopiedWhatsApp] = useState(false);

  // Import state
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDayName = DAY_NAMES[selectedDay].full;
  const currentTasks = routines[selectedDay]?.tasks || [];

  // Generate clean export payload
  const getExportData = () => {
    if (exportScope === 'current') {
      return {
        app: 'SynapsisKids',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        type: 'single_day',
        dayOfWeek: selectedDay,
        dayName: currentDayName,
        tasks: currentTasks,
      };
    } else {
      return {
        app: 'SynapsisKids',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        type: 'all_week',
        routines: routines,
      };
    }
  };

  const exportJsonString = JSON.stringify(getExportData(), null, 2);

  // Download JSON file
  const handleDownloadFile = () => {
    const data = exportJsonString;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename =
      exportScope === 'current'
        ? `synapsis-kids-${DAY_NAMES[selectedDay].short.toLowerCase()}.json`
        : 'synapsis-kids-semana-completa.json';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundManager.playSound('chime', 0.8);
  };

  // Copy raw JSON
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(exportJsonString);
      setHasCopied(true);
      soundManager.playSound('chime', 0.8);
      setTimeout(() => setHasCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Generate 1-Click Magic Link (Compact & URL Safe)
  const getMagicLink = () => {
    const base64Data = encodeRoutine(getExportData() as RoutinePayload);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#rotina=${encodeURIComponent(base64Data)}`;
  };

  // Generate WhatsApp Message with Magic Link
  const getWhatsAppMessage = () => {
    const base64Data = encodeRoutine(getExportData() as RoutinePayload);
    const magicLink = getMagicLink();

    const summary =
      exportScope === 'current'
        ? `📅 *Synapsis Kids — ${currentDayName}*\nTotal: ${currentTasks.length} atividades terapêuticas programadas.`
        : `📅 *Synapsis Kids — Semana Completa*\nProgramação estruturada para todos os 7 dias da semana.`;

    return `Olá! Segue a rotina personalizada estruturada no app *Synapsis Kids*:\n\n${summary}\n\n📲 *Para abrir e aplicar direto no celular/tablet:*\nBasta tocar no link abaixo:\n${magicLink}\n\n*(Se preferir importar manualmente pelo código no app:)*\n\`\`\`${base64Data}\`\`\`\n\nAbraços terapêuticos • Synapsis Kids ✨`;
  };

  // Open WhatsApp directly
  const handleOpenWhatsAppDirect = () => {
    const message = getWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    soundManager.playSound('harp', 0.8);
  };

  // Copy WhatsApp friendly message with encoded payload
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

  // Handle file upload for import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
      processImport(content);
    };
    reader.readAsText(file);
  };

  // Process text or base64 import
  const processImport = (rawInput: string) => {
    setImportError(null);
    setImportSuccess(null);

    let clean = rawInput.trim();
    if (!clean) {
      setImportError('Por favor, cole o código ou selecione um arquivo.');
      return;
    }

    // Try extracting from WhatsApp block if present (```BASE64```)
    const blockMatch = clean.match(/```([A-Za-z0-9+/=_-]+)```/);
    if (blockMatch && blockMatch[1]) {
      clean = blockMatch[1].trim();
    }

    const parsed = decodeRoutine(clean);
    if (!parsed) {
      setImportError('Formato inválido. Certifique-se de colar o código gerado pelo app.');
      return;
    }

    // Determine type: single day or all week
    if (parsed.type === 'all_week' && parsed.routines) {
      onImportRoutine({ type: 'all', routines: parsed.routines }, selectedDay);
      setImportSuccess('Rotina de toda a semana importada com sucesso!');
      soundManager.playSound('marimba', 0.8);
      setTimeout(() => onClose(), 1500);
    } else if (Array.isArray(parsed.tasks)) {
      onImportRoutine({ type: 'single', tasks: parsed.tasks }, selectedDay);
      setImportSuccess(`${parsed.tasks.length} atividades importadas para ${currentDayName}!`);
      soundManager.playSound('marimba', 0.8);
      setTimeout(() => onClose(), 1500);
    } else {
      setImportError('Não foi possível encontrar a lista de tarefas no código informado.');
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
          className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="share-routine-modal"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-tight">
                  Compartilhar & Importar Rotinas
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Transfira a rotina entre consultório e o celular dos pais
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (Exportar vs Importar) */}
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-850/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'export'
                  ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar / Enviar para os Pais</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'import'
                  ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar Rotina no Celular</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
            {activeTab === 'export' ? (
              /* TAB 1: EXPORTAR */
              <div className="space-y-4">
                {/* Scope selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    O que você deseja exportar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExportScope('current')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        exportScope === 'current'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">Dia Atual ({currentDayName})</span>
                      <span className="text-[10px] opacity-75">{currentTasks.length} tarefas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportScope('all')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        exportScope === 'all'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span className="text-xs block font-bold">Semana Completa</span>
                      <span className="text-[10px] opacity-75">Todos os 7 dias</span>
                    </button>
                  </div>
                </div>

                {/* Primary Action: Send to WhatsApp with 1-Click Magic Link */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wide">
                        Enviar para os Pais via WhatsApp
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700">
                      Link Mágico de 1 Clique ✨
                    </span>
                  </div>

                  <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    A família só precisará <strong>tocar no link no WhatsApp</strong> do celular ou tablet para a rotina carregar automaticamente no app, sem precisar digitar nem colar códigos!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleOpenWhatsAppDirect}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir WhatsApp Agora</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyWhatsApp}
                      className="py-2.5 px-3 bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
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
                    className="w-full py-2 px-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/40 hover:bg-emerald-200/70 dark:hover:bg-emerald-900/70 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{hasCopiedLink ? 'Link Mágico Copiado para Área de Transferência!' : 'Copiar Apenas o Link Mágico (URL)'}</span>
                  </button>

                  {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                    <p className="text-[10.5px] text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 leading-relaxed">
                      💡 <strong>Nota sobre o teste no celular:</strong> Como estamos em ambiente de desenvolvimento local (<code>localhost</code>), o WhatsApp não o reconhece como link público de internet. Para testar o Link Mágico no computador agora, cole-o em uma <strong>nova aba do seu navegador</strong>! Quando o app for publicado na internet (ex: <code>kids.synapsisclinico.com.br</code>), o WhatsApp tornará o link 100% clicável com visualização de cartão no celular.
                    </p>
                  )}
                </div>

                {/* Secondary Action: Download .JSON File */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block truncate">
                        Baixar Arquivo da Rotina (.json)
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Útil para anexar por e-mail ou guardar backup
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-indigo-400 text-xs font-bold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>

                {/* Raw Code Copy */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Código Técnico:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {hasCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{hasCopied ? 'Copiado!' : 'Copiar JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-[10px] font-mono text-stone-600 dark:text-stone-300 max-h-28 overflow-y-auto border border-stone-200 dark:border-stone-700">
                    {exportJsonString}
                  </pre>
                </div>

                {/* Synapsis Clínico Lead Magnet Banner for Psychologists */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 text-white border border-teal-500/30 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/synapsi_brain1.png"
                        alt="Synapsis Logo"
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-xs font-black tracking-tight text-teal-300">
                        Synapsis Clínico
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      Para Profissionais
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Você atende pacientes no consultório? Conheça o <strong>Synapsis Clínico</strong>: prontuário eletrônico completo, anamnese neuropsicológica, gestão financeira e agenda.
                  </p>

                  <a
                    href="https://synapsisclinico.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold shadow-xs active:scale-98 transition-all"
                  >
                    <span>Conhecer o Programa Synapsis Clínico</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* TAB 2: IMPORTAR */
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-800 dark:text-indigo-300">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Selecione o arquivo <code>.json</code> enviado pela terapeuta ou cole abaixo o código recebido no WhatsApp.
                  </p>
                </div>

                {/* File input button */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Opção 1: Selecionar Arquivo do Celular
                  </label>
                  <label className="w-full py-3 px-4 border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-indigo-400 rounded-2xl flex items-center justify-center gap-2 cursor-pointer bg-stone-50 dark:bg-stone-850 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                      Escolher arquivo .json
                    </span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Opção 2: Colar Mensagem ou Código Recebido
                  </label>
                  <textarea
                    rows={4}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Cole aqui o texto do WhatsApp ou o código copiado..."
                    className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-mono text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-stone-400"
                  />
                </div>

                {/* Error message */}
                {importError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* Success message */}
                {importSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{importSuccess}</span>
                  </div>
                )}

                {/* Import Action Button */}
                <button
                  type="button"
                  onClick={() => processImport(importText)}
                  disabled={!importText.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Carregar e Aplicar Rotina</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
