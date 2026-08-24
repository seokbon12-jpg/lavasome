# LAVASOME — 메인페이지

정적 사이트 (HTML/CSS/JS). 외부 라이브러리는 스크럽용 GSAP 하나뿐이고,
CDN 없이 `assets/vendor/` 에 넣어 씁니다. 스펙 원본은 [`docs/handoff.md`](docs/handoff.md).

```
index.html
assets/css/   styles.css · shader-bg.css · box-scrub.css
assets/js/    main.js · shader-bg.js · box-scrub.js
assets/vendor/gsap.min.js · ScrollTrigger.min.js
assets/img/   hero/ · box/
```

로컬에서 보기: `python3 -m http.server 8000` 후 `http://localhost:8000`

8섹션 구현: Hero · Our Formulas · **박스 오프닝(스크럽)** · Formulation First(메커니즘) ·
Jeju-Origin · Gentle Efficacy · Ingredient Cards · Reviews & Stories · Brand Closing.

톤은 저채도 화이트–그레이. 노란빛은 실제 제형 사진에서만 나오게 두고,
UI는 뉴트럴로 유지합니다.

스크롤 리빌은 **양방향**입니다 — 화면에 들어오면 떠오르고 벗어나면 다시
가라앉습니다. 한 번만 나타나게 하려면 `main.js` 의 IntersectionObserver 에서
`classList.toggle` 을 `add` + `unobserve` 로 바꾸면 됩니다.

---

## 폰트 — 지금은 임시

Adobe Fonts 킷 `zhv7ywn` 링크는 `index.html` 에 **이미 물려 있습니다.**
다만 이 개발 환경은 `use.typekit.net` 이 막혀 있어 프리뷰에서는 폴백이 뜹니다.
대표 로컬·라이브에서는 킷 서체가 그대로 적용됩니다.

| 용도 | 토큰 | 확정 (킷) | 프리뷰 폴백 |
|---|---|---|---|
| 영문 큰 타이틀 | `--font-title` | garamond-premier-pro 300 | Cormorant Garamond 300 |
| 영문 작은 라벨·넘버링 | `--font-label` | **nitti-typewriter-normal 400** | Courier Prime 400 |
| 영문 수치·워드마크 | `--font-display` | garamond-premier-pro | EB Garamond |
| 한글 헤드라인 | `--font-kr-head` | 미정 | Gowun Batang |
| 한글 본문 | `--font-kr-body` | 미정 | Noto Serif KR |

`--font-label` 이 걸리는 곳: 히어로 eyebrow, 섹션 넘버(01·02), SHOP, Best 태그,
벤핏 영문(Brightening 등), 성분 영문명, 감각 라벨, 푸터 메뉴 제목.
수치(13.5% / 135,000ppm)와 워드마크는 가라몬드로 남겨뒀습니다 — 모노로 바꾸면
수치의 무게감이 죽습니다. 원하시면 옮기겠습니다.

**교체 방법 — 두 군데만 고치면 끝입니다.**

타이틀 웨이트는 `--w-title: 300` 으로 잡혀 있습니다. 큰 타이틀만 `--font-title`,
라벨·수치는 `--font-display` 로 분리해뒀는데, 확정 서체로 넘어가면 둘 다 같은
패밀리를 쓰되 옵티컬 사이즈만 다르게 지정하면 됩니다.

> 프리뷰 대체본이 EB Garamond 이 아니라 Cormorant Garamond 인 이유:
> EB Garamond 은 wght 축이 400~800 이라 Regular 보다 얇아지지 않습니다.

킷 서체 이름이 이미 각 토큰 맨 앞에 있어서 **추가 작업은 없습니다.**
한글 명조를 구하시면 `--font-kr-head` / `--font-kr-body` 맨 앞에 이름만 넣으면 됩니다.

⚠️ Typekit 킷은 **도메인 잠금**입니다. 킷 설정에 `localhost` 와 라이브 도메인이
둘 다 등록돼 있어야 합니다.

---

## 아직 자리표시인 것 (배포 전 교체 필수)

HTML에서 `data-placeholder` 속성으로 전부 표시해뒀습니다.

- **히어로 4장**(`hero/`) · **제주 3장**(`jeju/`) · **샬레 6장**(`chalet/`) ·
  **제품컷 6종**(`products/`) 모두 들어왔습니다. 남은 자리표시는 **리뷰 타일 이미지**뿐입니다.

  제품컷은 UUID 파일명으로 올라와 라벨을 읽어 매칭했습니다. 요청하신
  `public/images/products/` 대신 기존 규칙에 맞춰 `assets/img/products/` 에 뒀습니다
  (프로젝트에 `public/` 이 없습니다). PNG 5.4 MB → JPEG 0.2 MB.

  제주 3장은 파일명 순서와 배치 순서가 달라 **내용 기준으로 매핑**했습니다.
  | 원본 | 배치 |
  |---|---|
  | `무제-1-02` 페트리+용암석 | `jeju-01-seawater.jpg` (용암해수) |
  | `무제-1-03` 백년초 | `jeju-02-opuntia.jpg` (백년초) |
  | `무제-1-01` 실험기구 선반 | `jeju-03-lab.jpg` (연구소 협력) |

  원본은 `assets/img/jeju/original/` 에 보관돼 있습니다. 다른 사진으로 교체할 때
  비율이 1182×1475 와 다르면 `.jeju__img` 의 `aspect-ratio` 도 같이 고쳐야 합니다.
