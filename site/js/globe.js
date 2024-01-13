/* =========================================================
   KEYLINK TRANSPORT — globe.js
   Interactive route globe powered by COBE (esm.sh CDN)
   Shows Keylink's active freight corridors from Vancouver.
   ========================================================= */

import createGlobe from 'https://esm.sh/cobe'

function initRouteGlobe () {
  const canvas = document.getElementById('routeGlobe')
  if (!canvas) return

  /* -- Rotation state -- */
  let phi = 2.15   // start facing BC / West Coast NA
  let globe = null

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  /* -- City markers [lat, lng] -- */
  const markers = [
    { location: [49.2827, -123.1207], size: 0.095 }, // Vancouver BC  — HUB
    { location: [34.0522, -118.2437], size: 0.060 }, // California (LA)
    { location: [51.0447, -114.0719], size: 0.060 }, // Alberta (Calgary)
    { location: [43.6532,  -79.3832], size: 0.060 }, // Toronto ON
    { location: [47.6062, -122.3321], size: 0.060 }, // Seattle WA
  ]

  /* -- Spawn globe once the canvas has layout width -- */
  function create (width) {
    if (globe) return
    globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width:  width * dpr,
      height: width * dpr,
      phi,
      theta:          0.38,   // tilt — shows northern latitudes well
      dark:           1,
      diffuse:        1.1,
      mapSamples:     16000,
      mapBrightness:  5.5,
      baseColor:   [0.07, 0.09, 0.16],   // deep midnight
      markerColor: [0.94, 0.66, 0.13],   // gold  — #F0A820
      glowColor:   [0.10, 0.48, 0.43],   // teal  — #1A7B6E
      markers,
      onRender (state) {
        phi += 0.0016          // slow rotation keeps NA in view
        state.phi = phi
        state.theta = 0.38
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
