"""page.html(아티팩트 원본) → index.html(로컬·내보내기용, 문서 머리 포함)"""
import os
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
s = open(os.path.join(root, 'page.html')).read()
head = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<!-- 이 파일은 page.html 을 감싼 것. 수정은 page.html 에서 하고 tools/build.py 로 다시 만든다. -->\n'
        '</head>\n<body>\n')
open(os.path.join(root, 'index.html'), 'w').write(head + s + '\n</body>\n</html>\n')
print('index.html')
