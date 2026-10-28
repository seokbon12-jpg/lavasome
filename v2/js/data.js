/* LAVASOME v2 — 화면에 들어가는 내용(문구·가격·이미지)은 모두 여기서 고친다.
   문구는 라이브(lavasome.co.kr, 2026-10-28 확인) 그대로. 새로 쓴 문구는 DESIGN_NOTES.md 「새 문구」 표에 있다.
   Cafe24로 옮길 때는 상품·쿠폰·인스타그램이 각 모듈 변수로 바뀐다(DESIGN_NOTES.md 「Cafe24 모듈 대응」). */
const SHOP = 'https://lavasome.co.kr';
const P = (slug, no) => `${SHOP}/product/${slug}/${no}/`;

window.LAVA = {
  band: '회원가입 후 포토후기 작성시 3000원 적립',
  bandHref: `${SHOP}/member/join.html`,

  nav: [
    { label: 'Shop',      href: `${SHOP}/product/list.html` },
    { label: '브랜드',     href: '../brand.html' },
    { label: '제품 사용법', href: '#ritual' },
    { label: '리뷰',       href: `${SHOP}/board/product/list.html?board_no=4` },
    { label: '이벤트',     href: '../notice.html' },
    { label: '고객센터',   href: '../faq.html' },
  ],

  /* 히어로 3장 — 순서·문구·버튼은 라이브 그대로 */
  slides: [
    {
      lang: 'en',
      title: 'Jeju-Origin Functional Base',
      lines: ['Built on Jeju-derived ingredients for balance and stability',
              'Designed for everyday skin condition care'],
      img: 'img/hero-01.jpg', alt: '라바섬 라인업 — 비타C 바이알, 퓨어 선스크린, 녹차잎 앰플 클렌저, 앰플 30ml 4종',
      pos: '50% 60%', href: '../brand.html',
    },
    {
      lang: 'ko',
      eyebrow: '산화 · 자극 부담은 낮추고, 결과는 빠르게 체감하는',
      title: '데일리 브라이트닝 앰플',
      mono: 'Balanced Vitamin C Formula 135,000ppm',
      lines: ['Effectiveness is not defined by strength, but by how it performs',
              'Precisely balanced for optimal activity'],
      img: 'img/hero-02.jpg', alt: '비타C 플러스 앰플 키트 — 바이알 4개, 어플리케이터 2개, 오프너, 사용 방법 안내',
      pos: '50% 50%', href: P('%EB%B9%84%ED%83%80c-%ED%94%8C%EB%9F%AC%EC%8A%A4-%EC%95%B0%ED%94%8C-5ml4ea-1box', 72),
    },
    {
      lang: 'ko',
      eyebrow: '민감한 피부를 진정시키는',
      title: '데일리 카밍 앰플',
      mono: 'Calming 50 Ampoule',
      lines: ['Designed to help restore skin balance with a calming-focused formulation',
              'Lightweight hydration and soothing care for sensitive, stressed skin'],
      /* 임시: 라인업 컷에서 카밍 50을 가운데 두고 자른 것. 라이브 원본(calming_no_text.jpg)을 받으면 교체 */
      img: 'img/hero-03.jpg', alt: '카밍 50 앰플 30ml, 양옆에 PDRN 1K와 글루타치온 앰플',
      pos: '50% 50%', href: P('%EC%B9%B4%EB%B0%8D-50-%EC%95%B0%ED%94%8C-30ml', 94), temp: true,
    },
  ],
  slideButton: 'Discover more',

  /* 라인 배너 — 라이브 띠 문구 */
  line: { name: 'Vita-C Plus Ampoule', mono: 'Balanced Vitamin C Formula', badge: '135,000ppm' },

  /* 피부 고민 필터 — 브랜드 프로필 10쪽 표 기준 매핑 */
  concerns: [
    { id: 'all',      label: '전체' },
    { id: 'moist',    label: '보습·장벽' },
    { id: 'calm',     label: '진정·민감' },
    { id: 'bright',   label: '미백·광채' },
    { id: 'firm',     label: '탄력·주름' },
    { id: 'cleanuv',  label: '클렌징·자외선' },
  ],

  /* 제품 7종 — 이름·부제·가격·할인율은 라이브 그대로(순서도 라이브 슬라이더 순서).
     rate: 라이브가 0%로 보여 주는 두 상품은 비워 둔다(계산한 값을 새로 만들지 않음).
     ends: 라이브에서 실제로 돌던 타이머만. Cafe24에서는 상품 할인 기간 변수로 바뀐다. */
  products: [
    { name: '퓨어 선스크린 35ml', sub: '바람결 퓨어 선스크린 - 공기같은 사용감의 수분핏 선크림',
      price: 39000, sale: 25000, rate: 36, img: 'img/p-sunscreen.jpg',
      tags: ['moist', 'calm', 'bright', 'cleanuv'], href: P('%ED%93%A8%EC%96%B4-%EC%84%A0%EC%8A%A4%ED%81%AC%EB%A6%B0-35ml', 55) },
    { name: '에이치에이 90 앰플 30ml', sub: '물빛결 수분 HA 앰플 - 속건조 완화, 피부 당김 개선',
      price: 48000, sale: 28800, rate: 40, img: 'img/p-ha90.jpg',
      tags: ['moist'], href: P('%EC%97%90%EC%9D%B4%EC%B9%98%EC%97%90%EC%9D%B4-90-%EC%95%B0%ED%94%8C-30ml', 97) },
    { name: '바쿠치올 5K 앰플 30ml', sub: '숲그늘 바쿠치올 앰플 - 안티에이징 솔루션',
      soldout: true, img: null,
      tags: ['firm'], href: P('%EB%B0%94%EC%BF%A0%EC%B9%98%EC%98%AC-5k-%EC%95%B0%ED%94%8C-30ml', 102) },
    { name: 'PDRN 1K 앰플 30ml', sub: '숨비온 리프트 PDRN 앰플 - 안티에이징 솔루션',
      price: 48000, sale: 28800, rate: 40, img: 'img/p-pdrn-1k.jpg', ends: '2026-10-31T23:59:59+09:00',
      tags: ['firm'], href: P('pdrn-1k-%EC%95%B0%ED%94%8C-30ml', 93) },
    { name: '녹차잎 앰플 클렌저 295ml', sub: '제주산책 앰플 클렌저 - 세안 후에도 촉촉한 앰플 클렌저',
      price: 48000, sale: 24000, rate: null, img: 'img/p-green-tea-cleanser.jpg', ends: '2026-10-31T23:59:59+09:00',
      tags: ['moist', 'calm', 'cleanuv'], href: P('%EB%85%B9%EC%B0%A8%EC%9E%8E-%EC%95%B0%ED%94%8C-%ED%81%B4%EB%A0%8C%EC%A0%80-295ml', 92) },
    { name: '비타C 플러스 앰플 5ml*4ea 1box', sub: '제주빛 비타C 앰플 - 순수비타민C 13.5% 화이트닝 앰플',
      price: 64000, sale: 39800, rate: null, img: 'img/p-vita-c-plus.jpg',
      tags: ['bright'], href: P('%EB%B9%84%ED%83%80c-%ED%94%8C%EB%9F%AC%EC%8A%A4-%EC%95%B0%ED%94%8C-5ml4ea-1box', 72) },
    { name: '카밍 50 앰플 30ml', sub: '비자림 카밍 앰플 - 피부 진정, 수분 충전',
      price: 48000, sale: 28800, rate: 40, img: 'img/p-calming-50.jpg',
      tags: ['calm'], href: P('%EC%B9%B4%EB%B0%8D-50-%EC%95%B0%ED%94%8C-30ml', 94) },
  ],
  productActions: ['옵션보기', '장바구니'],
  soldout: '일시품절',

  /* 시그니처 — 라이브 성분 카드 8장 문구 그대로 */
  formula: [
    { ko: '순수비타민C 13.5%', en: 'Calibrated Vitamin C', img: 'img/ing-vitc.jpg' },
    { ko: '미네랄 베이스',      en: 'Mineral Base',       note: '제주 용암해수',     img: 'img/ing-seawater.jpg' },
    { ko: '탄력 서포트',        en: 'Elasticity Support', note: '펩타이드',         img: 'img/ing-peptide.jpg' },
    { ko: '피부 진정',          en: 'Prickly Pear Calm',  note: '백년초 추출물',     img: 'img/ing-opuntia.jpg' },
    { ko: '보습 장벽',          en: 'Moisture Barrier',   note: '베타글루칸',        img: 'img/ing-betaglucan.jpg' },
    { ko: '맑은 광채',          en: 'Clear Radiance',     note: '글루타치온',        img: 'img/ing-glutathione.jpg' },
    { ko: '2중 안정화 기술',    note: '독자 더블 레이어 공법' },
    { ko: 'pH 3-4',            note: '비타민C 퍼포먼스 설계' },
  ],

  /* 사용법 — 비타C 플러스 키트 안내서 원문 */
  ritual: [
    { t: '오프너를 사용하여 앰플의 알루미늄 캡을 위로 올려 제거', n: '개봉 시 내용물이 튈 수 있으니 주의' },
    { t: '전용 어플리케이터를 앰플에 단단히 결합' },
    { t: '캡을 제거' },
    { t: '적당량을 덜어 피부에 고르게 펴 발라 흡수', n: '개봉 후에는 가급적 빠른 시일 내에 사용' },
  ],

  brand: { line: '정직한 성분, 자연스러운 변화', sub: '라바섬은 제주의 과학과 자연의 균형을 선사합니다.',
           link: 'Formulation First', href: '../brand.html' },

  /* 인스타그램 — 지금은 클라이언트 실사에서 자른 자리 표시(샘플). Cafe24 인스타그램 위젯으로 교체 */
  instagram: {
    handle: '@lavasome_official', title: '제주의 하루, 라바섬과 함께',
    href: 'https://www.instagram.com/lavasome_official/',
    items: ['img/ig-1.jpg', 'img/ig-2.jpg', 'img/ig-3.jpg', 'img/ig-4.jpg', 'img/ig-5.jpg', 'img/ig-6.jpg'],
  },

  coupon: {
    title: '라바섬 신규회원만을 위한 최대 30,000원 웰컴 혜택',
    items: [
      { name: '신규가입 쿠폰', amount: '5,000',  cond: '신규회원 전용' },
      { name: '쇼핑 쿠폰',     amount: '10,000', cond: '50,000원 이상 구매 시' },
      { name: 'BIG 쿠폰',     amount: '15,000', cond: '100,000원 이상 구매 시' },
    ],
    note: '라바섬 전 제품 사용 가능',
    href: `${SHOP}/member/join.html`,
    today: '오늘 하루 열지 않기', close: '닫기',
  },

  footer: {
    tagline: 'WHERE YOUR SKIN TAKES A BREATHER',
    tel: '1544-6743',
    hours: ['평일 09:00-18:00', '점심 12:00-13:00', '토/일/공휴일 휴무'],
    follow: [
      { label: 'KAKAO',     href: 'https://pf.kakao.com/_Gxfxclb' },
      { label: 'NAVER',     href: '#', todo: '네이버 주소 받기' },
      { label: 'INSTAGRAM', href: 'https://www.instagram.com/lavasome_official/' },
      { label: 'YOUTUBE',   href: 'https://www.youtube.com/@Lavasome_official' },
    ],
    links: [
      { label: '이용안내',       href: `${SHOP}/shopinfo/guide.html` },
      { label: '이용약관',       href: `${SHOP}/member/agreement.html` },
      { label: '개인정보취급방침', href: `${SHOP}/member/privacy.html` },
    ],
    biz: [
      ['상호', '주식회사 라바섬'], ['대표', '임희경'], ['사업자등록번호', '356-81-02119'],
      ['통신판매업신고', '제 2021-서울성북-0827 호'],
      ['주소', '서울특별시 성북구 한천로 553 (석관동) 4층'], ['전화', '1544-6743'],
      ['개인정보보호책임자', '선명원 (lavasome_korea@naver.com)'],
    ],
  },
};
