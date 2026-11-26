// 更新したら VERSION を変える
const VERSION='pv-v2';
const FILES=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION)
    .then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'}))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(VERSION).then(c=>
    c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok)c.put(e.request,res.clone());
      return res;
    }).catch(()=>c.match('index.html')))
  ));
});
