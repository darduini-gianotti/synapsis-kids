const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const toBase64 = (filePath, mime = 'image/jpeg') => {
  const resolved = path.resolve(filePath);
  if (fs.existsSync(resolved)) {
    const data = fs.readFileSync(resolved);
    return `data:${mime};base64,${data.toString('base64')}`;
  }
  return '';
};

const logoFull = toBase64('public/assets/synapsi_1_full.png', 'image/png');
const panqueccaSorriso = toBase64('public/mascots/panquecca_sorriso.jpg', 'image/jpeg');
const panqueccaEscovando = toBase64('public/mascots/panquecca_escovando.jpg', 'image/jpeg');
const panqueccaBanho = toBase64('public/mascots/panquecca_banho.jpg', 'image/jpeg');
const panqueccaComendo = toBase64('public/mascots/panquecca_comendo.jpg', 'image/jpeg');

const slidesData = [
  // SLIDE 1: CAPA
  {
    slideNumber: '01',
    category: 'GUIA PARENTAL • AUTONOMIA INFANTIL',
    badgeType: 'amber',
    html: `
      <div class="category-pill amber">🐾 GUIA PARENTAL • PREVISIBILIDADE VISUAL</div>
      
      <h1 class="main-title">
        Seu filho trava na hora de escovar os dentes ou ir para o banho?<br>
        <span class="text-amber">Não é 'birra':</span> ele precisa de previsibilidade. 🧠✨
      </h1>

      <div class="comparison-card">
        <div class="comp-col comp-old">
          <div class="comp-tag old">COMANDO FALADO ❌</div>
          <ul>
            <li>Repetir 15 vezes a mesma ordem</li>
            <li>Sobrecarga sensorial no cérebro</li>
            <li>Sensação de interrupção e perda</li>
            <li>Gritos, choro e estresse na família</li>
          </ul>
        </div>
        <div class="comp-divider">VS</div>
        <div class="comp-col comp-new">
          <div class="comp-tag new">COM A PANQUECCA 🐾</div>
          <ul>
            <li>Modelagem visual passo a passo</li>
            <li>Voz suave sem alarmes de pânico</li>
            <li>Previsibilidade do início ao fim</li>
            <li>Comemoração e reforço positivo</li>
          </ul>
        </div>
      </div>

      <div class="subtext-box">
        Descubra como a <strong>Mascote Panquecca</strong> no <strong>Synapsis Kids</strong> transforma o momento mais difícil do dia em uma conquista da criança.
      </div>
    `,
    swipeText: 'Arraste para entender 👉'
  },

  // SLIDE 2: O QUE ACONTECE NO CÉREBRO ATÍPICO
  {
    slideNumber: '02',
    category: 'NEUROBIOLOGIA DA TRANSIÇÃO',
    badgeType: 'alert',
    html: `
      <div class="category-pill alert">POR QUE ORDENS FALADAS NÃO FUNCIONAM?</div>
      
      <h1 class="main-title">
        O comando verbal é <span class="text-red">abstrato</span> e se perde no ar em segundos. ⏳
      </h1>

      <p class="section-lead">Para crianças com TEA ou TDAH, mudar de atividade não é apenas uma escolha:</p>

      <div class="cards-list">
        <div class="pain-card">
          <div class="pain-icon">🛑</div>
          <div class="pain-content">
            <h3>Rigidez Cognitiva & Transição Brusca</h3>
            <p>Interromper uma brincadeira de repente aciona a amígdala cerebral como uma ameaça real de perda. A criança trava em modo de autodefesa.</p>
          </div>
        </div>

        <div class="pain-card">
          <div class="pain-icon">🔇</div>
          <div class="pain-content">
            <h3>Sobrecarga no Processamento Auditivo</h3>
            <p>Quando os pais repetem ordens ("vai agora!", "larga isso!"), o cérebro da criança simplesmente desliga o canal auditivo para não entrar em colapso sensorial.</p>
          </div>
        </div>

        <div class="pain-card">
          <div class="pain-icon">🌫️</div>
          <div class="pain-content">
            <h3>Falta de Imagem Concreta</h3>
            <p>Dizer "vá tomar banho" exige mais de 8 passos mentais. Sem um mapa visual, a tarefa parece uma montanha impossível de escalar.</p>
          </div>
        </div>
      </div>
    `,
    swipeText: 'Veja a solução 👉'
  },

  // SLIDE 3: APRESENTANDO A PANQUECCA
  {
    slideNumber: '03',
    category: 'VÍNCULO AFETIVO',
    badgeType: 'amber',
    html: `
      <div class="category-pill amber">A NOVA COMPANHEIRA DA SUA FAMÍLIA</div>
      
      <h1 class="main-title" style="font-size: 42px;">
        Conheça a <span class="text-amber">Panquecca</span>: A Mascote do Synapsis Kids! 🐾💛
      </h1>

      <div class="mascot-hero-card">
        <div class="mascot-img-wrap">
          <img src="${panqueccaSorriso}" alt="Mascote Panquecca">
        </div>
        <div class="mascot-hero-text">
          <div class="hero-badge">AFETO & PREVISIBILIDADE</div>
          <h3>Vínculo Sem Ameaça Social</h3>
          <p>Crianças com neurodivergências respondem muito melhor a personagens antropomórficos amigáveis do que a ordens diretas de autoridade adulta. A Panquecca é parceira da rotina, não uma juíza.</p>
        </div>
      </div>

      <div class="feature-pills-row">
        <div class="feature-item">
          <span class="f-icon">🎙️</span>
          <div>
            <strong>Voz Suave de Estúdio</strong>
            <span>Instruções calmas sem bips estridentes</span>
          </div>
        </div>
        <div class="feature-item">
          <span class="f-icon">🛡️</span>
          <div>
            <strong>Curadoria Neuropsicológica</strong>
            <span>Baseada em ABA, TEACCH e CAA</span>
          </div>
        </div>
      </div>
    `,
    swipeText: 'Como ela ensina? Veja 👉'
  },

  // SLIDE 4: MODELAGEM VISUAL DE HÁBITOS
  {
    slideNumber: '04',
    category: 'MODELAGEM DE COMPORTAMENTO',
    badgeType: 'teal',
    html: `
      <div class="category-pill teal">APRENDIZAGEM POR IMITAÇÃO</div>
      
      <h1 class="main-title">
        A Panquecca <span class="text-teal">faz junto</span> com a criança! 🪥🛁
      </h1>

      <p class="section-lead">A criança olha o cartão e compreende imediatamente a ação concreta:</p>

      <div class="gallery-showcase">
        <div class="mini-card">
          <div class="mini-img"><img src="${panqueccaEscovando}" alt="Escovar os Dentes"></div>
          <strong>Escovar Dentes</strong>
          <span>Modelagem com escova e pasta</span>
        </div>
        <div class="mini-card">
          <div class="mini-img"><img src="${panqueccaBanho}" alt="Tomar Banho"></div>
          <strong>Hora do Banho</strong>
          <span>Sem medo do chuveiro ou da água</span>
        </div>
        <div class="mini-card">
          <div class="mini-img"><img src="${panqueccaComendo}" alt="Comer Frutas"></div>
          <strong>Alimentação</strong>
          <span>Incentivo a hábitos saudáveis</span>
        </div>
      </div>

      <div class="highlight-callout">
        💡 <strong>Ativação dos neurônios-espelho:</strong> a criança não precisa adivinhar o que fazer. A imagem orienta e traz segurança imediata.
      </div>
    `,
    swipeText: 'E quando termina? Veja 👉'
  },

  // SLIDE 5: REFORÇO POSITIVO E DOPAMINA
  {
    slideNumber: '05',
    category: 'ANÁLISE DO COMPORTAMENTO (ABA)',
    badgeType: 'green',
    html: `
      <div class="category-pill success">SEM PUNIÇÃO • REFORÇO IMEDIATO</div>
      
      <h1 class="main-title">
        Sensação de Vitória: <span class="text-green">Dopamina Saudável</span>! 🏆🎉
      </h1>

      <p class="section-lead">O bom comportamento só se fixa quando a criança experimenta alegria ao concluir:</p>

      <div class="celebration-box">
        <div class="celeb-img-box">
          <img src="${panqueccaSorriso}" alt="Panquecca Comemorando">
          <div class="celeb-tag">✨ NOTA 10!</div>
        </div>
        <div class="celeb-content">
          <h3>Festa na Tela com Confetes Coloridos!</h3>
          <p>Ao tocar no botão de concluir, o aplicativo toca um sinal suave e solta confetes vibrantes enquanto a Panquecca sorri e parabeniza a criança.</p>
          <div class="celeb-badges">
            <span>✓ Autoestima elevada</span>
            <span>✓ Autonomia real</span>
            <span>✓ Vontade de repetir</span>
          </div>
        </div>
      </div>
    `,
    swipeText: 'Como funciona no celular? 👉'
  },

  // SLIDE 6: TECNOLOGIA PARA FAMÍLIAS E CLÍNICAS
  {
    slideNumber: '06',
    category: 'SYNAPSIS KIDS • RECURSOS',
    badgeType: 'cyan',
    html: `
      <div class="category-pill cyan">TUDO NO SEU BOLSO</div>
      
      <h1 class="main-title">
        Tudo o que pais e terapeutas precisam em <span class="text-cyan">1 Toque</span>. 📲
      </h1>

      <div class="grid-2x2">
        <div class="exam-card">
          <div class="exam-icon">🧩</div>
          <h3>Prancha PECS & ARASAAC</h3>
          <p>Cartões de alto contraste com pictogramas reconhecidos mundialmente para Comunicação Alternativa.</p>
        </div>

        <div class="exam-card">
          <div class="exam-icon">⚖️</div>
          <h3>Modo Primeiro / Depois</h3>
          <p>Técnica comportamental First-Then para desarmar crises de transição entre dever e lazer.</p>
        </div>

        <div class="exam-card">
          <div class="exam-icon">⏱️</div>
          <h3>Time Timer Visual</h3>
          <p>Disco colorido que encolhe com o tempo, sem números estressantes de contagem regressiva.</p>
        </div>

        <div class="exam-card">
          <div class="exam-icon">📲</div>
          <h3>Link Mágico WhatsApp</h3>
          <p>O terapeuta monta a rotina em consulta e os pais importam tudo no celular em 2 segundos.</p>
        </div>
      </div>
    `,
    swipeText: 'Como começar de graça? 👉'
  },

  // SLIDE 7: CTA / CONVITE
  {
    slideNumber: '07',
    category: 'COMECE HOJE',
    badgeType: 'amber',
    html: `
      <div class="category-pill amber">100% GRATUITO • SEM ANÚNCIOS</div>
      
      <h1 class="main-title" style="font-size: 44px; text-align: center;">
        Apresente a <span class="text-amber">Panquecca</span> para o seu filho hoje mesmo! 🐾💙
      </h1>

      <div class="offer-box">
        <div class="offer-item">
          <span class="offer-icon">🎁</span>
          <div>
            <strong>100% Gratuito Para Famílias</strong>
            <p>Sem mensalidade, sem anúncios e sem cadastro demorado.</p>
          </div>
        </div>

        <div class="offer-item">
          <span class="offer-icon">📱</span>
          <div>
            <strong>Instale Direto na Tela Inicial</strong>
            <p>Funciona no iPhone, iPad, Android ou computador como aplicativo (PWA).</p>
          </div>
        </div>

        <div class="offer-item">
          <span class="offer-icon">💼</span>
          <div>
            <strong>É Terapeuta Infantil ou Tem Clínica?</strong>
            <p>Conheça o ecossistema Synapsis Clínico (CFP, CFFa, COFFITO e ABPp) com 3 meses grátis!</p>
          </div>
        </div>
      </div>

      <div class="cta-button-box">
        <div class="cta-btn">
          CLIQUE NO LINK DA BIO & ABRA O APP
        </div>
        <span class="cta-url">rotina.synapsisclinico.com.br</span>
      </div>

      <div class="save-reminder">
        💬 Ou comente <strong>PANQUECCA</strong> que enviamos o link direto no seu direct!
      </div>
    `,
    swipeText: 'Salve este post 📌'
  }
];

