import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Read logos as base64 for reliable, zero-latency rendering
const synapsiFullB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'synapsi_1_full.png')).toString('base64');
const synapsiBrainB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'synapsi_brain1.png')).toString('base64');

// Read all 7 clean screenshots as base64 for 100% reliable rendering on file://, localhost and web
const screen01B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '01_tela_principal.png')).toString('base64');
const screen02B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '02_prancha_tea.png')).toString('base64');
const screen03B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '03_modal_foco_passos.png')).toString('base64');
const screen04B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '04_compartilhar_link.png')).toString('base64');
const screen04bB64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '04b_importar_link.png')).toString('base64');
const screen05B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '05_lembretes_celular.png')).toString('base64');
const screen06B64 = fs.readFileSync(path.join(DOCS_DIR, 'clean_screens', '06_configuracoes.png')).toString('base64');

// Read 3 Clinico screenshots as base64
const clinicoAgendaB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'clinico_images', 'clinico_agenda_inteligente.png')).toString('base64');
const clinicoFiscalB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'clinico_images', 'clinico_financeiro_fiscal.png')).toString('base64');
const clinicoLaudoB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'clinico_images', 'clinico_laudo_neuropsicologico.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Synapsis Kids — Rotina Visual, Previsibilidade e Autonomia para Crianças com TEA e TDAH</title>
  <meta name="description" content="Aplicativo gratuito de rotina visual baseado em ABA, TEACCH e CAA/PECS. Promove autonomia, previsibilidade e autorregulação em crianças no Espectro Autista e TDAH. Sem anúncios e 100% offline.">

  <!-- Open Graph / Redes Sociais / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Synapsis Kids — Rotina Visual & Previsibilidade para TEA e TDAH">
  <meta property="og:description" content="Rotina visual interativa com prancha PECS, voz dos pais, sem alarmes estridentes e 100% gratuito. Concepção clínica especializada.">
  <meta property="og:image" content="/assets/synapsi_1_full.png">
  <meta property="og:url" content="https://rotina.synapsis.com.br/inicio">

  <link rel="icon" type="image/png" href="/assets/synapsi_brain1.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

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
  </style>
