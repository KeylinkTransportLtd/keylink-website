/* =========================================================
   KEYLINK TRANSPORT — blog.js
   Fully dynamic: renders the latest 3 posts, the article grid
   (pages of 12) and the category chips from KEYLINK_POSTS
   (js/blog-registry.js). Adding a post to blog-registry.js
   is the only step needed to publish it everywhere.
   ========================================================= */
(function () {
  'use strict';
  var PAGE = 12;
  var posts = (window.KEYLINK_POSTS || []).slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  var latestEl = document.getElementById('bpLatest');
  var grid = document.getElementById('blogGrid');
  var latestSec = document.querySelector('.bp-latest');
  var moreWrap = document.querySelector('.bp-more');
  var moreBtn = document.getElementById('bpMore');
  var countEl = document.querySelector('.blog-section__count');
  var titleEl = document.getElementById('bpAllTitle');
  var tabsEl = document.querySelector('.bp-tabs');
  var search = document.getElementById('blogSearch');
  var empty = document.getElementById('blogEmpty');
  if (!grid || !posts.length) return;

  var KNOWN = { 'Industry': 'industry', 'Logistics': 'logistics', 'Safety': 'safety', 'Company': 'company', 'Tips & Guides': 'tips' };
  function key(c) { return KNOWN[c] || c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function webp(src) { return /^\/assets\/.+\.(png|jpe?g)$/i.test(src) ? '<source srcset="' + src.replace(/\.(png|jpe?g)$/i, '.webp') + '" type="image/webp">' : ''; }

  function card(p, lead, eager) {
    var k = key(p.category);
    return '<article class="blog-post' + (lead ? ' blog-post--featured' : '') + '" data-category="' + k + '">' +
      '<a href="' + esc(p.slug) + '" class="blog-post__link">' +
        '<div class="blog-post__img"><picture>' + webp(p.image) +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.title) + '" loading="' + (eager ? 'eager' : 'lazy') + '"></picture></div>' +
        '<div class="blog-post__body">' +
          '<span class="blog-post__cat blog-post__cat--' + k + '">' + esc(p.category) + '</span>' +
          '<h3 class="blog-post__title">' + esc(p.title) + '</h3>' +
          (lead && p.summary ? '<p class="blog-post__excerpt">' + esc(p.summary) + '</p>' : '') +
          '<time class="blog-post__date" datetime="' + esc(p.date) + '">' + esc(p.dateLabel) + '</time>' +
        '</div></a></article>';
  }

  /* Chips with counts */
  var counts = {}, order = [];
  posts.forEach(function (p) { if (!counts[p.category]) { counts[p.category] = 0; order.push(p.category); } counts[p.category]++; });
  order.sort(function (a, b) { return counts[b] - counts[a]; });
  tabsEl.innerHTML = '<button class="blog-tab active" data-filter="all" role="tab" aria-selected="true">All <span class="n">' + posts.length + '</span></button>' +
    order.map(function (c) { return '<button class="blog-tab" data-filter="' + key(c) + '" role="tab" aria-selected="false">' + esc(c) + ' <span class="n">' + counts[c] + '</span></button>'; }).join('');

  var filter = 'all', query = '', shown = PAGE;

  function render() {
    var browsing = filter === 'all' && !query;
    var list = posts.filter(function (p) {
      if (filter !== 'all' && key(p.category) !== filter) return false;
      if (query && (p.title + ' ' + (p.summary || '') + ' ' + p.category).toLowerCase().indexOf(query) === -1) return false;
      return true;
    });
    latestSec.hidden = !browsing;
    if (browsing) latestEl.innerHTML = card(list[0], true, true) + card(list[1], false, true) + card(list[2], false, true);
    var rest = browsing ? list.slice(3) : list;
    grid.innerHTML = rest.slice(0, shown).map(function (p) { return card(p, false, false); }).join('');
    var left = rest.length - Math.min(shown, rest.length);
    moreWrap.hidden = left <= 0;
    moreBtn.textContent = 'Show more articles (' + left + ' more)';
    titleEl.textContent = browsing ? 'All Articles' : (query ? 'Search results' : tabsEl.querySelector('.active').firstChild.textContent.trim());
    countEl.innerHTML = '<strong>' + list.length + '</strong> Article' + (list.length !== 1 ? 's' : '');
    empty.hidden = list.length > 0;
  }

  tabsEl.addEventListener('click', function (e) {
    var t = e.target.closest('.blog-tab'); if (!t) return;
    filter = t.dataset.filter; shown = PAGE;
    tabsEl.querySelectorAll('.blog-tab').forEach(function (b) { b.classList.toggle('active', b === t); b.setAttribute('aria-selected', b === t ? 'true' : 'false'); });
    render();
  });
  var timer;
  search.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { query = search.value.trim().toLowerCase(); shown = PAGE; render(); }, 200);
  });
  moreBtn.addEventListener('click', function () {
    var first = grid.children.length;
    shown += PAGE; render();
    var a = grid.children[first] && grid.children[first].querySelector('a');
    if (a) a.focus({ preventScroll: true }); /* keyboard users land on the first new card */
  });
  document.getElementById('blogClearSearch').addEventListener('click', function () {
    search.value = ''; query = ''; filter = 'all'; shown = PAGE;
    tabsEl.querySelectorAll('.blog-tab').forEach(function (b) { var on = b.dataset.filter === 'all'; b.classList.toggle('active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    render();
  });
  render();
})();
