# LAVASOME — 메인페이지

정적 사이트 (HTML/CSS/JS, 외부 라이브러리 없음). 스펙 원본은 [`docs/handoff.md`](docs/handoff.md).

```
index.html
assets/css/styles.css
assets/js/main.js
```

로컬에서 보기: `python3 -m http.server 8000` 후 `http://localhost:8000`

8섹션 구현: Hero · Our Formulas · Formulation First(메커니즘) · Jeju-Origin ·
Gentle Efficacy · Ingredient Cards · Reviews & Stories · Brand Closing.

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
| 영문 큰 타이틀 | `--font-title` | **classico-urw 400** | Tenor Sans 400 |
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

> ⚠️ Classico URW 의 Adobe Fonts CSS 이름을 확인하지 못해 `classico-urw` 와
> `urw-classico` 두 표기를 함께 걸어뒀습니다. 킷 페이지에서 실제 값을 확인하고
> 안 맞는 쪽을 지우세요. Classico 에는 Light 가 없어 웨이트는 400 이 하한입니다.

킷 서체 이름이 이미 각 토큰 맨 앞에 있어서 **추가 작업은 없습니다.**
한글 명조를 구하시면 `--font-kr-head` / `--font-kr-body` 맨 앞에 이름만 넣으면 됩니다.

⚠️ Typekit 킷은 **도메인 잠금**입니다. 킷 설정에 `localhost` 와 라이브 도메인이
둘 다 등록돼 있어야 합니다.

---

## 아직 자리표시인 것 (배포 전 교체 필수)

HTML에서 `data-placeholder` 속성으로 전부 표시해뒀습니다.

- **히어로 사진 4장은 들어왔습니다** (`assets/img/hero/`). 나머지 이미지 — 제품컷,
  제형 매크로, 제주 소재, UGC — 는 아직 톤만 맞춘 그라디언트 블록입니다.
- **S7 리뷰 전부** — 실제 리뷰가 없어서 문구를 지어내지 않았습니다. 타일 구조만 잡아뒀습니다.
  자사몰·와디즈에서 **닉네임·출처가 확인되는 리뷰만** 넣으세요.
- **S3 360° 시퀀스** — 지금은 SVG 오브제를 스크롤에 맞춰 돌리는 대체 구현입니다.
  실제 시퀀스를 받으면 `.spin` 에 두 속성만 추가하면 자동 전환됩니다.
  ```html
  <figure class="spin" data-spin data-frames="assets/img/spin/{i}.webp" data-frame-count="36">
  ```
- **카피** — S1·S9 외에는 상세페이지 원문을 받지 못해 스펙 요약을 근거로 초안을 썼습니다.
  상세페이지 원문으로 교체하세요.

## 표기 관련

- 미백·주름개선 등 **기능성 라벨은 심사 근거가 확인된 제품에만** 노출하세요.
  해당 위치에 HTML 주석으로 표시해뒀습니다.
- 인체적용시험 만족도 조사·수상·입점을 다루던 Brand Proof 섹션은 요청에 따라 삭제했습니다.
  다시 넣을 때는 "만족도 조사" 표기와 면책 문구를 함께 복원하세요.

## 접근성 / 반응형

- 데스크톱 1440 · 모바일 375 확인, 가로 오버플로 없음
- skip link, 키보드 포커스 링, 가로 스크롤러 방향키 조작
- `prefers-reduced-motion` 에서 리빌·360° 회전 정지
