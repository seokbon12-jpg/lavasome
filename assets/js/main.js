/* LAVASOME — 메인페이지 인터랙션
   외부 라이브러리 없음. 페이드 + 살짝 슬라이드만. 바운스·일래스틱 없음. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 헤더: 스크롤 시 배경 살짝 불투명 ───────────────────── */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onStuck();
    addEventListener('scroll', onStuck, { passive: true });
  }

  /* ── 스크롤 리빌 ─────────────────────────────────────────── */
  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // 양방향: 들어오면 떠오르고, 벗어나면 다시 가라앉는다.
    // (한 번만 보이게 하려면 unobserve 로 바꾸면 된다)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('is-in', e.isIntersecting);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });

    // 앵커로 한 번에 멀리 점프하면(푸터의 #ingredients 등) 옵저버가
    // 그 프레임을 건너뛰어 해당 섹션이 빈 채로 남는 경우가 있다.
    // 점프 직후에는 위치를 직접 재서 맞춰 준다.
    var syncReveals = function () {
      var vh = window.innerHeight;
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect();
        el.classList.toggle('is-in', r.top < vh * 0.9 && r.bottom > 0);
      });
    };
    addEventListener('hashchange', syncReveals);
    addEventListener('load', syncReveals);
    if (location.hash) setTimeout(syncReveals, 60);
  }

  /* ── S3 제형 360° (스크롤 연동) ──────────────────────────
     지금은 SVG 오브제를 회전시키는 대체 구현.
     실제 360° 시퀀스를 받으면 .spin 에 아래 두 속성만 추가하면
     이미지 시퀀스 모드로 자동 전환된다.
       data-frames="assets/img/spin/{i}.webp"   ({i} = 1..N)
       data-frame-count="36"
  ------------------------------------------------------------ */
  var spin = document.querySelector('[data-spin]');
  if (spin && !reduced) {
    var tpl = spin.getAttribute('data-frames');
    var count = parseInt(spin.getAttribute('data-frame-count'), 10);
    var frames = null;
    var imgEl = null;

    if (tpl && count > 0) {
      frames = [];
      for (var i = 1; i <= count; i++) {
        var src = tpl.replace('{i}', i);
        var im = new Image();
        im.src = src;
        frames.push(src);
      }
      imgEl = document.createElement('img');
      imgEl.className = 'spin__obj';
      imgEl.alt = '';
      imgEl.src = frames[0];
      var stage = spin.querySelector('.spin__stage');
      stage.innerHTML = '';
      stage.appendChild(imgEl);
    }

    var obj = spin.querySelector('.spin__obj');
    var ticking = false;

    var draw = function () {
      ticking = false;
      var r = spin.getBoundingClientRect();
      var vh = window.innerHeight;
      // 오브제가 뷰포트를 통과하는 동안 0 → 1
      var p = (vh - r.top) / (vh + r.height);
      p = Math.min(1, Math.max(0, p));

      if (frames) {
        var idx = Math.min(frames.length - 1, Math.round(p * (frames.length - 1)));
        if (imgEl.getAttribute('src') !== frames[idx]) imgEl.src = frames[idx];
      } else if (obj) {
        obj.style.setProperty('--spin', (p * 360).toFixed(1) + 'deg');
        var gloss = obj.querySelector('.spin__gloss');
        if (gloss) gloss.style.opacity = (0.12 + Math.abs(Math.cos(p * Math.PI * 2)) * 0.34).toFixed(2);
      }
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };

    draw();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
  }

  /* ── S1 히어로 시차(패럴랙스) ────────────────────────────
     배경과 사진 세 장이 서로 다른 비율로 움직여 층이 갈린다.
     data-parallax 값: 양수면 스크롤을 느리게 따라오고(뒤로 물러남),
     음수면 페이지보다 빨리 올라간다(앞으로 다가옴). */
  var hero = document.querySelector('.hero');
  if (hero && !reduced) {
    var layers = [].slice.call(hero.querySelectorAll('[data-parallax]')).map(function (el) {
      return { el: el, rate: parseFloat(el.getAttribute('data-parallax')) || 0 };
    });

    var pTicking = false;
    var paint = function () {
      pTicking = false;
      var y = window.scrollY;
      // 히어로가 화면을 벗어나면 계산을 멈춘다
      if (y > hero.offsetHeight) return;
      layers.forEach(function (l) {
        l.el.style.transform = 'translate3d(0,' + (y * l.rate).toFixed(2) + 'px,0)';
      });
    };
    var onP = function () {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(paint);
    };
    paint();
    addEventListener('scroll', onP, { passive: true });
    addEventListener('resize', onP, { passive: true });
  }

  /* 사진이 아직 없으면 깨진 이미지 대신 자리표시 배경만 남긴다 */
  [].forEach.call(document.querySelectorAll('.hero img'), function (img) {
    img.addEventListener('error', function () { img.remove(); });
    if (img.complete && img.naturalWidth === 0) img.remove();
  });

  /* ── S7 리뷰 스크롤러 — 좌→우 자동 흐름(마퀴) ────────────────
     타일을 여러 벌 복제해 이어 붙이고 translateX 를 계속 밀어 끊김 없이
     흐르게 한다. 마우스를 올리거나 포커스가 들어오면 멈춘다(읽을 수 있게).
     탭이 가려지거나 섹션이 화면 밖이면 루프를 멈춘다.
     prefers-reduced-motion 이면 복제하지 않고 직접 스크롤(CSS)로 둔다. */
  var sc = document.querySelector('[data-scroller]');
  var track = sc && sc.querySelector('.scroller__track');
  if (sc) {
    sc.setAttribute('role', 'region');
    sc.setAttribute('aria-label', '후기와 이야기');
  }
  if (track && !reduced) {
    var originals = [].slice.call(track.children);

    // 스크린리더에는 감춘 복제본을 이어 붙인다.
    function appendSet() {
      originals.forEach(function (li) {
        var clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        [].forEach.call(clone.querySelectorAll('a, button, [tabindex]'), function (el) {
          el.tabIndex = -1;
        });
        track.appendChild(clone);
      });
    }
    appendSet();  // 최소 2벌

    // 한 벌의 반복 폭 = 첫 원본과 첫 복제본 사이 거리(간격 포함).
    var setWidth = 0;
    function measure() {
      var first = track.children[0];
      var firstClone = track.children[originals.length];
      setWidth = firstClone ? (firstClone.offsetLeft - first.offsetLeft) : 0;
    }
    measure();

    // 넓은 화면에서 한 벌로 못 채우면 벌을 더 붙인다(빈 틈 방지).
    var guard = 8;
    while (setWidth > 0 && track.scrollWidth < window.innerWidth + setWidth * 2 && guard-- > 0) {
      appendSet();
    }

    var pos = -setWidth;        // 좌→우: -setWidth → 0 으로 밀린다
    var speed = 28;             // px/초 — "천천히"
    var last = 0, raf = 0, paused = false, onScreen = true;

    function frame(now) {
      raf = 0;
      if (paused || !onScreen || document.hidden || setWidth <= 0) return;
      if (!last) last = now;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      pos += speed * dt;
      if (pos >= 0) pos -= setWidth;
      track.style.transform = 'translate3d(' + pos.toFixed(2) + 'px,0,0)';
      raf = requestAnimationFrame(frame);
    }
    function run() {
      if (paused || !onScreen || document.hidden) return;
      if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
    }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    // 읽을 수 있게 — 마우스오버·포커스 시 정지
    sc.addEventListener('mouseenter', function () { paused = true; stop(); });
    sc.addEventListener('mouseleave', function () { paused = false; run(); });
    sc.addEventListener('focusin', function () { paused = true; stop(); });
    sc.addEventListener('focusout', function () { paused = false; run(); });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else run();
    });
    if ('IntersectionObserver' in window) {
      onScreen = false;
      new IntersectionObserver(function (es) {
        onScreen = es[0].isIntersecting;
        onScreen ? run() : stop();
      }, { rootMargin: '80px' }).observe(sc);
    }
    addEventListener('resize', function () {
      var prev = setWidth;
      measure();
      if (prev > 0 && setWidth > 0) pos = pos / prev * setWidth;  // 진행 비율 유지
      if (pos >= 0) pos -= setWidth;
    }, { passive: true });

    track.style.transform = 'translate3d(' + pos.toFixed(2) + 'px,0,0)';
    run();
  }

  /* ── 푸터 연도 ───────────────────────────────────────────── */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