</head>
<body class="bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">

  <!-- ==================== BANNER SUPERIOR INFORMATIVO (desktop only) ==================== -->
  <div class="hidden sm:block bg-gradient-to-r from-teal-900/60 via-slate-900 to-indigo-950/60 border-b border-teal-500/20 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 text-center">
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] sm:text-[11px]">
        🌿 PROTOCOLO CLÍNICO & FAMILIAR
      </span>
      <span class="text-slate-300 leading-snug">
        Desenvolvido com validação neuropsicológica especializada em TEA & TDAH • <strong>100% Gratuito & Sem Anúncios</strong>
      </span>
    </div>
  </div>

  <!-- ==================== NAVBAR RESPONSIVA (DESKTOP + MOBILE FIRST) ==================== -->
  <header class="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-20 md:h-22 flex items-center justify-between gap-3">
      
      <!-- Logo Oficial Synapsis Kids -->
      <a href="/" class="flex items-center group shrink-0" title="Synapsis Kids">
        <img src="data:image/png;base64,${synapsiFullB64}" alt="Synapsis Kids" class="h-8 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(79,70,229,0.35)] group-hover:scale-105 transition-transform">
      </a>

      <!-- Menu Links Desktop -->
      <nav class="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 text-xs lg:text-sm font-semibold text-slate-300 shrink-0">
        <a href="#recursos" class="hover:text-teal-400 transition-colors">Recursos</a>
        <a href="#metodo" class="hover:text-teal-400 transition-colors">Método Clínico</a>
        <a href="#instalacao" class="hover:text-teal-400 transition-colors">Como Instalar</a>
        <a href="/manual.html" target="_blank" class="hover:text-teal-400 transition-colors flex items-center gap-1">
          <span>Manual</span>
          <svg class="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <a href="#clinico" class="px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:border-teal-400">
          <span>💼 Para Clínicas & Terapeutas</span>
        </a>
      </nav>

      <!-- Ações Mobile (apenas hambúrguer) -->
      <div class="flex md:hidden items-center gap-2">
        <button id="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Abrir menu de navegação" aria-expanded="false" class="w-10 h-10 rounded-xl bg-slate-800/80 active:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400">
          <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Menu Gaveta Mobile (Dropdown Suave) -->
    <div id="mobile-drawer" class="drawer-closed md:hidden border-b border-slate-800 bg-[#090D16]/98 px-4 py-4 space-y-3 shadow-2xl backdrop-blur-xl">
      <nav class="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
        <a href="#recursos" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between">
          <span>✨ Recursos do Aplicativo</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="#metodo" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between">
          <span>🧠 Concepção Clínica & Especialista</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="#instalacao" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between">
          <span>📲 Como Instalar na Tela Inicial (PWA)</span>
          <span class="text-xs text-slate-500">➔</span>
        </a>
        <a href="/manual.html" target="_blank" class="px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition flex items-center justify-between text-teal-300">
          <span class="flex items-center gap-1.5">📖 Manual do Usuário (com PDF)</span>
          <svg class="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <a href="#clinico" onclick="closeMobileMenu()" class="px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 hover:bg-teal-900/40 transition flex items-center justify-between mt-1">
          <span>💼 Para Clínicas & Terapeutas</span>
          <span class="text-xs">➔</span>
        </a>
      </nav>

    </div>
  </header>

  <!-- ==================== HERO SECTION ==================== -->
  <section class="relative pt-0 pb-10 sm:pt-12 sm:pb-14 overflow-hidden">
    <!-- Luzes de Fundo -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-4 sm:pt-0">
      <div class="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5">
        
        <!-- Selo de Início -->
        <div class="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-slate-800/90 border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-bold shadow-inner">
          <span class="flex items-center gap-1.5">
            <span class="flex h-2 w-2 rounded-full bg-teal-400 badge-pulse shrink-0"></span>
            <span>🌿 Protocolo Clínico & Familiar</span>
          </span>
          <span class="hidden sm:inline text-teal-500/60">•</span>
          <span class="text-teal-200/80 font-semibold text-[10px] sm:text-[11px]">Rotina Visual Estruturada • Foco, Previsibilidade & Gestão do Tempo</span>
        </div>

        <!-- Headline Principal Responsiva -->
        <h1 class="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.12]">
          Mais Previsibilidade, Menos Ansiedade: <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-emerald-200 to-indigo-400">A Rotina Visual que Traz Clareza e Acolhe o seu Dia.</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal px-2">
          Desenvolvido com validação neuropsicológica para transformar tarefas diárias e repetitivas em passos simples e organizados. A ferramenta ideal para quem busca equilíbrio no gerenciamento do tempo, autonomia e uma rotina sem sobrecarga mental.
        </p>

        <!-- Badges de Confiança: Grid 2x2 no mobile, linha única no desktop -->
        <div class="pt-3 sm:pt-5 max-w-xl mx-auto">
          <div class="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-[15px] font-semibold text-slate-200">
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

  <!-- ==================== CONCEPÇÃO CLÍNICA & CIÊNCIA ==================== -->
  <section id="metodo" class="py-12 sm:py-16 bg-slate-900/60 border-y border-slate-800 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Coluna da Especialista & Co-Branding -->
        <div class="lg:col-span-5 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-bold">
            🌿 DA CLÍNICA PARA A SUA CASA
          </div>

          <h2 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Ciência do Comportamento com Afeto e Sensibilidade.
          </h2>

          <p class="text-slate-300 leading-relaxed text-sm sm:text-base">
            O <strong>Synapsis Kids</strong> não é apenas um cronômetro ou organizador genérico. Ele foi concebido a partir dos desafios reais vividos na prática clínica com neurodivergências, famílias e pessoas que buscam vencer a sobrecarga no gerenciamento do seu tempo e tarefas.
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
              Decomposição de tarefas complexas em micro-passos sequenciais realizáveis, com reforçamento positivo imediato através de celebrações suaves.
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
              Sem bips estridentes ou contadores regressivos aterrorizantes. Áudios calibrados em estúdio com timbres harmônicos acolhedores.
            </p>
          </div>

        </div>
      </div>

    </div>
  </section>

  <!-- ==================== RECURSOS DO APLICATIVO COM TELAS REAIS ==================== -->
  <section id="recursos" class="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
      <span class="text-xs font-bold uppercase tracking-wider text-teal-400">Recursos Feitos para o Dia a Dia</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Tudo o que pais e terapeutas precisam.</h2>
      <p class="text-slate-400 text-sm sm:text-base">
        Veja as telas reais do aplicativo. Toque em qualquer imagem para ampliar em tela cheia.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Card 1: Prancha Visual PECS -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen02B64}" alt="Prancha Visual TEA" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
            🔍 Ampliar
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧩</span>
            <h3 class="text-base font-extrabold text-white">Prancha de Comunicação Visual (PECS)</h3>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Cartões grandes em formato CAA/PECS. A criança toca no cartão para ouvir o que deve fazer e toca para concluir, acompanhando visualmente o progresso da rotina.
          </p>
        </div>
      </div>

      <!-- Card 2: Vozes, Mascote & Sons de Estúdio -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen06B64}" alt="Vozes Neurais e Sons de Estúdio" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
            🔍 Ampliar
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">🎙️</span>
            <h3 class="text-base font-extrabold text-white">Vozes Calibradas & Sons sem Ruído</h3>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            23 áudios de estúdio em MP3 com afeto e modulação sensorial, mascote encorajador e possibilidade de gravar a própria voz familiar dos pais.
          </p>
        </div>
      </div>

      <!-- Card 3: Modo Primeiro / Depois & Foco -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen03B64}" alt="Foco na Tarefa e Micro-Passos" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
            🔍 Ampliar
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">⏳</span>
            <h3 class="text-base font-extrabold text-white">Foco na Tarefa & Micro-Passos</h3>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Janela de foco que decompõe tarefas (como tomar banho ou escovar dentes) em passos simples, e tela de Primeiro/Depois para motivar transições difíceis.
          </p>
        </div>
      </div>

      <!-- Card 4: Compartilhamento WhatsApp -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen04B64}" alt="Compartilhamento por Link Mágico" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
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
            Envie a rotina completa estruturada pelo terapeuta para o WhatsApp dos pais. Um Link Mágico ultra-compacto carrega toda a programação instantaneamente.
          </p>
        </div>
      </div>

      <!-- Card 5: Alarmes no Celular -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen05B64}" alt="Sincronização de Calendário" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
            🔍 Ampliar
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">📅</span>
            <h3 class="text-base font-extrabold text-white">Lembretes no Calendário do Celular</h3>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Exporte as rotinas para o calendário oficial do iPhone ou Android (.ICS) com alarmes pontuais programados nos horários de cada atividade.
          </p>
        </div>
      </div>

      <!-- Card 6: Importação Rápida no App -->
      <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition group overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="h-64 sm:h-72 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
          <img src="data:image/png;base64,${screen04bB64}" alt="Importação Rápida no Meu App" class="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
            🔍 Ampliar
          </span>
        </div>
        <div class="p-6 space-y-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xl">📥</span>
            <h3 class="text-base font-extrabold text-white">Importação Sem Perder Configurações</h3>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Recebeu um link no WhatsApp? Toque em colar no aplicativo já instalado para atualizar sua semana mantendo seu tema, senha PIN e ajustes intactos.
          </p>
        </div>
      </div>

    </div>
  </section>

  <!-- ==================== PONTE B2B: SYNAPSIS CLÍNICO (3 TELAS INTERATIVAS) ==================== -->
  <section id="clinico" class="py-14 sm:py-16 bg-gradient-to-b from-[#090D16] via-slate-950 to-[#090D16] border-y border-teal-500/30 relative overflow-hidden">
    <!-- Luzes de fundo -->
    <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Cabeçalho da Seção -->
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40">
          💼 GESTÃO CLÍNICA INTELIGENTE & RIGOR CIENTÍFICO
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Você é Psicólogo ou Neuropsicólogo? Conheça o <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-brand-400 to-indigo-400">Synapsis Clínico</span>.
        </h2>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
          Projetado sob medida para as exigências da psicologia e neuropsicologia, atendendo com a mesma excelência profissionais autônomos e clínicas consolidadas com múltiplos especialistas. Simplifique sua rotina com uma <strong>Agenda Inteligente</strong> que elimina conflitos de horários e salas, garanta total tranquilidade com o <strong>Controle Financeiro 360°</strong> integrado, e mantenha <strong>Prontuários e Laudos em rigorosa conformidade</strong> ética (CFP 06/2019 e LGPD) com assinatura digital imutável.
        </p>
      </div>

      <!-- Grid com as 3 Telas do Sistema Clínico (Clique para Ampliar) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        <!-- Tela 1: Agenda Inteligente & Trava Anticonflito -->
        <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition shadow-2xl flex flex-col justify-between overflow-hidden group">
          <div class="h-60 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="data:image/png;base64,${clinicoAgendaB64}" alt="Agenda Inteligente Synapsis Clínico" class="max-h-full max-w-full object-contain rounded-xl shadow-md border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-teal-300 font-bold border border-teal-500/30 backdrop-blur-sm">
              🔍 Ampliar Tela
            </span>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">📅</span>
              <h3 class="text-base font-extrabold text-white">Agenda Inteligente & Trava de Salas</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Agenda com detecção anticonflito para consultórios e sublocações. Disparo ético de lembretes no WhatsApp dos pais de menores e confirmação de presença em 1 toque.
            </p>
            <ul class="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <li>✓ Confirmação em 1 clique via WhatsApp</li>
              <li>✓ Trava de cancelamento de última hora (24h)</li>
              <li>✓ Separação de salas e repasse automático</li>
            </ul>
          </div>
        </div>

        <!-- Tela 2: Gestão Financeira, Carnê-Leão & NFS-e -->
        <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition shadow-2xl flex flex-col justify-between overflow-hidden group">
          <div class="h-60 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="data:image/png;base64,${clinicoFiscalB64}" alt="Gestão Fiscal e Carnê-Leão" class="max-h-full max-w-full object-contain rounded-xl shadow-md border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-amber-300 font-bold border border-amber-500/30 backdrop-blur-sm">
              🔍 Ampliar Tela
            </span>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏛️</span>
              <h3 class="text-base font-extrabold text-white">Suíte Financeira & Fiscal 360°</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Cobrança via PIX com baixa automática, cálculo de Livro-Caixa e Carnê-Leão (PF) com geração do DARF 0190, e emissão direta de NFS-e na prefeitura com Certificado A1 (PJ).
            </p>
            <ul class="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <li>✓ Conciliação bancária PIX Asaas em tempo real</li>
              <li>✓ Dedução legal de taxas e sublocação no IRPF</li>
              <li>✓ Emissão de nota fiscal autorizada em 1 toque</li>
            </ul>
          </div>
        </div>

        <!-- Tela 3: Módulo Neuropsicológico & Laudos Periciais -->
        <div class="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition shadow-2xl flex flex-col justify-between overflow-hidden group">
          <div class="h-60 p-3 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-center relative cursor-pointer" onclick="zoomImage(this.querySelector('img'))">
            <img src="data:image/png;base64,${clinicoLaudoB64}" alt="Laudo Neuropsicológico Estruturado" class="max-h-full max-w-full object-contain rounded-xl shadow-md border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] text-indigo-300 font-bold border border-indigo-500/30 backdrop-blur-sm">
              🔍 Ampliar Tela
            </span>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🧠</span>
              <h3 class="text-base font-extrabold text-white">Módulo Neuro & Prontuário CFP</h3>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Módulo exclusivo de baterias psicométricas (WISC, WAIS, Neupsilin) com cálculo de percentis, curva normal, hipótese diagnóstica CID-11 e Prontuário imutável com Hash SHA-256.
            </p>
            <ul class="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <li>✓ Laudo Estruturado compilado em PDF timbrado</li>
              <li>✓ Conformidade estrita com a Res. CFP 06/2019</li>
              <li>✓ Curva normal de Gauss e percentis automáticos</li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Banner de Fechamento com CTAs -->
      <div class="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-1.5 text-center md:text-left">
          <h4 class="text-lg sm:text-xl font-extrabold text-white">
            Eleve o padrão científico e a gestão do seu consultório de psicologia.
          </h4>
          <p class="text-xs sm:text-sm text-slate-400">
            Conheça todas as micro-demonstrações interativas e agende uma apresentação VIP de 15 minutos sem compromisso.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <a href="https://synapsisclinico.com.br" target="_blank" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition text-center whitespace-nowrap">
            Acessar Site do Synapsis Clínico ➔
          </a>
          <a href="https://wa.me/5511999998888?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20demonstra%C3%A7%C3%A3o%20do%20Synapsis%20Cl%C3%ADnico." target="_blank" class="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition text-center whitespace-nowrap flex items-center justify-center gap-2">
            <span>💬 Demonstração no WhatsApp</span>
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
      
      <!-- Seletor Interativo de Plataforma (com toque ergonômico) -->
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

          <div class="pt-2">
            <a href="/" class="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-teal-500/20">
              <span>Abrir no Navegador Agora</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>
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
              <h3 class="text-base sm:text-lg font-bold text-white">No Android (Samsung, Xiaomi, Motorola...)</h3>
              <p class="text-xs text-slate-400">Utilize o navegador <strong>Google Chrome</strong></p>
            </div>
          </div>

          <ol class="space-y-4 text-xs sm:text-sm text-slate-200">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <span>Abra o link no navegador <strong>Google Chrome</strong>.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <span>Toque nos <strong>três pontinhos verticais (⋮)</strong> no canto superior direito da tela.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <span>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <span>Confirme em <strong>"Instalar"</strong>. O aplicativo funcionará em tela cheia e offline!</span>
            </li>
          </ol>

          <div class="pt-2">
            <a href="/" class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20">
              <span>Abrir no Navegador Agora</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- LINK PARA O MANUAL DO USUÁRIO -->
    <div class="mt-10 sm:mt-12 text-center px-4">
      <a href="/manual.html" target="_blank" class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 underline underline-offset-4">
        <span>📖 Quer entender cada botão em detalhes? Consulte o Manual do Usuário Oficial com opção em PDF ➔</span>
      </a>
    </div>

  </section>

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
          <img src="data:image/png;base64,${synapsiFullB64}" alt="Synapsis Kids" class="h-10 sm:h-12 w-auto object-contain">
        </div>

        <div class="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-xs">
          <a href="/" class="hover:text-white transition">Aplicativo</a>
          <a href="/manual.html" target="_blank" class="hover:text-white transition">Manual do Usuário</a>
          <a href="#instalacao" class="hover:text-white transition">Como Instalar</a>
          <a href="https://synapsisclinico.com.br" target="_blank" class="text-teal-400 hover:text-teal-300 transition font-bold">Synapsis Clínico</a>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
        <div>
          <p>© 2026 <strong>Synapsis Kids</strong> • Ecossistema Synapsis Clínico & SD Engenharia.</p>
          <p>Concepção Clínica & Curadoria Neuropsicológica: <strong>Sandra Sorgatti D'Arduini (CRP 06/162626)</strong>.</p>
        </div>
        <div>
          <p>Desenvolvido para apoio familiar e educacional. 100% gratuito e sem fins de rastreamento de dados.</p>
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

    // Detecção Inteligente de Sistema Operacional
    function detectOS() {
      const ua = navigator.userAgent || navigator.vendor || window.opera || '';
      if (/android/i.test(ua)) {
        switchInstallTab('android');
      } else {
        switchInstallTab('ios');
      }
    }

    // Modal de Zoom (Lightbox)
    function zoomImage(img) {
      if (!img) return;
      const modal = document.getElementById('zoom-modal');
      const zoomImg = document.getElementById('zoom-img');
      zoomImg.src = img.src;
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
      if (e.key === 'Escape') {
        closeZoom();
        closeMobileMenu();
      }
    });

    // Inicializar detecção
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detectOS);
    } else {
      detectOS();
    }
  </script>

</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'landing.html'), htmlContent, 'utf8');
console.log('✅ Landing Page Synapsis Kids gerada com sucesso em public/landing.html com todas as telas em base64');
