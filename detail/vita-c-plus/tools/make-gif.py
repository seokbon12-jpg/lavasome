"""프레임 PNG 폴더 → 반복 GIF.

python3 make-gif.py <프레임폴더> <출력.gif> [프레임간격ms]

전 프레임을 하나의 팔레트로 맞춘다. 프레임마다 팔레트가 다르면
배경색이 미세하게 떨려 보인다(특히 크림색 바탕).
"""
import glob
import os
import sys

from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
ms = int(sys.argv[3]) if len(sys.argv) > 3 else 83

files = sorted(glob.glob(os.path.join(src, '*.png')))
frames = [Image.open(f).convert('RGB') for f in files]

# 팔레트는 여러 프레임을 이어 붙인 띠에서 뽑는다 — 움직이며 나타나는 색까지 담기게
w, h = frames[0].size
pick = frames[:: max(1, len(frames) // 8)]
strip = Image.new('RGB', (w, h * len(pick)))
for i, fr in enumerate(pick):
    strip.paste(fr, (0, h * i))
pal = strip.quantize(colors=255, method=Image.Quantize.MEDIANCUT)

out = [fr.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG) for fr in frames]
out[0].save(dst, save_all=True, append_images=out[1:], duration=ms, loop=0, optimize=True, disposal=1)
print('gif', os.path.basename(dst), f'{os.path.getsize(dst) / 1e6:.1f}MB', len(out), 'frames')
