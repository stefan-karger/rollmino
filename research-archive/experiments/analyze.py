from itertools import product
PIECES={
 'navy':[(0,0)],'brown':[(0,0),(1,0)],'orange':[(0,0),(1,0),(2,0)],'purple':[(0,0),(0,1),(1,1)],
 'grey':[(0,0),(1,0),(2,0),(3,0)],'green':[(0,0),(1,0),(0,1),(1,1)],'cyan':[(0,0),(0,1),(0,2),(1,2)],
 'yellow':[(1,0),(0,1),(1,1),(2,1)],'red':[(0,1),(1,1),(1,0),(2,0)]}
def all_orients(coords):
  result=[]
  for mirror,turn in product((False,True),range(4)):
   ps=[((-x if mirror else x),y) for x,y in coords]
   for _ in range(turn):ps=[(-y,x) for x,y in ps]
   minx=min(x for x,y in ps);miny=min(y for x,y in ps)
   t=tuple(sorted((x-minx,y-miny) for x,y in ps))
   if t not in result: result.append(t)
  return result

def pprint(points):
 mx=max(x for x,y in points);my=max(y for x,y in points)
 return '/'.join(''.join('■' if (x,y) in points else '·' for x in range(mx+1)) for y in range(my+1))
for name,coords in PIECES.items():
 o=all_orients(coords)
 print(f'{name:7}: {len(coords)} cells, {len(o)} orients: '+ '  '.join(pprint(s) for s in o))
print('Total cells:', sum(map(len,PIECES.values())), 'total unique orientations:',sum(len(all_orients(x)) for x in PIECES.values()))
