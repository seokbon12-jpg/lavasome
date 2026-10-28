/* LAVASOME v2 — 그리기 + 동작. 프레임워크 없이, 스크롤 감지는 IntersectionObserver만 쓴다.
   모션은 섹션마다 한 번. html.is-static(?static · 동작 줄이기)이면 모두 최종 상태로 그린다. */
(() => {
  const D = window.LAVA;
  const root = document.documentElement;
  const STATIC = root.classList.contains('is-static');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const list = (k) => $(`[data-list="${k}"]`);
  const bind = (k) => $(`[data-bind="${k}"]`);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const ext = (h) => /^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '';
  const store = {
    get(k, s = localStorage) { try { return s.getItem(k); } catch { return null; } },
    set(k, v, s = localStorage) { try { s.setItem(k, v); } catch { /* 비공개 창 등 */ } },
  };
  const arrow = '<span class="more__a" aria-hidden="true">→</span>';

  /* ── 0. 띠 + GNB ─────────────────────────────────── */
  const band = bind('band');
  band.textContent = D.band; band.href = D.bandHref;
  if (store.get('lava-band', sessionStorage)) $('#band').hidden = true;
  $('.band__x').addEventListener('click', () => { $('#band').hidden = true; store.set('lava-band', '1', sessionStorage); });

  list('nav').innerHTML = D.nav.map((n) =>
    `<li><a href="${n.href}"${ext(n.href)}>${esc(n.label)}</a></li>`).join('');
  const menuBtn = $('.hd__menu');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    root.style.setProperty('--menu-top', $('#hd').getBoundingClientRect().bottom + 'px');
    root.classList.toggle('menu-open', open);
  });
  $$('#gnb a').forEach((a) => a.addEventListener('click', () => { if (root.classList.contains('menu-open')) menuBtn.click(); }));
  new IntersectionObserver(([e]) => $('#hd').classList.toggle('is-scrolled', !e.isIntersecting))
    .observe($('.top-sentinel'));

  /* ── 1. 히어로 ───────────────────────────────────── */
  const slides = D.slides;
  list('slides').innerHTML = slides.map((s, i) => `
    <article class="slide${i ? '' : ' is-on'}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${slides.length}"${i ? ' aria-hidden="true"' : ''}>
      <div class="slide__txt">
        ${s.eyebrow ? `<p class="slide__eyebrow">${esc(s.eyebrow)}</p>` : ''}
        <h${i ? 2 : 1} class="slide__t${s.lang === 'en' ? ' slide__t--en' : ''}"><span>${esc(s.title)}</span></h${i ? 2 : 1}>
        ${s.mono ? `<p class="slide__mono mono">${esc(s.mono)}</p>` : ''}
        <p class="slide__lines">${s.lines.map(esc).join('<br>')}</p>
        <a class="btn" href="${s.href}"${ext(s.href)}${i ? ' tabindex="-1"' : ''}>${esc(D.slideButton)}<span class="btn__a" aria-hidden="true">→</span></a>
      </div>
      <figure class="slide__fig">
        <div class="slide__frame"><img src="${s.img}" alt="${esc(s.alt)}" width="1086" height="1086" style="object-position:${s.pos}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></div>
      </figure>
    </article>`).join('');
  list('bars').innerHTML = slides.map((_, i) =>
    `<button type="button" class="bar" aria-label="${i + 1}번 슬라이드" data-to="${i}"><i></i></button>`).join('');
  bind('slideAll').textContent = String(slides.length).padStart(2, '0');

  const hero = $('#hero'); const sEls = $$('.slide', hero); const bars = $$('.bar', hero);
  let cur = 0, timer = null; const DUR = 6500;
  const show = (n) => {
    cur = (n + slides.length) % slides.length;
    sEls.forEach((el, i) => {
      const on = i === cur;
      el.classList.toggle('is-on', on);
      el.toggleAttribute('aria-hidden', !on);
      $('.btn', el).tabIndex = on ? 0 : -1;
    });
    bars.forEach((b, i) => { b.classList.toggle('is-on', i === cur); b.classList.toggle('is-done', i < cur); i === cur ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'); });
    bind('slideNow').textContent = String(cur + 1).padStart(2, '0');
    hero.style.setProperty('--dur', DUR + 'ms');
  };
  const play = () => { if (STATIC) return; stop(); hero.classList.add('is-playing'); timer = setTimeout(() => { show(cur + 1); play(); }, DUR); };
  const stop = () => { clearTimeout(timer); hero.classList.remove('is-playing'); };
  $$('[data-go]', hero).forEach((b) => b.addEventListener('click', () => { show(cur + +b.dataset.go); play(); }));
  bars.forEach((b) => b.addEventListener('click', () => { show(+b.dataset.to); play(); }));
  hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
  hero.addEventListener('focusin', stop); hero.addEventListener('focusout', play);
  let x0 = null;
  hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); play(); }
  });
  /* 화면 밖이면 자동 넘김 멈춤 */
  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop())).observe(hero);
  show(0);

  /* ── 1b. 라인 배너 ───────────────────────────────── */
  $('[data-line]').innerHTML = `<span class="line__in"><span class="line__name">${esc(D.line.name)}</span>
    <span class="line__mono mono">${esc(D.line.mono)}</span><b class="badge">${esc(D.line.badge)}</b>${arrow}</span>`;

  /* ── 2. 피부 고민 → 제품 ─────────────────────────── */
  list('concerns').innerHTML = D.concerns.map((c, i) =>
    `<button type="button" class="chip" data-c="${c.id}" aria-pressed="${!i}">${esc(c.label)}</button>`).join('');
  list('products').innerHTML = D.products.map((p, i) => {
    const price = p.soldout
      ? `<p class="price"><span class="price__so">${esc(D.soldout)}</span></p>`
      : `<p class="price"><s><span class="sr-only">정가 </span>${won(p.price)}</s> <span class="price__sale"><span class="sr-only">할인가 </span>${won(p.sale)}</span>${p.rate ? ` <span class="price__rate">${p.rate}%</span>` : ''}</p>`;
    const img = p.img
      ? `<img src="${p.img}" alt="" width="800" height="1000" loading="lazy">`
      : `<span class="slot mono" aria-hidden="true">IMAGE SLOT<br>제품컷 · 4:5</span>`;
    return `<li class="pc${p.soldout ? ' is-so' : ''}" data-i="${i}" data-tags="${p.tags.join(' ')}">
      <a class="pc__link" href="${p.href}"${ext(p.href)}>
        <div class="pc__img">${img}${p.soldout ? `<span class="pc__so mono">${esc(D.soldout)}</span>` : ''}</div>
        <p class="pc__meta mono">${p.ends ? `<span class="pc__cd" data-ends="${p.ends}"></span>` : '&nbsp;'}</p>
        <h3 class="pc__name">${esc(p.name)}</h3>
        <p class="pc__sub">${esc(p.sub)}</p>
        ${price}
      </a>
      <div class="pc__act">
        <a href="${p.href}"${ext(p.href)} aria-label="${esc(p.name)} ${D.productActions[0]}">${D.productActions[0]}</a>
        <a href="${p.href}"${ext(p.href)} aria-label="${esc(p.name)} ${D.productActions[1]}">${D.productActions[1]}</a>
      </div>
    </li>`;
  }).join('');

  const cards = $$('.pc');
  const pickConcern = (id) => {
    $$('.chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.c === id));
    list('products').classList.add('is-sorted');
    const hit = (el) => id === 'all' || el.dataset.tags.split(' ').includes(id);
    /* 맞는 카드를 앞으로(원래 순서 유지), 나머지는 흐리게 — 숨기지 않는다 */
    const sorted = [...cards].sort((a, b) => (hit(b) - hit(a)) || (a.dataset.i - b.dataset.i));
    sorted.forEach((el, n) => { el.style.order = n; el.classList.toggle('is-dim', !hit(el)); });
    const n = cards.filter(hit).length;
    const label = D.concerns.find((c) => c.id === id).label;
    bind('filterMsg').textContent = id === 'all' ? '전체 제품' : `${label} — 맞는 제품 ${n}개를 앞에 두었습니다`;
  };
  $$('.chip').forEach((c) => c.addEventListener('click', () => pickConcern(c.dataset.c)));

  const cds = $$('[data-ends]');
  const tick = () => {
    const now = Date.now();
    cds.forEach((el) => {
      let t = Math.max(0, Math.floor((Date.parse(el.dataset.ends) - now) / 1000));
      if (!t) { el.textContent = ''; return; }
      const d = Math.floor(t / 86400); t %= 86400;
      const p2 = (n) => String(n).padStart(2, '0');
      el.textContent = `${p2(d)}일 ${p2(Math.floor(t / 3600))}:${p2(Math.floor(t % 3600 / 60))}:${p2(t % 60)}`;
    });
  };
  if (cds.length) { tick(); setInterval(tick, 1000); }

  /* ── 3. 시그니처 ─────────────────────────────────── */
  const sig = slides[1];
  bind('sigEyebrow').textContent = sig.eyebrow;
  bind('sigTitle').textContent = sig.title;
  bind('sigMono').textContent = D.line.mono;
  bind('sigBadge').textContent = D.line.badge;
  bind('sigLines').innerHTML = sig.lines.map(esc).join('<br>');
  const horizon = '<svg class="hz" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 H150 C190 20 200 4 240 4 H400" pathLength="1"/></svg>';
  list('formula').innerHTML = D.formula.map((f, i) => `
    <li class="fm">
      ${horizon}
      <div class="fm__row">
        ${f.img ? `<img class="fm__img" src="${f.img}" alt="" width="400" height="400" loading="lazy">` : `<span class="fm__img fm__img--txt mono" aria-hidden="true">${esc(f.ko.startsWith('pH') ? 'pH' : '2×')}</span>`}
        <div class="fm__txt">
          <p class="fm__no mono">${String(i + 1).padStart(2, '0')}</p>
          <h3 class="fm__ko">${esc(f.ko)}</h3>
          <p class="fm__note">${[f.note, f.en].filter(Boolean).map((t, k) => k ? `<span class="mono">${esc(t)}</span>` : esc(t)).join('')}</p>
        </div>
      </div>
    </li>`).join('');
  list('ritual').innerHTML = D.ritual.map((r, i) => `
    <li class="step rise">
      <p class="step__no mono">STEP ${String(i + 1).padStart(2, '0')}</p>
      <p class="step__t">${esc(r.t)}</p>
      ${r.n ? `<p class="step__n">※ ${esc(r.n)}</p>` : ''}
    </li>`).join('');

  /* ── 4. 브랜드 한 줄: 단어 단위로 ───────────────────── */
  const words = (t) => t.split(' ').map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  bind('brandLine').innerHTML = words(D.brand.line);
  bind('brandSub').innerHTML = words(D.brand.sub);
  $$('.note__sub .w').forEach((w) => w.style.setProperty('--i', +w.style.getPropertyValue('--i') + 4));
  const bl = bind('brandLink'); bl.href = D.brand.href; bl.innerHTML = `${esc(D.brand.link)} ${arrow}`;

  /* ── 5. 인스타그램 ───────────────────────────────── */
  const ig = D.instagram;
  bind('igLabel').textContent = ig.handle.toUpperCase();
  bind('igTitle').textContent = ig.title;
  const il = bind('igLink'); il.href = ig.href; il.target = '_blank'; il.rel = 'noopener'; il.innerHTML = `${esc(ig.handle)} ${arrow}`;
  list('instagram').innerHTML = ig.items.map((src, i) => `
    <li><a href="${ig.href}" target="_blank" rel="noopener" aria-label="인스타그램 게시물 ${i + 1}">
      <img src="${src}" alt="" width="600" height="600" loading="lazy">
      <svg class="ig__i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg>
    </a></li>`).join('');

  /* ── 6. 푸터 ─────────────────────────────────────── */
  const F = D.footer;
  bind('tagline').textContent = F.tagline;
  bind('tel').innerHTML = `<a href="tel:${F.tel.replace(/-/g, '')}">${F.tel}</a>`;
  list('hours').innerHTML = F.hours.map((h) => `<li>${esc(h)}</li>`).join('');
  const lnk = (a) => `<li><a href="${a.href}"${ext(a.href)}${a.todo ? ` data-todo="${esc(a.todo)}"` : ''}>${esc(a.label)}</a></li>`;
  list('follow').innerHTML = F.follow.map(lnk).join('');
  list('links').innerHTML = F.links.map(lnk).join('');
  list('biz').innerHTML = F.biz.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

  /* ── 웰컴 쿠폰 ───────────────────────────────────── */
  const C = D.coupon, cp = $('#coupon');
  bind('cpTitle').textContent = C.title;
  bind('cpNote').textContent = C.note;
  list('coupons').innerHTML = C.items.map((c) => `
    <li><a class="cpn" href="${C.href}"${ext(C.href)}>
      <span class="cpn__name">${esc(c.name)}</span>
      <span class="cpn__amt"><b>${c.amount}</b>원</span>
      <span class="cpn__cond">${esc(c.cond)}</span>
    </a></li>`).join('');
  $('[data-cp="today"]').textContent = C.today;
  $('[data-cp="close"]').textContent = C.close;
  const today = new Date().toISOString().slice(0, 10);
  const closeCp = () => { cp.classList.remove('is-on'); setTimeout(() => { cp.hidden = true; }, STATIC ? 0 : 500); };
  $('[data-cp="today"]').addEventListener('click', () => { store.set('lava-cp-day', today); closeCp(); });
  $('[data-cp="close"]').addEventListener('click', () => { store.set('lava-cp', '1', sessionStorage); closeCp(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !cp.hidden) closeCp(); });
  /* 폰: 히어로를 가리지 않게 제목 한 줄로 먼저 보이고, 누르면 펼친다 */
  const cpOpen = $('.cp__open');
  const setPeek = (peek) => { cp.classList.toggle('is-peek', peek); cpOpen.setAttribute('aria-expanded', !peek); };
  const phone = matchMedia('(max-width: 760px)');
  setPeek(phone.matches);
  phone.addEventListener('change', (e) => setPeek(e.matches));
  cpOpen.addEventListener('click', () => { if (phone.matches) setPeek(!cp.classList.contains('is-peek')); });
  if (store.get('lava-cp-day') !== today && !store.get('lava-cp', sessionStorage) && !/[?&]nocoupon\b/.test(location.search)) {
    cp.hidden = false;
    if (STATIC) cp.classList.add('is-on');
    else setTimeout(() => cp.classList.add('is-on'), 1200);
  }

  /* ── 등장 모션: 섹션마다 한 번 ───────────────────── */
  if (STATIC) {
    $$('[data-reveal], .fm, [data-ink]').forEach((el) => el.classList.add('is-in'));
  } else {
    const once = (els, opt, cb) => {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return; io.unobserve(e.target); (cb || ((t) => t.classList.add('is-in')))(e.target);
      }), opt);
      els.forEach((el) => io.observe(el));
    };
    once($$('[data-reveal]'), { rootMargin: '0px 0px -12% 0px' });
    once($$('.fm'), { rootMargin: '0px 0px -30% 0px' });
    /* 읽히는 문장: 화면 62% 선을 지날 때 */
    once($$('[data-ink]'), { rootMargin: '0px 0px -38% 0px' });
  }

  /* 시그니처 인덱스: 지금 보는 막에 점 */
  const idx = $$('.idx a');
  const actIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) idx.forEach((a) => (a.dataset.act === e.target.dataset.actId ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('[data-act-id]').forEach((a) => actIO.observe(a));
  idx[0].setAttribute('aria-current', 'step');
  root.classList.add('is-ready');
})();
