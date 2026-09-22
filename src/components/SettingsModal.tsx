import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  RotateCcw,
  Check,
  Play,
  Sun,
  Moon,
  Monitor,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Delete,
  Calendar,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { AppSettings, ThemeMode, VoiceCharacterStyle } from '../types';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetAllToFactory: () => void;
  onOpenExportCalendar?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllToFactory,
  onOpenExportCalendar,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({
    ...settings,
    parentPin: settings.parentPin || '1234',
    childLockEnabled: settings.childLockEnabled || false,
    themeMode: settings.themeMode || 'light',
    enableLargeCards: settings.enableLargeCards !== false,
    selectedVoiceURI: settings.selectedVoiceURI,
    voiceStyle: settings.voiceStyle || 'mascot',
    voiceRate: settings.voiceRate || 1.0,
    voicePitch: settings.voicePitch || 1.35,
  });

  const [pinInput, setPinInput] = useState<string>(settings.parentPin || '1234');
  const [showPin, setShowPin] = useState<boolean>(true);
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices detected in the browser
  useEffect(() => {
    const updateVoices = () => {
      const list = soundManager.getPortugueseVoices();
      setAvailableVoices(list);
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [isOpen]);

  // Sync state when settings prop updates
  useEffect(() => {
    setLocalSettings({
      ...settings,
      parentPin: settings.parentPin || '1234',
      childLockEnabled: settings.childLockEnabled || false,
      themeMode: settings.themeMode || 'light',
      enableLargeCards: settings.enableLargeCards !== false,
      selectedVoiceURI: settings.selectedVoiceURI,
      voiceStyle: settings.voiceStyle || 'mascot',
      voiceRate: settings.voiceRate || 1.0,
      voicePitch: settings.voicePitch || 1.35,
    });
    setPinInput(settings.parentPin || '1234');
    setPinError('');
    setPinSuccessMsg('');
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleVolumeChange = (vol: number) => {
    setLocalSettings((prev) => ({ ...prev, soundVolume: vol }));
  };

  const handleThemeChange = (mode: ThemeMode) => {
    const updated = { ...localSettings, themeMode: mode };
    setLocalSettings(updated);
    onSaveSettings(updated);
  };

  const handleVoiceStyleChange = (style: VoiceCharacterStyle) => {
    let pitch = 1.28;
    let rate = 0.88;
    if (style === 'gentle') {
      pitch = 1.05;
      rate = 0.88;
    } else if (style === 'normal') {
      pitch = 1.0;
      rate = 0.95;
    }
    const updated: AppSettings = {
      ...localSettings,
      voiceStyle: style,
      voicePitch: pitch,
      voiceRate: rate,
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    soundManager.setVoicePreferences(
      localSettings.selectedVoiceURI,
      pitch,
      rate,
      style
    );
  };

  const handleTestChime = () => {
    soundManager.playSound('chime', localSettings.soundVolume);
  };

  const handleTestHarp = () => {
    soundManager.playSound('harp', localSettings.soundVolume);
  };

  const handleTestVoice = () => {
    const style = localSettings.voiceStyle || 'mascot';
    soundManager.setVoicePreferences(
      localSettings.selectedVoiceURI,
      localSettings.voicePitch,
      localSettings.voiceRate,
      style
    );
    if (style === 'mascot') {
      soundManager.speak(
        'Oi amiguinho! Eu sou o Mascote do Synapsis Kids! Vamos fazer as tarefas juntos e se divertir?',
        localSettings.soundVolume
      );
    } else if (style === 'gentle') {
      soundManager.speak(
        'Olá. Vamos realizar as atividades com calma e carinho, no seu ritmo.',
        localSettings.soundVolume
      );
    } else {
      soundManager.speak(
        'Olá! Esta é a voz de apoio à rotina do Synapsis Kids.',
        localSettings.soundVolume
      );
    }
  };

  const handleTestCelebration = () => {
    const style = localSettings.voiceStyle || 'mascot';
    soundManager.setVoicePreferences(
      localSettings.selectedVoiceURI,
      localSettings.voicePitch,
      localSettings.voiceRate,
      style
    );
    soundManager.playCelebrationSample(localSettings.soundVolume);
  };

  const handlePinKeypad = (digit: string) => {
    setPinError('');
    setPinSuccessMsg('');
    if (pinInput.length >= 4) {
      // If already 4 digits, replace starting afresh
      setPinInput(digit);
      return;
    }
    setPinInput((prev) => (prev + digit).slice(0, 4));
  };

  const handlePinBackspace = () => {
    setPinError('');
    setPinSuccessMsg('');
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinError('');
    setPinSuccessMsg('');
    setPinInput('');
  };

  const handleSavePinNow = () => {
    const cleaned = (pinInput || '').trim();
    if (cleaned.length !== 4 || !/^\d{4}$/.test(cleaned)) {
      setPinError('A senha deve ter exatamente 4 números (ex: 1234).');
      setPinSuccessMsg('');
      soundManager.playSound('bell', 0.4);
      return;
    }
    setPinError('');
    const updated = { ...localSettings, parentPin: cleaned };
    setLocalSettings(updated);
    onSaveSettings(updated);
    soundManager.playSound('chime', 0.5);
    setPinSuccessMsg(`✓ Senha alterada para "${cleaned}" com sucesso!`);
    setTimeout(() => {
      setPinSuccessMsg('');
    }, 4000);
  };

  const handleResetPinToDefault = () => {
    const defaultPin = '1234';
    setPinInput(defaultPin);
    setPinError('');
    const updated = { ...localSettings, parentPin: defaultPin };
    setLocalSettings(updated);
    onSaveSettings(updated);
    soundManager.playSound('chime', 0.5);
    setPinSuccessMsg('✓ Senha restaurada para o padrão: 1234');
    setTimeout(() => {
      setPinSuccessMsg('');
    }, 4000);
  };

  const handleSave = () => {
    const cleanedPin = (pinInput || localSettings.parentPin || '1234').trim();
    if (cleanedPin.length !== 4 || !/^\d{4}$/.test(cleanedPin)) {
      setPinError('A senha dos pais deve conter exatamente 4 números.');
      return;
    }
    setPinError('');
    const finalSettings: AppSettings = {
      ...localSettings,
      parentPin: cleanedPin,
    };
    onSaveSettings(finalSettings);
    onClose();
  };

  const currentTheme = localSettings.themeMode || 'light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 max-h-[90vh]"
          id="settings-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">Configurações do Aplicativo</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 text-sm overscroll-contain">
            {/* Theme Mode Selector (Claro / Escuro / Sistema) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                <span>Tema Visual (Claro / Escuro)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="theme-light-btn"
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    currentTheme === 'light'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Claro</span>
                </button>

                <button
                  type="button"
                  id="theme-dark-btn"
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    currentTheme === 'dark'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Escuro</span>
                </button>

                <button
                  type="button"
                  id="theme-system-btn"
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    currentTheme === 'system'
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Sistema</span>
                </button>
              </div>
            </div>

            {/* Audio Volume */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Volume dos Lembretes Sonoros
                </span>
                <span>{Math.round(localSettings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestChime}
                  className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-stone-600 dark:fill-stone-300" />
                  Ouvir Sino
                </button>
                <button
                  type="button"
                  onClick={handleTestHarp}
                  className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-stone-600 dark:fill-stone-300" />
                  Ouvir Harpa
                </button>
              </div>
            </div>

            {/* Voice support & Natural Voice Picker */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Leitura por Voz dos Lembretes (TTS)
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Voz acolhedora para ler tarefas e reforços positivos para a criança.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.voiceEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, voiceEnabled: e.target.checked }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-stone-300 dark:border-stone-600"
                />
              </div>

              {localSettings.voiceEnabled && (
                <div className="pt-2 border-t border-stone-200/70 dark:border-stone-700/60 space-y-3">
                  {/* Voice Selector Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                      Estilo de Voz do Aparelho
                    </label>
                    <select
                      value={localSettings.selectedVoiceURI || ''}
                      onChange={(e) => {
                        const uri = e.target.value || undefined;
                        setLocalSettings((prev) => ({ ...prev, selectedVoiceURI: uri }));
                        soundManager.setVoicePreferences(
                          uri,
                          localSettings.voicePitch || 1.0,
                          localSettings.voiceRate || 0.95
                        );
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">✨ Automática (Priorizar Voz Mais Natural & Humana)</option>
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} {v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') ? '🌟 (Natural)' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="block text-[10px] text-stone-400 mt-1 leading-snug">
                      Dica: Vozes com selo <strong>"Natural"</strong> ou <strong>"Google"</strong> eliminam o som mecânico de robô.
                    </span>
                  </div>

                  {/* Personagem & Estilo da Voz */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                      Personagem & Estilo da Voz
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => handleVoiceStyleChange('mascot')}
                        className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          (localSettings.voiceStyle || 'mascot') === 'mascot'
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50 font-bold shadow-2xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="text-xl">🧸</span>
                        <span className="text-[11px] font-black leading-tight">Mascote</span>
                        <span className="text-[9px] opacity-75 leading-tight">Estilo Desenho</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVoiceStyleChange('gentle')}
                        className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          localSettings.voiceStyle === 'gentle'
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/50 font-bold shadow-2xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="text-xl">🌸</span>
                        <span className="text-[11px] font-black leading-tight">Voz Suave</span>
                        <span className="text-[9px] opacity-75 leading-tight">Apoio TEA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVoiceStyleChange('normal')}
                        className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                          localSettings.voiceStyle === 'normal'
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/50 font-bold shadow-2xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="text-xl">👤</span>
                        <span className="text-[11px] font-black leading-tight">Voz Normal</span>
                        <span className="text-[9px] opacity-75 leading-tight">Padrão Sistema</span>
                      </button>
                    </div>
                  </div>

                  {/* Speech Pace / Speed */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                      Cadência da Fala
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSettings((prev) => ({ ...prev, voiceRate: 0.88 }));
                          soundManager.setVoicePreferences(
                            localSettings.selectedVoiceURI,
                            localSettings.voicePitch,
                            0.88,
                            localSettings.voiceStyle || 'mascot'
                          );
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                          (localSettings.voiceRate || 1.0) <= 0.9
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        🧘 Fala Mais Calma (TEA)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSettings((prev) => ({ ...prev, voiceRate: 1.0 }));
                          soundManager.setVoicePreferences(
                            localSettings.selectedVoiceURI,
                            localSettings.voicePitch,
                            1.0,
                            localSettings.voiceStyle || 'mascot'
                          );
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                          (localSettings.voiceRate || 1.0) > 0.9
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        🗣️ Cadência Animada
                      </button>
                    </div>
                  </div>

                  {/* Action & Test Voice Buttons */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/60 dark:border-stone-700/60">
                    <button
                      type="button"
                      onClick={handleTestVoice}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800"
                    >
                      <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                      <span>Ouvir Apresentação</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestCelebration}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200 dark:border-amber-800"
                      title="Testa a fanfarra comemorativa e o elogio com voz de mascote"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Ouvir Elogio / Comemoração</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modo Cartões Grandes (CAA / PECS) */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      Modo Cartões Grandes (CAA / PECS)
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          localSettings.enableLargeCards !== false
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {localSettings.enableLargeCards !== false ? 'Habilitado' : 'Desabilitado'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Exibe o alternador para a prancha de ilustrações grandes e toque sonoro para crianças não-verbais.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="toggle-enable-large-cards"
                  checked={localSettings.enableLargeCards !== false}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, enableLargeCards: e.target.checked }))
                  }
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-stone-300 dark:border-stone-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Área dos Pais & Bloqueio com Senha */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      Bloqueio de Edição (Modo Criança)
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          localSettings.childLockEnabled
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {localSettings.childLockEnabled ? 'Ativado' : 'Desativado'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Impede que a criança adicione, altere ou remova tarefas sem a senha.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="child-lock-toggle"
                    checked={localSettings.childLockEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      const updated = { ...localSettings, childLockEnabled: enabled };
                      setLocalSettings(updated);
                      onSaveSettings(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-stone-600 peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Gerenciamento do PIN / Senha de 4 Dígitos */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Senha dos Pais (4 Dígitos)
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPinToDefault}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    title="Restaurar senha padrão de fábrica: 1234"
                  >
                    Restaurar 1234
                  </button>
                </div>

                {/* PIN Visual Preview & Input */}
                <div className="space-y-2 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    {/* 4 Visual Slots */}
                    <div className="flex items-center gap-1.5 flex-1 justify-center sm:justify-start">
                      {[0, 1, 2, 3].map((idx) => {
                        const digit = pinInput[idx];
                        const isFilled = digit !== undefined;
                        return (
                          <div
                            key={idx}
                            className={`w-10 h-11 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg transition-all ${
                              isFilled
                                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-300 dark:text-stone-600'
                            }`}
                          >
                            {isFilled ? (showPin ? digit : '•') : '-'}
                          </div>
                        );
                      })}
                    </div>

                    {/* Eye toggle & Clear button */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id="toggle-pin-visibility-btn"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title={showPin ? 'Ocultar números da senha' : 'Exibir números da senha'}
                        aria-label="Alternar visibilidade da senha"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        id="clear-pin-input-btn"
                        onClick={handlePinClear}
                        className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold"
                        title="Limpar campo para digitar nova senha"
                        aria-label="Limpar senha"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Direct keyboard input fallback */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type={showPin ? 'text' : 'password'}
                      id="parent-pin-input"
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={pinInput}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPinInput(val);
                        setPinError('');
                        setPinSuccessMsg('');
                      }}
                      placeholder="Digite 4 dígitos"
                      className="flex-1 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono tracking-wider text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                      type="button"
                      id="save-new-pin-btn"
                      onClick={handleSavePinNow}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Senha</span>
                    </button>
                  </div>

                  {/* Mini keypad for quick touch selection */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-1.5">
                      Toque nos números para definir a nova senha:
                    </p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => handlePinKeypad(digit)}
                          className="h-8 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 active:scale-95 font-bold text-xs text-stone-700 dark:text-stone-200 transition-all flex items-center justify-center shadow-2xs"
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Success confirmation message */}
                  {pinSuccessMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{pinSuccessMsg}</span>
                    </motion.div>
                  )}

                  {/* Error validation message */}
                  {pinError && (
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {pinError}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  Dica: anote a sua senha de 4 dígitos. Ela será necessária sempre que você quiser adicionar, editar ou excluir tarefas da rotina do seu filho.
                </p>
              </div>
            </div>

            {/* Export to Calendar / Reminders (iOS & Android) */}
            {onOpenExportCalendar && (
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  id="settings-open-export-calendar-btn"
                  onClick={() => {
                    onClose();
                    onOpenExportCalendar();
                  }}
                  className="w-full py-2.5 px-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Sincronizar Lembretes no Celular (iOS / Android)</span>
                </button>
              </div>
            )}

            {/* Reset Defaults */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      'Deseja restaurar todas as rotinas para o modelo inicial padrão?'
                    )
                  ) {
                    onResetAllToFactory();
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Todas as Rotinas Padrão</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl font-medium text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
