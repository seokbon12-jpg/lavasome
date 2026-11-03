"""제품 카드 이미지(홈 · 제품 페이지 공용) — 실사만 쓴다. (2026.10.21 피드백 05·06)

· 30ml 앰플·선스크린·클렌저·글루타티온: 2026.10.13 라인업 사진(z2)에서 병 윤곽대로 오린다
· 비타C: 10.21 의뢰서에 첨부된 바이알 단독 사진(흰 바탕)
· 바탕은 설화수처럼 옅은 그레이 한 가지로 통일, 바닥 그림자만 새로 그린다

사용: python3 tools/product-cards.py <z2.png> <vial.png> assets/img/products
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

Z2, VIAL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
BG = (239, 239, 237)        # --shot-bg 와 같은 값
W, H = 800, 1000
SS = 4

def bottle(cap, body):
    return [('rr', body, 16), ('rr', cap, 6)]

# 병 실루엣(z2 픽셀) — 가장자리를 재서 정한 값
SHAPE = {
    'sunscreen':          ([('rr', (436, 457, 577, 827), 12)], .60),
    'pdrn-1k':            (bottle((821, 486, 910, 611), (800, 612, 931, 834)), .58),
    'calming-50':         (bottle((960, 486, 1048, 611), (939, 612, 1070, 834)), .58),
    'glutathione-20k':    (bottle((1101, 486, 1190, 611), (1081, 612, 1213, 834)), .58),
    'ha90':               (bottle((1245, 486, 1335, 611), (1224, 612, 1357, 835)), .58),
    'green-tea-cleanser': ([('rr', (607, 364, 799, 829), 14), ('rr', (662, 300, 751, 366), 3),
                            ('rr', (674, 282, 739, 302), 3), ('rr', (678, 248, 736, 284), 2),
                            ('poly', [(670, 241), (673, 235), (806, 236), (812, 241), (808, 254),
                                      (802, 252), (736, 251), (672, 251)])], .70),
}

def mask_for(parts, ox, oy, size):
    m = Image.new('L', (size[0] * SS, size[1] * SS), 0)
    d = ImageDraw.Draw(m)
    for kind, *a in parts:
        if kind == 'rr':
            b, r = a
            d.rounded_rectangle([(b[0] - ox) * SS, (b[1] - oy) * SS, (b[2] - ox) * SS, (b[3] - oy) * SS],
                                radius=r * SS, fill=255)
        else:
            d.polygon([((x - ox) * SS, (y - oy) * SS) for x, y in a[0]], fill=255)
    return m.resize(size, Image.LANCZOS)

def bounds(parts):
    xs, ys = [], []
    for kind, *a in parts:
        pts = [(a[0][0], a[0][1]), (a[0][2], a[0][3])] if kind == 'rr' else a[0]
        xs += [p[0] for p in pts]; ys += [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)

def place(src, mask, frac, name):
    """src(RGB)+mask 를 바탕 가운데 아래쪽에 앉히고 그림자를 깐다"""
    scale = H * frac / src.size[1]
    size = (round(src.size[0] * scale), round(src.size[1] * scale))
    src = src.resize(size, Image.LANCZOS); mask = mask.resize(size, Image.LANCZOS)
    can = Image.new('RGB', (W, H), BG)
    px = (W - size[0]) // 2; py = int(H * .83) - size[1]; bot = py + size[1]
    s1 = Image.new('L', (W, H), 0)
    ImageDraw.Draw(s1).ellipse((px - 40, bot - 16, px + size[0] + 40, bot + 30), fill=46)
    can.paste((186, 186, 182), (0, 0), s1.filter(ImageFilter.GaussianBlur(20)))
    s2 = Image.new('L', (W, H), 0)
    ImageDraw.Draw(s2).rectangle((px + 10, bot - 4, px + size[0] - 10, bot + 3), fill=110)
    can.paste((140, 140, 136), (0, 0), s2.filter(ImageFilter.GaussianBlur(4)))
    can.paste(src, (px, py), mask)
    can.save(f'{OUT}/{name}.jpg', quality=88, optimize=True, progressive=True)

lu = Image.open(Z2).convert('RGB')
for name, (parts, frac) in SHAPE.items():
    x0, y0, x1, y1 = bounds(parts); pad = 4
    ox, oy = x0 - pad, y0 - pad
    crop = lu.crop((ox, oy, x1 + pad, y1 + pad))
    place(crop, mask_for(parts, ox, oy, crop.size), frac, name)

# 비타C 바이알: 흰 바탕 단독 사진 → 줄마다 처음~끝 '흰색 아닌' 픽셀 사이를 제품으로
v = Image.open(VIAL).convert('RGB')
m = Image.new('L', v.size, 0); vp = v.load(); mp = m.load()
for y in range(v.size[1]):
    xs = [x for x in range(v.size[0]) if min(vp[x, y]) < 243]
    if len(xs) > 8:
        for x in range(xs[0], xs[-1] + 1): mp[x, y] = 255
m = m.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(.7))
bb = m.getbbox()
place(v.crop(bb), m.crop(bb), .48, 'vita-c-plus')
print('ok')
