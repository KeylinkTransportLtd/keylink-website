/* =========================================================
   KEYLINK TRANSPORT — blog.js
   Fully dynamic: renders cards AND category tabs from
   KEYLINK_POSTS registry. Adding a post to blog-registry.js
   is the only step needed to publish it everywhere.
   ========================================================= */

(function () {
  'use strict';

  var grid = document.getElementById('blogGrid');
  if (!grid) return;

  /* ---- Helpers ---- */

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Convert a category label to a CSS-safe key.
     Known categories keep their existing keys so existing CSS
     badge colours still apply. Any new category auto-slugifies. */
  var KNOWN_CATS = {
    'Industry':      'industry',
    'Logistics':     'logistics',
    'Safety':        'safety',
    'Company':       'company',
    'Tips & Guides': 'tips'
  };

  function categoryKey(cat) {
    return KNOWN_CATS[cat] ||
      cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* ---- Sorted posts (newest first) — shared by hero + grid ---- */

  var sortedPosts = (window.KEYLINK_POSTS || []).slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  /* ---- Build grid from registry (skip index 0 — shown in hero) ---- */

  function buildGrid() {
    if (!sortedPosts.length) return;

    /* Posts for the grid: all posts, newest first (latest leads the section) */
    var gridPosts = sortedPosts;

    var html = '';
    gridPosts.forEach(function (p, i) {
      var catKey     = categoryKey(p.category);
      var isFeatured = i === 0 && p.featured;
      var imgLoading = i === 0 ? 'eager' : 'lazy';

      if (isFeatured) {
        html +=
          '<article class="blog-post blog-post--featured" data-category="' + catKey + '">' +
            '<a href="' + esc(p.slug) + '" class="blog-post__link">' +
              '<div class="blog-post__img">' +
                '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" loading="' + imgLoading + '">' +
              '</div>' +
              '<div class="blog-post__body">' +
                '<span class="blog-post__cat blog-post__cat--' + catKey + '">' + esc(p.category) + '</span>' +
                '<h2 class="blog-post__title">' + esc(p.title) + '</h2>' +
                (p.summary ? '<p class="blog-post__excerpt">' + esc(p.summary) + '</p>' : '') +
                '<time class="blog-post__date">' + esc(p.dateLabel) + '</time>' +
              '</div>' +
            '</a>' +
          '</article>';
      } else {
        html +=
          '<article class="blog-post" data-category="' + catKey + '">' +
            '<a href="' + esc(p.slug) + '" class="blog-post__link">' +
              '<div class="blog-post__img">' +
                '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" loading="' + imgLoading + '">' +
              '</div>' +
              '<div class="blog-post__body">' +
                '<span class="blog-post__cat blog-post__cat--' + catKey + '">' + esc(p.category) + '</span>' +
                '<h3 class="blog-post__title">' + esc(p.title) + '</h3>' +
                '<time class="blog-post__date">' + esc(p.dateLabel) + '</time>' +
              '</div>' +
            '</a>' +
          '</article>';
      }
    });

    grid.innerHTML = html;

    var countEl = document.querySelector('.blog-section__count');
    if (countEl) {
      countEl.innerHTML = '<strong>' + gridPosts.length + '</strong> Article' + (gridPosts.length !== 1 ? 's' : '');
    }
  }

  /* ---- Build category tabs dynamically ---- */

  function buildTabs() {
    var tabsEl = document.querySelector('.blog-tabs');
    if (!tabsEl || !sortedPosts.length) return;

    /* Unique categories from all posts in order of appearance */
    var gridPosts = sortedPosts;
    var seen = {};
    var cats = [];
    gridPosts.forEach(function (p) {
      if (!seen[p.category]) {
        seen[p.category] = true;
        cats.push(p.category);
      }
    });

    var html = '<button class="blog-tab active" data-filter="all" role="tab" aria-selected="true">All</button>';
    cats.forEach(function (cat) {
      html += '<button class="blog-tab" data-filter="' + esc(categoryKey(cat)) + '" role="tab" aria-selected="false">' + esc(cat) + '</button>';
    });
    tabsEl.innerHTML = html;
  }

  /* ---- Hero carousel: cross-fade through latest 3 posts ---- */

  function initHeroCarousel() {
    if (!sortedPosts.length) return;

    var carousel    = document.getElementById('heroCarousel');
    var feature     = document.getElementById('heroFeature');
    var img         = document.getElementById('heroImg');
    var headline    = document.getElementById('heroHeadline');
    var sub         = document.getElementById('heroSub');
    var cat         = document.getElementById('heroCat');
    var fdate       = document.getElementById('heroFDate');
    var dotsEl      = document.getElementById('heroDots');
    var prevBtn     = document.getElementById('heroPrev');
    var nextBtn     = document.getElementById('heroNext');
    var controlsEl  = document.getElementById('heroControls');
    if (!carousel || !feature || !img) return;

    var slides = sortedPosts.slice(0, 3);
    var current = 0;
    var fadingTimer = null;
    var advanceTimer = null;
    var isPaused = false;

    var FADE_MS  = 380;
    var CYCLE_MS = 5000;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Preload all candidate hero images so swaps are instant */
    slides.forEach(function (p) {
      if (p && p.image) { var im = new Image(); im.src = p.image; }
    });

    /* If only one post, render statically and bail on carousel chrome */
    if (slides.length <= 1) {
      applySlide(slides[0]);
      if (controlsEl) controlsEl.style.display = 'none';
      return;
    }

    carousel.style.setProperty('--hero-cycle-duration', CYCLE_MS + 'ms');

    /* Build dots */
    if (dotsEl) {
      dotsEl.innerHTML = '';
      slides.forEach(function (p, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'blog-hero__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Show featured post ' + (i + 1) + ': ' + (p.title || ''));
        dot.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(i, true);
        });
        dotsEl.appendChild(dot);
      });
    }

    function applySlide(p) {
      if (!p) return;
      feature.href = p.slug;
      carousel.setAttribute('data-href', p.slug);
      if (img)      { img.src = p.image; img.alt = p.imageAlt || p.title; }
      if (headline) headline.textContent = p.title;
      if (sub)      sub.textContent      = p.summary || '';
      if (cat)      cat.textContent      = p.category;
      if (fdate)    fdate.textContent    = p.dateLabel;
      /* Strip any tooltip-triggering attrs the browser/extensions read on hover */
      if (feature) {
        feature.removeAttribute('aria-label');
        feature.removeAttribute('title');
      }
      if (img) img.removeAttribute('title');
    }

    function updateDots() {
      if (!dotsEl) return;
      var dots = dotsEl.querySelectorAll('.blog-hero__dot');
      dots.forEach(function (d, i) {
        var active = i === current;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function goTo(index, manual) {
      if (slides.length <= 1) return;
      var next = ((index % slides.length) + slides.length) % slides.length;
      if (next === current && !manual) return;

      if (manual) restartAutoAdvance();

      if (reduced) {
        current = next;
        applySlide(slides[current]);
        updateDots();
        return;
      }

      carousel.classList.add('is-fading');
      clearTimeout(fadingTimer);
      fadingTimer = setTimeout(function () {
        current = next;
        applySlide(slides[current]);
        updateDots();
        /* Force reflow so the fade-back transition triggers reliably */
        // eslint-disable-next-line no-unused-expressions
        carousel.offsetWidth;
        carousel.classList.remove('is-fading');
      }, FADE_MS);
    }

    function next() { goTo(current + 1, false); }
    function prev() { goTo(current - 1, false); }

    function startAutoAdvance() {
      if (reduced || slides.length <= 1 || isPaused || document.hidden) return;
      stopAutoAdvance();
      advanceTimer = setInterval(next, CYCLE_MS);
    }
    function stopAutoAdvance() {
      if (advanceTimer) { clearInterval(advanceTimer); advanceTimer = null; }
    }
    function restartAutoAdvance() {
      stopAutoAdvance();
      updateDots();
      startAutoAdvance();
    }

    /* Initial render */
    applySlide(slides[current]);
    updateDots();
    startAutoAdvance();

    /* Hover does NOT pause autoplay (per product decision). The carousel keeps
       cycling whether or not the user is hovering. Clicking still navigates. */

    /* Whole hero is clickable: any click outside dots/chevrons goes to active slide */
    carousel.addEventListener('click', function (e) {
      if (e.target.closest('a, button, .blog-hero__controls')) return;
      var href = carousel.getAttribute('data-href');
      if (href) window.location.assign(href);
    });

    /* Keyboard navigation */
    carousel.setAttribute('tabindex', '-1');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); restartAutoAdvance(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); restartAutoAdvance(); }
    });

    if (prevBtn) prevBtn.addEventListener('click', function (e) {
      e.stopPropagation(); prev(); restartAutoAdvance();
    });
    if (nextBtn) nextBtn.addEventListener('click', function (e) {
      e.stopPropagation(); next(); restartAutoAdvance();
    });

    /* Touch swipe (mobile) */
    var touchStartX = null;
    var touchStartY = null;
    carousel.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (touchStartX == null) return;
      var t = (e.changedTouches && e.changedTouches[0]) || null;
      if (!t) { touchStartX = null; return; }
      var dx = t.clientX - touchStartX;
      var dy = t.clientY - touchStartY;
      touchStartX = touchStartY = null;
      /* Only treat as a swipe if mostly horizontal and >40px */
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) next(); else prev();
        restartAutoAdvance();
      }
    }, { passive: true });

    /* Pause when tab hidden, resume on focus */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoAdvance(); else startAutoAdvance();
    });
  }

  /* ---- Render ---- */

  initHeroCarousel();
  buildGrid();
  buildTabs();

  /* ---- Filter + Search ---- */

  var tabsEl       = document.querySelector('.blog-tabs');
  var searchInput  = document.getElementById('blogSearch');
  var emptyState   = document.getElementById('blogEmpty');
  var clearBtn     = document.getElementById('blogClearSearch');
  var activeFilter = 'all';
  var searchQuery  = '';

  function applyFilters() {
    var posts        = grid.querySelectorAll('.blog-post');
    var totalMatched = 0;

    posts.forEach(function (post) {
      var catMatch  = activeFilter === 'all' || post.dataset.category === activeFilter;
      var textMatch = true;
      if (searchQuery) {
        textMatch = (post.textContent || '').toLowerCase().indexOf(searchQuery) !== -1;
      }

      var matches = catMatch && textMatch;
      if (matches) totalMatched++;

      post.classList.toggle('hidden', !matches);
    });

    if (emptyState) emptyState.style.display = totalMatched === 0 ? 'block' : 'none';
    grid.classList.toggle('blog-grid--filtered', activeFilter !== 'all' || !!searchQuery);
  }

  /* Event delegation — works for dynamically generated tab buttons */
  if (tabsEl) {
    tabsEl.addEventListener('click', function (e) {
      var tab = e.target.closest('.blog-tab');
      if (!tab) return;
      activeFilter = tab.dataset.filter;
      tabsEl.querySelectorAll('.blog-tab').forEach(function (t) {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      applyFilters();
    });
  }

  if (searchInput) {
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      }, 200);
    });
  }

  function resetFilters() {
    searchQuery  = '';
    activeFilter = 'all';
    if (searchInput) searchInput.value = '';
    if (tabsEl) {
      tabsEl.querySelectorAll('.blog-tab').forEach(function (t) {
        var isAll = t.dataset.filter === 'all';
        t.classList.toggle('active', isAll);
        t.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
    }
    applyFilters();
  }

  if (clearBtn) clearBtn.addEventListener('click', resetFilters);

  applyFilters();

})();
