/* Ludothèque — bouton « Plein écran » commun à toutes les applis.
   Il suffit d'ajouter <script src="plein-ecran.js"></script> juste avant </body>. */
(function () {
  var d = document, root = d.documentElement;
  var demander = root.requestFullscreen || root.webkitRequestFullscreen;
  if (!demander) return; // l'appareil ne sait pas faire (iPhone…) : pas de bouton
  var actif = function () { return d.fullscreenElement || d.webkitFullscreenElement; };

  var css = d.createElement("style");
  css.textContent =
    ".ludo-pe{position:fixed;right:14px;bottom:14px;z-index:2147483000;display:flex;align-items:center;gap:8px;" +
    "font:700 16px/1 'Segoe UI',system-ui,sans-serif;color:#fff;background:rgba(31,58,95,.88);border:2px solid rgba(255,255,255,.7);" +
    "border-radius:999px;padding:10px 16px;min-height:48px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:.85;transition:opacity .15s}" +
    ".ludo-pe:hover,.ludo-pe:focus-visible{opacity:1}.ludo-pe:focus-visible{outline:4px solid #f2a900;outline-offset:2px}" +
    ".ludo-pe svg{width:20px;height:20px;flex:none}" +
    "@media (max-width:560px){.ludo-pe span{display:none}.ludo-pe{padding:10px 12px}}" +
    "@media print{.ludo-pe{display:none}}";
  d.head.appendChild(css);

  var b = d.createElement("button");
  b.type = "button";
  b.className = "ludo-pe";
  var ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  function maj() {
    var on = !!actif();
    b.innerHTML = (on ? ICON_OFF : ICON_ON) + "<span>" + (on ? "Quitter le plein écran" : "Plein écran") + "</span>";
    b.setAttribute("aria-label", on ? "Quitter le plein écran" : "Plein écran");
    b.setAttribute("aria-pressed", String(on));
  }
  b.addEventListener("click", function () {
    if (actif()) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
    else { try { var p = demander.call(root); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  });
  d.addEventListener("fullscreenchange", maj);
  d.addEventListener("webkitfullscreenchange", maj);
  maj();
  (d.body || root).appendChild(b);
})();
