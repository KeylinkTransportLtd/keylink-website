/* ============================================================
   Keylink Transport — Home Page Blog Slider
   Reads window.KEYLINK_POSTS, renders glass cards, handles
   drag-to-scroll, touch, and arrow nav (side + bottom).
   ============================================================ */
(function () {
  'use strict';

  function initBlogSlider() {
    var posts = window.KEYLINK_POSTS || [];
    if (!posts.length) return;

    /* Sort newest first */
    var sorted = posts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    /* Unique categories in order of first appearance */
    var cats = ['All'];
    sorted.forEach(function (p) {
      if (cats.indexOf(p.category) === -1) cats.push(p.category);
    });

    var activeCategory = 'All';
    var filteredPosts  = sorted.slice();

    var filtersEl  = document.getElementById('blogSliderFilters');
    var trackEl    = document.getElementById('blogSliderTrack');
    var wrapperEl  = document.getElementById('blogSliderWrapper');
    var countEl    = document.getElementById('blogSliderCount');

    /* Both arrow pairs: side (L/R flanking) + bottom */
    var prevBtns = Array.from(document.querySelectorAll('.js-blog-prev'));
    var nextBtns = Array.from(document.querySelectorAll('.js-blog-next'));

    if (!filtersEl || !trackEl || !wrapperEl) return;

    /* ---- Filter render ---- */
    function renderFilters() {
      filtersEl.innerHTML = '';
      cats.forEach(function (cat) {
        var btn = document.createElement('button');
        btn.className = 'blog-filter-tag' + (cat === activeCategory ? ' active' : '');
        btn.textContent = cat;
        btn.setAttribute('type', 'button');
        btn.addEventListener('click', function () {
          activeCategory = cat;
          filteredPosts  = cat === 'All'
            ? sorted.slice()
            : sorted.filter(function (p) { return p.category === cat; });
          renderFilters();
          renderCards();
          resetScroll();
        });
        filtersEl.appendChild(btn);
      });
    }

    /* ---- Card render ---- */
    function renderCards() {
      trackEl.innerHTML = '';
      filteredPosts.forEach(function (post) {
        trackEl.appendChild(createCard(post));
      });
      if (countEl) {
        countEl.textContent = filteredPosts.length + ' article' + (filteredPosts.length !== 1 ? 's' : '');
      }
      /* Defer arrow state until after browser has reflowed the new cards */
      requestAnimationFrame(function () {
        requestAnimationFrame(updateArrowState);
      });
    }

    function escHtml(str) {
      var d = document.createElement('div');
      d.appendChild(document.createTextNode(str));
      return d.innerHTML;
    }

    function createCard(post) {
      var a = document.createElement('a');
      a.href = post.slug;
      a.className = 'blog-slide-card';
      a.setAttribute('aria-label', post.title);
      var summary = post.summary ? escHtml(post.summary) : '';
      a.innerHTML =
        '<div class="bsc__img-wrap">' +
          '<img class="bsc__img" src="' + escHtml(post.image) + '" alt="" loading="lazy">' +
          '<div class="bsc__img-overlay"></div>' +
          '<span class="bsc__category">' + escHtml(post.category) + '</span>' +
        '</div>' +
        '<div class="bsc__body">' +
          '<h3 class="bsc__title">' + escHtml(post.title) + '</h3>' +
          (summary ? '<p class="bsc__summary">' + summary + '</p>' : '') +
          '<div class="bsc__meta">' +
            '<span class="bsc__date">' +
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
              escHtml(post.dateLabel) +
            '</span>' +
            '<span class="bsc__read-more">Read &rarr;</span>' +
          '</div>' +
        '</div>';
      return a;
    }

    /* ---- Scroll ---- */
    var scrollPos = 0;

    function getMaxScroll() {
      return Math.max(0, trackEl.scrollWidth - wrapperEl.clientWidth);
    }

    function applyScroll(pos, animate) {
      scrollPos = Math.max(0, Math.min(getMaxScroll(), pos));
      trackEl.style.transition = animate
        ? 'transform 0.52s cubic-bezier(0.4, 0, 0.2, 1)'
        : 'none';
      trackEl.style.transform = 'translateX(-' + scrollPos + 'px)';
      updateArrowState();
    }

    function resetScroll() {
      applyScroll(0, true);
    }

    function updateArrowState() {
      var max = getMaxScroll();
      prevBtns.forEach(function (b) {
        b.disabled = scrollPos <= 0;
        b.classList.toggle('is-disabled', scrollPos <= 0);
      });
      nextBtns.forEach(function (b) {
        b.disabled = scrollPos >= max;
        b.classList.toggle('is-disabled', scrollPos >= max);
      });
    }

    prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyScroll(scrollPos - wrapperEl.clientWidth * 0.78, true);
      });
    });
    nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyScroll(scrollPos + wrapperEl.clientWidth * 0.78, true);
      });
    });

    /* ---- Mouse drag ---- */
    var dragging        = false;
    var dragStartX      = 0;
    var dragStartScroll = 0;
    var didDrag         = false;

    wrapperEl.addEventListener('mousedown', function (e) {
      dragging        = true;
      didDrag         = false;
      dragStartX      = e.clientX;
      dragStartScroll = scrollPos;
      wrapperEl.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) didDrag = true;
      applyScroll(dragStartScroll - dx, false);
    });

    document.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      wrapperEl.style.cursor = 'grab';
    });

    /* Prevent navigation if user dragged */
    wrapperEl.addEventListener('click', function (e) {
      if (didDrag) e.preventDefault();
    }, true);

    /* ---- Touch drag ---- */
    var touchStartX      = 0;
    var touchStartScroll = 0;

    wrapperEl.addEventListener('touchstart', function (e) {
      touchStartX      = e.touches[0].clientX;
      touchStartScroll = scrollPos;
    }, { passive: true });

    wrapperEl.addEventListener('touchmove', function (e) {
      var dx = e.touches[0].clientX - touchStartX;
      applyScroll(touchStartScroll - dx, false);
    }, { passive: true });

    /* ---- Init ---- */
    renderFilters();
    renderCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogSlider);
  } else {
    initBlogSlider();
  }
})();
