# Recursos

Recursos gratuitos y abiertos para hacer cosas útiles con IA sin ser técnico. Cada uno resuelve una cosa concreta y se usa en minutos.

Página con todo, en versión fácil: **https://recursos.macaronesianstreet.com**

## Cómo está ordenado

| Carpeta | Qué hay | Para quién |
|---|---|---|
| [`mensajes/`](mensajes) | Mensajes listos para pegar en tu IA, con el método que siguen. Sin instalar nada. | Cualquiera, desde el móvil |
| [`skills/`](skills) | Skills para Claude Code: el método completo, con scripts que comprueban el resultado. | Quien trabaja en el ordenador |

## Lo que hay

### Tu web
- **Tu web, hecha por tu IA.** Un primer boceto de la web de tu negocio, pensado para el móvil.
  - Mensaje: [`mensajes/webs`](mensajes/webs)
  - Skill: [`skills/web-a-fondo`](skills/web-a-fondo): 7 fases, con QA automático en 8 anchos y revisión pantalla a pantalla en móvil.

Más recursos en camino.

## Instalar una skill en Claude Code

En la carpeta de tu proyecto:

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design --agent claude-code -y
npx skills add https://github.com/MacaronesianStreet/recursos --skill web-a-fondo --agent claude-code -y
cd .claude/skills/web-a-fondo/scripts && npm i
```

La primera línea instala `frontend-design`, la skill de diseño de Anthropic, en la que se apoya `web-a-fondo`. Los scripts de QA necesitan Node 18 o superior y Google Chrome.

## Licencia

MIT. Úsalo, cámbialo y compártelo como quieras.

Hecho por [Daniel Llusiá](https://www.instagram.com/daniel.llusia/) · MacaronesianStreet, Tenerife.