function buildFullHtml(slide) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Slide ${slide.slideNumber} — Synapsis Kids Panquecca</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: 1080px;
      height: 1350px;
      background: #080d1a;
      background-image: 
        radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16) 0%, transparent 45%),
        radial-gradient(circle at 15% 85%, rgba(13, 148, 136, 0.14) 0%, transparent 40%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #f8fafc;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 60px 70px;
      position: relative;
    }

    /* TOP NAVBAR */
    .slide-navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
      margin-bottom: 40px;
      position: relative;
      z-index: 10;
    }
    .slide-logo img {
      height: 44px;
    }
    .slide-counter {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.8);
      color: #FBBF24;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.1em;
      padding: 8px 20px;
      border-radius: 9999px;
    }

    /* MAIN CONTENT */
    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
    }

    /* TYPOGRAPHY */
    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 8px 18px;
      border-radius: 9999px;
      margin-bottom: 26px;
      width: fit-content;
    }
    .category-pill.amber {
      color: #FBBF24;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
    }
    .category-pill.alert {
      color: #f87171;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(248, 113, 113, 0.35);
    }
    .category-pill.teal {
      color: #2dd4bf;
      background: rgba(13, 148, 136, 0.15);
      border: 1px solid rgba(45, 212, 191, 0.35);
    }
    .category-pill.cyan {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
    }
    .category-pill.success {
      color: #34d399;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.35);
    }

    .main-title {
      font-size: 46px;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    .text-amber { color: #FBBF24; }
    .text-teal { color: #2dd4bf; }
    .text-cyan { color: #38bdf8; }
    .text-red { color: #f87171; }
    .text-green { color: #34d399; }

    .section-lead {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    /* SLIDE 1: COMPARISON */
    .comparison-card {
      display: flex;
      gap: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 28px 24px;
      margin-bottom: 28px;
    }
    .comp-col { flex: 1; }
    .comp-tag {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.1em;
      padding: 6px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: inline-block;
    }
    .comp-tag.old {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.4);
    }
    .comp-tag.new {
      background: rgba(245, 158, 11, 0.25);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.45);
    }
    .comp-col ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .comp-col ul li {
      font-size: 17px;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .comp-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-weight: 900;
      font-size: 15px;
      padding: 0 8px;
    }
    .subtext-box {
      font-size: 19px;
      color: #94a3b8;
      line-height: 1.6;
      border-left: 4px solid #FBBF24;
      padding-left: 20px;
    }

    /* PAIN CARDS (SLIDE 2) */
    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .pain-card {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px 28px;
    }
    .pain-icon { font-size: 34px; line-height: 1; }
    .pain-content h3 { font-size: 21px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
    .pain-content p { font-size: 16.5px; color: #94a3b8; line-height: 1.5; }

    /* MASCOT HERO CARD (SLIDE 3) */
    .mascot-hero-card {
      display: flex;
      gap: 24px;
      background: rgba(15, 23, 42, 0.9);
      border: 1.5px solid rgba(245, 158, 11, 0.4);
      border-radius: 24px;
      padding: 24px;
      margin-bottom: 24px;
      align-items: center;
    }
    .mascot-img-wrap {
      width: 220px;
      height: 220px;
      border-radius: 20px;
      overflow: hidden;
      flex-shrink: 0;
      border: 2px solid #FBBF24;
    }
    .mascot-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .hero-badge {
      font-size: 11px;
      font-weight: 800;
      color: #FBBF24;
      background: rgba(245, 158, 11, 0.15);
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .mascot-hero-text h3 { font-size: 24px; color: #FFF; margin-bottom: 10px; font-weight: 800; }
    .mascot-hero-text p { font-size: 17px; color: #cbd5e1; line-height: 1.5; }

    .feature-pills-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      padding: 16px 20px;
      border-radius: 14px;
    }
    .f-icon { font-size: 28px; }
    .feature-item strong { display: block; font-size: 17px; color: #ffffff; }
    .feature-item span { font-size: 14px; color: #94a3b8; }

    /* GALLERY SHOWCASE (SLIDE 4) */
    .gallery-showcase {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin-bottom: 28px;
    }
    .mini-card {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid #334155;
      border-radius: 18px;
      padding: 14px;
      text-align: center;
    }
    .mini-img {
      width: 100%;
      height: 160px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
      border: 1px solid #1E293B;
    }
    .mini-img img { width: 100%; height: 100%; object-fit: cover; }
    .mini-card strong { display: block; font-size: 17px; color: #ffffff; margin-bottom: 4px; }
    .mini-card span { font-size: 13px; color: #94a3b8; line-height: 1.35; display: block; }
    .highlight-callout {
      font-size: 18px;
      color: #f1f5f9;
      background: rgba(13, 148, 136, 0.15);
      border: 1px solid rgba(45, 212, 191, 0.3);
      padding: 18px 24px;
      border-radius: 14px;
    }

    /* CELEBRATION BOX (SLIDE 5) */
    .celebration-box {
      display: flex;
      gap: 26px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.95));
      border: 1.5px solid rgba(52, 211, 153, 0.4);
      border-radius: 24px;
      padding: 28px;
      align-items: center;
    }
    .celeb-img-box {
      width: 220px;
      height: 220px;
      border-radius: 20px;
      overflow: hidden;
      flex-shrink: 0;
      border: 2px solid #34D399;
      position: relative;
    }
    .celeb-img-box img { width: 100%; height: 100%; object-fit: cover; }
    .celeb-tag {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: #059669;
      color: #FFF;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .celeb-content h3 { font-size: 25px; color: #FFF; margin-bottom: 12px; font-weight: 800; }
    .celeb-content p { font-size: 17px; color: #cbd5e1; line-height: 1.5; margin-bottom: 18px; }
    .celeb-badges { display: flex; gap: 10px; flex-wrap: wrap; }
    .celeb-badges span {
      font-size: 13px;
      font-weight: 700;
      color: #34D399;
      background: rgba(52, 211, 153, 0.12);
      padding: 6px 12px;
      border-radius: 8px;
    }

    /* 2X2 GRID (SLIDE 6) */
    .grid-2x2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .exam-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 18px;
      padding: 26px;
    }
    .exam-icon { font-size: 32px; margin-bottom: 12px; }
    .exam-card h3 { font-size: 20px; color: #ffffff; margin-bottom: 8px; font-weight: 700; }
    .exam-card p { font-size: 15.5px; color: #94a3b8; line-height: 1.45; }

    /* CTA (SLIDE 7) */
    .offer-box {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-bottom: 34px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 30px;
    }
    .offer-item { display: flex; align-items: center; gap: 20px; }
    .offer-icon {
      font-size: 32px;
      width: 50px;
      height: 50px;
      background: rgba(245, 158, 11, 0.18);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .offer-item strong { font-size: 20px; color: #ffffff; display: block; margin-bottom: 3px; }
    .offer-item p { font-size: 15.5px; color: #94a3b8; }
    
    .cta-button-box { text-align: center; margin-bottom: 24px; }
    .cta-btn {
      display: inline-block;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #060911;
      background: linear-gradient(135deg, #F59E0B, #2DD4BF);
      padding: 20px 48px;
      border-radius: 9999px;
      box-shadow: 0 12px 30px rgba(245, 158, 11, 0.35);
      margin-bottom: 10px;
    }
    .cta-url {
      display: block;
      font-size: 16px;
      color: #94a3b8;
      font-weight: 600;
    }
    .save-reminder { text-align: center; font-size: 18px; color: #cbd5e1; }

    /* FOOTER */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid rgba(51, 65, 85, 0.5);
      position: relative;
      z-index: 10;
    }
    .footer-brand {
      font-size: 16px;
      font-weight: 700;
      color: #64748b;
    }
    .footer-swipe {
      font-size: 16px;
      font-weight: 800;
      color: #FBBF24;
      background: rgba(245, 158, 11, 0.15);
      padding: 8px 18px;
      border-radius: 9999px;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
  </style>
</head>
<body>

  <!-- TOP NAVBAR -->
  <div class="slide-navbar">
    <div class="slide-logo">
      ${logoFull ? `<img src="${logoFull}" alt="Synapsis Kids">` : `<span style="font-size:24px; font-weight:800; color:#FBBF24;">SYNAPSIS KIDS</span>`}
    </div>
    <div class="slide-counter">${slide.slideNumber}/07</div>
  </div>

  <!-- CONTENT -->
  <div class="slide-content">
    ${slide.html}
  </div>

  <!-- FOOTER -->
  <div class="slide-footer">
    <span class="footer-brand">@synapsisclinico • rotina.synapsisclinico.com.br</span>
    <span class="footer-swipe">${slide.swipeText}</span>
  </div>

</body>
</html>
  `;
}

async function generateCarousel() {
  const outputDir = path.resolve('carrossel_panquecca_instagram');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('🐾 Iniciando geração do Carrossel da Mascote Panquecca (1080x1350)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350 });

  for (let i = 0; i < slidesData.length; i++) {
    const slide = slidesData[i];
    const html = buildFullHtml(slide);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 200));

    const fileName = `slide_${slide.slideNumber}.png`;
    const outputPath = path.join(outputDir, fileName);

    await page.screenshot({
      path: outputPath,
      type: 'png'
    });

    console.log(`✓ Gerado Slide ${slide.slideNumber}: ${fileName}`);
  }

  await browser.close();
  console.log('\n🎉 Todos os 7 slides gerados com sucesso em:', outputDir);
}

generateCarousel().catch(err => {
  console.error('Erro ao gerar carrossel:', err);
  process.exit(1);
});
