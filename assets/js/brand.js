/* ═══════════════════════════════════════════════════════════════════
   브랜드 페이지 — 숫자 카운트업

   .cu 의 data-count 에 실제 값을 넣으면 스크롤 진입 시 0부터 올라간다.
   값이 없거나 0 이면 마크업의 대시를 그대로 두고 손대지 않는다.
   검증되지 않은 숫자를 화면에 띄우지 않기 위해서다.

     <span class="cu" data-count="37" data-suffix="">—</span>

   prefers-reduced-motion 이면 애니메이션 없이 최종값만 찍는다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var nums = [].slice.call(document.querySelectorAll('.cu'));
  if (!nums.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(el, v) {
    el.textContent = v.toLocaleString() + (el.getAttribute('data-suffix') || '');
  }

  function run(el) {
    var to = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (!to) return;                       // 값 미정 — 대시를 유지한다
    if (reduced) { render(el, to); return; }

    var t0 = null;
    requestAnimationFrame(function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1100);
      k = 1 - Math.pow(1 - k, 3);          // ease-out cubic
      render(el, Math.round(to * k));
      if (k < 1) requestAnimationFrame(step);
    });
  }

  if (!('IntersectionObserver' in window)) {
    nums.forEach(run);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target);
    });
  }, { threshold: 0.4 });

  nums.forEach(function (n) { io.observe(n); });
})();
