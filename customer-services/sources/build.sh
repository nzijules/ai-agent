#!/bin/bash
# usage : ./build.sh <tag> <map.json|none> <audio.mp3>   → full-<tag>.html et page-<tag>.html
python3 - "$@" <<'PY'
import base64, sys, json
tag, mp, audio = sys.argv[1:4]
s = open('cs.html').read()
logo = 'data:image/png;base64,' + base64.b64encode(open('../logo-mtn.png','rb').read()).decode()
tm = 'null' if mp == 'none' else json.dumps(json.load(open(mp)))
dur = 115 if mp == 'none' else json.load(open(mp))[-1][0]
s = s.replace('LOGO_DATA_URI', logo).replace('TMAP_DATA', tm).replace('AUDIO_SRC', audio).replace('DUR_INT', str(int(dur)))
open(f'page-{tag}.html','w').write(s)
head, rest = s.split('</style>', 1)
open(f'full-{tag}.html','w').write('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '</style>\n</head>\n<body>\n' + rest + '\n</body>\n</html>\n')
PY
