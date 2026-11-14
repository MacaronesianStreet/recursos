// Recorre la web en móvil pantalla a pantalla (390 y 320 px) y deja una captura por pantalla.
// Uso: node movil.mjs index.html qa-movil
// Sirve para ver lo que la captura de página completa esconde: bloques que aparecen al hacer scroll,
// barras fijas que tapan, y componentes de escritorio que en vertical no se han reformulado.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const [, , html, salida = 'qa-movil'] = process.argv;
if (!html) { console.error('Uso: node movil.mjs index.html [carpeta]'); process.exit(2); }
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p));
if (!CHROME) { console.error('No encuentro Chrome. Indica la ruta con la variable CHROME.'); process.exit(2); }
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
const url = /^https?:/.test(html) ? html : 'file://' + path.resolve(html);
const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] });
let fallos = 0;
for (const ancho of [390, 320]) {
  const p = await navegador.newPage();
  await p.setViewport({ width: ancho, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errores = []; p.on('pageerror', e => errores.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle0' }); await espera(1500);
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  let n = 0;
  for (let y = 0; y < alto; y += 700) {
    await p.evaluate(v => scrollTo(0, v), y); await espera(900);
    await p.screenshot({ path: path.join(salida, `${ancho}-${String(n++).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 72 });
  }
  const fuera = await p.evaluate(() => {
    const iw = innerWidth, lista = [];
    const desliza = e => { for (let x = e.parentElement; x; x = x.parentElement) { const o = getComputedStyle(x).overflowX; if ((o === 'auto' || o === 'scroll') && x.scrollWidth > x.clientWidth) return true; } return false; };
    document.querySelectorAll('body *').forEach(e => {
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      if (!r.width || s.position === 'fixed' || s.visibility === 'hidden' || e.getAttribute('aria-hidden') === 'true') return;
      if ((r.right > iw + 1 || r.left < -1) && !desliza(e)) lista.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} (${Math.round(r.left)}→${Math.round(r.right)})`);
    });
    return { ancho: document.documentElement.scrollWidth, lista: lista.slice(0, 10) };
  });
  const pantallas = Math.ceil(alto / 780);
  console.log(`\n${ancho} px: ${n} capturas, ${pantallas} pantallas de alto`);
  if (fuera.ancho > ancho) { fallos++; console.log(`  ✗ La página se desplaza de lado (${fuera.ancho} px de ancho).`); }
  if (fuera.lista.length) { fallos++; console.log('  ✗ Se salen de la pantalla: ' + fuera.lista.join(' | ')); }
  if (errores.length) { fallos++; console.log('  ✗ Errores de JavaScript: ' + errores.join(' | ')); }
  if (pantallas > 14) console.log('  · Más de 14 pantallas: mira si algún bloque apilado debería ser un carrusel o una lista más corta.');
  await p.close();
}
await navegador.close();
console.log(`\nCapturas en ${salida}. Ábrelas en orden: es lo que verá quien llegue desde el móvil.`);
process.exit(fallos ? 1 : 0);
