"""(10.21 피드백 03) 메인 배너 2번 — 연출 사진 속 바이알을 실물 바이알 사진으로 바꾼다.
배경(돌·꽃·자몽)은 그대로 두고, 의뢰서에 첨부된 바이알 단독컷을 원래 병 자리에 덮는다.
원래 병보다 실물이 조금 넓어서 그대로 덮이면 원래 병은 보이지 않는다.

사용: python3 tools/hero-vial.py <원본 연출컷> <바이알 단독컷.png> <출력.jpg>
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

SRC, VIAL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
bg = Image.open(SRC).convert('RGB')

# 바이알 오리기: 흰 바탕 → 줄마다 처음~끝 '흰색 아닌' 픽셀 사이
v = Image.open(VIAL).convert('RGB')
m = Image.new('L', v.size, 0); vp = v.load(); mp = m.load()
for y in range(v.size[1]):
    xs = [x for x in range(v.size[0]) if min(vp[x, y]) < 243]
    if len(xs) > 8:
        for x in range(xs[0], xs[-1] + 1): mp[x, y] = 255
m = m.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(.7))
bb = m.getbbox(); v = v.crop(bb); m = m.crop(bb)

# 원래 병 자리(2400×1029 기준): 가운데 x 1648, 바닥 y 816, 높이 552
H = 566
s = H / v.size[1]
v = v.resize((round(v.size[0] * s), H), Image.LANCZOS)
m = m.resize(v.size, Image.LANCZOS)
cx, base = 1648, 818
x0 = cx - v.size[0] // 2; y0 = base - H

# 장면의 따뜻한 빛에 맞춰 살짝 데운다(흰 스튜디오 조명 → 오후 햇빛)
warm = Image.new('RGB', v.size, (255, 236, 212))
v = Image.blend(v, ImageChops.multiply(v, warm), .55)

# 그림자: 바닥에 닿는 짙은 선 + 오른쪽 뒤로 길게 번지는 그림자(돌 그림자와 같은 방향)
sh = Image.new('L', bg.size, 0); d = ImageDraw.Draw(sh)
d.ellipse((x0 - 10, base - 22, x0 + v.size[0] + 150, base + 26), fill=120)
bg.paste((150, 120, 92), (0, 0), sh.filter(ImageFilter.GaussianBlur(24)))
c = Image.new('L', bg.size, 0)
ImageDraw.Draw(c).rectangle((x0 + 14, base - 5, x0 + v.size[0] - 14, base + 4), fill=150)
bg.paste((120, 96, 72), (0, 0), c.filter(ImageFilter.GaussianBlur(5)))

bg.paste(v, (x0, y0), m)
bg.save(OUT, quality=88, optimize=True, progressive=True)
print('ok', (x0, y0, x0 + v.size[0], base))
