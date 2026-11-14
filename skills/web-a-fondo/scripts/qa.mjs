#!/usr/bin/env node
// QA de una web de una sola página. Uso: node qa.mjs ruta/index.html [carpeta-salida]
// Abre la página en Chrome a 8 anchos, la recorre entera y busca los fallos que un cliente exigente ve.
// Sale con código 1 si hay errores. Deja capturas completas en la carpeta de salida para revisarlas a ojo.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(process.argv[2] || 'index.html');
const out = path.resolve(process.argv[3] || path.join(path.dirname(file), 'qa'));
fs.mkdirSync(out, { recursive: true });

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find(p => p && fs.existsSync(p));
if (!CHROME) { console.error('No encuentro Chrome. Define CHROME_PATH.'); process.exit(2); }

const VIEWPORTS = [
  { name: 'movil-320', width: 320, height: 640, mobile: true },
  { name: 'movil-360', width: 360, height: 780, mobile: true },
  { name: 'movil-375', width: 375, height: 667, mobile: true },
  { name: 'movil-390', width: 390, height: 844, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'portatil-1024', width: 1024, height: 700, mobile: false },
  { name: 'escritorio-1440', width: 1440, height: 900, mobile: false },
  { name: 'pantalla-1920', width: 1920, height: 1080, mobile: false },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
const informe = { archivo: file, errores: [], avisos: [], porAncho: {} };
const err = (vp, msg) => informe.errores.push(`[${vp}] ${msg}`);
const warn = (vp, msg) => informe.avisos.push(`[${vp}] ${msg}`);

// Comprobaciones estáticas (una vez)
const html = fs.readFileSync(file, 'utf8');
if (!/<meta[^>]+name=["']viewport/i.test(html)) err('html', 'Falta <meta name="viewport">.');
if (!/<html[^>]+lang=/i.test(html)) err('html', 'Falta lang en <html>.');
if (!/<title>[^<]{3,}<\/title>/i.test(html)) err('html', 'Falta <title>.');
if (!/<meta[^>]+name=["']description/i.test(html)) warn('html', 'Falta meta description.');
if (!/og:title/i.test(html)) warn('html', 'Faltan etiquetas Open Graph (vista previa al compartir por WhatsApp).');
if (/lorem ipsum/i.test(html)) err('html', 'Hay lorem ipsum.');
for (const m of html.matchAll(/href=["'](https?:\/\/(?:wa\.me|api\.whatsapp\.com)[^"']*)["']/gi)) {
  if (!/wa\.me\/\d{9,15}(\?text=|$|["'])/.test(m[1]) && !/api\.whatsapp\.com\/send\?phone=\d{9,15}/.test(m[1])) err('html', `Enlace de WhatsApp mal formado: ${m[1].slice(0, 80)}`);
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  const consola = [];
  page.on('console', m => { if (m.type() === 'error') consola.push(m.text()); });
  page.on('pageerror', e => consola.push(String(e)));
  const fallidas = [];
  page.on('requestfailed', r => fallidas.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) fallidas.push(`${r.status()} ${r.url()}`); });
  await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  try { await page.goto('file://' + file, { waitUntil: 'networkidle2', timeout: 30000 }); }
  catch { warn(vp.name, 'La página tardó más de 30 s en quedarse quieta (red lenta o algo cargando sin fin).'); }
  // El scroll suave falsearía las medidas: se desactiva solo para medir.
  await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important}' }).catch(() => {});

  // Recorre la página para disparar lazy-load y animaciones de entrada
  await page.evaluate(async () => {
    const paso = innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += paso) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });
  await new Promise(r => setTimeout(r, 1200));

  // Botones flotantes (fijos o pegajosos) que tapan otro botón o enlace al hacer scroll
  const tapados = await page.evaluate(async () => {
    const sel = el => { let s = el.tagName.toLowerCase(); if (el.id) return s + '#' + el.id; const t = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 28).replace(/\s+/g, ' '); return t ? `${s} «${t}»` : s; };
    const fijo = el => { let p = el; while (p && p !== document.body) { const ps = getComputedStyle(p).position; if (ps === 'fixed' || ps === 'sticky') return p; p = p.parentElement; } return null; };
    const vis = el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05 && b.width > 0 && b.height > 0; };
    const out = new Set(); const paso = innerHeight * 0.5;
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 90));
      const inter = [...document.querySelectorAll('a,button,[role=button],input,select,textarea')].filter(vis);
      // Una barra fija a todo lo ancho (cabecera) tapa el contenido por diseño; se miran solo los botones flotantes.
      const flot = inter.filter(e => { const c = fijo(e); return c && c.getBoundingClientRect().width < innerWidth * 0.6; }), resto = inter.filter(e => !fijo(e));
      for (const f of flot) { const a = f.getBoundingClientRect();
        for (const r of resto) { const b = r.getBoundingClientRect();
          if (b.bottom < 0 || b.top > innerHeight) continue;
          const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (w > 4 && h > 4 && w * h > 0.3 * Math.min(a.width * a.height, b.width * b.height)) out.add(`${sel(f)} tapa ${sel(r)}`);
        } }
    }
    scrollTo(0, 0); return [...out];
  });
  if (tapados.length) err(vp.name, `Un botón flotante tapa otro botón al hacer scroll: ${tapados.slice(0, 5).join(' | ')}`);

  const r = await page.evaluate((esMovil) => {
    const vw = document.documentElement.clientWidth;
    const sel = el => {
      let s = el.tagName.toLowerCase();
      if (el.id) return s + '#' + el.id;
      if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.');
      const t = (el.innerText || '').trim().slice(0, 30).replace(/\s+/g, ' ');
      return t ? `${s} «${t}»` : s;
    };
    const visible = el => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && b.width > 0 && b.height > 0; };
    const res = { desbordeHorizontal: document.documentElement.scrollWidth - vw, culpables: [], imgRotas: [], imgSinAlt: [], textoCortado: [], tactilPequeno: [], letraPequena: [], contraste: [], anclasRotas: [], ocultosTrasAnimar: [] };
    const todos = [...document.body.querySelectorAll('*')];
    for (const el of todos) {
      if (!visible(el)) continue;
      const b = el.getBoundingClientRect();
      // Algo que se sale por la derecha y no está dentro de un contenedor que recorte
      if (b.right > vw + 1 && b.width < vw * 3) {
        let p = el.parentElement, recortado = false;
        while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { recortado = true; break; } p = p.parentElement; }
        if (!recortado) res.culpables.push(sel(el) + ` (sale ${Math.round(b.right - vw)} px)`);
      }
    }
    for (const img of document.images) {
      if (img.complete && img.naturalWidth === 0) res.imgRotas.push(img.currentSrc || img.src);
      if (!img.hasAttribute('alt')) res.imgSinAlt.push(img.src.slice(0, 80));
    }
    // Fondos con url() que no cargan no se detectan aquí; se miran en las peticiones fallidas.
    for (const el of todos) {
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);
      const tieneTexto = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (tieneTexto && !el.closest('svg') && (el.scrollWidth > el.clientWidth + 2) && (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis' || cs.whiteSpace === 'nowrap') && el.clientWidth > 0)
        res.textoCortado.push(sel(el));
      if (tieneTexto && esMovil) {
        const fs = parseFloat(cs.fontSize);
        if (fs < 13) res.letraPequena.push(`${sel(el)} (${fs}px)`);
      }
      if (tieneTexto) {
        // contraste contra el primer fondo sólido hacia arriba
        const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
        let c = rgb(cs.color), p = el, bg = null;
        while (p) { const bc = rgb(getComputedStyle(p).backgroundColor); const bi = getComputedStyle(p).backgroundImage; if (bi && bi !== 'none') { bg = null; break; } if (bc.length >= 3 && (bc[3] === undefined || bc[3] > 0.9)) { bg = bc; break; } p = p.parentElement; }
        if (bg && c.length >= 3 && (c[3] === undefined || c[3] > 0.9)) {
          const L = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
          const a = L(c), d = L(bg), ratio = (Math.max(a, d) + 0.05) / (Math.min(a, d) + 0.05);
          const grande = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
          if (ratio < (grande ? 3 : 4.5)) res.contraste.push(`${sel(el)} (${ratio.toFixed(2)}:1)`);
        }
      }
      if (esMovil && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.getAttribute('role') === 'button')) {
        const bb = el.getBoundingClientRect();
        const enLinea = getComputedStyle(el).display === 'inline' && el.closest('p,li');
        if (!enLinea && (bb.height < 40 || bb.width < 40)) res.tactilPequeno.push(`${sel(el)} (${Math.round(bb.width)}×${Math.round(bb.height)})`);
      }
    }
    for (const a of document.querySelectorAll('a[href^="#"]')) { const id = a.getAttribute('href').slice(1); if (id && !document.getElementById(id)) res.anclasRotas.push(a.getAttribute('href')); }
    // Elementos que deberían verse pero se quedaron invisibles (animación de entrada que no se disparó)
    for (const el of document.querySelectorAll('h1,h2,h3,p,img,section > *')) { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); if (b.width > 0 && b.height > 0 && +cs.opacity < 0.05 && cs.visibility !== 'hidden') res.ocultosTrasAnimar.push(sel(el)); }
    // Solapes: texto que pisa otro texto, una imagen o un botón, sin ser uno hijo del otro.
    res.solapes = []; res.pegadoAlBorde = [];
    const tieneTxt = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    // Para texto se mide la caja de las letras, no la del elemento (su padding puede rodear a un botón a propósito).
    const cajaTexto = el => {
      if (el.tagName === 'BUTTON' || el.tagName === 'IMG') return el.getBoundingClientRect();
      let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
      for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) {
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) { if (!q.width) continue; L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); }
      }
      return L === Infinity ? el.getBoundingClientRect() : { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T };
    };
    const oculto = el => { const d = el.closest('details:not([open])'); return d && !el.closest('summary'); };
    const bloques = todos.filter(el => visible(el) && !oculto(el) && (tieneTxt(el) || el.tagName === 'IMG' || el.tagName === 'BUTTON'))
      .map(el => ({ el, b: cajaTexto(el), txt: el.tagName !== 'IMG' }))
      .filter(o => o.b.width > 4 && o.b.height > 4);
    for (let i = 0; i < bloques.length; i++) for (let j = i + 1; j < bloques.length; j++) {
      const A = bloques[i], B = bloques[j];
      if (!A.txt && !B.txt) continue;
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const w = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left);
      const h = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
      if (w <= 2 || h <= 2) continue;
      const menor = Math.min(A.b.width * A.b.height, B.b.width * B.b.height);
      if (w * h < menor * 0.08) continue;
      const fijo = [A.el, B.el].some(e => { let p = e; while (p && p !== document.body) { if (['fixed', 'sticky'].includes(getComputedStyle(p).position)) return true; p = p.parentElement; } return false; });
      if (fijo) continue; // la barra fija se solapa con todo al hacer scroll; se revisa a ojo
      res.solapes.push({ sobreImagen: !A.txt || !B.txt, d: `${sel(A.el)} ↔ ${sel(B.el)} (y≈${Math.round(Math.max(A.b.top, B.b.top))})` });
    }
    if (esMovil) for (const o of bloques) {
      if (!o.txt || o.b.width >= vw - 4) continue;
      const m = Math.min(o.b.left, vw - o.b.right);
      if (m < 12 && m > -1) res.pegadoAlBorde.push(sel(o.el) + ` (${Math.round(m)} px)`);
    }
    res.alto = document.documentElement.scrollHeight;
    return res;
  }, vp.mobile);

  informe.porAncho[vp.name] = r;
  const uniq = a => [...new Set(a)];
  if (r.desbordeHorizontal > 1) err(vp.name, `La página se desplaza en horizontal ${r.desbordeHorizontal} px. Culpables: ${uniq(r.culpables).slice(0, 6).join(' | ') || 'no localizados'}`);
  else if (r.culpables.length) warn(vp.name, `Elementos que se salen del ancho (ocultos por el body, pero cortados): ${uniq(r.culpables).slice(0, 6).join(' | ')}`);
  const sol = r.solapes.filter(s => !s.sobreImagen).map(s => s.d), solImg = r.solapes.filter(s => s.sobreImagen).map(s => s.d);
  if (sol.length) err(vp.name, `Elementos que se pisan: ${uniq(sol).slice(0, 6).join(' | ')}`);
  if (solImg.length) warn(vp.name, `Texto encima de imagen (¿es a propósito y se lee?): ${uniq(solImg).slice(0, 4).join(' | ')}`);
  if (r.pegadoAlBorde.length) err(vp.name, `Texto pegado al borde de la pantalla (<12 px): ${uniq(r.pegadoAlBorde).slice(0, 6).join(' | ')}`);
  if (r.imgRotas.length) err(vp.name, `Imágenes rotas: ${uniq(r.imgRotas).slice(0, 5).join(' | ')}`);
  if (r.imgSinAlt.length) err(vp.name, `Imágenes sin alt: ${r.imgSinAlt.length}`);
  if (r.textoCortado.length) err(vp.name, `Texto cortado: ${uniq(r.textoCortado).slice(0, 6).join(' | ')}`);
  if (r.tactilPequeno.length) err(vp.name, `Botones o enlaces pequeños para el dedo (<40 px): ${uniq(r.tactilPequeno).slice(0, 6).join(' | ')}`);
  if (r.letraPequena.length) warn(vp.name, `Letra por debajo de 13 px: ${uniq(r.letraPequena).slice(0, 6).join(' | ')}`);
  if (r.contraste.length) err(vp.name, `Contraste insuficiente: ${uniq(r.contraste).slice(0, 6).join(' | ')}`);
  if (r.anclasRotas.length) err(vp.name, `Enlaces internos a secciones que no existen: ${uniq(r.anclasRotas).join(' ')}`);
  if (r.ocultosTrasAnimar.length) err(vp.name, `Contenido invisible tras recorrer la página (animación de entrada rota): ${uniq(r.ocultosTrasAnimar).slice(0, 6).join(' | ')}`);
  if (consola.length) err(vp.name, `Errores de JavaScript: ${uniq(consola).slice(0, 3).join(' | ')}`);
  const malas = uniq(fallidas).filter(u => !/favicon/.test(u));
  if (malas.length) err(vp.name, `Recursos que no cargan: ${malas.slice(0, 5).join(' | ')}`);

  await page.screenshot({ path: path.join(out, `${vp.name}.png`), fullPage: true });
  await page.screenshot({ path: path.join(out, `${vp.name}-pliegue.png`) });
  await page.close();
}

// Movimiento reducido: la página no puede quedarse en blanco
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('file://' + file, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  const vacios = await page.evaluate(() => [...document.querySelectorAll('h1,h2,p')].filter(e => +getComputedStyle(e).opacity < 0.05).length);
  if (vacios) err('movimiento-reducido', `${vacios} títulos o párrafos invisibles con movimiento reducido activado.`);
  await page.close();
}

await browser.close();
fs.writeFileSync(path.join(out, 'informe.json'), JSON.stringify(informe, null, 2));
console.log(`\nQA de ${path.basename(file)}: ${informe.errores.length} errores, ${informe.avisos.length} avisos`);
for (const e of informe.errores) console.log('  ✗ ' + e);
for (const a of informe.avisos) console.log('  · ' + a);
console.log(`Capturas en ${out}`);
process.exit(informe.errores.length ? 1 : 0);
