/* Services page: sticky service nav scroll-spy + gentle scroll reveals. */
(function () {
  'use strict';
  var nav = document.getElementById('svNav');
  var mainNav = document.getElementById('mainNav');
  if (!nav) return;
  var tabs = [].slice.call(nav.querySelectorAll('.sv-nav__tab'));
  var secs = tabs.map(function (t) { return document.querySelector(t.getAttribute('href')); });
  var inner = nav.querySelector('.sv-nav__inner');

  function syncNav() {
    if (mainNav) document.documentElement.style.setProperty('--nav-h', Math.round(mainNav.getBoundingClientRect().height) + 'px');
  }
  syncNav();
  window.addEventListener('resize', syncNav, { passive: true });

  var current = -1;
  function spy() {
    var line = (mainNav ? mainNav.offsetHeight : 76) + nav.offsetHeight + 40;
    var best = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) best = i; });
    if (best === current) return;
    current = best;
    tabs.forEach(function (t, i) {
      var on = i === best;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    var at = tabs[best];
    if (at && inner.scrollWidth > inner.clientWidth + 4) {
      inner.scrollTo({ left: Math.max(0, at.offsetLeft - (inner.clientWidth - at.offsetWidth) / 2), behavior: 'smooth' });
    }
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* Reveal: skip entirely when reduced motion is on */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.sv-card, .sv-detail__text, .sv-detail__media, .sv-temp, .sv-addons li, .sv-steps li, .sv-table-wrap, .sv-chips');
  document.documentElement.classList.add('sv-js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('sv-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el, i) {
    el.classList.add('sv-reveal');
    el.style.transitionDelay = (i % 3) * 60 + 'ms'; /* small stagger inside a row */
    io.observe(el);
  });
})();
