/* ============================================================
   Keylink Transport — Related Articles Slider
   Reads window.KEYLINK_POSTS (blog-registry.js) to build a
   draggable card slider with spring-physics animation.

   Algorithm: same-category posts first (newest → oldest),
   then other categories (newest → oldest). Current page excluded.
   ============================================================ */
'use strict';

(function () {

  /* ---- Helpers ---- */

  /* Return just the bare filename without extension or path, e.g.
     /blog/optimize-freight-routes → "optimize-freight-routes"
     /optimize-freight-routes.html → "optimize-freight-routes"          */
  function getCurrentSlug() {
    return window.location.pathname.split('/').pop().replace(/\.html$/, '') || '';
  }

  /* Normalise registry slug the same way for comparison */
  function slugBase(slug) {
    return slug.split('/').pop().replace(/\.html$/, '');
  }

  function getRelatedPosts(currentSlug, currentCategory) {
    var all = window.KEYLINK_POSTS || [];
    var others = all.filter(function (p) { return slugBase(p.slug) !== currentSlug; });

    function byDate(a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : 0; }

    var sameCat = others.filter(function (p) { return p.category === currentCategory; }).sort(byDate);
    var diffCat = others.filter(function (p) { return p.category !== currentCategory; }).sort(byDate);

    return sameCat.concat(diffCat);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- Card HTML ---- */

  /* From inside /blog/, only the bare filename is needed as a relative link */
  function slugFile(slug) {
    return slug.split('/').pop(); // 'blog/optimize-freight-routes.html' → 'optimize-freight-routes.html'
  }

  function renderCard(post) {
    return (
      '<a href="' + slugFile(post.slug) + '" class="rs-card">' +
        '<div class="rs-card__img">' +
          '<img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.title) + '" loading="lazy" draggable="false">' +
          '<span class="rs-card__cat">' + escapeHtml(post.category) + '</span>' +
        '</div>' +
        '<div class="rs-card__body">' +
          '<div class="rs-card__title">' + escapeHtml(post.title) + '</div>' +
          '<div class="rs-card__footer">' +
            '<span class="rs-card__date">' + escapeHtml(post.dateLabel) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  /* ---- Build DOM ---- */

  function buildSlider(container, posts) {
    container.innerHTML =
      '<button class="rs-btn rs-btn--prev" aria-label="Previous articles">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      '</button>' +
      '<div class="rs-viewport">' +
        '<div class="rs-track">' +
          posts.map(renderCard).join('') +
        '</div>' +
      '</div>' +
      '<button class="rs-btn rs-btn--next" aria-label="Next articles">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
      '</button>';

    initDrag(container);
  }

  /* ---- Spring-physics drag engine ---- */

  function initDrag(wrap) {
    var viewport = wrap.querySelector('.rs-viewport');
    var track    = wrap.querySelector('.rs-track');
    var btnPrev  = wrap.querySelector('.rs-btn--prev');
    var btnNext  = wrap.querySelector('.rs-btn--next');

    var posX     = 0;   // current rendered position
    var targetX  = 0;   // where spring is pulling toward
    var velX     = 0;   // current velocity
    var rafId    = null;

    var isDragging   = false;
    var hasDragged   = false;
    var dragOriginX  = 0;
    var dragOriginPos= 0;

    /* -- Bounds -- */
    function maxScroll() {
      return -(track.scrollWidth - viewport.offsetWidth);
    }

    function clamp(v, lo, hi) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    /* -- Apply transform -- */
    function setPos(x) {
      posX = x;
      track.style.transform = 'translateX(' + x + 'px)';
    }

    /* -- Spring loop -- */
    function springLoop() {
      var stiffness = 0.16;
      var damping   = 0.72;
      var force     = (targetX - posX) * stiffness;
      velX = velX * damping + force;
      posX += velX;
      track.style.transform = 'translateX(' + posX + 'px)';
      syncButtons();

      if (Math.abs(velX) > 0.12 || Math.abs(targetX - posX) > 0.12) {
        rafId = requestAnimationFrame(springLoop);
      } else {
        posX  = targetX;
        velX  = 0;
        rafId = null;
        track.style.transform = 'translateX(' + posX + 'px)';
        syncButtons();
      }
    }

    function animateTo(newX) {
      targetX = clamp(newX, maxScroll(), 0);
      if (!rafId) rafId = requestAnimationFrame(springLoop);
    }

    /* -- Button state -- */
    function syncButtons() {
      btnPrev.classList.toggle('rs-disabled', posX >= -0.5);
      btnNext.classList.toggle('rs-disabled', posX <= maxScroll() + 0.5);
    }

    /* -- Arrow buttons -- */
    btnPrev.addEventListener('click', function () {
      animateTo(posX + viewport.offsetWidth * 0.72);
    });
    btnNext.addEventListener('click', function () {
      animateTo(posX - viewport.offsetWidth * 0.72);
    });

    /* -- Mouse drag -- */
    viewport.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging   = true;
      hasDragged   = false;
      dragOriginX  = e.clientX;
      dragOriginPos = posX;
      velX = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      viewport.classList.add('rs-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var delta = e.clientX - dragOriginX;
      if (Math.abs(delta) > 4) hasDragged = true;
      var raw = dragOriginPos + delta;
      var max = maxScroll();
      // Elastic resistance at edges
      if (raw > 0)   raw = raw * 0.22;
      if (raw < max) raw = max + (raw - max) * 0.22;
      posX    = raw;
      targetX = raw;
      track.style.transform = 'translateX(' + raw + 'px)';
      syncButtons();
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('rs-dragging');
      // Snap back if overscrolled
      var max = maxScroll();
      if (posX > 0 || posX < max) {
        animateTo(clamp(posX, max, 0));
      }
    });

    /* Block link navigation after a drag */
    track.addEventListener('click', function (e) {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    }, true);

    /* -- Touch drag -- */
    var touchOriginX  = 0;
    var touchOriginPos = 0;
    var touchMoved    = false;

    viewport.addEventListener('touchstart', function (e) {
      touchOriginX   = e.touches[0].clientX;
      touchOriginPos = posX;
      touchMoved     = false;
      velX = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }, { passive: true });

    viewport.addEventListener('touchmove', function (e) {
      var delta = e.touches[0].clientX - touchOriginX;
      if (Math.abs(delta) > 5) touchMoved = true;
      var raw = touchOriginPos + delta;
      var max = maxScroll();
      if (raw > 0)   raw = raw * 0.22;
      if (raw < max) raw = max + (raw - max) * 0.22;
      posX    = raw;
      targetX = raw;
      track.style.transform = 'translateX(' + raw + 'px)';
      syncButtons();
    }, { passive: true });

    viewport.addEventListener('touchend', function () {
      var max = maxScroll();
      if (posX > 0 || posX < max) {
        animateTo(clamp(posX, max, 0));
      }
    }, { passive: true });

    track.addEventListener('click', function (e) {
      if (touchMoved) {
        e.preventDefault();
        e.stopPropagation();
        touchMoved = false;
      }
    }, true);

    /* -- Init -- */
    syncButtons();
  }

  /* ---- Boot ---- */

  function init() {
    var container = document.getElementById('relatedSlider');
    if (!container || !window.KEYLINK_POSTS) return;

    var slug        = getCurrentSlug();
    var currentPost = window.KEYLINK_POSTS.find(function (p) { return slugBase(p.slug) === slug; });
    var category    = currentPost ? currentPost.category : '';
    var posts       = getRelatedPosts(slug, category);

    if (posts.length === 0) {
      var section = container.closest('section');
      if (section) section.style.display = 'none';
      return;
    }

    buildSlider(container, posts);
  }

  // Safe DOMContentLoaded — works whether script loads sync or deferred
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
