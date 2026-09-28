/* ═══════════════════════════════════════════════════════════════════
   가로 슬라이더 두 개 — 메인 비주얼([data-mv])과 제품 캐러셀([data-pcar])

   외부 라이브러리 없이 transform 만 움직인다.
   · 메인 비주얼: 한 번에 한 장, 순환, 6초 자동 넘김(호버·포커스 중지)
   · 제품 캐러셀: 한 화면에 보이는 개수를 실제 아이템 폭에서 재서
     그만큼씩 민다. 순환하지 않고 양 끝에서 버튼이 죽는다.

   prefers-reduced-motion 이면 자동 넘김을 켜지 않는다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── ① 메인 비주얼 ──────────────────────────────────────── */
  (function mainVisual() {
    var host = document.querySelector('[data-mv]');
    if (!host) return;
    var track = host.querySelector('.mv__track');
    var slides = track ? track.children : null;
    if (!slides || slides.length < 2) return;

    var dots = host.querySelector('[data-mv-dots]');
    var total = slides.length;
    var i = 0;
    var timer = null;

    // 점은 슬라이드 수만큼 만들어 붙인다 — 마크업에 손대지 않기 위해서
    var buttons = [];
    if (dots) {
      for (var n = 0; n < total; n++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', (n + 1) + '번 슬라이드');
        b.addEventListener('click', (function (k) {
          return function () { go(k); restart(); };
        })(n));
        dots.appendChild(b);
        buttons.push(b);
      }
    }

    function go(k) {
      i = (k + total) % total;
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      for (var n = 0; n < total; n++) {
        // 화면 밖 슬라이드는 탭 순서에서 빼 둔다
        slides[n].inert = (n !== i);
        if (buttons[n]) buttons[n].setAttribute('aria-current', n === i ? 'true' : 'false');
      }
    }

    function restart() {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(i + 1); }, 6000);
    }

    var prev = host.querySelector('[data-mv-prev]');
    var next = host.querySelector('[data-mv-next]');
    if (prev) prev.addEventListener('click', function () { go(i - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(i + 1); restart(); });

    host.addEventListener('mouseenter', function () { clearInterval(timer); });
    host.addEventListener('mouseleave', restart);
    host.addEventListener('focusin', function () { clearInterval(timer); });
    host.addEventListener('focusout', restart);
    // 탭이 가려져 있는 동안 타이머를 돌릴 이유가 없다
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else restart();
    });

    swipe(host, function (dir) { go(i + dir); restart(); });

    go(0);
    restart();
  })();

  /* ── ② 제품 캐러셀 ──────────────────────────────────────── */
  (function products() {
    var host = document.querySelector('[data-pcar]');
    if (!host) return;
    var view = host.querySelector('.pcar__view');
    var track = host.querySelector('.pcar__track');
    var items = track ? track.children : null;
    if (!items || !items.length) return;

    var prev = host.querySelector('[data-pcar-prev]');
    var next = host.querySelector('[data-pcar-next]');
    var at = 0;

    function step() {
      // 아이템 폭 + 간격. 레이아웃에서 직접 재야 브레이크포인트마다 맞는다.
      var a = items[0].getBoundingClientRect();
      if (items.length < 2) return a.width;
      return items[1].getBoundingClientRect().left - a.left;
    }
    function perView() {
      var s = step();
      return s > 0 ? Math.max(1, Math.round(view.clientWidth / s)) : 1;
    }
    function maxAt() { return Math.max(0, items.length - perView()); }

    function apply() {
      at = Math.min(at, maxAt());
      track.style.transform = 'translate3d(' + (-at * step()) + 'px,0,0)';
      if (prev) prev.disabled = at <= 0;
      if (next) next.disabled = at >= maxAt();
    }

    if (prev) prev.addEventListener('click', function () { at -= 1; if (at < 0) at = 0; apply(); });
    if (next) next.addEventListener('click', function () { at += 1; apply(); });
    swipe(host, function (dir) { at += dir; if (at < 0) at = 0; apply(); });

    addEventListener('resize', apply, { passive: true });
    apply();
  })();

  /* ── 손가락으로 밀기 ────────────────────────────────────── */
  function swipe(el, onSwipe) {
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      // 세로로 더 많이 움직였으면 스크롤이지 스와이프가 아니다
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) onSwipe(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }
})();
