/* ═══════════════════════════════════════════════════════════════════
   02 Ingredients — "현무암 위의 표본" (brand.html #ingredients)

   섹션을 화면에 멈추고(GSAP ScrollTrigger pin), 스크롤 진행도를 원료 번호로
   바꾼다. 고른 원료의 샬레는 렌즈 한가운데로 크게, 나머지는 궤도를 따라
   양옆 아래로 작아지며 물러난다. 뒤의 빛은 그 원료의 색(data-glow)으로.
   · 렌즈 눈금과 샬레 속 내용물은 스크롤에 맞춰 천천히 돈다(scrub).
   · 작은 샬레를 누르면 그 원료 자리로 스크롤한다.
   · 동작 줄이기 · GSAP 없음 → 아무것도 하지 않는다(CSS 기본 목록이 보인다).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var sec = document.querySelector('[data-lens]');
  if (!sec) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var items = Array.prototype.slice.call(sec.querySelectorAll('.spec'));
  var n = items.length;
  var now = sec.querySelector('.lens__now');
  var ticks = Array.prototype.slice.call(sec.querySelectorAll('.lens__rail i'));
  var rings = sec.querySelector('.lens__rings');
  var cur = -1;

  sec.classList.add('is-lens');

  /* 궤도 자리(단위: 큰 샬레 지름). |d| = 가운데서 몇 칸 떨어졌나 */
  var ORBIT = [
    { x: 0,    y: 0,    s: 1,   o: 1 },
    { x: .74,  y: .2,   s: .3,  o: .95 },
    { x: 1.06, y: .42,  s: .21, o: .6 },
    { x: 1.3,  y: .62,  s: .15, o: .28 },
    { x: 1.46, y: .8,   s: .1,  o: 0 }
  ];
  var phone = window.matchMedia('(max-width: 760px)');

  function place(i) {
    if (i === cur) return;
    cur = i;
    items.forEach(function (el, k) {
      var d = k - i, a = Math.min(Math.abs(d), ORBIT.length - 1), p = ORBIT[a];
      var side = d < 0 ? -1 : 1;
      // 폰은 화면이 좁아 궤도를 조금 접는다
      var fx = phone.matches ? .86 : 1;
      el.style.setProperty('--x', (side * p.x * fx).toFixed(3));
      el.style.setProperty('--y', p.y.toFixed(3));
      el.style.setProperty('--s', p.s);
      // 지나간 원료는 왼쪽 글 자리와 겹치지 않게 바로 옆 하나만 흐리게 남긴다
      el.style.setProperty('--o', d < 0 ? (a === 1 ? .55 : 0) : p.o);
      el.style.setProperty('--z', 10 - a);
      el.classList.toggle('is-on', d === 0);
    });
    now.textContent = (i < 9 ? '0' : '') + (i + 1);
    ticks.forEach(function (t, k) { t.classList.toggle('is-on', k <= i); });
    sec.style.setProperty('--glow', items[i].getAttribute('data-glow'));
  }
  place(0);

  var st = ScrollTrigger.create({
    trigger: sec,
    start: 'top top',
    end: function () { return '+=' + Math.round(window.innerHeight * 0.62 * (n - 1)); },
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    refreshPriority: 1,
    snap: {
      snapTo: 1 / (n - 1),
      duration: { min: 0.25, max: 0.6 },
      delay: 0.08,
      ease: 'power2.inOut'
    },
    onUpdate: function (self) {
      var p = self.progress;
      place(Math.round(p * (n - 1)));
      // 렌즈 눈금은 거꾸로, 샬레 속은 정방향으로 — 손으로 샬레를 돌려 보는 느낌
      rings.style.setProperty('--rot', (-p * 90).toFixed(2) + 'deg');
      sec.style.setProperty('--spin', (p * 160).toFixed(2) + 'deg');
    }
  });

  /* 작은 샬레를 누르면 그 원료로 */
  items.forEach(function (el, k) {
    el.querySelector('.spec__dish').addEventListener('click', function () {
      if (k === cur) return;
      var y = st.start + (st.end - st.start) * (k / (n - 1));
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  if (phone.addEventListener) phone.addEventListener('change', function () { var i = cur; cur = -1; place(i); });
})();
