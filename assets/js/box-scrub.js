/* ═══════════════════════════════════════════════════════════════════
   박스 오프닝 — 스크롤 스크럽 (GSAP ScrollTrigger)

   프레임: ffmpeg 로 뽑은 WebP 시퀀스
     assets/img/box/desktop/001..121.webp   (1320x1796)
     assets/img/box/mobile/001..041.webp    (880x1197, 1/3 로 솎음)

   · 섹션을 pin 하고 스크롤 진행도(0→1)를 프레임 인덱스에 매핑
   · 모바일은 프레임 수를 줄여 로드
   · prefers-reduced-motion 이면 pin·스크럽 없이 마지막 프레임만 정적 표시
   · 아티팩트 빌드에서는 window.__BOX_FRAMES__ 에 data URI 배열이 주입된다
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var host = document.querySelector('[data-box-scrub]');
  if (!host) return;

  var canvas = host.querySelector('.boxopen__canvas');
  var stage = host.querySelector('.boxopen__stage');
  var side = host.querySelector('.boxopen__side');
  if (!canvas || !stage) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 760px)').matches;

  /* 2단(용기 왼쪽 · 카피 오른쪽)을 쓸 수 있는 화면인지.
     ⚠️ box-scrub.css 의 쌓기 미디어쿼리와 같은 조건이어야 한다.
     둘이 어긋나면 쌓인 배치인데 카피가 숨은 채로 남는다. */
  var stackQuery = window.matchMedia('(max-width: 1080px), (max-height: 640px)');
  var stacked = stackQuery.matches;
  host.classList.toggle('is-stacked', stacked);

  /* 스크롤 진행도에 맞춰 켜지는 오른쪽 블록들.
     등장 시점은 마크업의 data-at(0~1). 전부 0.7 이전이라 박스가
     다 열릴 때는 이미 모두 켜져 있다. */
  var steps = [];
  Array.prototype.forEach.call(host.querySelectorAll('[data-step]'),
    function (el) {
      steps.push({ el: el, at: parseFloat(el.dataset.at || '0'), on: false });
    });

  function syncSteps(p) {
    if (stacked) return;                    // 쌓인 배치는 CSS 가 전부 보여준다
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i], want = p >= s.at;
      if (want === s.on) continue;          // 바뀔 때만 건드린다
      s.on = want;
      s.el.classList.toggle('is-on', want);
    }
  }

  var BG = '#F2F1ED';                       // 영상 배경색
  var DESKTOP = { dir: 'desktop', count: 121 };
  var MOBILE = { dir: 'mobile', count: 41 };
  var set = isMobile ? MOBILE : DESKTOP;

  // 아티팩트 빌드는 프레임을 data URI 로 심어 넣는다.
  var injected = window.__BOX_FRAMES__;
  var urls;
  if (injected && injected[set.dir] && injected[set.dir].length) {
    urls = injected[set.dir];
  } else {
    urls = [];
    for (var i = 1; i <= set.count; i++) {
      urls.push('assets/img/box/' + set.dir + '/' +
        (i < 10 ? '00' : i < 100 ? '0' : '') + i + '.webp');
    }
  }
  var total = urls.length;

  var frames = new Array(total);
  var current = -1;

  /* ── 캔버스 크기 (DPR 상한 2) ─────────────────────────────── */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(stage.clientWidth * dpr));
    var h = Math.max(1, Math.round(stage.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    return true;
  }

  /* ── 한 프레임 그리기 (contain) ───────────────────────────── */
  function paint(idx) {
    var img = frames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    var s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    current = idx;
  }

  function show(idx) {
    idx = Math.max(0, Math.min(total - 1, idx | 0));
    if (idx === current) return;
    paint(idx);
  }

  function load(idx) {
    if (frames[idx]) return frames[idx];
    var img = new Image();
    img.decoding = 'async';
    img.src = urls[idx];
    frames[idx] = img;
    return img;
  }

  /* ── 모션 최소화: 마지막 프레임 한 장만 ───────────────────── */
  if (reduced) {
    resize();
    var lastImg = load(total - 1);
    var drawLast = function () { resize(); paint(total - 1); };
    if (lastImg.complete && lastImg.naturalWidth) drawLast();
    else lastImg.addEventListener('load', drawLast);
    addEventListener('resize', drawLast, { passive: true });
    host.classList.add('is-done');
    return;
  }

  /* ── 프레임 프리로드 (앞에서부터, 동시 6개) ───────────────── */
  var loaded = 0, next = 0;
  function pump() {
    while (next < total && next - loaded < 6) load(next++).addEventListener(
      'load', onOne, { once: true });
    // 실패해도 진행이 막히지 않게
    if (next >= total) return;
  }
  function onOne() {
    loaded++;
    if (loaded === 1) { resize(); paint(0); }
    pump();
    if (loaded >= total) start();
  }
  // 첫 프레임은 즉시
  var first = load(0);
  first.addEventListener('load', function () { resize(); paint(0); pump(); },
    { once: true });
  first.addEventListener('error', function () { pump(); }, { once: true });
  if (first.complete && first.naturalWidth) { resize(); paint(0); pump(); }

  // 전부 못 받아도 일정 시간 뒤에는 스크럽을 켠다(느린 회선 대비)
  var started = false;
  setTimeout(function () { if (!started) start(); }, 2500);

  /* ── ScrollTrigger 로 pin + 스크럽 ────────────────────────── */
  function start() {
    if (started) return;
    started = true;
    if (!window.gsap || !window.ScrollTrigger) {
      // GSAP 가 없으면 마지막 프레임만 보여주고 끝낸다
      show(total - 1);
      host.classList.add('is-done');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    host.classList.add('is-scrub');   // 이게 붙어야 오른쪽 블록이 숨는다

    var tween = null;

    function build() {
      // 2단일 때는 카피가 다 등장할 시간이 필요해서 더 길게 끈다.
      var travel = stacked ? (isMobile ? 160 : 200) : 300;
      var state = { f: 0 };
      tween = gsap.to(state, {
        f: total - 1,
        ease: 'none',
        onUpdate: function () { show(Math.round(state.f)); },
        scrollTrigger: {
          trigger: stacked ? side : host,
          start: 'top top',
          end: '+=' + travel + '%',
          pin: true,
          pinSpacing: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            host.classList.toggle('is-done', self.progress > 0.06);
            syncSteps(self.progress);
          }
        }
      });
    }
    build();

    /* 창을 늘였다 줄였다 하며 2단↔쌓기를 넘나들면 pin 대상과 길이가
       달라진다. 그냥 두면 쌓인 배치인데 카피가 숨은 채로 남는다. */
    function onModeChange() {
      var now = stackQuery.matches;
      if (now === stacked) return;
      stacked = now;
      host.classList.toggle('is-stacked', stacked);
      steps.forEach(function (s) { s.on = false; s.el.classList.remove('is-on'); });
      if (tween && tween.scrollTrigger) tween.scrollTrigger.kill(true);
      if (tween) tween.kill();
      build();
      ScrollTrigger.refresh();
    }
    if (stackQuery.addEventListener) {
      stackQuery.addEventListener('change', onModeChange);
    } else if (stackQuery.addListener) {
      stackQuery.addListener(onModeChange);          // 구형 사파리
    }

    addEventListener('resize', function () {
      if (resize()) paint(current < 0 ? 0 : current);
    }, { passive: true });
  }
})();
