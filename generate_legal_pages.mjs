import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'dist');

const synapsiFullB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'synapsi_1_full.png')).toString('base64');
const synapsiBrainB64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'synapsi_brain1.png')).toString('base64');

// ==================== TERMOS DE USO ====================
const termosHtml = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <title>Termos de Uso — Synapsis Kids</title>
  <meta name="description" content="Termos e Condições Gerais de Uso do Aplicativo Synapsis Kids — Rotina Visual e Previsibilidade para TEA e TDAH.">
  <link rel="icon" type="image/png" href="data:image/png;base64,${synapsiBrainB64}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              400: '#2dd4bf',
              500: '#14b8a6',
              600: '#0d9488',
            },
            kids: {
              indigo: '#4F46E5',
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
</head>
<body class="bg-[#090D16] text-slate-200 antialiased font-sans selection:bg-teal-500 selection:text-white">

  <!-- Navbar -->
  <header class="border-b border-slate-800 bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="landing.html" class="flex items-center gap-3 group">
        <img src="data:image/png;base64,${synapsiFullB64}" alt="Synapsis Kids" class="h-9 sm:h-10 w-auto object-contain">
      </a>
      <div class="flex items-center gap-3 sm:gap-4">
        <a href="landing.html" class="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5">
          <span>← Voltar ao Início</span>
        </a>
        <a href="/" data-app-link class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-teal-400 hover:to-indigo-500 transition">
          Abrir App ➔
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
    <div class="mb-10 text-center sm:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold mb-4">
        <span>📋 Documento Jurídico Oficial • Synapsis Kids</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Termos e Condições Gerais de Uso</h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-2">
        Última atualização: 16 de Outubro de 2026 • Versão 2.0 • Ecossistema Synapsis Clínico
      </p>
    </div>

    <div class="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">

      <!-- Seção 1 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">1.</span> Identificação da Mantenedora e Objeto
        </h2>
        <p>
          O presente instrumento estabelece os termos e condições de uso do aplicativo <strong>Synapsis Kids</strong> (disponível através do domínio <code>rotina.synapsisclinico.com.br</code>), concebido para oferecer rotina visual estruturada, previsibilidade e apoio à autorregulação para crianças no Espectro Autista (TEA), TDAH e outras condições do neurodesenvolvimento.
        </p>
        <p>
          O aplicativo é mantido e disponibilizado pela empresa desenvolvedora do ecossistema:
        </p>
        <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 space-y-1.5 text-xs">
          <p><strong>Razão Social:</strong> SD ENGENHARIA E CONSULTORIA LTDA</p>
          <p><strong>CNPJ:</strong> 61.567.359/0001-30</p>
          <p><strong>Sede:</strong> São Bernardo do Campo - SP, Brasil</p>
          <p><strong>Concepção Clínica e Curadoria Neuropsicológica:</strong> Sandra Sorgatti D'Arduini (CRP 06/162626)</p>
          <p><strong>Contato e Encarregado (DPO):</strong> contato@synapsisclinico.com.br</p>
        </div>
        <p>
          Ao acessar ou utilizar o Synapsis Kids, os pais, mães, responsáveis legais, educadores ou terapeutas (doravante denominados <strong>USUÁRIOS</strong>) declaram ter lido, compreendido e aceito integralmente estes Termos de Uso.
        </p>
      </section>

      <!-- Seção 2 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">2.</span> Gratuidade Vitalícia e Ausência de Cobranças Ocultas
        </h2>
        <p>
          O Synapsis Kids foi concebido com uma missão de <strong>impacto social e inclusão neurodivergente</strong>:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-slate-300">
          <li><strong>100% Gratuito:</strong> O aplicativo não exige pagamento, planos de assinatura mensal ou taxas de licenciamento para famílias;</li>
          <li><strong>Sem Anúncios Comerciais:</strong> Não há exibição de banners publicitários, vídeos promocionais ou parcerias comerciais que possam sobrecarregar sensorialmente as crianças ou incentivar o consumo infantil;</li>
          <li><strong>Sem Compras Internas (*In-App Purchases*):</strong> Não existem compras de itens adicionais, bloqueios de fases ou mecanismos de monetização no interior do aplicativo.</li>
        </ul>
      </section>

      <!-- Seção 3 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">3.</span> Finalidade Pedagógica e Limitação Clínica
        </h2>
        <p>
          O Synapsis Kids baseia suas ferramentas em princípios reconhecidos de apoio comportamental e educacional, tais como:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong>ABA (*Applied Behavior Analysis*):</strong> Encadeamento de tarefas em micro-passos e reforço positivo;</li>
          <li><strong>TEACCH:</strong> Estruturação visual espacial e clareza de transições;</li>
          <li><strong>CAA / PECS:</strong> Comunicação alternativa e aumentativa através de cartões visuais;</li>
          <li><strong>Time Timer Visual:</strong> Percepção concreta da passagem do tempo sem estresse numérico.</li>
        </ul>
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed space-y-1">
          <p class="font-bold">⚠️ Aviso Clínico Importante:</p>
          <p>
            O aplicativo é um instrumento complementar de apoio à rotina e previsibilidade. Ele <strong>NÃO substitui</strong> a avaliação, o diagnóstico, o tratamento medicamentoso ou a intervenção terapêutica individualizada conduzida por psicólogos, neuropsicólogos, médicos pediatras/neurologistas, terapeutas ocupacionais ou fonoaudiólogos habilitados.
          </p>
        </div>
      </section>

      <!-- Seção 4 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">4.</span> Arquitetura Local-First e Responsabilidade por Backups
        </h2>
        <p>
          Em respeito irrestrito à privacidade da criança, o Synapsis Kids opera na arquitetura <strong>Local-First (Armazenamento Local Exclusivo)</strong>:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-slate-300">
          <li><strong>Onde os dados ficam salvos:</strong> Todas as rotinas personalizadas, nomes, horários, configurações visuais e registros de conquistas ficam gravados exclusivamente na memória do navegador do usuário (<code>localStorage</code> / <code>IndexedDB</code>);</li>
          <li><strong>Inexistência de Servidor de Dados:</strong> A SD Engenharia não possui cópia, banco de dados em nuvem ou acesso às rotinas criadas no seu dispositivo;</li>
          <li><strong>Responsabilidade de Backup:</strong> Caso o usuário limpe o cache do navegador, formate o celular ou desinstale o aplicativo, os dados locais serão eliminados. Por essa razão, o aplicativo disponibiliza a função <strong>Exportar Backup (.JSON)</strong> no menu de configurações, cabendo ao responsável gerar e guardar seus arquivos de segurança.</li>
        </ul>
      </section>

      <!-- Seção 5 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">5.</span> Propriedade Intelectual e Licenças
        </h2>
        <div class="space-y-3">
          <div>
            <h3 class="font-bold text-white text-xs uppercase tracking-wider text-teal-400">A. Mascote Panquecca</h3>
            <p class="mt-1">
              A personagem, modelagens 3D, ilustrações, animações e voz da <strong>Mascote Panquecca</strong> constituem propriedade intelectual exclusiva e protegida por direitos autorais pertencentes à <strong>SD ENGENHARIA E CONSULTORIA LTDA</strong>. É proibida sua reprodução comercial, cópia, alteração ou utilização em produtos de terceiros sem autorização prévia por escrito.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-white text-xs uppercase tracking-wider text-teal-400">B. Pictogramas ARASAAC</h3>
            <p class="mt-1">
              Os símbolos pictográficos utilizados na biblioteca de comunicação alternativa são de propriedade do <em>Governo de Aragão (Espanha)</em> e foram criados por Sergio Palao para o <strong>ARASAAC</strong> (Centro Aragonês de Comunicação Aumentativa e Alternativa), distribuídos sob Licença Internacional <strong>Creative Commons BY-NC-SA</strong>. Seu uso no Synapsis Kids é estritamente educacional e não-comercial.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-white text-xs uppercase tracking-wider text-teal-400">C. Marca e Software Synapsis</h3>
            <p class="mt-1">
              O nome "Synapsis", as marcas associadas, o código-fonte, layout e identidade visual são de titularidade da SD Engenharia e Consultoria Ltda.
            </p>
          </div>
        </div>
      </section>

      <!-- Seção 6 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">6.</span> Compartilhamento Voluntário de Rotinas (Link Mágico & WhatsApp)
        </h2>
        <p>
          O aplicativo oferece a conveniência de compartilhar rotinas com familiares, mediadores ou professores através do botão de compartilhamento via WhatsApp ou link compactado:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li>Os dados da rotina são compactados criptograficamente diretamente no fragmento de URL (hash da barra de endereço), sem passar por banco de dados externo;</li>
          <li>O ato de compartilhar o link é uma <strong>decisão voluntária e exclusiva do responsável legal</strong>, que deve garantir que o destinatário seja pessoa de confiança autorizada a acompanhar a rotina da criança.</li>
        </ul>
      </section>

      <!-- Seção 7 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">7.</span> Foro e Legislação Aplicável
        </h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil, em particular pelo Marco Civil da Internet (Lei nº 12.965/2014), Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e Estatuto da Criança e do Adolescente (Lei nº 8.069/1990).
        </p>
        <p>
          Fica eleito o Foro da Comarca de <strong>São Bernardo do Campo, Estado de São Paulo</strong>, para dirimir eventuais dúvidas ou controvérsias decorrentes deste instrumento.
        </p>
      </section>

    </div>

    <!-- Voltar -->
    <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <a href="politica-de-privacidade.html" class="hover:text-teal-400 transition font-semibold flex items-center gap-1.5">
        <span>🛡️ Ver Política de Privacidade & LGPD</span> ➔
      </a>
      <a href="landing.html" class="hover:text-white transition">
        ← Voltar à Página Principal
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-slate-950 border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
    <div class="max-w-4xl mx-auto px-4 space-y-2">
      <p>© 2026 <strong>Synapsis Kids</strong> • Mantido por SD ENGENHARIA E CONSULTORIA LTDA (CNPJ: 61.567.359/0001-30).</p>
      <p>Curadoria Neuropsicológica: Sandra Sorgatti D'Arduini (CRP 06/162626).</p>
    </div>
  </footer>

  <script>
    document.addEventListener('click', function(e) {
      var appLink = e.target.closest('a[data-app-link]');
      if (!appLink) return;
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        window.open('https://rotina.synapsisclinico.com.br/', '_blank');
      }
    }, false);
  </script>

