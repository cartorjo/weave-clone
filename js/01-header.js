/* Header behaviour: close the responsive menu after navigation, add a subtle
   scroll state, and identify the section a visitor is currently reading. */
(function () {
  'use strict';
  if (!window.__onReady) return;

  window.__onReady(function () {
    var menu = document.getElementById('mobile-menu');
    var header = document.querySelector('[data-site-header]');
    var wideNav = window.matchMedia('(min-width: 1440px)');

    if (menu) {
      menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) menu.open = false;
      });

      wideNav.addEventListener('change', function (event) {
        if (event.matches) menu.open = false;
      });
    }

    var navGroups = Array.prototype.slice.call(document.querySelectorAll('.site-nav__group'));
    navGroups.forEach(function (group) {
      group.addEventListener('click', function (event) {
        if (event.target.closest('a')) group.open = false;
      });
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          group.open = false;
          var summary = group.querySelector('summary');
          if (summary) summary.focus();
        }
      });
    });

    document.addEventListener('click', function (event) {
      navGroups.forEach(function (group) {
        if (group.open && !group.contains(event.target)) group.open = false;
      });
    });

    var updateHeader = function () {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('[data-section-link]'));
    var sections = [];
    var seen = {};
    sectionLinks.forEach(function (link) {
      var id = (link.getAttribute('href') || '').replace(/^#/, '');
      var section = id && document.getElementById(id);
      if (section && !seen[id]) {
        seen[id] = true;
        sections.push(section);
      }
    });
    sections.sort(function (a, b) {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    });

    function setActive(id) {
      sectionLinks.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + id;
        if (active) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    function updateActiveSection() {
      if (!sections.length) return;
      var threshold = window.innerHeight * 0.46;
      var active = null;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= threshold) active = section.id;
      });
      setActive(active);
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
  });
})();
