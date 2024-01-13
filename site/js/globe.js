/* =========================================================
   KEYLINK TRANSPORT — globe.js
   Interactive route globe powered by COBE (esm.sh CDN)
   Shows Keylink's active freight corridors from Vancouver.
   ========================================================= */

import createGlobe from 'https://esm.sh/cobe'

function initRouteGlobe () {
  const canvas = document.getElementById('routeGlobe')
  if (!canvas) return

  /* -- Rotation state --
     phi = 4.15 rad → 237°E = 123°W = BC / West Coast NA facing viewer
     (phi=0 shows 0° prime meridian; increasing phi rotates eastward) */
  let phi = 4.15
  let globe = null

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  /* -- City markers [lat, lng] -- */
  const markers = [
    { location: [49.2827, -123.1207], size: 0.10  }, // Vancouver BC  — HUB
    { location: [34.0522, -118.2437], size: 0.065 }, // California (LA)
    { location: [51.0447, -114.0719], size: 0.065 }, // Alberta (Calgary)
    { location: [43.6532,  -79.3832], size: 0.065 }, // Toronto ON
    { location: [47.6062, -122.3321], size: 0.065 }, // Seattle WA
  ]

  /* -- Spawn globe once the canvas has layout width -- */
  function create (width) {
    if (globe) return
    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width:  width * dpr,
      height: width * dpr,
      phi,
      theta:          0.40,   // tilt — northern latitudes well centred
      dark:           1,
      diffuse:        1.4,
      mapSamples:     16000,
      mapBrightness:  8,      // bright enough to see continents clearly
      baseColor:   [0.18, 0.24, 0.32],   // dark-slate base — continents visible
      markerColor: [0.94, 0.66, 0.13],   // gold  — #F0A820
      glowColor:   [0.10, 0.48, 0.43],   // teal  — #1A7B6E
      markers,
      onRender (state) {
        phi += 0.0016          // slow rotation — NA stays in view ~30 s
        state.phi = phi
        state.theta = 0.40
      }
    })
    /* Fade in once WebGL context is ready */
    setTimeout(function () { canvas.style.opacity = '1' }, 150)
  }

  canvas.style.opacity    = '0'
  canvas.style.transition = 'opacity 1.2s ease'

  const w = canvas.offsetWidth
  if (w > 0) {
    create(w)
  } else {
    /* Canvas not yet laid out — wait for ResizeObserver */
    const ro = new ResizeObserver(function (entries) {
      const cw = entries[0] && entries[0].contentRect.width
      if (cw > 0) { ro.disconnect(); create(cw) }
    })
    ro.observe(canvas)
  }
}

initRouteGlobe()
