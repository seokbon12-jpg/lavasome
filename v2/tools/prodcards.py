"""라인업 컷(z2)에서 제품을 떼어 같은 바탕(--stone)의 4:5 카드 이미지로."""
import sys
from PIL import Image, ImageFilter, ImageDraw, ImageStat, ImageChops
Z, OUT = sys.argv[1], sys.argv[2]
lu = Image.open(Z + '/z2.png').convert('RGB')
TARGET = (239, 235, 228)          # --stone #EFEBE4
W, H = 800, 1000
# 병 실루엣(z2 픽셀) — 가장자리를 재서 정함. ('rr', 상자, 반경) 또는 ('poly', 점들)
def bottle(cap, body):
    return [('rr', body, 16), ('rr', cap, 6)]
SHAPE = {
  'sunscreen':  [('rr', (436, 457, 577, 827), 12)],
  'pdrn-1k':    bottle((821, 486, 910, 611), (800, 612, 931, 834)),
  'calming-50': bottle((960, 486, 1048, 611), (939, 612, 1070, 834)),
  'ha90':       bottle((1245, 486, 1335, 611), (1224, 612, 1357, 835)),
  'green-tea-cleanser': [('rr', (607, 364, 799, 829), 14), ('rr', (662, 300, 751, 366), 3),
                         ('rr', (674, 282, 739, 302), 3), ('rr', (678, 248, 736, 284), 2),
                         ('poly', [(670, 241), (673, 235), (806, 236), (812, 241), (808, 254), (802, 252), (736, 251), (672, 251)])],
}
SS = 4
def mask_for(parts, ox, oy, size):
    m = Image.new('L', (size[0] * SS, size[1] * SS), 0); d = ImageDraw.Draw(m)
    for kind, *a in parts:
        if kind == 'rr':
            b, r = a
            d.rounded_rectangle([(b[0] - ox) * SS, (b[1] - oy) * SS, (b[2] - ox) * SS, (b[3] - oy) * SS], radius=r * SS, fill=255)
        else:
            d.polygon([((x - ox) * SS, (y - oy) * SS) for x, y in a[0]], fill=255)
    return m.resize(size, Image.LANCZOS)
def bounds(parts):
    xs, ys = [], []
    for kind, *a in parts:
        pts = [(a[0][0], a[0][1]), (a[0][2], a[0][3])] if kind == 'rr' else a[0]
        xs += [p[0] for p in pts]; ys += [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)
def card(name, parts):
    x0, y0, x1, y1 = bounds(parts)
    pad = 4; ox, oy = x0 - pad, y0 - pad
    s = lu.crop((ox, oy, x1 + pad, y1 + pad)); sw, sh = s.size
    mk = mask_for(parts, ox, oy, s.size)
    scale = (H * (0.72 if 'cleanser' in name else 0.6)) / sh
    size = (round(sw * scale), round(sh * scale))
    s = s.resize(size, Image.LANCZOS); mk = mk.resize(size, Image.LANCZOS)
    can = Image.new('RGB', (W, H), TARGET)
    px = (W - size[0]) // 2; py = int(H * 0.84) - size[1]
    bot = py + size[1] - int(pad * scale)
    shd = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(shd)
    dd.ellipse((px - 30, bot - 14, px + size[0] + 30, bot + 26), fill=60)
    can.paste((196, 188, 177), (0, 0), shd.filter(ImageFilter.GaussianBlur(18)))
    shd2 = Image.new('L', (W, H), 0)
    ImageDraw.Draw(shd2).rectangle((px + 12, bot - 3, px + size[0] - 12, bot + 4), fill=120)
    can.paste((150, 142, 132), (0, 0), shd2.filter(ImageFilter.GaussianBlur(4)))
    can.paste(s, (px, py), mk)
    can.save(f'{OUT}/p-{name}.jpg', quality=88)
for k, v in SHAPE.items(): card(k, v)
# 비타C: 키트 누끼(z4, RGBA)
kit = Image.open(Z + '/z4.png').convert('RGBA').crop((90, 290, 910, 900))
kw = int(W * 0.84); kit = kit.resize((kw, int(kit.size[1] * kw / kit.size[0])), Image.LANCZOS)
can = Image.new('RGB', (W, H), TARGET)
sh_ = Image.new('L', (W, H), 0); y = int(H * 0.5 - kit.size[1] / 2)
ImageDraw.Draw(sh_).rectangle(((W - kw) // 2 + 20, y + kit.size[1] - 10, (W + kw) // 2 - 20, y + kit.size[1] + 18), fill=60)
can.paste((200, 192, 182), (0, 0), sh_.filter(ImageFilter.GaussianBlur(18)))
can.paste(kit, ((W - kw) // 2, y), kit)
can.save(f'{OUT}/p-vita-c-plus.jpg', quality=88)
print('ok')
