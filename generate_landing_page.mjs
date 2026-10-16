import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const NOTEBOOK_DIR = path.join(process.cwd(), 'NotebookLM');

const DIST_DIR = path.join(process.cwd(), 'dist');

// Garante que a pasta de screenshots existe em public e dist
const SCREENSHOTS_PUBLIC = path.join(PUBLIC_DIR, 'screenshots');
const SCREENSHOTS_DIST = path.join(DIST_DIR, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_PUBLIC)) fs.mkdirSync(SCREENSHOTS_PUBLIC, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIST)) fs.mkdirSync(SCREENSHOTS_DIST, { recursive: true });

const requiredScreenshots = [
  '02_prancha_tea_pecs.png',
  '03_prancha_primeiro_depois.png',
  '04_modal_foco_micro_passos.png',
  '08_modal_temporizador_visual.png',
  '11_modal_sincronizacao_calendario.png',
  '09_modal_compartilhar_whatsapp.png'
];

requiredScreenshots.forEach(file => {
  const src = path.join(NOTEBOOK_DIR, 'prints', file);
  const pub = path.join(SCREENSHOTS_PUBLIC, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, pub);
  }
  if (fs.existsSync(DIST_DIR) && fs.existsSync(pub)) {
    fs.copyFileSync(pub, path.join(SCREENSHOTS_DIST, file));
  }
});

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <title>Synapsis Kids — Rotina Visual com a Mascote Panquecca, Previsibilidade e Autonomia para TEA e TDAH</title>
  <meta name="description" content="Aplicativo gratuito de rotina visual baseado em ABA, TEACCH e CAA/PECS com a Mascote Panquecca. Promove autonomia, previsibilidade e autorregulação em crianças no Espectro Autista e TDAH. 100% gratuito e sem anúncios.">

  <!-- Open Graph / Redes Sociais / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Synapsis Kids — Rotina Visual & Mascote Panquecca para TEA e TDAH">
  <meta property="og:description" content="Rotina visual interativa com a Mascote Panquecca, prancha Primeiro/Depois, pictogramas ARASAAC, Time Timer e sons acolhedores. 100% gratuito e sem anúncios.">
  <meta property="og:image" content="https://rotina.synapsisclinico.com.br/assets/synapsi_1_full.png">
  <meta property="og:url" content="https://rotina.synapsisclinico.com.br">

  <link rel="icon" type="image/png" href="assets/synapsi_brain1.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon-180.png">

  <!-- Fontes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              400: '#2dd4bf',
              500: '#14b8a6',
              600: '#0d9488',
              700: '#0f766e',
              800: '#115e59',
              900: '#134e4a',
            },
            kids: {
              indigo: '#4F46E5',
              indigoDark: '#3730A3',
              amber: '#F59E0B',
              rose: '#F43F5E',
              emerald: '#10B981',
              navy: '#090D16',
              navyCard: '#0F172A',
              navyBorder: '#1E293B',
            }
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --sat: env(safe-area-inset-top, 0px);
      --sab: env(safe-area-inset-bottom, 0px);
    }
    html {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .glow-teal {
      box-shadow: 0 0 60px -15px rgba(20, 184, 166, 0.35);
    }
    .glow-amber {
      box-shadow: 0 0 60px -15px rgba(245, 158, 11, 0.35);
    }
    .glow-indigo {
      box-shadow: 0 0 60px -15px rgba(79, 70, 229, 0.35);
    }
    .badge-pulse {
      animation: pulseGlow 2.5s infinite;
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.95); }
    }
    /* Barra Flutuante Mobile */
    #mobile-sticky-bar {
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    }
    #mobile-sticky-bar.visible {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    #mobile-sticky-bar.hidden-bar {
      transform: translateY(115%);
      opacity: 0;
      pointer-events: none;
    }
    /* Menu Gaveta Mobile */
    #mobile-drawer {
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    #mobile-drawer.drawer-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
      max-height: 600px;
    }
    #mobile-drawer.drawer-closed {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-10px);
      max-height: 0;
    }
    /* Modal de Zoom Touch-Friendly */
    #zoom-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(9, 13, 22, 0.96);
      backdrop-filter: blur(10px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
      padding: 1rem;
    }
    #zoom-modal img {
      max-width: 96vw;
      max-height: 88vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      object-fit: contain;
    }
    /* Ocultar barra de rolagem mas manter rolagem fluida */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">

  <!-- ==================== BANNER SUPERIOR INFORMATIVO ==================== -->
  <div class="hidden sm:block bg-gradient-to-r from-teal-900/60 via-slate-900 to-indigo-950/60 border-b border-teal-500/20 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center">
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] sm:text-[11px]">
        🌿 PROTOCOLO CLÍNICO & FAMILIAR
      </span>
      <span class="text-slate-300 leading-snug">
        Validação neuropsicológica especializada em TEA & TDAH • <strong>100% Gratuito & Sem Anúncios</strong> • Com a <strong>Mascote Panquecca 🐾</strong>
      </span>
    </div>
  </div>

  <!-- ==================== NAVBAR RESPONSIVA ==================== -->
  <header class="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2">
      
      <!-- Logo Oficial Synapsis Kids -->
      <a href="/" data-app-link class="flex items-center group shrink-0" title="Synapsis Kids">
        <img src="assets/synapsi_1_full.png" alt="Synapsis Kids" width="220" height="56" fetchpriority="high" class="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(79,70,229,0.35)] group-hover:scale-105 transition-transform">
      </a>

      <!-- Menu Links Desktop -->
      <nav class="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-semibold text-slate-300 shrink-0">
        <a href="#mascote" class="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400 font-bold">
          <span>🐾 Mascote Panquecca</span>
        </a>
        <a href="#recursos" class="hover:text-teal-400 transition-colors">Recursos</a>
        <a href="#versatilidade" class="hover:text-indigo-300 transition-colors">Para Jovens & Adultos</a>
        <a href="#metodo" class="hover:text-teal-400 transition-colors">Método Clínico</a>
        <a href="https://www.instagram.com/synapsisclinico" target="_blank" rel="noopener noreferrer" class="hover:text-pink-400 transition-colors flex items-center gap-1 text-pink-300">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>@synapsisclinico</span>
        </a>
        <a href="#clinico" class="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:border-teal-400">
          <span>💼 Para Clínicas</span>
        </a>
      </nav>

      <!-- Ações Mobile -->
      <div class="flex md:hidden items-center gap-2 ml-auto">
        <a href="#mascote" class="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs active:scale-95 transition whitespace-nowrap">
          <span>🐾 Panquecca</span>
        </a>
        <button id="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Abrir menu de navegação" aria-expanded="false" class="w-11 h-11 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 shrink-0 cursor-pointer">
          <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Menu Gaveta Mobile -->
    <div id="mobile-drawer" class="drawer-closed md:hidden border-b border-slate-800 bg-[#090D16]/98 px-4 py-4 space-y-3 shadow-2xl backdrop-blur-xl">
      <nav class="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
        <a href="#mascote" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 transition flex items-center justify-between">
          <span class="flex items-center gap-2">🐾 Conheça a Mascote Panquecca</span>
          <span class="text-xs">➔</span>
        </a>
        <a href="#recursos" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between">
          <span>✨ Recursos do Aplicativo</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="#versatilidade" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between text-indigo-300">
          <span>🎯 Também para Jovens & Adultos</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="#metodo" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between">
          <span>🧠 Concepção Clínica & Especialista</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="https://www.instagram.com/synapsisclinico" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between text-pink-300">
          <span class="flex items-center gap-2">📸 Siga @synapsisclinico no Instagram</span>
          <span class="text-xs">➔</span>
        </a>
        <a href="#clinico" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 hover:bg-teal-900/40 transition flex items-center justify-between mt-1">
          <span>💼 Para Clínicas & Terapeutas</span>
          <span class="text-xs">➔</span>
        </a>
      </nav>
    </div>
  </header>

  <!-- ==================== HERO SECTION ==================== -->
  <section class="relative pt-6 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        <!-- Selo de Início -->
        <div class="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-slate-800/90 border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-bold shadow-inner">
          <span class="flex items-center gap-1.5">
            <span class="flex h-2 w-2 rounded-full bg-teal-400 badge-pulse shrink-0"></span>
            <span>🌿 PROTOCOLO CLÍNICO & FAMILIAR</span>
          </span>
          <span class="hidden sm:inline text-teal-500/60">•</span>
          <span class="text-teal-200/80 font-semibold text-[10px] sm:text-[11px]">Rotina Visual Estruturada • Foco, Previsibilidade & Mascote Panquecca</span>
        </div>

        <!-- Headline Principal -->
        <h1 class="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.12]">
          Mais Previsibilidade, Menos Ansiedade: <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-200 to-indigo-400">A Rotina Visual que Acolhe o Dia da Criança.</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal px-2">
          Desenvolvido com validação neuropsicológica especializada em TEA e TDAH. Prancha interativa CAA/PECS com a <strong>Mascote Panquecca</strong>, prancha Primeiro/Depois, pictogramas oficiais ARASAAC e sons acolhedores.
        </p>

        <!-- Badges de Confiança -->
        <div class="pt-4 sm:pt-6 max-w-xl mx-auto">
          <div class="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm font-semibold text-slate-200">
            <div class="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/60 sm:bg-transparent border border-slate-700/60 sm:border-0 shadow-sm sm:shadow-none">
              <span class="text-emerald-400 font-bold text-sm sm:text-base">✓</span> 100% Gratuito
            </div>
            <div class="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/60 sm:bg-transparent border border-slate-700/60 sm:border-0 shadow-sm sm:shadow-none">
              <span class="text-emerald-400 font-bold text-sm sm:text-base">✓</span> Sem Anúncios
            </div>
            <div class="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/60 sm:bg-transparent border border-slate-700/60 sm:border-0 shadow-sm sm:shadow-none">
              <span class="text-emerald-400 font-bold text-sm sm:text-base">✓</span> Funciona Offline
            </div>
            <div class="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/60 sm:bg-transparent border border-slate-700/60 sm:border-0 shadow-sm sm:shadow-none">
              <span class="text-emerald-400 font-bold text-sm sm:text-base">✓</span> Privacidade Total
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== SEÇÃO ESTELAR: MASCOTE PANQUECCA ==================== -->
  <section id="mascote" class="py-14 sm:py-20 bg-gradient-to-b from-slate-900/60 via-indigo-950/30 to-[#090D16] border-y border-amber-500/30 relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Cabeçalho da Panquecca -->
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black tracking-wide border border-amber-500/40 shadow-inner">
          <span>🐾</span> A MASCOTE OFICIAL DO SYNAPSIS KIDS
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Conheça a <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">Panquecca</span>: A Amiga que Conecta e Motiva a Criança!
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Crianças com autismo e TDAH frequentemente travam ou entram em crise com comandos verbais insistentes. A Panquecca transforma o momento da tarefa em um jogo afetivo de modelagem e conquista.
        </p>
      </div>

      <!-- 4 Pilares da Mascote Panquecca -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        
        <!-- Pilar 1 -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-3 hover:border-amber-400 transition flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl">
              🪥
            </div>
            <h3 class="text-lg font-bold text-white">Modelagem Visual Concreta</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              A Panquecca demonstra a execução real da ação: escovando os dentes, tomando banho, comendo frutas e guardando os brinquedos. A criança aprende por imitação visual natural.
            </p>
          </div>
          <span class="text-[11px] font-bold text-amber-400">✓ Reduz atrito com os pais</span>
        </div>

        <!-- Pilar 2 -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-xl space-y-3 hover:border-teal-400 transition flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-2xl">
              🎉
            </div>
            <h3 class="text-lg font-bold text-white">Reforço Positivo Imediato</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Ao concluir a atividade, a Panquecca vibra com sorrisos e confetes coloridos na tela. Sem cobranças ou castigos: apenas dopamina saudável e sensação de vitória e autoeficácia.
            </p>
          </div>
          <span class="text-[11px] font-bold text-teal-400">✓ Conquista e autoestima</span>
        </div>

        <!-- Pilar 3 -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-3 hover:border-indigo-400 transition flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl">
              🎙️
            </div>
            <h3 class="text-lg font-bold text-white">Voz Aconchegante sem Ruído</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Chega de alarmes estridentes de celular que disparam crises sensoriais. A Panquecca fala com afeto, ritmo sereno e modulação sonora suave para acolher a hipersensibilidade auditiva.
            </p>
          </div>
          <span class="text-[11px] font-bold text-indigo-400">✓ Proteção sensorial ativa</span>
        </div>

        <!-- Pilar 4 -->
        <div class="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3 hover:border-emerald-400 transition flex flex-col justify-between">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h3 class="text-lg font-bold text-white">Previsibilidade & Vínculo</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              A mesma personagem acolhedora acompanha a rotina do amanhecer até a hora de dormir, criando segurança emocional e desarmando a resistência nas transições difíceis do dia.
            </p>
          </div>
          <span class="text-[11px] font-bold text-emerald-400">✓ Rotina sem estresse</span>
        </div>

      </div>

      <!-- Vitrine Visual da Mascote Panquecca em Ação -->
      <div class="p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-white">A Panquecca nas Atividades do Dia a Dia</h3>
            <p class="text-xs sm:text-sm text-slate-400">Toque em qualquer imagem para ampliar os detalhes e a expressividade da mascote.</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Card Panquecca 1: Escovando -->
          <div class="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 transition overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between" onclick="zoomImage(this.querySelector('img'))">
            <div class="h-44 sm:h-56 bg-slate-950 p-2 flex items-center justify-center overflow-hidden relative">
              <img src="mascots/panquecca_escovando.jpg" alt="Panquecca Escovando os Dentes" loading="lazy" decoding="async" width="220" height="220" class="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-amber-300 font-bold border border-amber-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-3.5 bg-slate-900 border-t border-slate-800/80">
              <h4 class="text-xs sm:text-sm font-bold text-white">Escovar os Dentes</h4>
              <p class="text-[11px] text-slate-400">Modelagem do hábito com escova e pasta</p>
            </div>
          </div>

          <!-- Card Panquecca 2: Banho -->
          <div class="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-400/60 transition overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between" onclick="zoomImage(this.querySelector('img'))">
            <div class="h-44 sm:h-56 bg-slate-950 p-2 flex items-center justify-center overflow-hidden relative">
              <img src="mascots/panquecca_banho.jpg" alt="Panquecca na Hora do Banho" loading="lazy" decoding="async" width="220" height="220" class="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-3.5 bg-slate-900 border-t border-slate-800/80">
              <h4 class="text-xs sm:text-sm font-bold text-white">Hora do Banho</h4>
              <p class="text-[11px] text-slate-400">Previsibilidade acolhedora na água</p>
            </div>
          </div>

          <!-- Card Panquecca 3: Alimentação -->
          <div class="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-400/60 transition overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between" onclick="zoomImage(this.querySelector('img'))">
            <div class="h-44 sm:h-56 bg-slate-950 p-2 flex items-center justify-center overflow-hidden relative">
              <img src="mascots/panquecca_comendo.jpg" alt="Panquecca na Hora de Comer" loading="lazy" decoding="async" width="220" height="220" class="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-orange-300 font-bold border border-orange-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-3.5 bg-slate-900 border-t border-slate-800/80">
              <h4 class="text-xs sm:text-sm font-bold text-white">Alimentação & Frutas</h4>
              <p class="text-[11px] text-slate-400">Incentivo à refeição tranquila e nutritiva</p>
            </div>
          </div>

          <!-- Card Panquecca 4: Sorriso Vitória -->
          <div class="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-400/60 transition overflow-hidden shadow-lg cursor-pointer flex flex-col justify-between" onclick="zoomImage(this.querySelector('img'))">
            <div class="h-44 sm:h-56 bg-slate-950 p-2 flex items-center justify-center overflow-hidden relative">
              <img src="mascots/panquecca_sorriso.jpg" alt="Panquecca Comemorando Vitória" loading="lazy" decoding="async" width="220" height="220" class="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-pink-300 font-bold border border-pink-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-3.5 bg-slate-900 border-t border-slate-800/80">
              <h4 class="text-xs sm:text-sm font-bold text-white">Comemoração & Vitória</h4>
              <p class="text-[11px] text-slate-400">Reforço positivo, sorrisos e confetes</p>
            </div>
          </div>

        </div>

        <!-- Nota de Flexibilidade / Mascote Opcional -->
        <div class="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div class="flex items-center gap-3.5">
            <span class="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-lg shrink-0">
              ⚙️
            </span>
            <div class="space-y-0.5">
              <h4 class="text-xs sm:text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>Prefere um visual minimalista e neutro?</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 text-[10px] font-semibold border border-slate-700">Mascote Opcional</span>
              </h4>
              <p class="text-xs text-slate-400 leading-relaxed max-w-2xl">
                A Mascote Panquecca pode ser ativada ou desativada quando quiser. Para jovens e adultos que buscam discrição, você pode montar pranchas limpas utilizando apenas pictogramas diretos ARASAAC ou ícones visuais alternativos.
              </p>
            </div>
          </div>
          <a href="#versatilidade" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition whitespace-nowrap border border-slate-700">
            Ver Modo Adulto ↓
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- ==================== RECURSOS DO APLICATIVO COM TELAS REAIS ==================== -->
  <section id="recursos" class="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
      <div class="max-w-2xl space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <span>✨</span> Recursos Feitos para o Dia a Dia
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tudo o que pais e terapeutas precisam.
        </h2>
        <p class="text-slate-400 text-sm sm:text-base">
          Veja as telas reais do aplicativo. Deslize horizontalmente ou toque em qualquer tela para ampliar em tela cheia.
        </p>
      </div>

      <!-- Contador de Navegação -->
      <div class="flex items-center gap-3 shrink-0 self-start sm:self-end">
        <span id="recursos-counter" class="text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 flex items-center gap-1.5 shadow-sm">
          <span>⚡</span> 1 de 6 recursos
        </span>
      </div>
    </div>

    <!-- Carrossel Horizontal com Snap Touch-Friendly e Setas Laterais -->
    <div class="relative group/recursos">
      <!-- Seta Lateral Esquerda -->
      <button 
        id="recursos-prev-btn" 
        type="button" 
        aria-label="Ver recurso anterior" 
        title="Recurso anterior"
        class="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 hover:border-teal-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <!-- Seta Lateral Direita -->
      <button 
        id="recursos-next-btn" 
        type="button" 
        aria-label="Ver próximo recurso" 
        title="Próximo recurso"
        class="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 hover:border-teal-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
      </button>

      <div 
        id="recursos-carousel" 
        class="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        
        <!-- Card 1: Prancha Visual PECS & ARASAAC -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/02_prancha_tea_pecs.png" alt="Prancha Visual TEA e Pictogramas ARASAAC" fetchpriority="high" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">🧩</span>
              <h3 class="text-base font-extrabold text-white">Prancha PECS & Pictogramas ARASAAC</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Cartões grandes em formato CAA/PECS integrados ao catálogo oficial ARASAAC com a Mascote Panquecca. A criança toca no cartão para ouvir o comando e toca para concluir com confetes e reforço positivo.
            </p>
          </div>
        </div>

        <!-- Card 2: Modo Primeiro / Depois -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/03_prancha_primeiro_depois.png" alt="Prancha Primeiro e Depois Anti-Crises" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">⚖️</span>
              <h3 class="text-base font-extrabold text-white">Prancha Primeiro / Depois (First-Then)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              A clássica técnica comportamental para desarmar crises de transição: conecta a obrigação imediata (Primeiro) ao reforço motivador esperado (Depois), eliminando a ansiedade.
            </p>
          </div>
        </div>

        <!-- Card 3: Janela de Foco em Micro-Passos -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/04_modal_foco_micro_passos.png" alt="Janela de Foco na Tarefa e Micro-Passos" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">🔍</span>
              <h3 class="text-base font-extrabold text-white">Janela de Foco & Subtarefas</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Decompõe rotinas difíceis (como banho ou escovar dentes) em 4 micro-passos visuais simples com a Mascote Panquecca. A criança não se sente sobrecarregada e sabe exatamente o que fazer.
            </p>
          </div>
        </div>

        <!-- Card 4: Temporizador Visual Time Timer -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/08_modal_temporizador_visual.png" alt="Temporizador Visual Time Timer" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">⏱️</span>
              <h3 class="text-base font-extrabold text-white">Temporizador Time Timer (Disco Vermelho)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              O clássico disco colorido que vai encolhendo conforme o tempo passa. A criança compreende a passagem do tempo visualmente, sem números estressantes ou contagens regressivas que causam pânico.
            </p>
          </div>
        </div>

        <!-- Card 5: Sincronização de Calendário Oficial -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/11_modal_sincronizacao_calendario.png" alt="Sincronização de Calendário iOS e Android" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">📅</span>
              <h3 class="text-base font-extrabold text-white">Lembretes no Calendário (iPhone & Android)</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Exporte toda a semana para o Apple Calendar ou Google Agenda com 1 toque (.ICS). Notificações pontuais e silenciosas para a família nunca esquecer os horários de remédios e tarefas.
            </p>
          </div>
        </div>

        <!-- Card 6: Compartilhamento WhatsApp -->
        <div class="recurso-card w-[84vw] max-w-[340px] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
          <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="screenshots/09_modal_compartilhar_whatsapp.png" alt="Compartilhamento por Link Mágico no WhatsApp" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar
            </span>
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="text-xl">📲</span>
              <h3 class="text-base font-extrabold text-white">Sincronização 1-Clique via WhatsApp</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Terapeutas e pais compartilham a programação inteira através de um Link Mágico seguro. A família clica no link e o aplicativo importa a rotina completa na hora.
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Indicadores de Paginação / Dots + Dica Mobile -->
    <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <div class="flex items-center gap-2 text-xs text-slate-400 sm:hidden">
        <span class="inline-block animate-pulse">👈</span>
        <span class="font-medium text-slate-300">Deslize para o lado para ver todos os recursos</span>
        <span class="inline-block animate-pulse">👉</span>
      </div>

      <div class="flex items-center justify-center gap-1 sm:gap-2 mx-auto sm:mx-0" id="recursos-dots">
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="0" aria-label="Ir para recurso 1">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-teal-400 w-8 shadow-[0_0_12px_rgba(45,212,191,0.6)]"></span>
        </button>
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="1" aria-label="Ir para recurso 2">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="2" aria-label="Ir para recurso 3">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="3" aria-label="Ir para recurso 4">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="4" aria-label="Ir para recurso 5">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
        <button class="recurso-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="5" aria-label="Ir para recurso 6">
          <span class="recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
      </div>
    </div>
  </section>

  <!-- ==================== VERSATILIDADE PARA TODAS AS IDADES & MODO NEUTRO ==================== -->
  <section id="versatilidade" class="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
    <div class="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
        <span>🎯 VERSATILIDADE TOTAL • DA INFÂNCIA À VIDA ADULTA</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Uma ferramenta que evolui com você. <br class="hidden sm:inline">Com ou sem mascote.
      </h2>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
        A previsibilidade visual e o combate à disfunção executiva não têm idade. O Synapsis Kids adapta-se tanto ao universo lúdico infantil quanto à rotina discreta e focada de jovens e adultos com TDAH e Autismo.
      </p>
    </div>

    <!-- Carrossel Horizontal no Mobile / Grid no Desktop com Setas Laterais -->
    <div class="relative group/versatilidade">
      <!-- Seta Lateral Esquerda (Mobile) -->
      <button 
        id="versatilidade-prev-btn" 
        type="button" 
        aria-label="Ver perfil anterior" 
        title="Perfil anterior"
        class="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md md:hidden"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <!-- Seta Lateral Direita (Mobile) -->
      <button 
        id="versatilidade-next-btn" 
        type="button" 
        aria-label="Ver próximo perfil" 
        title="Próximo perfil"
        class="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md md:hidden"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
      </button>

      <div 
        id="versatilidade-carousel" 
        class="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:p-0"
      >
        <!-- Card 1: Primeira Infância & Crianças -->
        <div class="versatilidade-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 transition shadow-xl flex flex-col justify-between space-y-5">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                🧸
              </span>
              <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                Lúdico & Afetivo
              </span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Crianças no TEA e TDAH</h3>
              <p class="text-xs text-amber-400 font-semibold mt-0.5">Com a Mascote Panquecca</p>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Vínculo acolhedor com a cachorrinha Panquecca em 3D, sons suaves de comemoração e reforço de estrelinhas para engajar nos hábitos diários (banho, escovação e alimentação) sem estresse ou crises sensoriais.
            </p>
          </div>
          <ul class="text-[11px] text-slate-400 space-y-1.5 border-t border-slate-800 pt-4">
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Modelagem em micro-passos visuais</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Redução de sobrecarga e ansiedade</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Autonomia nas transições matinais e noturnas</span></li>
          </ul>
        </div>

        <!-- Card 2: Jovens e Adultos -->
        <div class="versatilidade-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-teal-500/40 hover:border-teal-400 transition shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-28 h-28 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div class="space-y-4 relative">
            <div class="flex items-center justify-between">
              <span class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-2xl">
                🎧
              </span>
              <span class="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                Modo Neutro & Foco
              </span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Jovens e Adultos</h3>
              <p class="text-xs text-teal-400 font-semibold mt-0.5">TDAH, Autismo & Disfunção Executiva</p>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Interface <em>dark mode</em> minimalista sem elementos infantis. O Time Timer combate a "cegueira temporal" (*time blindness*) e a prancha Primeiro/Depois vence a paralisia de início nos estudos ou no trabalho.
            </p>
          </div>
          <ul class="text-[11px] text-slate-400 space-y-1.5 border-t border-slate-800 pt-4 relative">
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Mascote 100% opcional (modo limpo e discreto)</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Time Timer visual para hiperfoco saudável</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Pictogramas técnicos ARASAAC ou ícones visuais limpos</span></li>
          </ul>
        </div>

        <!-- Card 3: Idosos e Cuidadores -->
        <div class="versatilidade-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400/60 transition shadow-xl flex flex-col justify-between space-y-5">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
                👵
              </span>
              <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30">
                Cuidado & Memória
              </span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Idosos & Reabilitação</h3>
              <p class="text-xs text-purple-400 font-semibold mt-0.5">Apoio a Famílias e Cuidadores</p>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Quadro visual de alto contraste para suporte à memória de trabalho, organização de medicações diárias, hidratação, fisioterapia e rotinas de autocuidado após AVC ou em quadros de declínio cognitivo.
            </p>
          </div>
          <ul class="text-[11px] text-slate-400 space-y-1.5 border-t border-slate-800 pt-4">
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Previsibilidade sem ansiedade de esquecimento</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">Facilidade de leitura com toques grandes</span></li>
            <li class="flex items-center gap-2">✓ <span class="text-slate-300">100% offline e sem senhas complicadas</span></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Indicadores de Paginação / Dots Versatilidade (Apenas Mobile) -->
    <div class="mt-4 flex flex-col items-center justify-center gap-2 pt-1 md:hidden">
      <div class="flex items-center justify-center gap-1.5" id="versatilidade-dots">
        <button class="versatilidade-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="0" aria-label="Ir para perfil 1">
          <span class="versatilidade-pill h-2.5 rounded-full transition-all duration-300 bg-indigo-400 w-8 shadow-[0_0_12px_rgba(99,102,241,0.6)]"></span>
        </button>
        <button class="versatilidade-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="1" aria-label="Ir para perfil 2">
          <span class="versatilidade-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
        <button class="versatilidade-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="2" aria-label="Ir para perfil 3">
          <span class="versatilidade-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
        </button>
      </div>
      <span class="text-[11px] text-slate-400 font-medium">👈 Deslize para ver os 3 modos de uso 👉</span>
    </div>

    <!-- Faixa de Destaque / Como Ativar -->
    <div class="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div class="flex items-center gap-3">
        <span class="text-xl">💡</span>
        <p class="text-xs sm:text-sm text-slate-300">
          <strong>Como funciona no aplicativo:</strong> Ao criar ou editar qualquer rotina, você decide livremente se prefere a Mascote Panquecca, os pictogramas universais ARASAAC ou os ícones visuais alternativos.
        </p>
      </div>
      <a href="/" data-app-link class="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition whitespace-nowrap">
        Experimentar no App ➔
      </a>
    </div>

  </section>

  <!-- ==================== BANNER COMUNIDADE INSTAGRAM @SYNAPSISCLINICO ==================== -->
  <section class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-3 text-center md:text-left max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>COMUNIDADE OFICIAL NO INSTAGRAM</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-white">
          Siga <span class="text-pink-400">@synapsisclinico</span> no Instagram
        </h3>
        <p class="text-sm text-slate-300 leading-relaxed">
          Acompanhe os bastidores clínicos da <strong>Dra. Sandra Sorgatti D'Arduini (CRP 06/162626)</strong>, novos vídeos da Mascote Panquecca, roteiros de rotina visual para baixar e conteúdos práticos sobre ABA, regulação sensorial e neurodesenvolvimento.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
        <a href="https://www.instagram.com/synapsisclinico" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>Seguir no Instagram</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ==================== CONCEPÇÃO CLÍNICA & CIÊNCIA ==================== -->
  <section id="metodo" class="py-12 sm:py-16 bg-slate-900/60 border-y border-slate-800 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Coluna da Especialista -->
        <div class="lg:col-span-5 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-bold">
            🌿 DA CLÍNICA PARA A SUA CASA
          </div>

          <h2 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Ciência do Comportamento com Afeto e Sensibilidade.
          </h2>

          <p class="text-slate-300 leading-relaxed text-sm sm:text-base">
            O <strong>Synapsis Kids</strong> nasceu da prática com famílias atípicas que sofriam com rotinas impressas em papel esquecidas na geladeira. Unimos métodos baseados em evidências à tecnologia amigável para celulares e tablets.
          </p>

          <!-- Card de Apresentação da Especialista -->
          <div class="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 shadow-xl">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🧠
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Sandra Sorgatti D’Arduini</h3>
                <p class="text-xs font-semibold text-teal-400">Psicóloga (CRP 06/162626) • Neuropsicóloga</p>
              </div>
            </div>

            <ul class="text-xs text-slate-300 space-y-1.5 border-t border-slate-700 pt-3">
              <li>• Especialista em Terapia Cognitivo-Comportamental (TCC)</li>
              <li>• Especialista em Transtornos do Neurodesenvolvimento (TEA e TDAH)</li>
              <li>• Especialista em Neuropsicologia e Reabilitação Cognitiva</li>
              <li>• Curadoria Clínica & Protocolos de Rotina Visual Estruturada</li>
            </ul>

            <blockquote class="italic text-xs text-slate-400 border-l-2 border-teal-500 pl-3">
              "A previsibilidade visual reduz em até 80% as crises de transição em crianças com TEA. Quando a criança enxerga concretamente o que vai acontecer, a ansiedade dá lugar à segurança."
            </blockquote>
          </div>
        </div>

        <!-- Coluna dos Pilares Científicos -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <!-- Pilar 1: ABA -->
          <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-teal-500/50 transition space-y-3">
            <div class="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-lg font-black">
              1
            </div>
            <h4 class="text-base font-bold text-white">Análise do Comportamento (ABA)</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Decomposição de tarefas complexas em micro-passos sequenciais realizáveis, com reforçamento positivo imediato através da Mascote Panquecca.
            </p>
          </div>

          <!-- Pilar 2: TEACCH -->
          <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-indigo-500/50 transition space-y-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg font-black">
              2
            </div>
            <h4 class="text-base font-bold text-white">Estruturação TEACCH</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Organização visual do tempo (início, meio e fim) com eliminação de ruídos e poluição cognitiva, criando um ambiente seguro e previsível.
            </p>
          </div>

          <!-- Pilar 3: CAA / PECS -->
          <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-amber-500/50 transition space-y-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg font-black">
              3
            </div>
            <h4 class="text-base font-bold text-white">Comunicação Alternativa (PECS)</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Prancha visual tátil com cartões grandes e de alto contraste, permitindo que a criança compreenda e comunique suas etapas sem depender apenas de comandos verbais.
            </p>
          </div>

          <!-- Pilar 4: Regulação Sensorial -->
          <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-emerald-500/50 transition space-y-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg font-black">
              4
            </div>
            <h4 class="text-base font-bold text-white">Proteção Sensorial</h4>
            <p class="text-xs text-slate-300 leading-relaxed">
              Sem bips estridentes ou contadores regressivos apavorantes. Áudios calibrados em estúdio com timbres harmônicos acolhedores.
            </p>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- ==================== PONTE B2B: SYNAPSIS CLÍNICO ==================== -->
  <section id="clinico" class="py-14 sm:py-16 bg-gradient-to-b from-[#090D16] via-slate-950 to-[#090D16] border-y border-teal-500/30 relative overflow-hidden">
    <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40">
          💼 GESTÃO CLÍNICA INTELIGENTE & RIGOR CIENTÍFICO
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
          Você atende crianças em consultório ou comanda uma clínica?
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          O <strong>Synapsis Kids</strong> é o braço lúdico familiar do <strong>Synapsis Clínico</strong>: o primeiro ecossistema multiprofissional do Brasil com prontuários específicos para <strong>Psicologia (CFP), Fonoaudiologia (CFFa), Terapia Ocupacional (COFFITO) e Psicopedagogia (ABPp)</strong>.
        </p>
      </div>

      <!-- Carrossel Horizontal no Mobile / Grid no Desktop com Setas Laterais -->
      <div class="relative group/clinico">
        <!-- Seta Lateral Esquerda (Mobile) -->
        <button 
          id="clinico-prev-btn" 
          type="button" 
          aria-label="Ver recurso clínico anterior" 
          title="Recurso anterior"
          class="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 hover:border-teal-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md md:hidden"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <!-- Seta Lateral Direita (Mobile) -->
        <button 
          id="clinico-next-btn" 
          type="button" 
          aria-label="Ver próximo recurso clínico" 
          title="Próximo recurso"
          class="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-teal-300 hover:text-white border border-teal-500/40 hover:border-teal-300 flex items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] active:scale-90 focus:outline-none cursor-pointer backdrop-blur-md md:hidden"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>

        <div 
          id="clinico-carousel" 
          class="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:p-0 mb-10 sm:mb-12"
        >
          
          <!-- Recurso 1: Agenda -->
          <div class="clinico-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-2xl flex flex-col justify-between">
            <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
              <img src="clinico_images/clinico_agenda_inteligente.png" alt="Agenda Inteligente Synapsis Clínico" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-6 space-y-2">
              <h3 class="text-base font-extrabold text-white">Projeto Terapêutico Singular (PTS)</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Matriz multiprofissional compartilhada com linha do tempo integrada entre psicólogo, fono, T.O. e psicopedagogo, com sigilo ético inviolável por conselho.
              </p>
            </div>
          </div>

          <!-- Recurso 2: Financeiro -->
          <div class="clinico-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-2xl flex flex-col justify-between">
            <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
              <img src="clinico_images/clinico_financeiro_fiscal.png" alt="Gestão Fiscal e Carnê-Leão" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-6 space-y-2">
              <h3 class="text-base font-extrabold text-white">Trava de Ouro & Repasses Automáticos</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Fim das brigas de fim de mês: repasses calculados apenas após a compensação bancária e exportação direta para o Carnê-Leão (DARF 0190).
              </p>
            </div>
          </div>

          <!-- Recurso 3: Laudos -->
          <div class="clinico-card w-[84vw] max-w-[340px] md:w-auto shrink-0 snap-start rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-2xl flex flex-col justify-between">
            <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
              <img src="clinico_images/clinico_laudo_neuropsicologico.png" alt="Laudo Neuropsicológico Estruturado" loading="lazy" decoding="async" width="500" height="350" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
              <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">🔍 Ampliar</span>
            </div>
            <div class="p-6 space-y-2">
              <h3 class="text-base font-extrabold text-white">Prova Digital SHA-256 & Baterias Nativas</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Baterias para Piaget (POP), Visca (EOCA), Audiograma digital CFFa, Perfil Sensorial Winnie Dunn (COFFITO) e laudos com assinatura pericial criptográfica.
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Indicadores de Paginação / Dots Clínico (Apenas Mobile) -->
      <div class="mt-2 mb-10 flex flex-col items-center justify-center gap-2 pt-1 md:hidden">
        <div class="flex items-center justify-center gap-1.5" id="clinico-dots">
          <button class="clinico-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="0" aria-label="Ir para recurso clínico 1">
            <span class="clinico-pill h-2.5 rounded-full transition-all duration-300 bg-teal-400 w-8 shadow-[0_0_12px_rgba(45,212,191,0.6)]"></span>
          </button>
          <button class="clinico-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="1" aria-label="Ir para recurso clínico 2">
            <span class="clinico-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
          </button>
          <button class="clinico-dot p-2 py-3 flex items-center justify-center focus:outline-none cursor-pointer" data-index="2" aria-label="Ir para recurso clínico 3">
            <span class="clinico-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500"></span>
          </button>
        </div>
        <span class="text-[11px] text-slate-400 font-medium">👈 Deslize para ver os recursos clínicos 👉</span>
      </div>

      <!-- Banner de Fechamento -->
      <div class="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-1.5 text-center md:text-left">
          <h4 class="text-lg sm:text-xl font-extrabold text-white">
            Garanta sua vaga na Turma Pioneira do Synapsis Clínico.
          </h4>
          <p class="text-xs sm:text-sm text-slate-400">
            20 vagas especiais com 3 meses grátis em qualquer plano + 50% de desconto vitalício no Clube das Fundadoras.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <a href="https://synapsisclinico.com.br" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition text-center whitespace-nowrap">
            Conhecer o Synapsis Clínico ➔
          </a>
          <a href="mailto:contato@synapsisclinico.com.br?subject=Contato%20-%20Synapsis%20Cl%C3%ADnico" class="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition text-center whitespace-nowrap flex items-center justify-center gap-2">
            <span>✉️ Contato por E-mail</span>
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- ==================== GUIA ILUSTRADO DE INSTALAÇÃO (PWA) ==================== -->
  <section id="instalacao" class="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto space-y-3 mb-10">
      <span class="text-xs font-bold uppercase tracking-wider text-teal-400">Instalação Gratuita & Rápida</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Como colocar na tela inicial do seu celular.</h2>
      <p class="text-slate-400 text-sm sm:text-base">
        O Synapsis Kids funciona como um aplicativo instalado (PWA). Você não precisa de login, não paga nada e ele abre instantaneamente direto da sua tela inicial.
      </p>
    </div>

    <!-- ALERTA IMPORTANTE PARA INSTAGRAM / WHATSAPP -->
    <div class="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 max-w-3xl mx-auto flex items-start gap-3.5 text-left">
      <span class="text-2xl shrink-0">⚠️</span>
      <div class="space-y-1 text-xs sm:text-sm text-amber-200 leading-relaxed">
        <strong class="font-bold text-amber-300 block">Está acessando pelo Instagram, Facebook ou WhatsApp?</strong>
        <span>Os navegadores embutidos desses aplicativos bloqueiam a instalação na tela de início. Para instalar: toque nos <strong>três pontinhos (⋮)</strong> no canto superior e escolha <strong>"Abrir no Safari"</strong> (no iPhone) ou <strong>"Abrir no Chrome"</strong> (no Android).</span>
      </div>
    </div>

    <!-- CARDS DE INSTALAÇÃO: SELETOR DE ABAS MOBILE-FIRST -->
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Seletor Interativo de Plataforma -->
      <div class="flex items-center justify-center p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-sm mx-auto shadow-lg">
        <button id="tab-btn-ios" onclick="switchInstallTab('ios')" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md active:scale-95">
          <span>🍎 iPhone / iPad</span>
        </button>
        <button id="tab-btn-android" onclick="switchInstallTab('android')" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2 active:scale-95">
          <span>🤖 Android</span>
        </button>
      </div>

      <!-- Card iPhone (iOS) -->
      <div id="tab-content-ios" class="block">
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6 shadow-xl relative overflow-hidden">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
              🍎
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white">No iPhone ou iPad (iOS)</h3>
              <p class="text-xs text-slate-400">Utilize o navegador nativo <strong>Safari</strong></p>
            </div>
          </div>

          <ol class="space-y-4 text-xs sm:text-sm text-slate-200">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span>Abra este site no navegador <strong>Safari</strong> do seu iPhone ou iPad.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span>Toque no botão <strong>Compartilhar</strong> (ícone de um quadrado com uma seta para cima na barra inferior do Safari).</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span>Role a lista para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span>Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O ícone do Synapsis Kids estará salvo junto aos seus outros aplicativos.</span>
            </li>
          </ol>
        </div>
      </div>

      <!-- Card Android -->
      <div id="tab-content-android" class="hidden">
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-6 shadow-xl relative overflow-hidden">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
              🤖
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white">No Celular Android</h3>
              <p class="text-xs text-slate-400">Utilize o navegador <strong>Google Chrome</strong></p>
            </div>
          </div>

          <ol class="space-y-4 text-xs sm:text-sm text-slate-200">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span>Abra este site no navegador <strong>Google Chrome</strong> do seu Android.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span>Toque no botão de menu (<strong>os três pontinhos ⋮</strong> no canto superior direito).</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span>Confirme tocando em <strong>"Instalar"</strong>. O ícone aparecerá automaticamente na sua tela de início!</span>
            </li>
          </ol>
        </div>
      </div>

    </div>

    <!-- ==================== GRANDE CHAMADA FINAL COM A MASCOTE PANQUECCA ==================== -->
    <div id="cta-final" class="mt-12 sm:mt-16 max-w-4xl mx-auto">
      <div class="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-teal-950/40 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        <!-- Efeitos Glow Suaves -->
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Mascote Panquecca Apresentando o Botão -->
        <div class="flex items-center gap-4 sm:gap-6 relative z-10 text-left w-full md:w-auto">
          <div class="relative shrink-0">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-950 ring-4 ring-amber-500/20">
              <img src="mascots/panquecca_sorriso.jpg" alt="Mascote Panquecca te esperando" loading="lazy" decoding="async" width="96" height="96" class="w-full h-full object-cover">
            </div>
            <span class="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
              <span>🐾</span> Panquecca
            </span>
          </div>

          <div class="space-y-1.5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-extrabold border border-amber-500/30">
              ✨ Tudo Pronto Para Começar!
            </span>
            <h3 class="text-lg sm:text-2xl font-black text-white leading-tight">
              A rotina que acolhe o seu filho está a um toque.
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              A Panquecca está pronta para guiar as conquistas do dia: sem estresse, sem cadastros e 100% gratuito para sempre.
            </p>
          </div>
        </div>

        <!-- Botão CTA Magnético -->
        <div class="shrink-0 w-full md:w-auto relative z-10 flex flex-col items-center gap-2">
          <a href="/" data-app-link class="w-full sm:w-auto px-8 py-4 sm:px-9 sm:py-4.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-2xl shadow-teal-500/40 transition-all transform hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center gap-2.5 whitespace-nowrap">
            <span>Começar no Synapsis Kids Grátis</span>
            <span class="text-lg">➔</span>
          </a>
          <span class="text-[11px] font-semibold text-teal-300/80 flex items-center gap-1">
            <span>✓</span> Abre instantâneo no navegador
          </span>
        </div>

      </div>
    </div>

  </section>

  <!-- ==================== BARRA FLUTUANTE DE CONVERSÃO MOBILE (STICKY BOTTOM BAR) ==================== -->
  <aside id="mobile-sticky-bar" class="hidden-bar fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[max(10px,env(safe-area-inset-bottom))] px-3 pt-2">
    <div class="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl p-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-400/60 shadow-sm shrink-0 bg-slate-950 flex items-center justify-center">
          <img src="mascots/panquecca_sorriso.jpg" alt="Panquecca" width="40" height="40" class="w-full h-full object-cover">
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-black text-white truncate">Synapsis Kids</span>
            <span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">Grátis</span>
          </div>
          <p class="text-[10px] text-slate-400 truncate">Sem cadastros • Acesso instantâneo</p>
        </div>
      </div>
      <a href="/" data-app-link class="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition flex items-center gap-1.5 whitespace-nowrap">
        <span>Abrir App</span>
        <span class="text-sm">➔</span>
      </a>
    </div>
  </aside>

  <!-- ==================== MODAL DE ZOOM (LIGHTBOX TOUCH-FRIENDLY) ==================== -->
  <div id="zoom-modal" onclick="closeZoom()" class="fixed inset-0 z-[99999] bg-[#090D16]/95 backdrop-blur-md hidden items-center justify-center p-3 sm:p-6 cursor-zoom-out">
    <button onclick="closeZoom(event)" aria-label="Fechar zoom da imagem" class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-slate-800 text-white border border-slate-600 flex items-center justify-center text-lg font-bold shadow-2xl active:scale-90 hover:bg-slate-700 transition z-50">
      ✕
    </button>
    <div class="relative max-w-full max-h-full flex flex-col items-center justify-center" onclick="event.stopPropagation()">
      <img id="zoom-img" src="" alt="Tela Ampliada" class="max-w-[96vw] max-h-[84vh] object-contain rounded-2xl shadow-2xl border border-white/15">
      <div class="mt-3 flex items-center gap-2">
        <button onclick="closeZoom(event)" class="px-4 py-1.5 rounded-full bg-slate-800/90 text-xs text-slate-300 font-semibold border border-slate-700 hover:text-white flex items-center gap-1.5 shadow">
          <span>Toque para fechar</span> ✕
        </button>
      </div>
    </div>
  </div>

  <!-- ==================== FOOTER ==================== -->
  <footer class="bg-slate-950 border-t border-slate-800/80 py-8 sm:py-10 text-slate-400 text-xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div class="flex items-center">
          <a href="/" data-app-link title="Synapsis Kids">
            <img src="assets/synapsi_1_full.png" alt="Synapsis Kids" loading="lazy" decoding="async" width="180" height="48" class="h-10 sm:h-12 w-auto object-contain">
          </a>
        </div>

        <div class="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-xs font-semibold">
          <a href="/" data-app-link class="hover:text-white transition" title="Abrir o aplicativo Synapsis Kids">Abrir Aplicativo</a>
          <a href="#mascote" class="text-amber-300 hover:text-amber-200 transition font-bold">🐾 Mascote Panquecca</a>
          <a href="termos-de-uso.html" class="hover:text-white transition">Termos de Uso</a>
          <a href="politica-de-privacidade.html" class="hover:text-white transition">Privacidade & LGPD</a>
          <a href="https://www.instagram.com/synapsisclinico" target="_blank" rel="noopener noreferrer" class="text-pink-400 hover:text-pink-300 transition font-bold flex items-center gap-1">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span>@synapsisclinico</span>
          </a>
          <a href="https://synapsisclinico.com.br" target="_blank" rel="noopener noreferrer" class="text-teal-400 hover:text-teal-300 transition font-bold flex items-center gap-1.5" title="Conheça o site oficial do Synapsis Clínico">
            <span>🌐 Site Oficial: Synapsis Clínico</span>
            <span class="text-[10px]">↗</span>
          </a>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
        <div>
          <p>© 2026 <strong>Synapsis Kids</strong> • Ecossistema Synapsis Clínico & SD Engenharia.</p>
          <p>Concepção Clínica & Curadoria Neuropsicológica: <strong>Sandra Sorgatti D'Arduini (CRP 06/162626)</strong>.</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="termos-de-uso.html" class="hover:text-slate-300 transition underline underline-offset-2">Termos de Uso</a>
          <span>•</span>
          <a href="politica-de-privacidade.html" class="hover:text-slate-300 transition underline underline-offset-2">Privacidade & LGPD</a>
        </div>
      </div>

    </div>
  </footer>

  <script>
    // Menu Mobile Drawer
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobile-drawer');
      const hamburgerIcon = document.getElementById('hamburger-icon');
      const closeIcon = document.getElementById('close-icon');
      const btn = document.getElementById('mobile-menu-btn');
      const isOpen = drawer.classList.contains('drawer-open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        drawer.classList.remove('drawer-closed');
        drawer.classList.add('drawer-open');
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    }

    function closeMobileMenu() {
      const drawer = document.getElementById('mobile-drawer');
      const hamburgerIcon = document.getElementById('hamburger-icon');
      const closeIcon = document.getElementById('close-icon');
      const btn = document.getElementById('mobile-menu-btn');
      drawer.classList.remove('drawer-open');
      drawer.classList.add('drawer-closed');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }

    // Seletor de Abas de Instalação (PWA)
    function switchInstallTab(os) {
      const tabIos = document.getElementById('tab-btn-ios');
      const tabAndroid = document.getElementById('tab-btn-android');
      const contentIos = document.getElementById('tab-content-ios');
      const contentAndroid = document.getElementById('tab-content-android');
      if (!tabIos || !tabAndroid) return;

      if (os === 'ios') {
        tabIos.className = 'flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md active:scale-95';
        tabAndroid.className = 'flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2 active:scale-95';
        contentIos.classList.remove('hidden');
        contentAndroid.classList.add('hidden');
      } else {
        tabAndroid.className = 'flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md active:scale-95';
        tabIos.className = 'flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2 active:scale-95';
        contentAndroid.classList.remove('hidden');
        contentIos.classList.add('hidden');
      }
    }

    // Modal de Zoom (Lightbox)
    function zoomImage(imgElement) {
      if (!imgElement) return;
      const modal = document.getElementById('zoom-modal');
      const zoomImg = document.getElementById('zoom-img');
      zoomImg.src = imgElement.src;
      zoomImg.alt = imgElement.alt || 'Imagem ampliada';
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeZoom(e) {
      if (e) e.stopPropagation();
      const modal = document.getElementById('zoom-modal');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeZoom();
    });

    // Função Modular para Carrosséis Horizontais com Suporte a Touch e Setas Laterais
    function setupHorizontalCarousel(config) {
      const carousel = document.getElementById(config.carouselId);
      if (!carousel) return;
      const prevBtn = document.getElementById(config.prevBtnId);
      const nextBtn = document.getElementById(config.nextBtnId);
      const counter = config.counterId ? document.getElementById(config.counterId) : null;
      const dots = document.querySelectorAll(config.dotsSelector);
      const cards = carousel.querySelectorAll(config.cardSelector);

      if (!cards.length) return;

      function getActiveIndex() {
        const scrollLeft = carousel.scrollLeft;
        let activeIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, idx) => {
          const diff = Math.abs((card.offsetLeft - carousel.offsetLeft) - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            activeIdx = idx;
          }
        });
        return activeIdx;
      }

      function updateActiveState() {
        const activeIdx = getActiveIndex();

        if (counter) {
          counter.textContent = (activeIdx + 1) + ' de ' + cards.length;
        }

        if (dots.length) {
          dots.forEach((dot, idx) => {
            const pill = dot.querySelector(config.pillSelector) || dot;
            if (idx === activeIdx) {
              pill.className = config.activePillClass;
            } else {
              pill.className = config.inactivePillClass;
            }
          });
        }
      }

      function scrollToIndex(idx) {
        if (idx < 0) idx = cards.length - 1; // loop circular
        if (idx >= cards.length) idx = 0;
        const targetCard = cards[idx];
        if (targetCard) {
          carousel.scrollTo({
            left: targetCard.offsetLeft - carousel.offsetLeft,
            behavior: 'smooth'
          });
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const currentIdx = getActiveIndex();
          scrollToIndex(currentIdx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const currentIdx = getActiveIndex();
          scrollToIndex(currentIdx + 1);
        });
      }

      if (dots.length) {
        dots.forEach((dot) => {
          dot.addEventListener('click', function(e) {
            e.preventDefault();
            const idx = parseInt(this.getAttribute('data-index'), 10);
            if (!isNaN(idx)) scrollToIndex(idx);
          });
        });
      }

      carousel.addEventListener('scroll', function() {
        window.requestAnimationFrame(updateActiveState);
      }, { passive: true });

      updateActiveState();
    }

    // Inicializa os 3 carrosséis interativos
    (function initAllCarousels() {
      // 1. Carrossel de Recursos (6 cards com contador e setas laterais)
      setupHorizontalCarousel({
        carouselId: 'recursos-carousel',
        prevBtnId: 'recursos-prev-btn',
        nextBtnId: 'recursos-next-btn',
        counterId: 'recursos-counter',
        dotsSelector: '.recurso-dot',
        pillSelector: '.recurso-pill',
        cardSelector: '.recurso-card',
        activePillClass: 'recurso-pill h-2.5 rounded-full transition-all duration-300 bg-teal-400 w-8 shadow-[0_0_12px_rgba(45,212,191,0.6)]',
        inactivePillClass: 'recurso-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500'
      });

      // 2. Carrossel de Versatilidade (3 perfis: Crianças, Jovens/Adultos, Idosos)
      setupHorizontalCarousel({
        carouselId: 'versatilidade-carousel',
        prevBtnId: 'versatilidade-prev-btn',
        nextBtnId: 'versatilidade-next-btn',
        counterId: null,
        dotsSelector: '.versatilidade-dot',
        pillSelector: '.versatilidade-pill',
        cardSelector: '.versatilidade-card',
        activePillClass: 'versatilidade-pill h-2.5 rounded-full transition-all duration-300 bg-indigo-400 w-8 shadow-[0_0_12px_rgba(99,102,241,0.6)]',
        inactivePillClass: 'versatilidade-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500'
      });

      // 3. Carrossel Synapsis Clínico (3 recursos B2B)
      setupHorizontalCarousel({
        carouselId: 'clinico-carousel',
        prevBtnId: 'clinico-prev-btn',
        nextBtnId: 'clinico-next-btn',
        counterId: null,
        dotsSelector: '.clinico-dot',
        pillSelector: '.clinico-pill',
        cardSelector: '.clinico-card',
        activePillClass: 'clinico-pill h-2.5 rounded-full transition-all duration-300 bg-teal-400 w-8 shadow-[0_0_12px_rgba(45,212,191,0.6)]',
        inactivePillClass: 'clinico-pill h-2.5 rounded-full transition-all duration-300 bg-slate-700 w-2.5 hover:bg-slate-500'
      });
    })();

    // Barra Flutuante Mobile de Acesso Rápido
    (function initMobileStickyBar() {
      const stickyBar = document.getElementById('mobile-sticky-bar');
      const ctaFinal = document.getElementById('cta-final');
      if (!stickyBar) return;

      let ticking = false;
      function updateStickyBar() {
        const scrollY = window.scrollY || window.pageYOffset;
        let nearBottom = false;

        if (ctaFinal) {
          const rect = ctaFinal.getBoundingClientRect();
          if (rect.top <= window.innerHeight - 40) {
            nearBottom = true;
          }
        }

        if (scrollY > 380 && !nearBottom) {
          stickyBar.classList.remove('hidden-bar');
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
          stickyBar.classList.add('hidden-bar');
        }
        ticking = false;
      }

      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(updateStickyBar);
          ticking = true;
        }
      }, { passive: true });

      updateStickyBar();
    })();

    // Auto-detecta SO do Celular para a aba de instalação (PWA)
    (function autoDetectMobileOS() {
      try {
        if (/Android/i.test(navigator.userAgent)) {
          switchInstallTab('android');
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          switchInstallTab('ios');
        }
      } catch(e) {}
    })();

    // Telemetria Anônima
    (function initTelemetry() {
      function sendTelemetryEvent(eventName, payload) {
        try {
          if (navigator.sendBeacon) {
            var blob = new Blob([JSON.stringify({ event: eventName, payload: payload, timestamp: Date.now() })], { type: 'application/json' });
            navigator.sendBeacon('/api/telemetry', blob);
          }
        } catch(e) {}
      }

      sendTelemetryEvent('landing_page_view', {
        referrer: document.referrer || 'direct',
        url: window.location.href
      });

      document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link) return;

        var href = link.getAttribute('href') || '';
        var isAppLink = link.hasAttribute('data-app-link') || href === '/' || href.indexOf('index.html') !== -1;

        // Ao abrir localmente via file:///, o navegador não consegue rodar o Vite SPA (CORS).
        // Redireciona de forma suave para o app oficial na nuvem.
        if (isAppLink && window.location.protocol === 'file:') {
          e.preventDefault();
          window.open('https://rotina.synapsisclinico.com.br/', '_blank');
          return;
        }

        if (href.indexOf('synapsisclinico.com.br') !== -1 || href.indexOf('contato@synapsisclinico.com.br') !== -1) {
          sendTelemetryEvent('clinico_referral_click', {
            target: href,
            text: (link.innerText || '').trim().substring(0, 50)
          });
        } else if (href.indexOf('instagram.com/synapsisclinico') !== -1) {
          sendTelemetryEvent('instagram_referral_click', {
            target: href,
            text: (link.innerText || '').trim().substring(0, 50)
          });
        } else if (isAppLink) {
          sendTelemetryEvent('landing_to_app_click', {
            text: (link.innerText || '').trim().substring(0, 50)
          });
        }
      }, true);
    })();
  </script>

</body>
</html>
`;

// Escreve em public/landing.html
fs.writeFileSync(path.join(PUBLIC_DIR, 'landing.html'), htmlContent, 'utf8');
console.log('✅ Landing Page Synapsis Kids gerada com sucesso em public/landing.html');

// Escreve também em dist/landing.html se a pasta dist existir
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  fs.writeFileSync(path.join(distPath, 'landing.html'), htmlContent, 'utf8');
  console.log('✅ Landing Page Synapsis Kids sincronizada com sucesso em dist/landing.html');
}
