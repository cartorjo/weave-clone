/* Header behaviour: close the responsive menu after navigation and add a
   subtle scroll state. Opening/closing is native <details>. */
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
  });
})();
