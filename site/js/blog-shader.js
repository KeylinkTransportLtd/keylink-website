/* =========================================================
   KEYLINK TRANSPORT — blog-shader.js
   WebGL animated wave shader for the blog hero.
   Palette: midnight #0A0E1A, navy #12294A, teal #22a092, gold #F0A820
   ported from React/WebGL to vanilla JS
   ========================================================= */

(function () {
  'use strict';

  var canvas = document.getElementById('blogShaderCanvas');
  // Update class — canvas is now page-level, not just header
  if (!canvas) return;

  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    // WebGL not supported — canvas stays hidden, CSS gradient fallback shows
    canvas.style.display = 'none';
    return;
  }

  /* ---- Shaders ---- */
  var vsSource = [
    'attribute vec4 aVertexPosition;',
    'void main() {',
    '  gl_Position = aVertexPosition;',
    '}'
  ].join('\n');

  // Colors mapped to Keylink palette:
  //   bgColor1  = midnight  #0A0E1A  → vec4(0.039, 0.055, 0.102)
  //   bgColor2  = navy      #12294A  → vec4(0.071, 0.161, 0.290)
  //   lineColor1 = teal-lt  #22a092  → vec4(0.133, 0.627, 0.573)
  //   lineColor2 = gold     #F0A820  → vec4(0.941, 0.659, 0.125)
  var fsSource = [
    'precision highp float;',
    'uniform vec2 iResolution;',
    'uniform float iTime;',

    'const float overallSpeed      = 0.18;',
    'const float gridSmoothWidth   = 0.015;',
    'const float axisWidth         = 0.05;',
    'const float majorLineWidth    = 0.025;',
    'const float minorLineWidth    = 0.0125;',
    'const float majorLineFrequency = 5.0;',
    'const float minorLineFrequency = 1.0;',
    'const float scale             = 5.0;',

    // Keylink teal as primary line color
    'const vec4 lineColor1 = vec4(0.133, 0.627, 0.573, 1.0);',
    // Gold accent for secondary lines
    'const vec4 lineColor2 = vec4(0.941, 0.659, 0.125, 1.0);',

    'const float minLineWidth   = 0.008;',
    'const float maxLineWidth   = 0.18;',
    'const float lineSpeed      = 1.0 * overallSpeed;',
    'const float lineAmplitude  = 1.0;',
    'const float lineFrequency  = 0.2;',
    'const float warpSpeed      = 0.2 * overallSpeed;',
    'const float warpFrequency  = 0.5;',
    'const float warpAmplitude  = 1.0;',
    'const float offsetFrequency = 0.5;',
    'const float offsetSpeed    = 1.33 * overallSpeed;',
    'const float minOffsetSpread = 0.6;',
    'const float maxOffsetSpread = 2.0;',
    'const int   linesPerGroup  = 16;',

    '#define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))',
    '#define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))',
    '#define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))',
    '#define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))',

    'float random(float t) {',
    '  return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;',
    '}',

    'float getPlasmaY(float x, float horizontalFade, float offset) {',
    '  return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;',
    '}',

    'void main() {',
    '  vec2 fragCoord = gl_FragCoord.xy;',
    '  vec4 fragColor;',
    '  vec2 uv    = fragCoord.xy / iResolution.xy;',
    '  vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;',

    '  float horizontalFade = 1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);',
    '  float verticalFade   = 1.0 - (cos(uv.y * 6.28318) * 0.5 + 0.5);',

    // Warp space for fluid movement
    '  space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);',
    '  space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;',

    '  vec4 lines = vec4(0.0);',

    // Keylink midnight → navy background gradient (left to right)
    '  vec4 bgColor1 = vec4(0.039, 0.055, 0.102, 1.0);',  // #0A0E1A midnight
    '  vec4 bgColor2 = vec4(0.071, 0.161, 0.290, 1.0);',  // #12294A navy

    '  for (int l = 0; l < linesPerGroup; l++) {',
    '    float normalizedLineIndex = float(l) / float(linesPerGroup);',
    '    float offsetTime     = iTime * offsetSpeed;',
    '    float offsetPosition = float(l) + space.x * offsetFrequency;',
    '    float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;',
    '    float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;',
    '    float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);',
    '    float linePosition = getPlasmaY(space.x, horizontalFade, offset);',
    '    float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0',
    '               + drawCrispLine(linePosition, halfWidth * 0.15, space.y);',

    '    float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;',
    '    vec2  circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));',
    '    float circle = drawCircle(circlePosition, 0.012, space) * 4.0;',
    '    line = line + circle;',

    // Mix teal and gold based on line index — mostly teal, gold accent on higher indices
    '    float goldBlend = smoothstep(0.5, 1.0, normalizedLineIndex) * 0.35;',
    '    vec4  currentColor = mix(lineColor1, lineColor2, goldBlend);',
    '    lines += line * currentColor * rand;',
    '  }',

    '  fragColor  = mix(bgColor1, bgColor2, uv.x + uv.y * 0.3);',
    '  fragColor *= verticalFade;',
    '  fragColor.a = 1.0;',
    '  fragColor  += lines;',

    '  gl_FragColor = fragColor;',
    '}'
  ].join('\n');

  /* ---- Compile shaders ---- */
  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Blog shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader   = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  var fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Blog shader link error:', gl.getProgramInfoLog(program));
    return;
  }

  /* ---- Geometry (full-screen quad) ---- */
  var posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]), gl.STATIC_DRAW);

  var aPos     = gl.getAttribLocation(program, 'aVertexPosition');
  var uRes     = gl.getUniformLocation(program, 'iResolution');
  var uTime    = gl.getUniformLocation(program, 'iTime');

  /* ---- Resize canvas to fill the viewport ---- */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  }, { passive: true });
  resize();

  /* ---- Render loop ---- */
  var startTime = performance.now();
  var rafId;
  var stopped = false;

  // Pause when the browser tab is hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopped = true;
    } else {
      stopped = false;
      if (!rafId) rafId = requestAnimationFrame(render);
    }
  });

  function render(now) {
    if (stopped) { rafId = null; return; }
    rafId = requestAnimationFrame(render);

    var t = (now - startTime) / 1000;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Draw a single static frame and stop
    render(startTime);
    return;
  }

  rafId = requestAnimationFrame(render);

})();
