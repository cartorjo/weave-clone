/* Connection System: restrained data-flow paths over the hero image and a
   keyboard-ready industry network. The visual never carries essential content. */
(function () {
  'use strict';
  if (!window.__onReady) return;

  window.__onReady(function () {
    var reduced = window.__mq && window.__mq.reduced && window.__mq.reduced.matches;
    var hero = document.querySelector('[data-connection-hero]');

    if (hero) {
      var setHeroStatic = function () {
        hero.classList.remove('is-connection-playing');
        hero.classList.add('is-connection-settled');
      };

      if (reduced) {
        setHeroStatic();
      } else {
        hero.classList.add('is-connection-playing');
        window.setTimeout(setHeroStatic, 1650);
      }
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-industry-network]')).forEach(function (network) {
      var triggers = Array.prototype.slice.call(network.querySelectorAll('[data-network-industry]'));
      var paths = Array.prototype.slice.call(network.querySelectorAll('[data-network-path]'));
      var visual = network.querySelector('.industries__network');
      if (!triggers.length || !paths.length || !visual) return;

      var activate = function (industry) {
        network.setAttribute('data-active-industry', industry);
        triggers.forEach(function (trigger) {
          var active = trigger.getAttribute('data-network-industry') === industry;
          trigger.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        paths.forEach(function (path) {
          path.classList.toggle('is-active', path.getAttribute('data-network-path') === industry);
        });
      };

      triggers.forEach(function (trigger, index) {
        trigger.addEventListener('mouseenter', function () {
          activate(trigger.getAttribute('data-network-industry'));
        });
        trigger.addEventListener('focus', function () {
          activate(trigger.getAttribute('data-network-industry'));
        });
        trigger.addEventListener('click', function () {
          activate(trigger.getAttribute('data-network-industry'));
        });
        trigger.addEventListener('keydown', function (event) {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          var direction = event.key === 'ArrowDown' ? 1 : -1;
          var next = (index + direction + triggers.length) % triggers.length;
          triggers[next].focus();
        });
      });

      if (!reduced && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            visual.classList.add('is-network-drawing');
            observer.disconnect();
          });
        }, { threshold: 0.25 });
        observer.observe(network);
      }
    });
  });
})();
