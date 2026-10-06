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
    }

    [].forEach.call(chips, function (c) {
      c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); });
    });
  });
})();