</body>
</html>
`;

// ==================== POLITICA DE PRIVACIDADE & LGPD ====================
const privacidadeHtml = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <title>Política de Privacidade & LGPD — Synapsis Kids</title>
  <meta name="description" content="Política de Privacidade, Proteção de Dados de Crianças e Conformidade com a LGPD (Art. 14) do Synapsis Kids.">
  <link rel="icon" type="image/png" href="data:image/png;base64,${synapsiBrainB64}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              400: '#2dd4bf',
              500: '#14b8a6',
              600: '#0d9488',
            },
            kids: {
              indigo: '#4F46E5',
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
</head>
<body class="bg-[#090D16] text-slate-200 antialiased font-sans selection:bg-teal-500 selection:text-white">

  <!-- Navbar -->
  <header class="border-b border-slate-800 bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="landing.html" class="flex items-center gap-3 group">
        <img src="data:image/png;base64,${synapsiFullB64}" alt="Synapsis Kids" class="h-9 sm:h-10 w-auto object-contain">
      </a>
      <div class="flex items-center gap-3 sm:gap-4">
        <a href="landing.html" class="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5">
          <span>← Voltar ao Início</span>
        </a>
        <a href="/" data-app-link class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-teal-400 hover:to-indigo-500 transition">
          Abrir App ➔
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
    <div class="mb-10 text-center sm:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-4">
        <span>🔒 Proteção à Infância • LGPD (Art. 14 da Lei nº 13.709/2018) & ECA</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Política de Privacidade & Proteção de Dados</h1>
      <p class="text-xs sm:text-sm text-slate-400 mt-2">
        Última atualização: 16 de Outubro de 2026 • Versão 2.0 • Ecossistema Synapsis Clínico
      </p>
    </div>

    <div class="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">

      <!-- Destaque Principal: Local-First / Zero Cloud -->
      <section class="bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-teal-950/40 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-lg space-y-3">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛡️</span>
          <h2 class="text-base sm:text-lg font-bold text-emerald-300">
            Compromisso de Não-Coleta: Os Dados da Criança Nunca Saem do Seu Aparelho
          </h2>
        </div>
        <p class="text-slate-200">
          O <strong>Synapsis Kids</strong> foi projetado sob o princípio de <strong>Privacy by Design (Privacidade desde a Concepção)</strong> e <strong>Data Minimization (Minimização Máxima de Dados)</strong>. Nós acreditamos que a maneira mais segura e ética de proteger uma criança neurodivergente é <strong>não armazenar nem transacionar seus dados em nenhum servidor externo</strong>.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-xl block mb-1">📱</span>
            <span class="text-white font-bold block text-xs">100% Local-First</span>
            <span class="text-[11px] text-slate-400">Salvo no seu celular ou PC</span>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-xl block mb-1">🚫</span>
            <span class="text-white font-bold block text-xs">Zero Banco em Nuvem</span>
            <span class="text-[11px] text-slate-400">Sem cópias ou uploads remotos</span>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span class="text-xl block mb-1">🔒</span>
            <span class="text-white font-bold block text-xs">Sem Cadastro Infantil</span>
            <span class="text-[11px] text-slate-400">Sem e-mail, senha ou biometria</span>
          </div>
        </div>
      </section>

      <!-- Seção 1 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">1.</span> O Princípio do Melhor Interesse da Criança (Art. 14 da LGPD)
        </h2>
        <p>
          Em rigoroso cumprimento ao <strong>Artigo 14 da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD)</strong> e ao <strong>Estatuto da Criança e do Adolescente (Lei nº 8.069/1990 - ECA)</strong>, todo o funcionamento do Synapsis Kids subordina-se prioritariamente à tutela dos direitos fundamentais da criança, com destaque para a privacidade, dignidade e desenvolvimento físico e psíquico saudável.
        </p>
        <p>
          O aplicativo não exige qualquer cadastro civil, CPF, endereço ou fotografia obrigatória da criança para funcionamento. O uso é imediato, autônomo e livre de barreiras de identificação.
        </p>
      </section>

      <!-- Seção 2 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">2.</span> Quais Informações Existem no Aplicativo e Onde Ficam Guardadas
        </h2>
        <p>
          Quando a família ou o terapeuta utiliza o Synapsis Kids, são criadas rotinas que podem conter:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li>Nomes informados para identificação dos cartões (ex.: "Escovar os Dentes", "Tomar Café");</li>
          <li>Horários previstos para início e término de atividades;</li>
          <li>Imagens e símbolos selecionados da biblioteca oficial de pictogramas ARASAAC, vídeos da Mascote Panquecca ou ícones visuais alternativos;</li>
          <li>Contagem de estrelas de reforço positivo obtidas no dia;</li>
          <li>Gravações de áudio de apoio vocal cadastradas pelo responsável.</li>
        </ul>
        <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 space-y-1.5 mt-3 text-xs">
          <p class="text-emerald-400 font-bold uppercase tracking-wider">Armazenamento Exclusivo no Dispositivo (Local Storage)</p>
          <p>
            Todos os itens acima mencionados são salvos <strong>exclusivamente na memória interna do navegador de internet do próprio usuário</strong> (mecanismos nativos <code>localStorage</code> e <code>IndexedDB</code>).
          </p>
          <p>
            <strong>A SD Engenharia e Consultoria Ltda NÃO tem acesso, NÃO faz leitura, NÃO transmite e NÃO armazena em servidores remotos nenhum desses dados.</strong>
          </p>
        </div>
      </section>

      <!-- Seção 3 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">3.</span> Ausência Absoluta de Rastreamento Comercial e Publicidade
        </h2>
        <p>
          O Synapsis Kids compromete-se com padrões éticos inegociáveis de proteção digital:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-slate-300">
          <li><strong>Zero Venda ou Compartilhamento de Dados:</strong> É expressamente proibida a cessão, aluguel, venda ou enriquecimento de bases com quaisquer dados decorrentes do uso da ferramenta;</li>
          <li><strong>Zero Redes de Anúncios (*No Ads*):</strong> O aplicativo não integra bibliotecas de Google AdMob, Meta Ads ou quaisquer redes de propaganda infantil direcionada;</li>
          <li><strong>Sem Cookies Invasivos:</strong> Não utilizamos cookies de rastreamento comportamental de terceiros (como pixels de remarketing no interior da área de rotinas).</li>
        </ul>
      </section>

      <!-- Seção 4 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">4.</span> Telemetria Técnica e Anonimizada de Acesso
        </h2>
        <p>
          Exclusivamente na página de apresentação (Landing Page informativa pública), podem ser coletadas métricas técnicas de tráfego agregado e estritamente anônimo (ex.: quantidade diária de visitas à página e cliques em links de instalação), através de requisições de telemetria técnica.
        </p>
        <p>
          Tais dados são puramente estatísticos e desprovidos de identificadores pessoais, servindo unicamente para mensurar a estabilidade dos servidores da página informativa e aprimorar a experiência de navegação do público.
        </p>
      </section>

      <!-- Seção 5 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">5.</span> Direitos dos Pais e Responsáveis Legais (Art. 18 da LGPD)
        </h2>
        <p>
          Como todos os dados ficam sob a posse e controle físico do próprio usuário no seu dispositivo:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong>Exclusão Imediata e Total:</strong> O responsável pode a qualquer momento excluir uma rotina individual dentro do app ou apagar todos os dados simplesmente limpando o histórico/cache do seu navegador de internet;</li>
          <li><strong>Portabilidade e Exportação:</strong> O aplicativo dispõe de ferramenta nativa no painel de configurações para baixar um arquivo integral de cópia de segurança em formato aberto (JSON);</li>
          <li><strong>Autonomia Completa:</strong> Nenhuma solicitação a atendentes é necessária para apagar seus dados, pois eles já pertencem integralmente e com exclusividade ao seu dispositivo.</li>
        </ul>
      </section>

      <!-- Seção 6 -->
      <section class="bg-[#0F172A]/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span class="text-teal-400">6.</span> Identificação da Controladora e Canal do DPO
        </h2>
        <p>
          Para esclarecimento de quaisquer dúvidas relacionadas a esta Política, exercício de direitos ou diretrizes de governança de dados:
        </p>
        <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 space-y-1.5 text-xs">
          <p><strong>Empresa Mantenedora:</strong> SD ENGENHARIA E CONSULTORIA LTDA</p>
          <p><strong>CNPJ:</strong> 61.567.359/0001-30</p>
          <p><strong>Sede:</strong> São Bernardo do Campo - SP, Brasil</p>
          <p><strong>Encarregado de Proteção de Dados (DPO):</strong> Suporte e Governança Synapsis</p>
          <p><strong>E-mail de Contato:</strong> <a href="mailto:contato@synapsisclinico.com.br" class="text-teal-400 hover:underline">contato@synapsisclinico.com.br</a></p>
        </div>
      </section>

    </div>

    <!-- Voltar -->
    <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <a href="termos-de-uso.html" class="hover:text-teal-400 transition font-semibold flex items-center gap-1.5">
        <span>📋 Ver Termos e Condições de Uso</span> ➔
      </a>
      <a href="landing.html" class="hover:text-white transition">
        ← Voltar à Página Principal
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-slate-950 border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
    <div class="max-w-4xl mx-auto px-4 space-y-2">
      <p>© 2026 <strong>Synapsis Kids</strong> • Mantido por SD ENGENHARIA E CONSULTORIA LTDA (CNPJ: 61.567.359/0001-30).</p>
      <p>Curadoria Neuropsicológica: Sandra Sorgatti D'Arduini (CRP 06/162626).</p>
    </div>
  </footer>

  <script>
    document.addEventListener('click', function(e) {
      var appLink = e.target.closest('a[data-app-link]');
      if (!appLink) return;
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        window.open('https://rotina.synapsisclinico.com.br/', '_blank');
      }
    }, false);
  </script>

</body>
</html>
`;

// Escreve em public
fs.writeFileSync(path.join(PUBLIC_DIR, 'termos-de-uso.html'), termosHtml, 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'politica-de-privacidade.html'), privacidadeHtml, 'utf8');
console.log('✅ Páginas jurídicas salvas em public/');

// Escreve em dist se existir
if (fs.existsSync(DIST_DIR)) {
  fs.writeFileSync(path.join(DIST_DIR, 'termos-de-uso.html'), termosHtml, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'politica-de-privacidade.html'), privacidadeHtml, 'utf8');
  console.log('✅ Páginas jurídicas sincronizadas em dist/');
}
