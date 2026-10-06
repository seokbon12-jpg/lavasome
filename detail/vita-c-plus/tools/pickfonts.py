import re,sys,os,subprocess,hashlib,html
css=open(sys.argv[1]).read(); page=open(sys.argv[2]).read(); out=sys.argv[3]
os.makedirs(out,exist_ok=True)
# 페이지에 실제로 나오는 글자(태그 제거) + 대문자 변환 대비
t=re.sub(r'<!--.*?-->','',page,flags=re.S); t=re.sub(r'<(script|style)[^>]*>.*?</\1>','',t,flags=re.S)
t=html.unescape(re.sub(r'<[^>]+>',' ',t))
chars=set(t)|set(t.upper())|set(t.lower())|set('0123456789%,.+·-–°/:()○ ')
cps={ord(c) for c in chars}
def covers(rng):
    for part in rng.split(','):
        part=part.strip().replace('U+','')
        if '-' in part: a,b=part.split('-'); a,b=int(a,16),int(b,16)
        elif '?' in part: a=int(part.replace('?','0'),16); b=int(part.replace('?','F'),16)
        else: a=b=int(part,16)
        if any(a<=c<=b for c in cps): return True
    return False
blocks=re.findall(r'(/\*[^*]*\*/\s*)?(@font-face\s*\{[^}]*\})',css)
keep=[]; n=0
for _,bk in blocks:
    rng=re.search(r'unicode-range:\s*([^;]+);',bk)
    if rng and not covers(rng.group(1)): continue
    url=re.search(r'url\((https://[^)]+)\)',bk).group(1)
    fam=re.search(r"font-family:\s*'([^']+)'",bk).group(1).replace(' ','')
    wt=re.search(r'font-weight:\s*(\d+)',bk).group(1)
    name=f"{fam}-{wt}-{hashlib.md5(url.encode()).hexdigest()[:8]}.woff2"
    dst=os.path.join(out,name)
    if not os.path.exists(dst):
        subprocess.run(['curl','-sS','--retry','4','-o',dst,url],check=True)
    keep.append(bk.replace(url,name)); n+=1
open(os.path.join(out,'fonts.css'),'w').write('/* 이 페이지에 쓰인 글자만 담은 Google Fonts 조각 (OFL). 문구를 바꾸면 pickfonts 로 다시 뽑는다. */\n'+'\n'.join(keep)+'\n')
print('kept',n,'of',len(blocks))
