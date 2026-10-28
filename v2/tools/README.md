# v2 이미지 다시 만들기

클라이언트 실사에서 자르기·배경 맞추기만 한다(생성 이미지 없음). Pillow 필요.

```bash
# Z = 2026.10.13 zip을 푼 폴더(z1~z4.png), R = 저장소 루트
python3 v2/tools/prodcards.py "$Z" v2/img     # 제품 카드 p-*.jpg (병 윤곽 좌표는 파일 안 SHAPE)
python3 v2/tools/v2img.py "$Z" . v2/img        # 히어로·패키지·사용법·성분·인스타 샘플·로고
```

누끼 원본(투명 PNG)을 받으면 `prodcards.py`의 비타C 부분처럼 RGBA를 그대로 앉히면 된다.
`v2img.py`의 로고는 `v2in/z1/02_brand/로고 벡터.png`를 찾는다 — 경로가 다르면 맨 아래 `lg`를 고친다.
