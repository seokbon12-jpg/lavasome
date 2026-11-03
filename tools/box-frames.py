"""사용: python3 tools/box-frames.py <z1·z3.png 가 있는 폴더> assets/img/box

(10.21 피드백 07) 처음처럼 뚜껑이 '위로 열리는' 박스 오프닝 프레임.
실사 두 장만 쓴다: 닫힌 상자 겉면(z1) · 연 상자(z3 — 위: 뚜껑 안쪽, 아래: 트레이).
뚜껑은 트레이 윗변(경첩)을 축으로 0°(닫힘) → 180°(완전히 젖힘) 회전한다.
  0~90°  : 겉면(z1)이 경첩 쪽으로 납작해지며 들린다
  90~180°: 안쪽 면(z3 위쪽)이 경첩 위로 펼쳐진다
들린 쪽 끝은 카메라에 가까워지므로 사다리꼴로 조금 넓힌다(원근)."""
import sys, os, math
from PIL import Image, ImageFilter, ImageDraw, ImageChops
Z, OUT = sys.argv[1], sys.argv[2]
BG = (242, 241, 237)
W, H = 1320, 1796
BOXW = 1000

z3 = Image.open(Z + '/z3.png').convert('RGB')
HINGE = 600
LX0, LX1, LY0 = 238, 1014, 29          # 뚜껑 안쪽
TX0, TX1, TY1 = 232, 1022, 1188         # 트레이

def cut(box, fill=True):
    """회색 배경을 빼고 상자만 — 배경은 같은 줄 바깥 픽셀과의 색 차이로 판정"""
    x0, y0, x1, y1 = box
    c = z3.crop((x0 - 6, y0, x1 + 6, y1))
    w, h = c.size
    m = Image.new('L', (w, h), 0); px = c.load(); mp = m.load()
    for y in range(h):
        l = px[1, y]; r = px[w - 2, y]
        ref = tuple((l[i] + r[i]) / 2 for i in range(3))
        for x in range(w):
            p = px[x, y]
            d = abs(p[0] - ref[0]) + abs(p[1] - ref[1]) + abs(p[2] - ref[2])
            blue = (p[2] - p[0]) > 7 and p[0] < 222        # 배경은 푸른 회색
            mp[x, y] = 255 if (d > 26 and not (blue and d < 40)) else 0
            # 뚜껑 위 손잡이 홈: 푸른 기가 도는 배경이 비쳐 보이는 자리
            if not fill and y < 60 and (p[2] - p[0]) > 4: mp[x, y] = 0
    # 가장자리 안쪽은 전부 상자(구멍 메우기): 각 줄의 처음~끝 상자 픽셀 사이를 채운다
    for y in (range(h) if fill else []):
        xs = [x for x in range(w) if mp[x, y]]
        if len(xs) > w * .5:
            for x in range(xs[0], xs[-1] + 1): mp[x, y] = 255
    m = m.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(.8))
    out = c.convert('RGBA'); out.putalpha(m)
    return out

inner = cut((LX0, LY0, LX1, HINGE), fill=False)   # 위쪽 손잡이 홈은 비워 둔다
tray = cut((TX0, HINGE, TX1, TY1))
s = BOXW / tray.size[0]
tray = tray.resize((BOXW, round(tray.size[1] * s)), Image.LANCZOS)
inner = inner.resize((round(inner.size[0] * s), round(inner.size[1] * s)), Image.LANCZOS)
TH, LH = tray.size[1], inner.size[1]
# 닫힌 뚜껑 겉면: z1(RGBA) 앞면을 트레이 크기에 맞춘다
z1 = Image.open(Z + '/z1.png').convert('RGBA').crop((677, 793, 4287, 3541))
outer = z1.resize((BOXW - 4, TH - 2), Image.LANCZOS)

x0 = (W - BOXW) // 2
hy = int(H * .5 - (TH + LH) / 2 + LH)   # 경첩 y: 다 열렸을 때 전체가 가운데 오도록