- **S7 리뷰 전부** — 실제 리뷰가 없어서 문구를 지어내지 않았습니다. 타일 구조만 잡아뒀습니다.
  자사몰·와디즈에서 **닉네임·출처가 확인되는 리뷰만** 넣으세요.
- **섹션 02 의 360° 시퀀스** — 지금은 SVG 오브제를 스크롤에 맞춰 돌리는 대체 구현입니다.
  실제 시퀀스를 받으면 `.spin` 에 두 속성만 추가하면 자동 전환됩니다.
  ```html
  <figure class="spin" data-spin data-frames="assets/img/spin/{i}.webp" data-frame-count="36">
  ```
- **카피** — 히어로·클로징 외에는 상세페이지 원문을 받지 못해 스펙 요약을 근거로 초안을 썼습니다.
  상세페이지 원문으로 교체하세요.

## 표기 관련

- 미백·주름개선 등 **기능성 라벨은 심사 근거가 확인된 제품에만** 노출하세요.
  해당 위치에 HTML 주석으로 표시해뒀습니다.
- 인체적용시험 만족도 조사·수상·입점을 다루던 Brand Proof 섹션은 요청에 따라 삭제했습니다.
  다시 넣을 때는 "만족도 조사" 표기와 면책 문구를 함께 복원하세요.

## 셰이더 배경 (성분 섹션) — 되돌리기 쉽게 격리해 뒀습니다

성분 섹션(`#ingredients`) 배경에 WebGL "Smoke" 플로우 셰이더가 깔리고,
그 위에 **샬레 표본 6개가 떠 있습니다**(시안 B 채택). 물을 깊게 내려 대비를
확보했기 때문에 유리판 없이 물 위에 바로 얹습니다.
셰이더는 21st.dev Shader Builder 레시피 값 그대로이고, 커서 반응은 꺼져 있습니다.

**전부 이 두 파일 안에만 있습니다.**

```
assets/css/shader-bg.css   .has-shader-bg 안으로만 스코프됨
assets/js/shader-bg.js     셰이더 + 마운트 로직
```

유리 굴절용 SVG 필터(`#glass-distortion`)는 성분 섹션 안에 인라인으로 두었습니다.
섹션을 지우면 필터도 같이 사라집니다.

### 구성

- 셰이더 캔버스에 `brightness(.94)` 를 걸어 물을 깊게 내림
- `::before` 베일에 방사형 + 세로 그라디언트를 겹쳐 중앙만 살짝 밝게
- `.spec__dish::before` 광륜 — 표본이 물 위에 떠 보이게
- 행간은 요소별로 따로 잡음(`.spec h3` 1.3 / `.spec__d` 1.6). body 의 1.75 를
  그대로 쓰면 한 줄짜리들이 흩어져 보입니다.

**대비는 렌더 픽셀로 측정했습니다.** 흰 글자 기준 11~15:1 로 WCAG AA(4.5:1)를
넉넉히 넘깁니다. 물을 다시 밝히실 거면 이 값이 먼저 떨어집니다.

유리 카드(시안 A)는 `proposals/ingredients.html` 에 그대로 남아 있습니다.

### 끄는 법 — 셋 중 아무거나

1. **커밋 되돌리기 (제일 깔끔)**
   ```
   git revert $(git log --format=%H --grep="smoke shader" -1)
   ```
   (해시를 직접 적어두면 리베이스·수정 때마다 어긋나서, 메시지로 찾게 해뒀습니다.)
2. **`index.html` 에서 세 군데만 삭제**
   `shader-bg.css` 링크 / `shader-bg.js` 스크립트 / 성분 섹션의 `data-shader-bg` 속성
3. **속성만 빼기** — `data-shader-bg` 하나만 지워도 캔버스가 안 붙고,
   `.has-shader-bg` 클래스가 없으니 CSS도 전부 무효가 됩니다. 파일은 남습니다.

어느 쪽이든 다른 섹션에는 영향이 없습니다.

### 세기 조절

물결 밝기는 두 곳에서 정해집니다.

- `.shader-bg__canvas` 의 `filter: saturate(1.12) brightness(.94)` — 물빛 자체
- `.has-shader-bg::before` 베일 — 방사형(중앙 `.30` → 가장자리 `.70`)과
  세로 그라디언트(`.70 / .60 / .74`)가 겹칩니다. 낮출수록 물결이 밝아집니다.

색·속도는 `shader-bg.js` 상단 상수에 모여 있습니다.
물을 밝히면 흰 글자 대비가 먼저 떨어지니 함께 확인하세요.

