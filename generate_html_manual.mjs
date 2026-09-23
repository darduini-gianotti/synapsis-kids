import fs from 'fs';
import path from 'path';

const mdPath = path.join(process.cwd(), 'MANUAL_DO_USUARIO.md');
let md = fs.readFileSync(mdPath, 'utf8');

function mdToHtml(text) {
  let lines = text.split('\n');
  let html = [];
  let inTable = false;
  let tableHeader = true;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeader = true;
        html.push('<div class="table-wrapper"><table>');
      }
      if (line.includes('---')) {
        tableHeader = false;
        continue;
      }
      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      let tag = tableHeader ? 'th' : 'td';
      let rowHtml = '<tr>' + cells.map(c => {
        let formatted = c
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>');
        return `<${tag}>${formatted}</${tag}>`;
      }).join('') + '</tr>';
      html.push(rowHtml);
      continue;
    } else if (inTable) {
      inTable = false;
      html.push('</table></div>');
    }

    if (line.startsWith('# ')) {
      html.push(`<h1>${line.replace('# ', '')}</h1>`);
    } else if (line.startsWith('## ')) {
      let title = line.replace('## ', '');
      let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      html.push(`<h2 id="${id}">${title}</h2>`);
    } else if (line.startsWith('### ')) {
      html.push(`<h3>${line.replace('### ', '')}</h3>`);
    } else if (line.startsWith('![')) {
      let m = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (m) {
        let alt = m[1];
        let src = m[2].replace('./docs/', './'); // adjust relative path for file inside docs/
        html.push(`<div class="figure-card"><img src="${src}" alt="${alt}" class="manual-img" onclick="zoomImage(this)"><p class="caption">👆 <strong>${alt}</strong> (clique na imagem para ampliar em tela cheia)</p></div>`);
      }
    } else if (line.startsWith('- ')) {
      html.push(`<li>${line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`);
    } else if (line.match(/^\d+\.\s/)) {
      html.push(`<li>${line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`);
    } else if (line === '---') {
      html.push('<hr>');
    } else if (line.length > 0) {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
      html.push(`<p>${formatted}</p>`);
    }
  }
  if (inTable) html.push('</table></div>');
  return html.join('\n');
}

const contentHtml = mdToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual do Usuário — Synapsis Kids</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4F46E5;
      --primary-dark: #3730A3;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --text: #1E293B;
      --muted: #64748B;
      --border: #E2E8F0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.65;
      display: flex;
      justify-content: center;
      padding: 32px 16px 80px;
    }
    .container {
      max-width: 960px;
      width: 100%;
      background: var(--surface);
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
      border: 1px solid var(--border);
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    .badge-tag {
      background: #EEF2FF;
      color: var(--primary);
      font-weight: 700;
      font-size: 0.85rem;
      padding: 6px 14px;
      border-radius: 9999px;
      display: inline-block;
    }
    .btn-print {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #1E293B;
      margin-top: 48px;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #F1F5F9;
    }
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #334155;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p { margin-bottom: 16px; color: #334155; font-size: 1.05rem; }
    hr { border: none; height: 1px; background: var(--border); margin: 36px 0; }
    .figure-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 24px;
      margin: 28px 0;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .manual-img {
      max-width: 100%;
      height: auto;
      max-height: 720px;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      cursor: zoom-in;
      transition: transform 0.2s ease;
      background: white;
    }
    .manual-img:hover {
      transform: scale(1.01);
    }
    .caption {
      margin-top: 14px;
      font-size: 0.9rem;
      color: var(--muted);
      margin-bottom: 0;
    }
    .table-wrapper {
      overflow-x: auto;
      margin: 24px 0 36px;
      border-radius: 14px;
      border: 1px solid var(--border);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }
    th {
      background: #F1F5F9;
      color: #475569;
      font-weight: 700;
      padding: 14px 16px;
      border-bottom: 2px solid var(--border);
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background-color: #FAFAFA; }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.88em;
      color: #4338CA;
    }
    li {
      margin-left: 24px;
      margin-bottom: 10px;
      color: #334155;
      font-size: 1.02rem;
    }
    /* Modal Zoom */
    #zoom-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(4px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    }
    #zoom-modal img {
      max-width: 95%;
      max-height: 95vh;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    @media print {
      body { padding: 0; background: white; }
      .container { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
      .btn-print, .caption { display: none; }
      .figure-card { page-break-inside: avoid; border: none; box-shadow: none; padding: 10px 0; }
      .manual-img { max-height: 550px; }
      .table-wrapper { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-actions">
      <span class="badge-tag">Synapsis Kids • Manual do Usuário</span>
      <button class="btn-print" onclick="window.print()">
        🖨️ Imprimir / Salvar PDF
      </button>
    </div>
    ${contentHtml}
  </div>

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
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'docs', 'manual_do_usuario.html'), fullHtml, 'utf8');
console.log('HTML manual successfully generated at docs/manual_do_usuario.html');
