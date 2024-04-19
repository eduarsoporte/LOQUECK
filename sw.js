;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_Radio_Studio_Uaiin',
  urlsToCache = [
    './',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    './css/style.css',
    'https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.2.0/mdb.min.css',
    'https://fonts.gstatic.com',
    'https://kit.fontawesome.com/b54a4aa7c7.js',
    'https://code.jquery.com/jquery-2.2.4.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.2.0/mdb.umd.min.js',
    'js/lunaradio-animado.js', 
    'https://www.gstatic.com/firebasejs/8.10.1/firebase.js',   
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'    
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})