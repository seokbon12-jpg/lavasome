/* ═══════════════════════════════════════════════════════════════════
   분류 칩 — 전체 제품(피부 고민) · FAQ(질문 분류)

   [data-filter-root] 안의 .chip[data-filter] 를 누르면 같은 root 안에서
   data-cat 이 맞는 항목만 남긴다. "all" 은 전부. 주소에 #id 가 있으면
   (홈의 "제품 보기"로 들어온 경우) 필터를 건드리지 않고 그 카드로 간다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  [].forEach.call(document.querySelectorAll('[data-filter-root]'), function (root) {
    var chips = root.querySelectorAll('.chip[data-filter]');
    var items = root.querySelectorAll('[data-cat]');
    var count = root.querySelector('[data-filter-count]');

    function apply(key) {
      var n = 0;
      [].forEach.call(items, function (el) {
        var show = key === 'all' || el.getAttribute('data-cat') === key;
        el.hidden = !show;
        if (show) n++;
      });
      [].forEach.call(chips, function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-filter') === key ? 'true' : 'false');
      });
      if (count) count.textContent = n;
      // 해당 분류가 비었을 때 보여 줄 문구(있으면)
      [].forEach.call(root.querySelectorAll('[data-empty-for]'), function (el) {
        el.hidden = !(n === 0 && el.getAttribute('data-empty-for') === key);
      });
    }

    [].forEach.call(chips, function (c) {
      c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); });
    });
    // 처음 눌려 있는 칩 기준으로 한 번 적용 — "전체"가 없는 목록(이벤트)도 있다
    var on = root.querySelector('.chip[aria-pressed="true"]');
    if (on) apply(on.getAttribute('data-filter'));
  });

  /* ── "더 보기" — [data-more-list] 의 카드가 PAGE 개를 넘으면 나머지를 접어 둔다 ── */
  [].forEach.call(document.querySelectorAll('[data-more-list]'), function (list) {
    var PAGE = 9;
    var btn = list.parentNode.querySelector('[data-more]');
    var items = list.children;
    var shown = PAGE;
    function fold() {
      for (var i = 0; i < items.length; i++) items[i].classList.toggle('is-folded', i >= shown);
      if (btn) btn.hidden = items.length <= shown;
    }
    if (btn) btn.addEventListener('click', function () { shown += PAGE; fold(); });
    fold();
  });
})();
