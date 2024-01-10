/* =========================================================
   KEYLINK TRANSPORT — main.js
   GSAP + ScrollTrigger scroll animations + UI interactions
   ========================================================= */

(function () {
  'use strict';

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- ENTRANCE ANIMATION (runs after preloader exits) ----
  function runEntranceAnimation() {
    if (prefersReducedMotion) {
      document.body.classList.remove('js-loading');
      return;
    }

    // Lock starting positions via GSAP *before* removing the CSS hiding class,
    // so there is zero flash between CSS releasing control and GSAP taking over.
    gsap.set('#mainNav',            { opacity: 0 });
    gsap.set('.nav__logo',          { x: -18, opacity: 0 });
    gsap.set('.nav__links li',      { y: -14, opacity: 0 });
    gsap.set('.nav__phone',         { x: 18,  opacity: 0 });
    gsap.set('.nav__actions .btn',  { x: 18,  opacity: 0 });
    gsap.set('.svh__status',        { y: 22,  opacity: 0 });
    gsap.set('.svh__title-line',    { y: 36,  opacity: 0 });
    gsap.set('.svh__sub',           { y: 22,  opacity: 0 });
    gsap.set('.svh__actions',       { y: 22,  opacity: 0 });
    gsap.set('.svh__scroll-hint',   { opacity: 0 });

    // CSS hiding can now be released — GSAP owns every element's state
    document.body.classList.remove('js-loading');

    gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1 — Nav bar shell fades in (no movement — just the frosted glass background)
      .to('#mainNav', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)

      // 2 — Logo glides in from the left
      .to('.nav__logo', {
        x: 0, opacity: 1,
        duration: 0.65,
        ease: 'power2.out'
      }, 0.1)

      // 3 — Nav links drop in one by one from above
      .to('.nav__links li', {
        y: 0, opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.2)

      // 4 — Phone number + CTA slide in from the right
      .to(['.nav__phone', '.nav__actions .btn'], {
        x: 0, opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power2.out'
      }, 0.38)

      // 5 — Status pill rises up (hero)
      .to('.svh__status', {
        y: 0, opacity: 1,
        duration: 0.7
      }, 0.45)

      // 6 — Headline lines stagger up
      .to('.svh__title-line', {
        y: 0, opacity: 1,
        duration: 0.9,
        stagger: 0.13
      }, 0.6)

      // 7 — Subtitle
      .to('.svh__sub', {
        y: 0, opacity: 1,
        duration: 0.7
      }, 0.92)

      // 8 — CTA buttons with a soft spring
      .to('.svh__actions', {
        y: 0, opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.4)'
      }, 1.05)

      // 9 — Scroll hint last
      .to('.svh__scroll-hint', {
        opacity: 1,
        duration: 0.6
      }, 1.3);
  }

  // Run entrance animation immediately (no preloader)
  runEntranceAnimation();

  // ---- NAVBAR SCROLL ----
  const nav = document.getElementById('mainNav');
  const svhSection = document.getElementById('svh');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- SCROLL VIDEO HERO — video scrubbing ----
  const heroVideo = document.getElementById('heroVideo');
  const svhProgressBar = document.getElementById('svhProgressBar');
  const svhScrollHint = document.getElementById('svhScrollHint');
  const svhStatusText  = document.getElementById('svhStatusText');
  const svhTitleSwap   = document.getElementById('svhTitleSwap');

  // Headline second-line phrases tied to scroll progress
  const TITLE_STAGES = [
    { at: 0.0,  text: 'No Surprises.' },
    { at: 0.33, text: 'No Delays.'    },
    { at: 0.66, text: 'No Hassle.'    },
  ];
  let lastTitleIndex = -1;

  // Status labels that change as truck empties
  const STATUS_STAGES = [
    { at: 0.0,  label: 'Loaded & Ready',  dotColor: '#F0A820' },  // gold — full truck
    { at: 0.33, label: 'En Route',        dotColor: '#22a092' },  // teal — moving
    { at: 0.66, label: 'Delivering',      dotColor: '#22a092' },  // teal — unloading
    { at: 0.9,  label: 'Delivered ✓',     dotColor: '#2DBD6E' },  // green — empty
  ];
  let lastStageIndex = -1;

  if (svhSection && heroVideo) {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: autoplay looping animation — no scroll scrubbing
      heroVideo.loop = true;
      heroVideo.muted = true;
      heroVideo.setAttribute('playsinline', '');
      heroVideo.play().catch(() => {});
    } else {
      // Desktop: scroll-scrub the video
      heroVideo.load();
      heroVideo.pause();

      let videoReady = false;
      heroVideo.addEventListener('loadedmetadata', () => { videoReady = true; scrubVideo(); });
      heroVideo.addEventListener('canplaythrough',  () => { videoReady = true; scrubVideo(); });

      function scrubVideo() {
        if (!videoReady || !heroVideo.duration) return;

        const sectionTop  = svhSection.offsetTop;
        const scrollable  = svhSection.offsetHeight - window.innerHeight;
        const scrolled    = window.scrollY - sectionTop;
        const progress    = Math.max(0, Math.min(1, scrolled / scrollable));

        // Scrub video time
        const targetTime = progress * heroVideo.duration;
        if (Math.abs(heroVideo.currentTime - targetTime) > 0.04) {
          heroVideo.currentTime = targetTime;
        }

        // Progress bar
        if (svhProgressBar) {
          svhProgressBar.style.width = (progress * 100) + '%';
        }

        // Scroll hint
        if (svhScrollHint) {
          svhScrollHint.classList.toggle('hidden', progress > 0.015);
        }

        // Headline second line — scroll-ticker swap at each threshold
        if (svhTitleSwap && !svhTitleSwap._animating) {
          let titleIndex = 0;
          for (let i = TITLE_STAGES.length - 1; i >= 0; i--) {
            if (progress >= TITLE_STAGES[i].at) { titleIndex = i; break; }
          }
          if (titleIndex !== lastTitleIndex) {
            lastTitleIndex = titleIndex;
            svhTitleSwap._animating = true;
            // Exit: slide upward out
            svhTitleSwap.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
            svhTitleSwap.style.transform = 'translateY(-28px)';
            svhTitleSwap.style.opacity = '0';
            setTimeout(() => {
              // Instantly reposition below, swap text
              svhTitleSwap.style.transition = 'none';
              svhTitleSwap.textContent = TITLE_STAGES[titleIndex].text;
              svhTitleSwap.style.transform = 'translateY(28px)';
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  // Enter: slide up into position
                  svhTitleSwap.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
                  svhTitleSwap.style.transform = 'translateY(0)';
                  svhTitleSwap.style.opacity = '1';
                  setTimeout(() => { svhTitleSwap._animating = false; }, 350);
                });
              });
            }, 260);
          }
        }

        // Live status badge — swap label at each threshold
        if (svhStatusText) {
          let stageIndex = 0;
          for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
            if (progress >= STATUS_STAGES[i].at) { stageIndex = i; break; }
          }
          if (stageIndex !== lastStageIndex) {
            lastStageIndex = stageIndex;
            const stage = STATUS_STAGES[stageIndex];
            svhStatusText.textContent = stage.label;
            // Animate the swap
            svhStatusText.style.opacity = '0';
            svhStatusText.style.transform = 'translateY(6px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                svhStatusText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                svhStatusText.style.opacity = '1';
                svhStatusText.style.transform = 'translateY(0)';
              });
            });
            // Dot color
            const dot = svhStatusText.previousElementSibling;
            if (dot) dot.style.background = stage.dotColor;
          }
        }
      }

      window.addEventListener('scroll', scrubVideo, { passive: true });
      scrubVideo();
    }
  }

  // ---- MOBILE MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ---- FLOATING CTA ----
  const floatingCTA = document.getElementById('floatingCTA');
  if (floatingCTA) {
    let floatingVisible = false;
    const toggleFloating = () => {
      const show = window.scrollY > window.innerHeight * 0.6;
      if (show === floatingVisible) return;
      floatingVisible = show;
      if (show) {
        floatingCTA.classList.add('visible');
        requestAnimationFrame(() => { floatingCTA.style.opacity = '1'; });
      } else {
        floatingCTA.style.opacity = '0';
        setTimeout(() => { floatingCTA.classList.remove('visible'); }, 400);
      }
    };
    window.addEventListener('scroll', toggleFloating, { passive: true });
    toggleFloating();
  }

  // ---- GSAP ANIMATIONS ----
  // Wait for GSAP to load
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      // Instantly show all animated elements
      document.querySelectorAll('.gsap-reveal, .gsap-reveal-left, .gsap-reveal-right, .gsap-scale').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // ---- Hero stagger ----
    const heroTitle = document.querySelectorAll('.hero__title .gsap-reveal');
    if (heroTitle.length) {
      gsap.fromTo(heroTitle,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.3
        }
      );
    }

    // ---- Generic reveal animations ----
    gsap.utils.toArray('.gsap-reveal').forEach(el => {
      if (el.closest('.hero__title')) return; // already handled
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 96%',
            toggleActions: 'play none none none',
            once: true
          },
          delay: parseFloat(el.style.transitionDelay) || 0
        }
      );
    });

    gsap.utils.toArray('.gsap-reveal-left').forEach(el => {
      gsap.fromTo(el,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });

    gsap.utils.toArray('.gsap-reveal-right').forEach(el => {
      gsap.fromTo(el,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });

    gsap.utils.toArray('.gsap-scale').forEach((el) => {
      gsap.fromTo(el,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          },
          delay: (parseFloat(el.style.transitionDelay) || 0)
        }
      );
    });

    // ---- Service cards stagger ----
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 96%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // ---- Value cards stagger ----
    const valueCards = document.querySelectorAll('.value-card');
    if (valueCards.length) {
      gsap.fromTo(valueCards,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: '.values-grid',
            start: 'top 96%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // ---- Route pills stagger ----
    const routePills = document.querySelectorAll('.route-pill');
    if (routePills.length) {
      gsap.fromTo(routePills,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.6)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.coverage-routes',
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // ---- Coverage map image: entrance + scroll parallax ----
    const corridorImg = document.querySelector('.corridor-map-img');
    if (corridorImg) {
      // Entrance: scale up from slightly smaller, fade in
      gsap.fromTo(corridorImg,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: corridorImg,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );

      // Subtle scroll-linked upward drift as user scrolls past the section
      gsap.to(corridorImg, {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.coverage-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8
        }
      });
    }

    // ---- Parallax on hero visual ----
    const heroVisual = document.querySelector('.hero__visual');
    if (heroVisual) {
      gsap.to(heroVisual, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // ---- SVG map route draw animation ----
    const mapLines = document.querySelectorAll('.coverage-map line');
    if (mapLines.length) {
      mapLines.forEach(line => {
        const length = line.getTotalLength ? line.getTotalLength() : 200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.coverage-map',
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true
          }
        });
      });
    }

    // ---- Testimonials slider ----
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    if (slider && prevBtn && nextBtn) {
      const cards = slider.querySelectorAll('.testimonial-card');
      let currentIndex = 0;

      const scrollToCard = (index) => {
        const card = cards[index];
        if (!card) return;
        gsap.to(slider, {
          scrollLeft: card.offsetLeft - slider.offsetLeft,
          duration: 0.6,
          ease: 'power2.inOut'
        });
      };

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
      });

      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        scrollToCard(currentIndex);
      });
    }

    // ---- Refresh ScrollTrigger on resize ----
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
  });

  // ---- STAT COUNTER ANIMATION ----
  // Runs without GSAP for robustness
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1800;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          if (!prefersReducedMotion) {
            animateCounter(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- SPECIALIZATIONS TEXT ROTATE ----
  (function initSpecRotate() {
    var container = document.getElementById('specTextRotate');
    if (!container) return;

    var TEXTS = [
      'Nursery Products',
      'Fresh Fish',
      'Bakery Goods',
      'Fresh Produce',
      'Lumber',
      'Frozen Foods',
      'Fresh Berries',
      'Cedar & Trees',
      'All Freight'
    ];

    var current = 0;
    var isAnimating = false;

    function buildWords(text) {
      var frag = document.createDocumentFragment();
      var words = text.split(' ');
      words.forEach(function(word, wi) {
        var wordEl = document.createElement('span');
        wordEl.className = 'tr-word';
        Array.from(word).forEach(function(ch, ci) {
          var charEl = document.createElement('span');
          charEl.className = 'tr-char';
          charEl.textContent = ch;
          // stagger: each word starts after previous word's last char
          var wordOffset = 0;
          for (var w = 0; w < wi; w++) wordOffset += words[w].length;
          charEl.style.transitionDelay = ((wordOffset + ci) * 0.015) + 's';
          wordEl.appendChild(charEl);
        });
        frag.appendChild(wordEl);
        if (wi < words.length - 1) {
          var sp = document.createElement('span');
          sp.className = 'tr-space';
          frag.appendChild(sp);
        }
      });
      return frag;
    }

    function show(text) {
      container.innerHTML = '';
      container.appendChild(buildWords(text));
      // Force reflow so initial state is applied before transition
      void container.offsetHeight;
      Array.from(container.querySelectorAll('.tr-char')).forEach(function(c) {
        c.classList.add('tr-char--in');
      });
    }

    function hide() {
      var chars = Array.from(container.querySelectorAll('.tr-char'));
      var maxDelay = 0;
      chars.forEach(function(c, i) {
        var delay = i * 0.010;
        maxDelay = delay;
        c.style.transitionDelay = delay + 's';
        c.classList.remove('tr-char--in');
        c.classList.add('tr-char--out');
      });
      return Math.min((maxDelay + 0.4) * 1000, 700);
    }

    function rotate() {
      if (isAnimating) return;
      isAnimating = true;
      var wait = hide();
      setTimeout(function() {
        current = (current + 1) % TEXTS.length;
        show(TEXTS[current]);
        isAnimating = false;
      }, wait);
    }

    if (prefersReducedMotion) {
      // Show all text static — pick first
      show(TEXTS[0]);
    } else {
      show(TEXTS[0]);
      setInterval(rotate, 1600);
    }
  })();

  // ---- FORM: quick quote redirect ----
  const ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = ctaForm.querySelector('[name="from"]')?.value || '';
      const to = ctaForm.querySelector('[name="to"]')?.value || '';
      window.location.href = `contact.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    });
  }

  // ---- STANDARDS SCROLL EXPANSION ----
  (function () {
    var wrapper  = document.getElementById('standardsWrapper');
    var bgEl     = document.getElementById('standardsBg');
    var mediaEl  = document.getElementById('standardsMedia');
    var dimmer   = document.getElementById('standardsDimmer');
    var titleL   = document.getElementById('standardsTitleL');
    var titleR   = document.getElementById('standardsTitleR');
    var hintEl   = document.getElementById('standardsHint');
    var splitCta = document.getElementById('standardsSplitCta');

    if (!wrapper) return;

    var isMobile = window.innerWidth < 768;
    window.addEventListener('resize', function () {
      isMobile = window.innerWidth < 768;
    }, { passive: true });

    function applyProgress(p) {
      // Background fades to black
      bgEl.style.opacity = 1 - p;

      // Image expands
      var growW = isMobile ? 650 : 1250;
      var growH = isMobile ? 200 : 400;
      var w = Math.min(300 + p * growW, window.innerWidth  * 0.95);
      var h = Math.min(400 + p * growH, window.innerHeight * 0.85);
      mediaEl.style.width  = w + 'px';
      mediaEl.style.height = h + 'px';

      // Dark overlay on image fades as image grows
      dimmer.style.opacity = Math.max(0, 0.7 - p * 0.3);

      // Title words slide off to opposite sides
      var tx = p * (isMobile ? 80 : 150);
      titleL.style.transform = 'translateX(-' + tx + 'vw)';
      titleR.style.transform = 'translateX('  + tx + 'vw)';

      // Hint fades quickly
      hintEl.style.opacity   = Math.max(0, 1 - p * 4);
      hintEl.style.transform = 'translateX(' + tx + 'vw)';

      // CTA button fades in as titles split
      if (splitCta) {
        var ctaOpacity = Math.min(1, Math.max(0, (p - 0.4) / 0.35));
        var ctaY = 12 - ctaOpacity * 12;
        splitCta.style.opacity = ctaOpacity;
        splitCta.style.transform = 'translateY(' + ctaY + 'px)';
        splitCta.classList.toggle('visible', ctaOpacity > 0.1);
      }
    }

    function onScroll() {
      var wrapperTop  = wrapper.getBoundingClientRect().top + window.scrollY;
      var scrollSpace = wrapper.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, (window.scrollY - wrapperTop) / scrollSpace));
      applyProgress(p);
    }

    applyProgress(0);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load in case section is already in view
  })();

})();
