# Filler Vita-C⁺ Ampoule — 상세페이지 (단독 작업본)

라바섬 사이트와 연결하지 않은 별도 작업물입니다. 메뉴·링크·배포 워크플로에 들어가지 않습니다.

```
page.html       상세페이지 원본 (아티팩트로 게시하는 파일)
index.html      page.html 을 감싼 로컬 보기용 — tools/build.py 로 다시 만든다
img/            사진 (기존 라바섬 자산: 제품 컷, 패키지, 원료 샬레, 현무암, 피부 컷)
fonts/          이 페이지에 쓰인 글자만 담은 Google Fonts 조각 (Hahmlet · IBM Plex)
export/         섹션별 정지 JPG(s01–s10) + 움직이는 섹션 GIF
tools/          build.py · export.mjs(내보내기) · make-gif.py · pickfonts.py
```

## 보기
`index.html` 을 브라우저로 열면 됩니다. `index.html#still` 은 모든 움직임이 끝난 정지 화면입니다.

## 애니메이션 규칙
- 모든 움직임은 CSS 애니메이션이고 주기가 6초로 같습니다(`--T`).
- GIF 는 6초 한 바퀴를 프레임 단위로 찍어 만들기 때문에 이음매 없이 반복됩니다.
- 움직이는 섹션: s01 바이알 위 빛 · s02 13.5 드러남 · s03 pH 바늘 + 16주 색 기록 · s06 임상 수치

## 다시 내보내기
```
npm i -D playwright      # 처음 한 번
node tools/export.mjs export            # 전체
node tools/export.mjs export --only s07 --fps 15 --scale 2
```

## ⚠️ 확정 전 확인할 것 (페이지 안 노란 바탕 표시)
- 08 임상: 시험기관 · 기간 · 대상 인원, 피부 자극 테스트 판정 결과
  (수치 +12% / +38% 는 박스 표기와 기존 상세 시안 기준)
- 07 안정성: 자사 비교 시험 조건과 비교 제형 정보
- 10 구성품 명칭·형태, 11 사용 방법 단계 — 기존 시안을 정리한 것이라 실제와 대조 필요
- 14 제품 정보: 용량 · 사용기한 · 전성분 · 기능성 심사 여부 · 제조업자
- 03 제주 베이스는 박스 표기(Opuntia · Jeju Lava Seawater) 기준입니다.
  기존 시안의 두 번째 원료(저해상도라 '마린플라센타'로 읽힘)와 다를 수 있습니다.