def quad(img, top_y, bot_y, top_w, bot_w):
    """img 를 (top_y, top_w) ~ (bot_y, bot_w) 사다리꼴에 그린다. top_y<bot_y"""
    hgt = max(1, int(round(bot_y - top_y)))
    wmax = int(max(top_w, bot_w)) + 2
    cx = wmax / 2
    # QUAD: 출력 사각형 → 입력의 네 모서리(좌상, 좌하, 우하, 우상)를 역매핑
    # 출력 공간에서 사다리꼴을 만들려면 MESH 대신 행 단위로 가로 스케일
    out = Image.new('RGBA', (wmax, hgt), (0, 0, 0, 0))
    src = img.resize((img.size[0], hgt), Image.LANCZOS)
    for y in range(hgt):
        f = y / max(1, hgt - 1)
        w = top_w + (bot_w - top_w) * f
        row = src.crop((0, y, src.size[0], y + 1)).resize((max(1, int(round(w))), 1), Image.BILINEAR)
        out.paste(row, (int(round(cx - w / 2)), y))
    return out, int(round(top_y)), wmax

def shade(img, k):
    """k<1 어둡게"""
    if abs(k - 1) < .01: return img
    r, g, b, a = img.split()
    r, g, b = [ch.point(lambda v, k=k: int(min(255, v * k))) for ch in (r, g, b)]
    return Image.merge('RGBA', (r, g, b, a))

def ease(t): return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2

def frame(t):
    im = Image.new('RGB', (W, H), BG)
    p = 0 if t < .16 else 1 if t > .8 else ease((t - .16) / .64)
    th = math.pi * p
    # 바닥 그림자
    sh = Image.new('L', (W, H), 0); d = ImageDraw.Draw(sh)
    d.rounded_rectangle((x0 + 24, hy + 30, x0 + BOXW - 24, hy + TH + 26), radius=26, fill=95)
    if p > .5:   # 젖혀진 뚜껑의 그림자
        d.rounded_rectangle((x0 + 24, hy - LH * (p - .5) * 2 + 20, x0 + BOXW - 24, hy + 10), radius=26, fill=int(70 * (p - .5) * 2))
    im.paste((198, 196, 190), (0, 0), sh.filter(ImageFilter.GaussianBlur(30)))
    im.paste(tray, (x0, hy), tray)
    persp = .09 * math.sin(th)                   # 들린 끝이 넓어지는 정도
    c = math.cos(th)
    if c > 0.002:   # 겉면: 경첩(hy) ~ hy + TH*cos
        bot = hy + TH * c
        face = shade(outer, .78 + .22 * c)
        q, qy, qw = quad(face, hy, bot, BOXW, BOXW * (1 + persp))
        # 들리는 뚜껑 아래로 드리운 그림자(트레이 위)
        if p > 0:
            s2 = Image.new('L', (W, H), 0)
            ImageDraw.Draw(s2).rectangle((x0, hy, x0 + BOXW, int(bot + 30 * math.sin(th))), fill=int(70 * math.sin(th)))
            im.paste((40, 38, 34), (0, 0), s2.filter(ImageFilter.GaussianBlur(24)))
        im.paste(q, (W // 2 - qw // 2, qy), q)
    elif c < -0.002:  # 안쪽 면: hy - LH*|cos| ~ 경첩
        top = hy - LH * (-c)
        face = shade(inner, .8 + .2 * (-c))
        q, qy, qw = quad(face, top, hy, inner.size[0] * (1 + persp), inner.size[0])
        im.paste(q, (W // 2 - qw // 2, qy), q)
    return im

if __name__ == '__main__':
    os.makedirs(OUT + '/desktop', exist_ok=True); os.makedirs(OUT + '/mobile', exist_ok=True)
    only = sys.argv[3:] and [int(a) for a in sys.argv[3:]]
    for i in (only or range(121)):
        f = frame(i / 120)
        if only: f.save(OUT + f'/preview-{i:03d}.jpg', quality=85); continue
        f.save(OUT + f'/desktop/{i+1:03d}.webp', quality=82, method=5)
        if i % 3 == 0:
            f.resize((880, 1197), Image.LANCZOS).save(OUT + f'/mobile/{i//3+1:03d}.webp', quality=80, method=5)
    print('ok', TH, LH, hy)
