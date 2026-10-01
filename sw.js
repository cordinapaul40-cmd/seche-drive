/* Service worker de Sèche & Drive : fonctionnement hors ligne et rappels quotidiens. */
const V = "seche-shell-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
const KEEP = [V, "seche-runtime", "seche-settings"];

self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !KEEP.includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin){
    if (req.mode === "navigate"){
      // Réseau d'abord pour recevoir les mises à jour, cache si hors ligne.
      e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put("index.html", cp)); return r; })
        .catch(() => caches.match("index.html")));
      return;
    }
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }
  // Polices et lecteur de tickets : mis en cache au premier usage.
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net/.test(url.host)){
    e.respondWith(caches.open("seche-runtime").then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r;
    }));
  }
});

const localDay = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
async function remind(){
  const c = await caches.open("seche-settings"), r = await c.match("settings.json");
  if (!r) return;
  const s = await r.json(), now = new Date(), today = localDay(now);
  if (!s.on || s.lastShown === today) return;
  let title = "Sèche & Drive", body = "Pense à cocher tes repas du jour pour garder ta série.";
  if (now.getDay() === s.weighDay && s.lastW !== today){ title = "Jour de pesée"; body = "Pèse-toi à jeun ce matin et note ton poids."; }
  else if (s.doneToday === today) return;
  await self.registration.showNotification(title, {body, icon:"icons/icon-192.png", badge:"icons/icon-192.png", tag:"rappel", lang:"fr"});
  await c.put("settings.json", new Response(JSON.stringify({...s, lastShown: today})));
}
self.addEventListener("periodicsync", e => { if (e.tag === "rappel-quotidien") e.waitUntil(remind()); });
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window", includeUncontrolled:true}).then(ws => ws.length ? ws[0].focus() : self.clients.openWindow("./")));
});
