import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Loader2,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import {
  searchArasaacPictograms,
  ArasaacPictogram,
  ARASAAC_POPULAR_TAGS,
} from '../utils/arasaac';

interface ArasaacPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, title?: string) => void;
  currentImageUrl?: string;
  defaultSearchQuery?: string;
}

export const ArasaacPickerModal: React.FC<ArasaacPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentImageUrl,
  defaultSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);
  const [results, setResults] = useState<ArasaacPictogram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if a initial query is provided
  useEffect(() => {
    if (isOpen) {
      const initialTerm = defaultSearchQuery.trim() || 'banheiro';
      setSearchQuery(defaultSearchQuery);
      performSearch(initialTerm);
    }
  }, [isOpen, defaultSearchQuery]);

  const performSearch = async (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchArasaacPictograms(clean);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleTagClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 dark:bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="arasaac-picker-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base leading-tight flex items-center gap-1.5">
                  <span>Buscar Desenhos ARASAAC (CAA)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Oficial
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Pictogramas abertos padronizados para autismo e comunicação alternativa
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800/80 space-y-3">
            <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquise: banheiro, escovar dentes, comer, banho..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-stone-400"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Buscar</span>
                )}
              </button>
            </form>

            {/* Quick Pick Tags */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Temas Rápidos Frequentes:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {ARASAAC_POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag.query}
                    type="button"
                    onClick={() => handleTagClick(tag.query)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 border shrink-0 ${
                      searchQuery.toLowerCase() === tag.query.toLowerCase()
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-indigo-300'
                    }`}
                  >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="p-4 flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-stone-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="text-xs font-semibold">Buscando pictogramas oficiais...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {results.map((pic) => {
                  const isSelected = currentImageUrl === pic.imageUrl;
                  return (
                    <motion.button
                      key={pic.id}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onSelect(pic.imageUrl, pic.name);
                        onClose();
                      }}
                      className={`group relative p-2.5 bg-white dark:bg-stone-800 rounded-2xl border-2 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 ring-2 ring-indigo-200 dark:ring-indigo-900'
                          : 'border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className="w-20 h-20 flex items-center justify-center p-1 bg-white rounded-xl mb-1.5">
                        <img
                          src={pic.imageUrl}
                          alt={pic.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 capitalize line-clamp-2 leading-tight">
                        {pic.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : hasSearched ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
                  Nenhum pictograma encontrado para "{searchQuery}"
                </p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Tente usar termos mais simples como <em>"banheiro"</em>, <em>"comer"</em>, <em>"dormir"</em> ou use os botões rápidos acima.
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer with ARASAAC Attribution */}
          <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span className="truncate">
              Símbolos: <strong>ARASAAC</strong> (Governo de Aragão) • Licença CC (BY-NC-SA)
            </span>
            <a
              href="https://arasaac.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0 ml-2"
            >
              <span>arasaac.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
