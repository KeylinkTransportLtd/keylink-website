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

  /* ---- Build grid from registry ---- */

  function buildGrid() {
    var posts = window.KEYLINK_POSTS;
    if (!posts || !posts.length) return;

    var html = '';
    posts.forEach(function (p, i) {
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
      countEl.textContent = posts.length + ' article' + (posts.length !== 1 ? 's' : '');
    }
  }

  /* ---- Build category tabs dynamically ---- */

  function buildTabs() {
    var posts = window.KEYLINK_POSTS;
    var tabsEl = document.querySelector('.blog-tabs');
    if (!tabsEl || !posts || !posts.length) return;

    /* Unique categories in order of first appearance */
    var seen = {};
    var cats = [];
    posts.forEach(function (p) {
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

  /* ---- Render ---- */

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
