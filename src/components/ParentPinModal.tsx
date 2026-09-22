import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Delete, ShieldCheck, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ParentPinModalProps {
  isOpen: boolean;
  correctPin: string;
  title?: string;
  description?: string;
  onSuccess: () => void;
  onClose: () => void;
  onResetPinToDefault?: () => void;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  correctPin,
  title = 'Área dos Pais',
  description = 'Digite a senha de 4 dígitos para liberar a edição da rotina.',
  onSuccess,
  onClose,
  onResetPinToDefault,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);

  const targetPin = correctPin || '1234';

  const resetInput = useCallback(() => {
    setPin('');
    setError(false);
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetInput();
      setWrongAttempts(0);
    }
  }, [isOpen, resetInput]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return;
      setError(false);
      setErrorMessage('');

      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === targetPin) {
          soundManager.playSound('chime', 0.5);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 150);
        } else {
          soundManager.playSound('bell', 0.4);
          setError(true);
          setWrongAttempts((prev) => prev + 1);
          setErrorMessage('Senha incorreta. Tente novamente.');
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    },
    [pin, targetPin, onSuccess, onClose]
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
    setErrorMessage('');
  }, []);

  // Physical keyboard listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleDigit, handleDelete, onClose]);

  // Recovery challenge state for adults
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<{ n1: number; n2: number; op: string; answer: number }>({
    n1: 14,
    n2: 23,
    op: '+',
    answer: 37,
  });
  const [challengeInput, setChallengeInput] = useState<string>('');
  const [challengeError, setChallengeError] = useState<string>('');

  const generateChallenge = () => {
    const isMult = Math.random() > 0.5;
    if (isMult) {
      const n1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const n2 = Math.floor(Math.random() * 6) + 3; // 3 to 8
      return { n1, n2, op: '×', answer: n1 * n2 };
    } else {
      const n1 = Math.floor(Math.random() * 30) + 15; // 15 to 44
      const n2 = Math.floor(Math.random() * 25) + 12; // 12 to 36
      return { n1, n2, op: '+', answer: n1 + n2 };
    }
  };

  const handleStartRecovery = () => {
    setChallenge(generateChallenge());
    setChallengeInput('');
    setChallengeError('');
    setIsRecovering(true);
  };

  const handleVerifyRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(challengeInput.trim(), 10);
    if (val === challenge.answer) {
      if (onResetPinToDefault) {
        onResetPinToDefault();
      }
      setIsRecovering(false);
      resetInput();
      setErrorMessage('Senha restaurada para 1234.');
      soundManager.playSound('chime', 0.5);
    } else {
      setChallengeError('Resultado incorreto. Tente novamente.');
      setChallengeInput('');
      soundManager.playSound('bell', 0.4);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-80 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800"
          id="parent-pin-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">
                  {isRecovering ? 'Recuperação de Senha' : title}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  {isRecovering ? 'Desafio para Adultos' : 'Proteção de Edição'}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="close-parent-pin-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isRecovering ? (
            /* Adult Recovery Challenge */
            <div className="p-5 flex flex-col items-center text-center">
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xs mb-4">
                Para redefinir o PIN para o padrão (1234), resolva a operação matemática abaixo:
              </p>

              <form onSubmit={handleVerifyRecovery} className="w-full max-w-[240px] space-y-3">
                <div className="py-2.5 px-4 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-lg text-stone-900 dark:text-stone-100 tracking-wider">
                  Quanto é {challenge.n1} {challenge.op} {challenge.n2} ?
                </div>

                <input
                  type="number"
                  autoFocus
                  placeholder="Resultado"
                  value={challengeInput}
                  onChange={(e) => {
                    setChallengeInput(e.target.value);
                    setChallengeError('');
                  }}
                  className="w-full px-3 py-2 text-center text-base font-bold bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
                />

                {challengeError && (
                  <p className="text-xs font-semibold text-rose-500">{challengeError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRecovering(false)}
                    className="flex-1 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Standard Tactile Keypad PIN Input */
            <div className="p-5 flex flex-col items-center text-center">
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xs mb-5">
                {description}
              </p>

              {/* 4-digit PIN Dots */}
              <div className="flex items-center justify-center gap-3.5 mb-3">
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = pin.length > index;
                  return (
                    <motion.div
                      key={index}
                      animate={
                        error
                          ? { x: [-6, 6, -4, 4, 0] }
                          : isFilled
                          ? { scale: [1, 1.25, 1] }
                          : {}
                      }
                      transition={{ duration: 0.25 }}
                      className={`w-4 h-4 rounded-full transition-all border ${
                        error
                          ? 'bg-rose-500 border-rose-600 ring-2 ring-rose-200 dark:ring-rose-950'
                          : isFilled
                          ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-700 dark:border-indigo-400 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error Message */}
              <div className="h-5 mb-2">
                {errorMessage ? (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMessage}
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Ambiente protegido para os pais
                  </span>
                )}
              </div>

              {/* Tactile Keypad */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] my-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    id={`pin-key-${digit}`}
                    onClick={() => handleDigit(digit)}
                    className="h-13 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 text-xl font-bold text-stone-800 dark:text-stone-100 transition-all shadow-2xs flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  id="pin-key-clear"
                  onClick={resetInput}
                  className="h-13 rounded-2xl bg-stone-50 dark:bg-stone-850 hover:bg-stone-200/70 dark:hover:bg-stone-750 text-xs font-semibold text-stone-500 dark:text-stone-400 transition-all flex items-center justify-center"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  id="pin-key-0"
                  onClick={() => handleDigit('0')}
                  className="h-13 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 text-xl font-bold text-stone-800 dark:text-stone-100 transition-all shadow-2xs flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  id="pin-key-backspace"
                  onClick={handleDelete}
                  className="h-13 rounded-2xl bg-stone-50 dark:bg-stone-850 hover:bg-stone-200/70 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 transition-all flex items-center justify-center"
                  title="Apagar dígito"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Recovery Option with adult gate */}
              <div className="mt-2.5 text-center space-y-1">
                {wrongAttempts >= 2 && onResetPinToDefault && (
                  <button
                    type="button"
                    id="pin-forgot-reset-btn"
                    onClick={handleStartRecovery}
                    className="text-xs text-amber-600 dark:text-amber-400 font-bold underline hover:opacity-80 transition-opacity block mx-auto pt-1"
                  >
                    Esqueceu a senha? Toque para recuperar
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
