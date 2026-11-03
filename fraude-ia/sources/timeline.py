import json, bisect
# Début de parole de chaque passage dans la voix-off (s), et fin de la dernière phrase
S = [0.0, 6.331, 14.736, 22.211, 30.053, 38.646]; SPEECH_END = 45.578
B = [0.0, 6.125, 14.48, 21.955, 29.84, 38.456, 45.976]   # coupes au milieu des silences
O1 = 0.5 + S[1] - 0.45; O2 = O1 + (S[2]-S[1]); O3 = O2 + (S[3]-S[2]); O4 = O3 + (S[4]-S[3])
O5 = O4 + 9.4; END = O5 + 9.8
O = [0, O1, O2, O3, O4, O5, END]
A = [(0,0),(5.0,O1),
     (9.0,O1+6.5),(11.2,O2),
     (14.8,O2+5.6),(17.4,O3),
     (23.4,O4),(24.0,O4+.3),(24.7,O4+1.4),(25.4,O4+2.1),(25.41,O4+7.8),(26.1,O4+8.5),(28.4,O5),
     (29.5,O5+2.95),(30.6,O5+4.85),(30.95,O5+5.6),(31.3,O5+6.65),(31.8,O5+7.1),(33.4,END-.6),(34,END)]
A = [(round(v,3), round(o,3)) for v,o in A]
def to_out(v):
    vs=[a[0] for a in A]; i=max(0,min(len(A)-2,bisect.bisect_right(vs,v)-1)); (v0,o0),(v1,o1)=A[i],A[i+1]
    return o0+(v-v0)*(o1-o0)/(v1-v0)
place = [0.5 - (S[0]-B[0])] + [O[k]+0.45-(S[k]-B[k]) for k in range(1,6)]
tl = dict(anchors=A, scenes=[round(x,3) for x in O], end=round(END,3), segs=[[B[k],B[k+1],round(place[k],3)] for k in range(6)],
          cuts=[round(to_out(a+.2),3) for a in (5.0,11.2,17.4,23.4,28.4)],
          stutters=[round(to_out(2.1),3), round(to_out(3.6),3)],
          bells=[round(O5+x,3) for x in (4.93,5.6,6.7,7.3)])
json.dump(tl, open('timeline.json','w'), indent=1); print(json.dumps(tl))
