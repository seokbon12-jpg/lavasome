/* ═══════════════════════════════════════════════════════════════════
   가로 슬라이더 두 개 — 메인 비주얼([data-mv])과 제품 캐러셀([data-pcar])

   외부 라이브러리 없이 transform 만 움직인다.
   · 메인 롤링 배너: 한 번에 한 장, 순환, 6.5초 자동 넘김(호버·포커스 중지).
     하단에 01 / 05 카운터와 칸별 진행 막대
   · 제품 캐러셀: 한 화면에 보이는 개수를 실제 아이템 폭에서 재서
     그만큼씩 민다. 순환하지 않고 양 끝에서 버튼이 죽는다.
     아래 진행 막대가 지금 보이는 구간을 보여준다.

   prefers-reduced-motion 이면 자동 넘김을 켜지 않는다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── ① 메인 롤링 배너 ──────────────────────────────────────
     하단 막대가 지금 위치(01 / 05)와 자동 넘김 진행을 함께 보여준다.
     진행 막대는 CSS 애니메이션 하나로 채우고(--mv-dur), 멈추면
     animation-play-state 만 바꾼다 — 타이머와 막대가 어긋나지 않게
     넘김 자체도 막대의 animationend 에 묶었다. */
  (function mainVisual() {
    var host = document.querySelector('[data-mv]');
    if (!host) return;
    var track = host.querySelector('.mv__track');
    var slides = track ? track.children : null;
    if (!slides || slides.length < 2) return;

    var DUR = 6500;
    host.style.setProperty('--mv-dur', DUR + 'ms');

    var bar = host.querySelector('[data-mv-dots]');
    var cur = host.querySelector('[data-mv-cur]');
    var tot = host.querySelector('[data-mv-total]');
    var total = slides.length;
    var i = 0;
    var paused = false;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (tot) tot.textContent = pad(total);

    var segs = [];
    if (bar) {
      for (var n = 0; n < total; n++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mv__seg';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', (n + 1) + '번 슬라이드');
        b.innerHTML = '<i></i>';
        b.addEventListener('click', (function (k) { return function () { go(k); }; })(n));
        bar.appendChild(b);
        segs.push(b);
      }
    }

    function go(k) {
      i = (k + total) % total;
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      for (var n = 0; n < total; n++) {
        var on = n === i;
        slides[n].classList.toggle('is-active', on);
        slides[n].inert = !on;                  // 화면 밖 슬라이드는 탭 순서에서 뺀다
        if (segs[n]) {
          segs[n].setAttribute('aria-selected', on ? 'true' : 'false');
          segs[n].classList.toggle('is-done', n < i);
          segs[n].classList.remove('is-on');
        }
      }
      if (cur) cur.textContent = pad(i + 1);
      // 진행 막대를 처음부터 다시 — 클래스를 뗐다 붙여 애니메이션을 재시작한다
      if (segs[i]) { void segs[i].offsetWidth; segs[i].classList.add('is-on'); }
    }

    // 막대가 다 차면 다음 장으로
    if (!reduced) {
      host.addEventListener('animationend', function (e) {
        if (e.target.parentNode && e.target.parentNode.classList.contains('is-on')) go(i + 1);
      });
    } else {
      host.classList.add('is-static');
    }

    function pause(v) { paused = v; host.classList.toggle('is-paused', v); }
    host.addEventListener('mouseenter', function () { pause(true); });
    host.addEventListener('mouseleave', function () { pause(false); });
    host.addEventListener('focusin', function () { pause(true); });
    host.addEventListener('focusout', function () { pause(false); });
    document.addEventListener('visibilitychange', function () { pause(document.hidden); });

    var prev = host.querySelector('[data-mv-prev]');
    var next = host.querySelector('[data-mv-next]');
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    swipe(host, function (dir) { go(i + dir); });

    host.classList.add('is-ready');   // 카피 등장 효과는 JS 가 돌 때만
    go(0);
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
    var bar = host.querySelector('[data-pcar-bar]');
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
      // 진행 막대: 보이는 구간의 폭과 위치를 그대로 옮긴다
      if (bar) {
        var n = items.length, pv = Math.min(perView(), n);
        bar.style.width = (pv / n * 100) + '%';
        bar.style.left = (at / n * 100) + '%';
      }
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
