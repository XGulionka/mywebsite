import os
import re

root = os.getcwd()
files = sorted([f for f in os.listdir(root) if f.lower().endswith('.html')])
errors = []

for fname in files:
    path = os.path.join(root, fname)
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    if '<!doctype html>' not in txt.lower():
        errors.append((fname, 'missing doctype'))
    if '<title>' not in txt.lower():
        errors.append((fname, 'missing title'))
    if not re.search(r'charset\s*=\s*"utf-8"|charset\s*=\s*\'utf-8\'', txt, re.I):
        errors.append((fname, 'missing charset utf-8'))
    for m in re.finditer(r'<img[^>]*>', txt, re.I):
        tag = m.group(0)
        if not re.search(r'alt\s*=\s*("[^"]*"|\'[^\']*\')', tag, re.I):
            errors.append((fname, 'img missing alt: ' + tag))
        srcm = re.search(r'src\s*=\s*"([^"\']+)"', tag, re.I)
        if srcm:
            src = srcm.group(1)
            if not re.match(r'^(https?:|mailto:|data:|#)', src, re.I):
                target = src.split('#')[0]
                if target and not os.path.exists(os.path.join(root, target)):
                    errors.append((fname, 'missing image ' + src))
    for m in re.finditer(r'(?:(?:href|src)\s*=\s*"([^"\']+)")', txt, re.I):
        ref = m.group(1)
        if re.match(r'^(https?:|mailto:|data:|javascript:|#)', ref, re.I):
            continue
        target = ref.split('#')[0]
        if target and not os.path.exists(os.path.join(root, target)):
            errors.append((fname, 'missing resource ' + ref))

print('files checked:', len(files))
print('issues found:', len(errors))
for fname, issue in errors:
    print(f'{fname}: {issue}')
