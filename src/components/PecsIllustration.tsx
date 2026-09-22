import React from 'react';
import { TaskIcon } from './TaskIcon';

interface PecsIllustrationProps {
  iconName: string;
  imageUrl?: string;
  className?: string;
  size?: number;
}

/**
 * Custom high-contrast, sensory-friendly vector illustrations tailored for
 * non-verbal autistic children and PECS / AAC communication boards.
 * Also supports direct ARASAAC and custom image URLs.
 */
export const PecsIllustration: React.FC<PecsIllustrationProps> = ({
  iconName,
  imageUrl,
  className = 'w-24 h-24',
  size = 96,
}) => {
  const renderGraphic = () => {
    // If an ARASAAC or custom image is provided, display it with high contrast
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={iconName}
          loading="lazy"
          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xs"
        />
      );
    }

    // 1. Vaso Sanitário / Banheiro / Privada
    if (iconName === 'Toilet') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Vaso Sanitário / Privada"
        >
          {/* Caixa acoplada (tanque) */}
          <rect x="25" y="15" width="26" height="38" rx="5" fill="#E2E8F0" stroke="#334155" strokeWidth="4" />
          <rect x="28" y="12" width="20" height="6" rx="2" fill="#CBD5E1" stroke="#334155" strokeWidth="3" />
          <circle cx="32" cy="24" r="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />

          {/* Tubo de conexão */}
          <path d="M38 53V65" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Base do vaso */}
          <path
            d="M42 66C42 66 38 78 35 84C34 86 35 88 38 88H68C71 88 72 86 71 84C68 78 64 66 64 66"
            fill="#F8FAFC"
            stroke="#334155"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect x="32" y="86" width="42" height="6" rx="3" fill="#E2E8F0" stroke="#334155" strokeWidth="3" />

          {/* Assento e bacia */}
          <ellipse cx="58" cy="52" rx="24" ry="14" fill="#F8FAFC" stroke="#334155" strokeWidth="4" />
          {/* Água limpa dentro */}
          <ellipse cx="60" cy="54" rx="14" ry="7" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" />

          {/* Tampa levantada */}
          <path
            d="M48 24C48 22 50 20 53 20C57 20 60 36 60 48H48V24Z"
            fill="#E2E8F0"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Papel higiênico ao lado */}
          <rect x="74" y="28" width="14" height="18" rx="4" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <path d="M74 38H88V48L81 45L74 48V38Z" fill="#F1F5F9" stroke="#334155" strokeWidth="2" />
        </svg>
      );
    }

    // 2. Lavar as Mãos
    if (iconName === 'Hand') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Lavar as mãos"
        >
          {/* Gotas de água */}
          <path d="M50 12C50 12 43 23 43 27C43 31 46 34 50 34C54 34 57 31 57 27C57 23 50 12 50 12Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M35 18C35 18 30 26 30 29C30 32 32 34 35 34C38 34 40 32 40 29C40 26 35 18 35 18Z" fill="#7DD3FC" />
          <path d="M65 18C65 18 60 26 60 29C60 32 62 34 65 34C68 34 70 32 70 29C70 26 65 18 65 18Z" fill="#7DD3FC" />

          {/* Bolhas de sabão */}
          <circle cx="28" cy="46" r="6" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="72" cy="44" r="7" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="50" cy="42" r="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />

          {/* Mãos com traços limpos */}
          <path
            d="M25 80L32 54C33 50 37 48 41 50C44 51 46 54 45 58L42 66L54 62C58 61 62 63 63 67C64 70 62 74 58 75L50 78"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FED7AA"
          />
          <path
            d="M75 80L68 54C67 50 63 48 59 50C56 51 54 54 55 58L58 66L46 62C42 61 38 63 37 67C36 70 38 74 42 75L50 78"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FDBA74"
          />
        </svg>
      );
    }

    // 3. Escovar os Dentes
    if (iconName === 'Sparkles') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Escovar os Dentes"
        >
          {/* Dente sorridente limpo */}
          <path
            d="M32 28C24 28 20 38 20 48C20 62 26 78 35 84C39 86 43 83 45 78L48 68C49 66 51 66 52 68L55 78C57 83 61 86 65 84C74 78 80 62 80 48C80 38 76 28 68 28C60 28 55 33 50 33C45 33 40 28 32 28Z"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Sorriso simpático no dente */}
          <circle cx="38" cy="46" r="3" fill="#334155" />
          <circle cx="62" cy="46" r="3" fill="#334155" />
          <path d="M42 54C46 58 54 58 58 54" stroke="#334155" strokeWidth="3" strokeLinecap="round" />

          {/* Escova de dente inclinada */}
          <rect x="68" y="12" width="10" height="24" rx="4" fill="#38BDF8" stroke="#334155" strokeWidth="3" transform="rotate(35 68 12)" />
          <rect x="73" y="14" width="6" height="8" rx="1" fill="#FFFFFF" transform="rotate(35 73 14)" />

          {/* Brilhos de limpeza */}
          <path d="M16 26L20 22L16 18L12 22Z" fill="#FACC15" />
          <path d="M84 26L88 22L84 18L80 22Z" fill="#FACC15" />
          <path d="M82 66L86 62L82 58L78 62Z" fill="#38BDF8" />
        </svg>
      );
    }

    // 4. Banho / Chuveiro
    if (iconName === 'Bath' || iconName === 'ShowerHead') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Tomar Banho"
        >
          {/* Cano do chuveiro */}
          <path d="M20 18H55V28" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          {/* Ducha */}
          <path d="M42 28H68L64 38H46L42 28Z" fill="#94A3B8" stroke="#334155" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Gotas de água caindo */}
          <line x1="48" y1="44" x2="47" y2="52" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="55" y1="44" x2="55" y2="54" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="62" y1="44" x2="63" y2="52" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />

          <line x1="45" y1="58" x2="44" y2="66" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="55" y1="60" x2="55" y2="70" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="65" y1="58" x2="66" y2="66" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Banheira ou piso com espuma */}
          <path d="M22 84C22 76 30 74 40 74H74C82 74 88 80 88 84H22Z" fill="#BAE6FD" stroke="#334155" strokeWidth="3" />
          <circle cx="34" cy="73" r="6" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="48" cy="71" r="7" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="64" cy="72" r="6" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
        </svg>
      );
    }

    // 5. Alimentação / Café / Almoço
    if (iconName === 'UtensilsCrossed' || iconName === 'Soup') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Alimentação / Refeição"
        >
          {/* Prato */}
          <circle cx="50" cy="54" r="32" fill="#F8FAFC" stroke="#334155" strokeWidth="4" />
          <circle cx="50" cy="54" r="22" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
          {/* Comidinha gostosa */}
          <circle cx="46" cy="50" r="6" fill="#FB923C" />
          <circle cx="56" cy="52" r="5" fill="#4ADE80" />
          <circle cx="48" cy="58" r="5" fill="#F87171" />

          {/* Garfo à esquerda */}
          <path d="M12 36V50C12 55 16 58 19 58V80" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M16 36V48M19 36V48" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Colher à direita */}
          <ellipse cx="83" cy="42" rx="6" ry="9" fill="#E2E8F0" stroke="#334155" strokeWidth="3.5" />
          <path d="M83 51V80" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />

          {/* Fumacinha quentinha */}
          <path d="M46 16C44 20 48 24 46 28" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 14C52 19 56 23 54 27" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }

    // 6. Brincar / Brinquedos / Games
    if (iconName === 'Gamepad2' || iconName === 'Box') {
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-full max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Hora de Brincar"
        >
          {/* Controle de videogame lúdico */}
          <rect x="18" y="32" width="64" height="40" rx="18" fill="#C084FC" stroke="#334155" strokeWidth="4" />
          {/* Botões direcionais */}
          <path d="M34 44V60M26 52H42" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* Botões de ação coloridos */}
          <circle cx="64" cy="46" r="4" fill="#F43F5E" stroke="#334155" strokeWidth="2" />
          <circle cx="72" cy="54" r="4" fill="#FACC15" stroke="#334155" strokeWidth="2" />
          <circle cx="64" cy="62" r="4" fill="#38BDF8" stroke="#334155" strokeWidth="2" />
          <circle cx="56" cy="54" r="4" fill="#4ADE80" stroke="#334155" strokeWidth="2" />

          {/* Estrelas de diversão */}
          <path d="M22 22L24 18L26 22L30 24L26 26L24 30L22 26L18 24Z" fill="#FACC15" />
          <path d="M78 22L80 18L82 22L86 24L82 26L80 30L78 26L74 24Z" fill="#FACC15" />
        </svg>
      );
    }

    // Fallback padrão: ícone TaskIcon centralizado
    return (
      <div className="flex items-center justify-center w-full h-full text-stone-700">
        <TaskIcon name={iconName} size={size * 0.55} className="text-current" />
      </div>
    );
  };

  // Uniform crisp white canvas tile for authentic PECS communication flashcards
  return (
    <div
      className={`flex items-center justify-center p-2 rounded-2xl bg-white border border-stone-200/90 shadow-2xs shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {renderGraphic()}
    </div>
  );
};