### 동작 조건

- WebGL 컨텍스트를 못 만들면 아무것도 하지 않습니다 (원래 흰 배경 유지)
- 탭이 가려지거나 섹션이 화면 밖이면 렌더 루프를 멈춥니다
- `prefers-reduced-motion` 이면 첫 프레임 한 장만 그리고 정지합니다
- devicePixelRatio 는 2 로 상한

## 박스 오프닝 스크롤 스크럽 (섹션 02 위)

원본 영상 `assets/video/box-opening.mp4` (2404×3444 · 5.04s · 24fps)에서
ffmpeg로 프레임을 뽑아 WebP 시퀀스로 넣고, GSAP ScrollTrigger로 섹션을
pin 한 뒤 스크롤 진행도를 프레임 인덱스에 매핑합니다.

```
assets/img/box/desktop/001..121.webp   660px · 1.8 MB
assets/img/box/mobile/001..041.webp    430px · 288 KB  (1/3로 솎음)
assets/css/box-scrub.css
assets/js/box-scrub.js
assets/vendor/gsap.min.js · ScrollTrigger.min.js   (Apache 2.0, LICENSE 동봉)
```

- **배경색** — 영상 모서리에서 샘플링한 `#F2F1ED`를 `--film` 토큰으로 두고,
  스크럽 섹션과 섹션 02(`.section--mech`)에 같이 적용해 이음매를 없앴습니다.
  (섹션 02는 원래 `#F3F2EF`라 미세하게 달랐습니다.)
- **프레임 재추출** — 원본에 여백이 많아 콘텐츠 bbox(1860×2528)로 크롭했습니다.
  크롭을 바꾸면 `box-scrub.css`의 `aspect-ratio: 660 / 898`도 같이 고쳐야 합니다.
- **모바일** — 프레임을 41장으로 줄이고 해상도도 430px로 낮춥니다.
- **prefers-reduced-motion** — ScrollTrigger를 아예 만들지 않고 마지막 프레임만
  정적으로 표시합니다(섹션 높이도 `auto`).
- **스크럽 길이** — `box-scrub.js`의 `end: '+=220%'`(모바일 160%). 늘리면 더 천천히 열립니다.

### 되돌리기

`index.html`에서 `box-scrub.css` 링크, `box-scrub.js`·GSAP 스크립트, 그리고
`<section class="boxopen" data-box-scrub>` 블록을 지우면 됩니다.

## 성분 섹션 시안 (샬레 사진)

`proposals/ingredients.html` — 같은 내용·같은 사진으로 만든 두 안을 위아래로 비교합니다.
로컬에서 `http://localhost:8000/proposals/ingredients.html`.

- **시안 A** 유리 카드 안에 샬레를 96px 원형으로. 지금 구조 유지, 여섯 칸이 균일.
- **시안 B** 카드를 걷어내고 샬레를 220px로. 물을 깊게 내려 표본이 발광하듯 뜨는 구성.

**시안 B 를 본 페이지에 적용했습니다.** 이 페이지는 비교 기록으로 남겨 둡니다.

### 사진 매핑 — 확인 필요

| 성분 | 사진 | 확신도 |
|---|---|---|
| 제주 용암해수 | `chalet-seawater.jpg` (용암석) | 확실 |
| 백년초 | `chalet-opuntia.jpg` (열매) | 확실 |
| 베타글루칸 | `chalet-betaglucan.jpg` (곡물) | 확실 |
| 순수 비타민C | `chalet-vitc.jpg` (노란 액) | 추정 |
| 펩타이드 | `chalet-peptide.jpg` (기포 젤) | **임의 배정** |
| 글루타치온 | `chalet-glutathione.jpg` (맑은 젤) | **임의 배정** |

> 제품 라인업의 `글루타치온 20K` 는 `바쿠치올 5K` 로 교체됐지만,
> **글루타치온은 성분(05)으로는 그대로 남아 있습니다.** 의도된 상태입니다.

남는 2장(`chalet-spare-beads.jpg` 짙은 비드, `chalet-spare-centella.jpg` 병풀)은
현재 성분 6종에 해당이 없어 뺐습니다. 원본은 `assets/img/chalet/original/`.

⚠️ **원본이 약 330px이라 적용된 220px 표본은 레티나에서 무릅니다.**
같은 컷을 660px 이상으로 다시 주시면 교체하겠습니다.

## 접근성 / 반응형

- 데스크톱 1440 · 모바일 375 확인, 가로 오버플로 없음
- skip link, 키보드 포커스 링
- 리뷰 띠는 좌→우 자동 흐름(마퀴). 마우스오버·포커스 시 정지, 화면 밖·탭 숨김 시 멈춤,
  `prefers-reduced-motion` 이면 흐름을 끄고 직접 스크롤로 전환. 속도는 `main.js` 의 `speed`(px/초)
- `prefers-reduced-motion` 에서 리빌·360° 회전 정지
