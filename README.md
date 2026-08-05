# LAVASOME — 메인페이지

정적 사이트 (HTML/CSS/JS, 외부 라이브러리 없음). 스펙 원본은 [`docs/handoff.md`](docs/handoff.md).

```
index.html
assets/css/styles.css
assets/js/main.js
```

로컬에서 보기: `python3 -m http.server 8000` 후 `http://localhost:8000`

9섹션 전부 구현: Hero · Our Formulas · Formulation First(메커니즘) · Jeju-Origin ·
Gentle Efficacy · Ingredient Cards · Brand Proof · Reviews & Stories · Brand Closing.

---

## 폰트 — 지금은 임시

확정 서체는 **Garamond Premier Pro** (Adobe Fonts 킷 `zhv7ywn`)인데,
현재 개발 환경에서 `use.typekit.net`이 막혀 있어 **임시로 Google Fonts를 쓰고 있습니다.**

| 용도 | 지금 (임시) | 확정 |
|---|---|---|
| 영문 타이틀 | EB Garamond | Garamond Premier Pro |
| 한글 헤드라인 | Gowun Batang | 미정 |
| 한글 본문 | Noto Serif KR | 미정 |

**교체 방법 — 두 군데만 고치면 끝입니다.**

1. `index.html` 의 주석 처리된 킷 링크를 살립니다.
   ```html
   <link rel="stylesheet" href="https://use.typekit.net/zhv7ywn.css">
   ```
2. `assets/css/styles.css` 의 `--font-display` 첫 항목을 앞으로 옮깁니다.
   ```css
   --font-display: "garamond-premier-pro", "EB Garamond", …;
   ```

한글 명조를 구하시면 `--font-kr-head` / `--font-kr-body` 도 같은 방식으로 바꾸면 됩니다.
서체 이름만 갈아끼우면 되도록 전부 CSS 변수로 빼놨습니다.

⚠️ Typekit 킷은 **도메인 잠금**입니다. 킷 설정에 `localhost` 와 라이브 도메인이
둘 다 등록돼 있어야 합니다.

---

## 아직 자리표시인 것 (배포 전 교체 필수)

HTML에서 `data-placeholder` 속성으로 전부 표시해뒀습니다.

- **이미지 전체** — 앰버 앰플컷, 제형 매크로, 제주 용암해수·현무암·백년초, 모델컷, UGC.
  지금은 톤만 맞춘 그라디언트 블록입니다. 상세페이지 원본 고해상 소재로 교체.
- **S8 리뷰 전부** — 실제 리뷰가 없어서 문구를 지어내지 않았습니다. 타일 구조만 잡아뒀습니다.
  자사몰·와디즈에서 **닉네임·출처가 확인되는 리뷰만** 넣으세요.
- **S7 만족도 조사 응답률 %** — 원자료를 못 받아서 비워뒀습니다. 숫자를 추정해 넣지 않았습니다.
- **S3 360° 시퀀스** — 지금은 SVG 오브제를 스크롤에 맞춰 돌리는 대체 구현입니다.
  실제 시퀀스를 받으면 `.spin` 에 두 속성만 추가하면 자동 전환됩니다.
  ```html
  <figure class="spin" data-spin data-frames="assets/img/spin/{i}.webp" data-frame-count="36">
  ```
- **카피** — S1·S9 외에는 상세페이지 원문을 받지 못해 스펙 요약을 근거로 초안을 썼습니다.
  상세페이지 원문으로 교체하세요.

## 표기 관련

- 인체적용시험은 **"만족도 조사"** 로만 표기했고, 임상 입증으로 승격하지 않았습니다.
  섹션과 푸터에 면책 문구를 넣어뒀습니다.
- 미백·주름개선 등 **기능성 라벨은 심사 근거가 확인된 제품에만** 노출하세요.
  해당 위치에 HTML 주석으로 표시해뒀습니다.
- 수상·입점 항목은 스펙에 적힌 내용 그대로입니다. 이미지사용권·공식명칭 확인 후 게시하세요.

## 접근성 / 반응형

- 데스크톱 1440 · 모바일 375 확인, 가로 오버플로 없음
- skip link, 키보드 포커스 링, 가로 스크롤러 방향키 조작
- `prefers-reduced-motion` 에서 리빌·360° 회전 정지
