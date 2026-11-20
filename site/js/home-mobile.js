/* Home sections, phone-only motion (owner pick 2026-11-20, option A). GSAP 3.12.5 + ScrollTrigger are
   already on the page. Runs only at <= 768px; on reduced motion it only builds
   the read-more buttons (everything stays visible, nothing moves). */
(function () {
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var EASE = 'expo.out', SPRING = 'back.out(1.5)';
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- read more: clamp long text walls, animate the height on tap ---------- */
  $('.spec-context, .erp-sub, .pn-home__sub').forEach(function (p) {
    p.classList.add('kla-clamp', 'is-clamped');
    if (p.scrollHeight <= p.clientHeight + 2) { p.classList.remove('is-clamped', 'kla-clamp'); return; }
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'kla-more'; btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span>Read more</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    p.insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.firstChild.textContent = open ? 'Read more' : 'Read less';
      if (reduced || !hasGsap) { p.classList.toggle('is-clamped', open); return; }
      var from = p.offsetHeight;
      p.classList.remove('is-clamped'); p.classList.add('is-animating');
      var to = open ? (function () { p.classList.add('is-clamped'); var h = p.offsetHeight; p.classList.remove('is-clamped'); return h; })() : p.scrollHeight;
      gsap.fromTo(p, { height: from }, { height: to, duration: 0.45, ease: 'power3.inOut', onComplete: function () {
        p.classList.remove('is-animating'); p.style.height = '';
        if (open) p.classList.add('is-clamped');
        if (hasGsap) ScrollTrigger.refresh();
      } });
    });
  });

  /* ---------- hero video: iPhone Safari pauses a muted video that scrolls off screen and only
     resumes it by itself when it is marked autoplay; restart it whenever it is back in view ---------- */
  var hv = document.getElementById('heroVideo');
  if (hv) {
    hv.muted = true; hv.loop = true; hv.autoplay = true; hv.playsInline = true;
    var playHero = function () { if (hv.paused) hv.play().catch(function () {}); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) playHero(); else hv.pause(); }); }).observe(hv);
    }
    document.addEventListener('visibilitychange', function () {
      var r = hv.getBoundingClientRect();
      if (!document.hidden && r.bottom > 0 && r.top < window.innerHeight) playHero();
    });
    playHero();
  }

  if (reduced || !hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);

  var enter = function (el, offset) { return { trigger: el, start: 'top ' + (offset || '88%'), once: true }; };

  /* ---------- scroll progress line ---------- */
  var bar = document.createElement('div'); bar.className = 'kla-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

  /* ---------- headings revealed line by line ---------- */
  function splitLines(h) {
    var tokens = [];
    Array.prototype.forEach.call(h.childNodes, function (n) {
      if (n.nodeType === 3) { n.textContent.split(/\s+/).forEach(function (w) { if (w) tokens.push({ w: w }); }); }
      else if (n.nodeName === 'BR') tokens.push({ br: true });
      else if (n.nodeType === 1) {
        var style = n.getAttribute('style') || '', cls = n.className || '';
        n.textContent.split(/\s+/).forEach(function (w) { if (w) tokens.push({ w: w, style: style, cls: cls }); });
      }
    });
    h.innerHTML = '';
    tokens.forEach(function (t, i) {
      if (t.br) { h.appendChild(document.createElement('br')); return; }
      var s = document.createElement('span'); s.className = 'kla-w' + (t.cls ? ' ' + t.cls : '');
      if (t.style) s.setAttribute('style', t.style);
      s.textContent = t.w; t.el = s;
      h.appendChild(s); h.appendChild(document.createTextNode(' '));
    });
    var lines = [], lastTop = null;
    tokens.forEach(function (t) {
      if (!t.el) return;
      var top = t.el.offsetTop;
      if (top !== lastTop) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(t.el);
    });
    h.innerHTML = '';
    return lines.map(function (ws) {
      var outer = document.createElement('span'); outer.className = 'kla-line';
      var inner = document.createElement('span'); inner.className = 'kla-line-in';
      ws.forEach(function (w, i) { if (i && !/^[.,;:!?]/.test(w.textContent)) inner.appendChild(document.createTextNode(' ')); inner.appendChild(w); });
      outer.appendChild(inner); h.appendChild(outer);
      return inner;
    });
  }
  var HEADS = '#services-heading, .pms-hdr .section-title, #erp-heading, #pn-home-heading, #coverage-heading, #routes-heading, #testimonials-heading, .faq-strip__title, #careers-strip-heading, #blog-slider-heading, #bal-heading, .savings-callout .container > div > div:first-child > div:last-child';
  // lines are measured, so wait for Bebas to be in before splitting
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    $(HEADS).forEach(function (h) {
      var lines = splitLines(h);
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, { yPercent: 0, duration: 0.8, ease: EASE, stagger: 0.08, scrollTrigger: enter(h) });
    });
    wrapNumber(document.querySelector('.savings-callout .container > div > div:first-child > div:last-child .kla-w[style]'), /^(\d+)%/, String);
    ScrollTrigger.refresh();
  });

  /* ---------- fade-up entrances (y 16, scale .98, 600 ms, 70 ms stagger, groups of 5) ---------- */
  function reveal(els, opts) {
    els = els.filter(Boolean); if (!els.length) return;
    opts = opts || {};
    gsap.set(els, { opacity: 0, y: opts.y || 16, scale: opts.scale || 0.98 });
    els.forEach(function (el, i) {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: opts.duration || 0.6, ease: opts.ease || 'power3.out',
        delay: (i % 5) * 0.07, scrollTrigger: enter(opts.trigger || el, opts.start) });
    });
  }
  // section headers: eyebrow, sub, header buttons
  reveal($('#home-services .tag, #home-services .section-sub, #home-services .svc-header__cta, #specializations .tag, #specializations .spec-roll-label, #specializations .spec-roll-outer, #specializations .spec-context, #specializations .kla-more, .pms-hdr .tag, .pms-hdr .proc__sub, .savings-callout .container > div > div:first-child > div:first-child, .savings-callout p, .savings-callout .btn--teal, #live-visibility .tag, #live-visibility .erp-sub, #live-visibility .kla-more, #live-visibility .erp-cta-row, #home-partners .tag, #home-partners .pn-home__sub, #home-partners .kla-more, #home-partners .careers-open-roles, #home-partners .pn-home__cta, .coverage-m__eyebrow, .coverage-m__rule, .coverage-m__sub, .coverage-m__cta, .coverage-m__link, #routes .tag, #routes .routes-sub, #routes .routes-footer, #home-testimonials .tag, .faq-strip__label, .faq-strip__sub, .faq-strip__links, .faq-strip__cta, .careers-strip:not(.pn-home) .careers-strip__sub, .careers-strip:not(.pn-home) .careers-open-roles, .careers-strip:not(.pn-home) .careers-strip__cta, #homeBlog .blog-slider__eyebrow, #homeBlog .blog-slider__sub, #homeBlog .btn--blog-all, #homeBlog .blog-slider__filters, #homeBlog .blog-slider__footer, #bookALoad .bal-eyebrow, #bookALoad .bal-body, #bookALoad .bal-right'));
  // cards and rows, springy
  reveal($('#live-visibility .erp-feature, #home-partners .pn-home__proof .erp-feature, #routes .route-card__body, .faq-strip__inner, .careers-strip:not(.pn-home) .careers-strip__inner, #bookALoad .bal-service'), { ease: SPRING, y: 20 });
  $('#homeBlog .blog-slider__track').forEach(function (track) {
    var seen = false;
    ScrollTrigger.create({ trigger: track, start: 'top 88%', once: true, onEnter: function () {
      seen = true; gsap.fromTo(track.children, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: SPRING, stagger: 0.08 });
    } });
    // the slider fills from JS after our script ran: catch late cards
    new MutationObserver(function () { if (seen) gsap.set(track.children, { opacity: 1, y: 0, scale: 1 }); }).observe(track, { childList: true });
  });
  // chips: springy stagger
  $('#specializations .spec-list, #home-partners .careers-open-roles, .coverage-m__chips, .faq-strip__links, .careers-strip:not(.pn-home) .careers-open-roles, .bal-checkboxes').forEach(function (g) {
    var chips = Array.prototype.slice.call(g.children); if (!chips.length) return;
    gsap.set(chips, { opacity: 0, y: 12, scale: 0.9 });
    gsap.to(chips, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: SPRING, stagger: 0.05, scrollTrigger: enter(g, '92%') });
  });

  /* ---------- photos: clip-path wipe on enter, scrubbed parallax while in view ---------- */
  $('#home-services .svc-card__media, #routes .route-card__media, #home-partners .pn-home__shot, #home-coverage .coverage-m__map, .careers-strip:not(.pn-home) .careers-strip__video-wrap, #live-visibility .erp-media, #how-it-works .pms-card:first-child .proc__stack-img').forEach(function (m) {
    gsap.set(m, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(m, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: EASE, scrollTrigger: enter(m, '90%') });
  });
  // services media are background spans, not img in a frame: scaling them pushed the photo over the card title (iPhone report 2026-11-20)
  // partners photos stay still: the owner saw that section "move around" while scrolling (2026-11-20)
  $('#routes .route-card__media img, #home-coverage .coverage-m__map img, .careers-strip:not(.pn-home) .careers-strip__video, #live-visibility .erp-media__video').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
  });

  /* ---------- 02 services: sticky stacking cards, the one behind scales down ---------- */
  var svc = $('#home-services .svc-card');
  svc.forEach(function (card, i) {
    card.style.zIndex = String(i + 1);
    reveal([card.querySelector('.svc-card__head'), card.querySelector('.svc-card__cta')], { trigger: card });
    if (i === svc.length - 1) return;
    // scale only: a faded card is see-through and the card under it bleeds into it (iPhone report 2026-11-20)
    gsap.to(card, { scale: 0.92, ease: 'none',
      scrollTrigger: { trigger: svc[i + 1], start: 'top bottom', end: 'top 74px', scrub: 0.3 } });
  });

  /* ---------- 04 how it works: sticky storytelling, 5 steps on a filling rail ---------- */
  (function () {
    var sec = document.getElementById('how-it-works'), block = sec && sec.querySelector('.proc__mobile-steps');
    var cards = $('.pms-card', sec); if (!block || cards.length < 2) return;
    var slider = block.querySelector('.pms-slider');
    // the CTA leaves the sticky block so the stage fits a phone viewport; it shows once the steps are done
    var cta = block.lastElementChild; cta.classList.add('kla-cta-out'); sec.appendChild(cta);
    var rail = document.createElement('div'); rail.className = 'kla-rail'; rail.setAttribute('aria-hidden', 'true');
    rail.innerHTML = '<div class="kla-rail__line"><div class="kla-rail__fill"></div></div><div class="kla-rail__dots">' +
      cards.map(function (_, i) { return '<span class="kla-rail__dot' + (i ? '' : ' is-on') + '">' + (i + 1) + '</span>'; }).join('') + '</div>';
    slider.insertBefore(rail, slider.firstChild);
    var dots = $('.kla-rail__dot', rail), fill = rail.querySelector('.kla-rail__fill');
    var stageH = Math.max.apply(null, cards.map(function (c) { return c.offsetHeight; }));
    sec.style.setProperty('--kla-stage-h', stageH + 'px');
    sec.classList.add('kla-pin');
    // shortcut: phones too short for the whole sticky stage get the plain stacked steps; upgrade by shrinking the stage
    if (block.offsetHeight + 77 > window.innerHeight) {
      sec.classList.remove('kla-pin'); rail.remove(); cta.classList.remove('kla-cta-out'); block.appendChild(cta); return;
    }
    cards.forEach(function (c, i) { c.style.zIndex = String(i + 1); });
    gsap.set(cards.slice(1), { opacity: 0, yPercent: 14, scale: 0.97 });
    var step = Math.round(window.innerHeight * 0.55);
    // the CTA sits (cards - 1) steps below the sticky block: that gap is the scroll distance of the story
    cta.style.marginTop = ((cards.length - 1) * step) + 'px';
    var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 64px', end: 'bottom bottom', scrub: 0.5,
      onUpdate: function (st) { var k = Math.min(cards.length - 1, Math.round(st.progress * (cards.length - 1))); dots.forEach(function (d, i) { d.classList.toggle('is-on', i <= k); }); } } });
    cards.forEach(function (c, i) {
      if (!i) return;
      // old step is gone before the new one fades in, so two steps never show on top of each other
      tl.to(cards[i - 1], { scale: 0.94, opacity: 0, yPercent: -4, duration: 0.5, ease: 'power2.in' }, i - 1)
        .to(c, { opacity: 1, yPercent: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, i - 0.5);
    });
    tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: cards.length - 1, ease: 'none' }, 0);
    // tapping a rail number scrolls to that step
    dots.forEach(function (d, i) { d.addEventListener('click', function () {
      var st = tl.scrollTrigger; window.scrollTo({ top: st.start + (st.end - st.start) * (i / (cards.length - 1)) + 1, behavior: 'smooth' });
    }); });
    // keep the taller-viewport math honest after images/fonts load
    window.addEventListener('load', function () {
      var h = Math.max.apply(null, cards.map(function (c) { return c.offsetHeight; }));
      sec.style.setProperty('--kla-stage-h', h + 'px');
      ScrollTrigger.refresh();
    }, { once: true });
  })();

  /* ---------- count-up numbers (15 years, 90 %, route km) ---------- */
  function countUp(span, to, fmt) {
    var o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', scrollTrigger: enter(span, '90%'),
      onUpdate: function () { span.textContent = fmt(Math.round(o.v)); } });
  }
  var comma = function (n) { return n.toLocaleString('en-US'); };
  function wrapNumber(el, re, fmt) {
    if (!el) return;
    var m = el.textContent.match(re); if (!m) return;
    var to = parseInt(m[1].replace(/,/g, ''), 10);
    el.innerHTML = el.textContent.replace(m[1], '<span class="kla-num" data-to="' + to + '">' + m[1] + '</span>');
    var span = el.querySelector('.kla-num'); span.textContent = fmt(0);
    countUp(span, to, fmt);
  }
  wrapNumber(document.querySelector('#specializations .spec-roll-label'), /^(\d+)/, String);
  $('#routes .route-card__km').forEach(function (el) { wrapNumber(el, /~([\d,]+)/, comma); });

  // layout settled: recompute trigger positions
  window.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true });
})();
