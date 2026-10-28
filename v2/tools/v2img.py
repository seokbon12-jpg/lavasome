"""v2 이미지: 모두 클라이언트가 준 실사(라인업 z2, 키트 z3, 라이브 패키지 컷, 페트리 컷)에서 자르기만 한다."""
import sys, glob
from PIL import Image
Z, R, O = sys.argv[1], sys.argv[2], sys.argv[3]   # zip 폴더, 저장소 루트, 출력
z2 = Image.open(Z + '/z2.png').convert('RGB'); z3 = Image.open(Z + '/z3.png').convert('RGB')
box = Image.open(R + '/detail/vita-c-plus/img/box-open.jpg').convert('RGB')
def save(im, name, w, q=84):
    if im.size[0] > w: im = im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS)
    im.save(f'{O}/{name}', quality=q, optimize=True, progressive=True)
save(z2.crop((330, 0, 1416, 1086)), 'hero-01.jpg', 1086)
save(z3, 'hero-02.jpg', 1200)
save(z2.crop((760, 440, 1250, 930)).resize((980, 980), Image.LANCZOS), 'hero-03.jpg', 980)
save(box, 'sig-package.jpg', 1000)
save(z3.crop((272, 112, 992, 592)), 'ritual-steps.jpg', 1080)
for k, n in {'vitc': 'vitc', 'seawater': 'seawater', 'peptide': 'peptide', 'opuntia': 'opuntia',
             'betaglucan': 'betaglucan', 'glutathione': 'glutathione'}.items():
    save(Image.open(f'{R}/assets/img/chalet/chalet-{k}.jpg').convert('RGB'), f'ing-{n}.jpg', 400)
# 인스타그램 자리 표시(샘플) — 실제 피드로 바뀐다
ig = [Image.open(R + '/assets/img/chalet/chalet-probiotics.jpg').convert('RGB'),
      z2.crop((0, 380, 520, 900)), z3.crop((300, 640, 1000, 1180)).resize((540, 540)),
      box.crop((0, 0, 700, 700)), z2.crop((560, 200, 900, 540)), z2.crop((1100, 420, 1448, 768))]
for i, im in enumerate(ig, 1):
    s = min(im.size); im = im.crop(((im.size[0] - s) // 2, (im.size[1] - s) // 2, (im.size[0] + s) // 2, (im.size[1] + s) // 2))
    save(im.resize((600, 600), Image.LANCZOS) if s < 600 else im, f'ig-{i}.jpg', 600)
lg = glob.glob(R + '/../_logo.png') or glob.glob(Z + '/../../v2in/z1/02_brand/*.png')
L = Image.open(lg[0]).convert('RGBA'); L = L.crop(L.getbbox()); L = L.resize((640, round(L.size[1] * 640 / L.size[0])), Image.LANCZOS)
L.save(f'{O}/logo.png', optimize=True)
print('ok', L.size)
