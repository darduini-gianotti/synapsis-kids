import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const ARTIFACT_DIR = 'C:/Users/Sergio DArduini/.gemini/antigravity/brain/54b764e2-1d67-424b-bc3e-76b1f5d7b46c';

// Read logos as base64
const logoIntegrareB64 = fs.readFileSync(path.join(DOCS_DIR, 'assets', 'logo_espaco_integrare.png')).toString('base64');
const synapsiFullB64 = fs.readFileSync(path.join(process.cwd(), 'public', 'assets', 'synapsi_1_full.png')).toString('base64');
const synapsiBrainB64 = fs.readFileSync(path.join(process.cwd(), 'public', 'assets', 'synapsi_brain1.png')).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual do Usuário — Synapsis Kids & Espaço Integrare</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4F46E5;
      --primary-dark: #3730A3;
      --teal: #0D9488;
      --teal-light: #2DD4BF;
      --amber: #D97706;
      --amber-light: #F59E0B;
      --navy: #090D16;
      --navy-card: #0F172A;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --text: #0F172A;
      --muted: #64748B;
      --border: #E2E8F0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #0B0F19;
      color: var(--text);
      line-height: 1.68;
      padding: 32px 16px 80px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 1040px;
      width: 100%;
      background: var(--surface);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    /* TOP ACTION BAR */
    .top-action-bar {
      background: #090D16;
      border-bottom: 1px solid #1E293B;
      padding: 14px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .badge-doc {
      background: rgba(45, 212, 191, 0.12);
      border: 1px solid rgba(45, 212, 191, 0.3);
      color: #2DD4BF;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 6px 14px;
      border-radius: 9999px;
      letter-spacing: 0.04em;
    }
    .btn-print {
      background: linear-gradient(135deg, #0D9488, #059669);
      color: white;
      border: none;
      padding: 9px 22px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
      transition: all 0.2s;
    }
    .btn-print:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(13, 148, 136, 0.5);
    }

    /* COVER HEADER (CAPA PREMIUM) */
    .cover-header {
      background: radial-gradient(circle at 85% 15%, rgba(13, 148, 136, 0.22) 0%, transparent 60%),
                  radial-gradient(circle at 10% 85%, rgba(79, 70, 229, 0.18) 0%, transparent 50%),
                  #090D16;
      color: white;
      padding: 48px 48px 44px;
      border-bottom: 1px solid #1E293B;
      position: relative;
    }

    /* HERO CO-BRANDING SECTION (AMBAS AS LOGOS BEM MAIORES) */
    .cover-logos-hero {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 36px;
      padding: 32px 36px;
      background: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      margin-bottom: 38px;
      flex-wrap: wrap;
    }
    .logo-hero-item {
      flex: 1;
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .logo-hero-synapsis {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-hero-synapsis img.full-logo {
      height: 125px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.6));
      transition: transform 0.2s ease;
    }
    .logos-hero-divider {
      width: 1px;
      height: 110px;
      background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    }
    .logo-hero-integrare {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-hero-integrare img {
      height: 125px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.6));
      transition: transform 0.2s ease;
    }

    .cover-category {
      color: #F59E0B;
      font-weight: 800;
      font-size: 0.88rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cover-title {
      font-size: 2.65rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 1.15rem;
      color: #94A3B8;
      max-width: 820px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .cover-tags {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .cover-tag {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #E2E8F0;
      font-size: 0.82rem;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
    }

    /* PREFÁCIO CLÍNICO (NOTA DOS CRIADORES) */
    .clinical-preface-card {
      background: linear-gradient(145deg, #0F172A 0%, #1E293B 100%);
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 36px 40px;
      margin: 44px 48px;
      color: #E2E8F0;
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    .clinical-preface-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 6px; height: 100%;
      background: linear-gradient(180deg, #2DD4BF, #F59E0B);
    }
    .preface-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .preface-badge {
      background: rgba(45, 212, 191, 0.15);
      color: #2DD4BF;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(45, 212, 191, 0.3);
    }
    .preface-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .preface-body p {
      font-size: 1.05rem;
      line-height: 1.75;
      color: #CBD5E1;
      margin-bottom: 16px;
    }
    .preface-body p strong {
      color: #FFFFFF;
    }

    /* SIGNATURE BLOCK */
    .credits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 32px;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }
    .credit-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
    }
    .credit-role {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #2DD4BF;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .credit-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .credit-spec {
      font-size: 0.88rem;
      color: #94A3B8;
      line-height: 1.5;
    }
    .credit-spec span {
      display: block;
      margin-top: 3px;
    }

    /* CONTENT BODY */
    .content-area {
      padding: 0 48px 48px;
    }
    h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.02em;
      margin-top: 56px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    h2 .chap-num {
      background: var(--primary);
      color: white;
      font-size: 0.95rem;
      padding: 4px 12px;
      border-radius: 8px;
      font-weight: 800;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1E293B;
      margin-top: 28px;
      margin-bottom: 14px;
    }
    p {
      margin-bottom: 16px;
      color: #334155;
      font-size: 1.05rem;
      line-height: 1.75;
    }
    hr {
      border: none;
      height: 1px;
      background: var(--border);
      margin: 48px 0;
    }

    /* CLINICAL HIGHLIGHT BOX IN CHAPTERS */
    .clinical-insight {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-left: 5px solid #059669;
      border-radius: 16px;
      padding: 20px 24px;
      margin: 24px 0 32px;
    }
    .insight-badge {
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #047857;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .clinical-insight p {
      margin-bottom: 0;
      font-size: 0.98rem;
      color: #166534;
      line-height: 1.6;
    }

    /* FIGURE CARDS */
    .figure-card {
      background: #090D16;
      border: 1px solid #1E293B;
      border-radius: 24px;
      padding: 28px;
      margin: 32px 0 40px;
      text-align: center;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.25);
    }
    .manual-img {
      max-width: 100%;
      height: auto;
      max-height: 780px;
      border-radius: 16px;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
      cursor: zoom-in;
      transition: transform 0.2s ease;
      background: #0F172A;
    }
    .manual-img:hover {
      transform: scale(1.01);
    }
    .figure-caption {
      margin-top: 18px;
      font-size: 0.92rem;
      color: #94A3B8;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .figure-caption strong {
      color: #F8FAFC;
    }

    /* TABLES */
    .table-wrapper {
      overflow-x: auto;
      margin: 24px 0 36px;
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }
    th {
      background: #F8FAFC;
      color: #475569;
      font-weight: 700;
      padding: 16px 18px;
      border-bottom: 2px solid var(--border);
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      color: #334155;
    }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background-color: #FAFAFA; }
    .col-num {
      font-weight: 800;
      color: var(--primary);
      width: 48px;
      text-align: center;
      font-size: 1.05rem;
    }
    .col-name {
      font-weight: 700;
      color: #0F172A;
      width: 220px;
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: #EEF2FF;
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 0.88em;
      color: #4338CA;
    }
    ul, ol {
      margin-left: 24px;
      margin-bottom: 20px;
    }
    li {
      margin-bottom: 10px;
      color: #334155;
      font-size: 1.02rem;
    }

    /* FOOTER */
    .manual-footer {
      background: #090D16;
      color: #94A3B8;
      padding: 40px 48px;
      border-top: 1px solid #1E293B;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 0.9rem;
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .footer-left strong {
      color: #FFFFFF;
    }

    /* MODAL ZOOM */
    #zoom-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(9, 13, 22, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    }
    #zoom-modal img {
      max-width: 95%;
      max-height: 95vh;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
    }

    /* PRINT STYLES */
    @media print {
      body { padding: 0; background: white; }
      .container { border: none; box-shadow: none; border-radius: 0; width: 100%; max-width: 100%; }
      .top-action-bar, .figure-caption span { display: none !important; }
      .cover-header { page-break-after: avoid; }
      .clinical-preface-card { page-break-inside: avoid; }
      .figure-card { page-break-inside: avoid; background: white; border: 1px solid #E2E8F0; padding: 12px; }
      .manual-img { max-height: 520px; box-shadow: none; border: 1px solid #CBD5E1; }
      .table-wrapper { page-break-inside: avoid; }
      .clinical-insight { page-break-inside: avoid; }
      h2 { page-break-before: always; }
      h2:first-of-type { page-break-before: avoid; }
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- TOP ACTION BAR -->
    <div class="top-action-bar">
      <span class="badge-doc">EDIÇÃO PREMIUM OFICIAL • PROTOCOLO CLÍNICO & GUIA DO USUÁRIO</span>
      <button class="btn-print" onclick="window.print()">
        🖨️ Imprimir / Salvar em PDF
      </button>
    </div>

    <!-- COVER HEADER -->
    <div class="cover-header">
      <!-- HERO CO-BRANDING SECTION COM AMBAS AS LOGOS BEM MAIORES -->
      <div class="cover-logos-hero">
        <div class="logo-hero-item logo-hero-synapsis">
          <img src="data:image/png;base64,${synapsiFullB64}" alt="Synapsis Kids — Rotina Visual" class="full-logo">
        </div>

        <div class="logos-hero-divider"></div>

        <div class="logo-hero-item logo-hero-integrare">
          <img src="data:image/png;base64,${logoIntegrareB64}" alt="Espaço Integrare — Psicologia e Neuropsicologia">
        </div>
      </div>

      <div class="cover-category">
        <span>⭐</span> Ecossistema Synapsis Clínico • Edição Kids
      </div>

      <h1 class="cover-title">Manual do Usuário & Guia de Rotina Visual</h1>

      <p class="cover-subtitle">
        A ferramenta interativa desenvolvida para promover autonomia, previsibilidade e autorregulação comportamental em crianças no Espectro Autista (TEA), TDAH e neurodivergências.
      </p>

      <div class="cover-tags">
        <span class="cover-tag">🌿 Validação Neuropsicológica</span>
        <span class="cover-tag">🧩 Prancha PECS / CAA</span>
        <span class="cover-tag">⏳ Princípio Primeiro/Depois</span>
        <span class="cover-tag">📲 Sincronização 1-Clique WhatsApp</span>
        <span class="cover-tag">🔒 100% Offline & Seguro</span>
      </div>
    </div>

    <!-- PREFÁCIO CLÍNICO (DA CLÍNICA PARA A VIDA REAL) -->
    <div class="clinical-preface-card">
      <div class="preface-header">
        <span class="preface-badge">DA CLÍNICA PARA A VIDA REAL • CONCEPÇÃO COMPARTILHADA</span>
        <span style="font-size: 0.85rem; color: #94A3B8;">Parceria Clínica & Tecnológica</span>
      </div>

      <h2 class="preface-title" style="margin-top: 0; border: none; padding: 0;">O Cuidado Clínico Encontra a Tecnologia</h2>

      <div class="preface-body">
        <p>
          O <strong>Synapsis Kids</strong> nasceu da união entre a engenharia de software e a sensibilidade do atendimento clínico diário. Na neuropsicologia, sabemos que para uma criança com <strong>Transtorno do Espectro Autista (TEA)</strong>, <strong>TDAH</strong> ou desafios no processamento sensorial, o ambiente cotidiano pode ser ruidoso, imprevisível e fonte de constante sobrecarga cognitiva. Tarefas aparentemente corriqueiras — como a transição de um jogo para o banho, a escovação dos dentes ou o preparo para a escola — frequentemente geram crises de ansiedade quando comunicadas apenas por comandos verbais abstratos.
        </p>
        <p>
          Este aplicativo foi concebido para atuar como uma <strong>ponte de segurança e previsibilidade</strong>. Ele traduz as diretrizes consagradas da <em>Análise do Comportamento Aplicada (ABA)</em>, do método <em>TEACCH</em> e dos sistemas de <em>Comunicação Aumentativa e Alternativa (CAA/PECS)</em> em uma interface tátil, afetuosa e visualmente serena. Cada detalhe — desde as paletas de cores de baixo estímulo e a sintetização de voz calma, até a decomposição de tarefas complexas em micro-passos sequenciais — foi planejado para substituir o desgaste das ordens repetitivas pelo empoderamento da criança, transformando a rotina do lar e da escola em um ambiente de cooperação, autonomia e afeto.
        </p>
      </div>

      <!-- CRÉDITOS DAS DUAS FRENTES -->
      <div class="credits-grid">
        <div class="credit-box">
          <div class="credit-role">🌿 Concepção Clínica & Curadoria Neuropsicológica</div>
          <div class="credit-name">Sandra Sorgatti D’Arduini</div>
          <div class="credit-spec">
            <strong>Psicóloga (CRP 06/162626) • Neuropsicóloga</strong>
            <span>• Especialista em Terapia Cognitivo-Comportamental (TCC)</span>
            <span>• Especialista em Transtornos do Neurodesenvolvimento</span>
            <span>• Especialista em Neuropsicologia e Reabilitação Cognitiva</span>
            <span style="color: #2DD4BF; margin-top: 6px; font-weight: 700;">Espaço Integrare — Psicologia e Neuropsicologia</span>
          </div>
        </div>

        <div class="credit-box">
          <div class="credit-role">💻 Arquitetura de Software & Inovação</div>
          <div class="credit-name">Sergio D’Arduini</div>
          <div class="credit-spec">
            <strong>SD Engenharia • Ecossistema Synapsis</strong>
            <span>• Arquitetura de Software e Sistemas de Alta Disponibilidade</span>
            <span>• Desenvolvimento do Ecossistema Synapsis Clínico</span>
            <span>• Plataformas Interativas de Acessibilidade Cognitiva</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="content-area">

      <!-- CAPÍTULO 1 -->
      <h2 id="cap1">
        <span class="chap-num">01</span> Tela Principal & Painel de Controle
      </h2>
      <p>
        A Tela Principal centraliza o planejamento diário da criança, atalhos rápidos e ferramentas de gestão parental e terapêutica. Todo o layout foi projetado para oferecer clareza com zero poluição visual.
      </p>

      <div class="clinical-insight">
        <div class="insight-badge">💡 Por que isso importa na clínica? • Sandra Sorgatti D'Arduini</div>
        <p>
          <em>"A previsibilidade temporal reduz em até 80% as crises de transição em crianças com TEA. A presença visual do contador de conquistas e a delimitação do dia da semana constroem a noção de tempo cronológico e promovem o senso de autorregulação."</em>
        </p>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_1_tela_principal.png" alt="Figura 1: Tela Principal" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 1: Tela Principal do Synapsis Kids</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Identidade & Logo</td>
              <td>Cabeçalho de identificação com o logotipo do aplicativo.</td>
              <td>Toque rápido para recarregar a visualização padrão.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Contador de Progresso (2/5)</td>
              <td>Mostra a proporção de tarefas concluídas vs pendentes.</td>
              <td>Fornece noção concreta de início, meio e fim ("só faltam 3!").</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Botão + Nova Tarefa</td>
              <td>Abre o formulário de cadastro de nova atividade com ícones e horários.</td>
              <td>Permite criar tarefas sob medida para a rotina familiar.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Tema (Sol/Lua)</td>
              <td>Alternador instantâneo entre Modo Claro e Modo Escuro.</td>
              <td>Essencial no período noturno para reduzir estímulos luminosos.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Controle Geral de Som</td>
              <td>Ativa ou silencia sinos, harpas e falas com 1 toque.</td>
              <td>Adequação rápida para consultórios, escolas ou locais silenciosos.</td>
            </tr>
            <tr>
              <td class="col-num">6</td>
              <td class="col-name">Bloqueio Parental (PIN)</td>
              <td>Cadeado de proteção com senha de 4 dígitos.</td>
              <td>Impede que a criança exclua ou altere tarefas acidentalmente.</td>
            </tr>
            <tr>
              <td class="col-num">7</td>
              <td class="col-name">Menu de Configurações</td>
              <td>Ajustes finos de vozes neurais, volume e estilo do mascote.</td>
              <td>Personalização auditiva para evitar sobrecarga sensorial.</td>
            </tr>
            <tr>
              <td class="col-num">8</td>
              <td class="col-name">Modelos Clínicos Prontos</td>
              <td>Rotinas estruturadas validadas (Matutina, Escolar, Desfralde, Noturna).</td>
              <td>Economiza tempo ao carregar rotinas completas com 1 clique.</td>
            </tr>
            <tr>
              <td class="col-num">9</td>
              <td class="col-name">Enviar / Importar Rotinas</td>
              <td>Geração e importação de Link Mágico sem necessidade de servidor na nuvem.</td>
              <td>Sincronização imediata entre pais, cuidadores, avós e terapeutas.</td>
            </tr>
            <tr>
              <td class="col-num">10</td>
              <td class="col-name">Sincronizar Calendário (.ics)</td>
              <td>Exporta alarmes para o Google Agenda, iPhone ou Samsung Calendar.</td>
              <td>Faz o celular tocar nos horários das tarefas sem manter o app aberto.</td>
            </tr>
            <tr>
              <td class="col-num">11</td>
              <td class="col-name">Copiar Programação</td>
              <td>Duplica as atividades de um dia para outros dias da semana.</td>
              <td>Reaproveita a rotina escolar de terça para quarta a sexta-feira.</td>
            </tr>
            <tr>
              <td class="col-num">12</td>
              <td class="col-name">Seletor de Dias da Semana</td>
              <td>Navegação entre segunda e domingo com destaque para o dia atual.</td>
              <td>Permite antecipar eventos de dias futuros com a criança.</td>
            </tr>
            <tr>
              <td class="col-num">13</td>
              <td class="col-name">Alternador de Visualização</td>
              <td>Alterna entre formato Lista e Prancha de Cartões Grandes (Modo TEA).</td>
              <td>Adapta a densidade de estímulos ao perfil de cada criança.</td>
            </tr>
            <tr>
              <td class="col-num">14</td>
              <td class="col-name">Bloco Primeiro / Depois</td>
              <td>Destaque da tarefa atual ("Agora") associada à próxima ("Depois").</td>
              <td>Técnica padrão de intervenção comportamental para motivar tarefas desafiadoras.</td>
            </tr>
            <tr>
              <td class="col-num">15</td>
              <td class="col-name">Cartão de Tarefa Interativo</td>
              <td>Exibe pictograma, horário, botão de áudio e status de conclusão.</td>
              <td>Toque no cartão para abrir a tela de micro-passos sequenciais.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 2 -->
      <h2 id="cap2">
        <span class="chap-num">02</span> Modo TEA & Prancha Visual PECS
      </h2>
      <p>
        A Prancha Visual ativa o modo de máxima acessibilidade cognitiva. Baseada nos princípios do <strong>PECS (Picture Exchange Communication System)</strong> e da <strong>Comunicação Aumentativa e Alternativa (CAA)</strong>, ela elimina textos longos e prioriza cartões amplos de alto contraste e fácil acionamento tátil.
      </p>

      <div class="clinical-insight">
        <div class="insight-badge">💡 Por que isso importa na clínica? • Sandra Sorgatti D'Arduini</div>
        <p>
          <em>"Crianças não alfabetizadas ou no início do letramento se orientam principalmente pela pista visual concreta. O pictograma atua diretamente no córtex visual, dispensando o esforço de decodificação de texto e gerando autonomia imediata."</em>
        </p>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_2_prancha_tea.png" alt="Figura 2: Prancha Visual TEA" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 2: Prancha Visual em Cartões Ampliados (Modo TEA)</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Seletor de Modo Visual</td>
              <td>Alterna entre Prancha Completa e Modo Foco Único (Primeiro / Depois).</td>
              <td>Reduz a sobrecarga em dias de desregulação sensorial.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Selo Modo TEA Ativo</td>
              <td>Indicador de interface adaptada para baixa frustração.</td>
              <td>Garante botões grandes que facilitam o toque motor infantil.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Horário da Atividade</td>
              <td>Destaque do horário programado em dígitos limpos.</td>
              <td>Associa o tempo do relógio com a rotina física da casa.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Ouvir Instrução por Voz</td>
              <td>Alto-falante que vocaliza a atividade na velocidade escolhida.</td>
              <td>Canal duplo (auditivo + visual) que reforça a compreensão.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Pictograma Visual CAA</td>
              <td>Ilustração de fácil identificação representando concretamente a ação.</td>
              <td>Comunicação direta que dispensa necessidade de leitura de texto.</td>
            </tr>
            <tr>
              <td class="col-num">6</td>
              <td class="col-name">Título em Fonte Grande</td>
              <td>Tipografia sem serifa, ampliada e de alto contraste.</td>
              <td>Estimula o letramento natural associado à imagem.</td>
            </tr>
            <tr>
              <td class="col-num">7</td>
              <td class="col-name">Botão Concluir Tarefa</td>
              <td>Botão amplo de marcação na base do cartão.</td>
              <td>Dispara confetes coloridos, reforço positivo sonoro e fala motivadora.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 3 -->
      <h2 id="cap3">
        <span class="chap-num">03</span> Foco na Atividade & Checklist de Passos
      </h2>
      <p>
        Ao tocar em qualquer cartão da prancha, abre-se o <strong>Modal de Foco</strong>. Ele isola a atividade de todas as outras distrações e decompõe comandos complexos em <strong>micro-passos sequenciais</strong>.
      </p>

      <div class="clinical-insight">
        <div class="insight-badge">💡 Por que isso importa na clínica? • Sandra Sorgatti D'Arduini</div>
        <p>
          <em>"A Análise de Tarefas (Task Analysis) é uma das ferramentas mais poderosas da terapia ABA. Dizer 'escove os dentes' envolve mais de 8 comandos motores simultâneos. Quebrar em etapas permite que a criança experimente o sucesso a cada pequeno passo cumprido, construindo autoeficácia."</em>
        </p>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_3_modal_foco_passos.png" alt="Figura 3: Modal de Foco e Passos" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 3: Modal de Foco e Checklist de Passos</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Botão Voltar à Prancha</td>
              <td>Retorna à tela anterior sem perder os passos já marcados.</td>
              <td>Permite rever outras tarefas sem resetar o progresso.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Horário Programado</td>
              <td>Exibição do horário da atividade no canto superior.</td>
              <td>Mantém a orientação temporal constante.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Desenho Central Interativo</td>
              <td>Ilustração tátil em destaque com efeito sonoro integrado.</td>
              <td>A criança pode tocar repetidas vezes no desenho para ouvir a instrução.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Título da Atividade em Destaque</td>
              <td>Nome da tarefa em fonte gigante e legibilidade total.</td>
              <td>Foco absoluto na ação presente, evitando dispersão mental.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Painel de Micro-Passos</td>
              <td>Seção de checklist contendo as etapas individuais da tarefa.</td>
              <td>Garante a correta execução de etapas higiênicas e funcionais.</td>
            </tr>
            <tr>
              <td class="col-num">6</td>
              <td class="col-name">Número e Descrição do Passo</td>
              <td>Instrução curta e clara (ex: <code>1. Levantar a tampa do vaso</code>).</td>
              <td>Sequenciamento motor lógico e sem ambiguidades.</td>
            </tr>
            <tr>
              <td class="col-num">7</td>
              <td class="col-name">Checkbox Tátil de Conclusão</td>
              <td>Caixa ampla de marcação com risco suave do texto.</td>
              <td>Gera dopamina e sensação de conquista intermediária imediata.</td>
            </tr>
            <tr>
              <td class="col-num">8</td>
              <td class="col-name">Botão "Tudo Feito!"</td>
              <td>Finaliza a atividade por completo ao concluir os passos.</td>
              <td>Aciona comemoração do mascote com som suave e sem sobreposição de áudio.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 4 -->
      <h2 id="cap4">
        <span class="chap-num">04</span> Compartilhamento & Importação por Link Mágico
      </h2>
      <p>
        O Synapsis Kids utiliza tecnologia de compressão algorítmica (<em>LZString</em>) que condensa toda a programação semanal em um <strong>Link Mágico</strong> para o WhatsApp, sem depender de banco de dados na nuvem ou senhas.
      </p>

      <div class="clinical-insight">
        <div class="insight-badge">💡 Por que isso importa na clínica? • Sandra Sorgatti D'Arduini</div>
        <p>
          <em>"A consistência entre o consultório, a casa e a escola é o pilar do sucesso terapêutico. O terapeuta pode montar a rotina no consultório e enviá-la aos pais pelo WhatsApp em 1 clique, garantindo que a mesma linguagem visual seja adotada em todos os ambientes da criança."</em>
        </p>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_4_compartilhar_link.png" alt="Figura 4: Compartilhar no WhatsApp" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 4: Tela de Compartilhamento via WhatsApp e Link Mágico</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Aba "Compartilhar Rotina"</td>
              <td>Painel ativo de geração de mensagens e links de envio.</td>
              <td>Envio rápido para cuidadores e professores.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Aba "Importar no Meu App"</td>
              <td>Aba receptora para carregar rotinas enviadas por outros celulares.</td>
              <td>Use quando receber uma programação enviada por outra pessoa.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Filtro Dia Atual vs Semana</td>
              <td>Escolha entre exportar apenas o dia aberto ou a grade semanal inteira.</td>
              <td>Envie a programação de um dia especial ou a rotina regular completa.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Resumo Visual das Atividades</td>
              <td>Pré-visualização das tarefas com horários e ícones.</td>
              <td>Permite conferir o conteúdo exato antes de disparar a mensagem.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Botão "Enviar no WhatsApp"</td>
              <td>Abre o WhatsApp com mensagem formatada e o link encurtado.</td>
              <td>Facilidade extrema para mães, pais e avós com 1 toque.</td>
            </tr>
            <tr>
              <td class="col-num">6</td>
              <td class="col-name">Botão "Copiar Mensagem"</td>
              <td>Copia o texto completo para a área de transferência.</td>
              <td>Ideal para enviar por Telegram, E-mail ou salvar no Bloco de Notas.</td>
            </tr>
            <tr>
              <td class="col-num">7</td>
              <td class="col-name">Copiar Apenas o Link Mágico</td>
              <td>Copia exclusivamente a URL criptografada.</td>
              <td>Perfeito para fixar em murais digitais ou painéis escolares.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_4b_importar_link.png" alt="Figura 4b: Importar no Meu App" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 4b: Tela de Importação em 1 Toque</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Aba Ativa "Importar"</td>
              <td>Interface de recebimento seguro de novas rotinas.</td>
              <td>Garante que você está no fluxo de carregamento de dados.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Botão "Colar Link Copiado"</td>
              <td>Detecta e cola automaticamente o link do WhatsApp com 1 toque.</td>
              <td>Elimina a complexidade técnica de recortar e colar links longos.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Campo de Inserção de Link</td>
              <td>Área de texto para digitação ou colagem manual.</td>
              <td>Segurança caso o navegador restrinja o acesso automático à área de transferência.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Botão "Verificar Link"</td>
              <td>Descompacta e exibe a pré-visualização das tarefas recebidas.</td>
              <td>Não substitui os dados do seu aparelho sem sua confirmação expressa.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 5 -->
      <h2 id="cap5">
        <span class="chap-num">05</span> Sincronização de Calendário & Alarmes
      </h2>
      <p>
        Para que os pais não precisem manter o aplicativo aberto o tempo todo, o Synapsis Kids gera um arquivo universal de calendário (<code>.ics</code>) compatível com <strong>Google Agenda</strong>, <strong>Apple Calendar (iOS)</strong> e <strong>Samsung Calendar</strong>.
      </p>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_5_lembretes_celular.png" alt="Figura 5: Sincronização de Calendário" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 5: Exportação de Alarmes para o Calendário Nativo do Smartphone</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Opção "Semana Toda"</td>
              <td>Exporta todos os eventos de segunda a domingo em um único arquivo.</td>
              <td>Ideal para planejar a semana letiva completa de uma vez.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Opção "Apenas o Dia Selecionado"</td>
              <td>Exporta unicamente as atividades do dia atual (ex: Terça-feira).</td>
              <td>Perfeito para dias atípicos, passeios ou consultas médicas.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Configuração dos Alarmes</td>
              <td>Define a antecedência do aviso (no horário, 5 min ou 15 min antes).</td>
              <td>Fornece o tempo prévio fundamental para preparar a criança antes de trocar de atividade.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Instruções para iPhone e Android</td>
              <td>Guia passo a passo de como abrir o arquivo em cada sistema operacional.</td>
              <td>Instruções fáceis para abrir direto no aplicativo nativo de agenda.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Botão "Baixar e Abrir no Calendário"</td>
              <td>Faz o download do arquivo <code>.ics</code> e aciona o calendário do celular.</td>
              <td>O celular passa a tocar e notificar os responsáveis automaticamente.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 6 -->
      <h2 id="cap6">
        <span class="chap-num">06</span> Vozes Neurais, Mascote & Regulação Sensorial
      </h2>
      <p>
        Crianças com sensibilidade auditiva (hiperacusia) frequentemente rejeitam ruídos agudos ou vozes robóticas. O Synapsis Kids inclui opções finas de equalização, cadência calmante e sintetizadores de voz para oferecer acolhimento sem sobrecarga.
      </p>

      <div class="clinical-insight">
        <div class="insight-badge">💡 Por que isso importa na clínica? • Sandra Sorgatti D'Arduini</div>
        <p>
          <em>"Muitas crianças no espectro autista apresentam processamento auditivo desacelerado. Reduzir a velocidade da fala para 0.85x e adotar entonações previsíveis e afetuosas permite que a criança decodifique a instrução com tranquilidade, sem entrar em estado de alerta ou defesa sensorial."</em>
        </p>
      </div>

      <div class="figure-card">
        <img src="./manual_images/manual_figura_6_configuracoes_vozes.png" alt="Figura 6: Configurações & Vozes" class="manual-img" onclick="zoomImage(this)">
        <p class="figure-caption">
          <strong>Figura 6: Ajustes de Vozes Neurais, Volume e Personagem Mascote</strong>
          <span>(Clique para ampliar em tela cheia)</span>
        </p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-num">Nº</th>
              <th class="col-name">Elemento</th>
              <th>Descrição & Finalidade</th>
              <th>Aplicação Terapêutica / Prática</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-num">1</td>
              <td class="col-name">Tema Visual (Claro / Escuro / Sistema)</td>
              <td>Ajuste de contraste e brilho da tela do aplicativo.</td>
              <td>Previne fadiga ocular e estresse fotossensível.</td>
            </tr>
            <tr>
              <td class="col-num">2</td>
              <td class="col-name">Volume dos Lembretes Sonoros</td>
              <td>Slider de intensidade para os sinos harmônicos e harpas.</td>
              <td>Permite regular o som em volume baixo e suave para crianças sensíveis.</td>
            </tr>
            <tr>
              <td class="col-num">3</td>
              <td class="col-name">Leitura por Voz dos Lembretes (TTS)</td>
              <td>Chave liga/desliga da narração em voz alta das atividades.</td>
              <td>Permite manter apenas avisos musicais sutis se a criança preferir silêncio vocal.</td>
            </tr>
            <tr>
              <td class="col-num">4</td>
              <td class="col-name">Seleção do Motor de Voz</td>
              <td>Lista de vozes instaladas no smartphone (Google, Apple, Microsoft).</td>
              <td>Escolha a voz mais acolhedora e natural em português brasileiro.</td>
            </tr>
            <tr>
              <td class="col-num">5</td>
              <td class="col-name">Estilo do Locutor (Mascote vs Suave TEA)</td>
              <td>Alternador de personalidade: <strong>Mascote Animado</strong> ou <strong>Voz Suave (TEA)</strong>.</td>
              <td>O tom <em>Mascote</em> gera entusiasmo lúdico, enquanto o <em>Suave TEA</em> entrega estabilidade e calma.</td>
            </tr>
            <tr>
              <td class="col-num">6</td>
              <td class="col-name">Cadência da Fala (Calma vs Animada)</td>
              <td>Velocidade do sintetizador ajustável entre 0.85x e 1.0x.</td>
              <td>A cadência lenta favorece a compreensão auditiva de crianças neurodivergentes.</td>
            </tr>
            <tr>
              <td class="col-num">7</td>
              <td class="col-name">Botões de Teste Auditivo</td>
              <td>Ouvir apresentação do mascote e demonstração de elogio antes de salvar.</td>
              <td>Valide previamente com a criança se o som agrada antes do uso no dia a dia.</td>
            </tr>
            <tr>
              <td class="col-num">8</td>
              <td class="col-name">Botão "Salvar Preferências"</td>
              <td>Grava permanentemente os ajustes na memória do aparelho.</td>
              <td>As escolhas persistem para sempre mesmo fechando e reabrindo o navegador.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr>

      <!-- CAPÍTULO 7 -->
      <h2 id="cap7">
        <span class="chap-num">07</span> Instalação como App (PWA) & Melhores Práticas
      </h2>

      <h3>Como Instalar na Tela Inicial do Celular</h3>
      <p>
        O Synapsis Kids foi construído como um <strong>Progressive Web App (PWA)</strong>. Ele não precisa ser baixado em lojas pesadas e funciona perfeitamente sem conexão com a internet:
      </p>

      <ul>
        <li>
          <strong>No Android (Google Chrome):</strong> Acesse o link no Chrome, toque nos três pontinhos no canto superior direito e selecione <code>"Adicionar à tela inicial"</code> ou <code>"Instalar aplicativo"</code>.
        </li>
        <li>
          <strong>No iPhone / iPad (Safari):</strong> Abra o link no Safari, toque no botão de Compartilhar (ícone do quadrado com seta para cima) e selecione <code>"Adicionar à Tela de Início"</code>.
        </li>
      </ul>

      <h3>Diretrizes Práticas para Pais e Terapeutas</h3>
      <ol>
        <li>
          <strong>Apresentação Prévia:</strong> Converse sobre a rotina no início do dia ou na noite anterior. O cérebro infantil se regula pela antecipação segura.
        </li>
        <li>
          <strong>Consistência e Parceria:</strong> Use o botão de compartilhamento para que os avós, cuidadores e professores da escola mantenham a mesma sequência de atividades.
        </li>
        <li>
          <strong>Reforço Positivo Imediato:</strong> Sempre comemore a marcação dos passos com palavras de incentivo genuínas junto com o elogio do aplicativo.
        </li>
      </ol>

    </div>

    <!-- FOOTER -->
    <div class="manual-footer">
      <div class="footer-left">
        <strong>Synapsis Kids • Rotina Visual, Autonomia e Previsibilidade</strong>
        <span>Desenvolvido em parceria com o <strong>Espaço Integrare — Psicologia e Neuropsicologia</strong></span>
      </div>
      <div>
        <span>Manual Oficial • Versão 2.0 (2026)</span>
      </div>
    </div>
  </div>

  <!-- ZOOM MODAL -->
  <div id="zoom-modal" onclick="this.style.display='none'">
    <img id="zoom-img" src="" alt="Zoom">
  </div>

  <script>
    function zoomImage(img) {
      const modal = document.getElementById('zoom-modal');
      const zoomImg = document.getElementById('zoom-img');
      zoomImg.src = img.src;
      modal.style.display = 'flex';
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(DOCS_DIR, 'manual_do_usuario.html'), htmlContent, 'utf8');
const publicManualPath = path.join(process.cwd(), 'public', 'manual.html');
fs.writeFileSync(publicManualPath, htmlContent, 'utf8');

// Copy images to public/manual_images
const publicImagesDir = path.join(process.cwd(), 'public', 'manual_images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}
const docsImagesDir = path.join(DOCS_DIR, 'manual_images');
if (fs.existsSync(docsImagesDir)) {
  fs.readdirSync(docsImagesDir).forEach(file => {
    fs.copyFileSync(path.join(docsImagesDir, file), path.join(publicImagesDir, file));
  });
}

console.log('✅ Manual Premium atualizado em docs/manual_do_usuario.html e public/manual.html');

