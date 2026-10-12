const SIZE=6; const pieces=[
 ['navy',[[0,0]]], ['brown',[[0,0],[1,0]]],['orange',[[0,0],[1,0],[2,0]]],['purple',[[0,0],[0,1],[1,1]]],
 ['grey',[[0,0],[1,0],[2,0],[3,0]]],['green',[[0,0],[1,0],[0,1],[1,1]]],['cyan',[[0,0],[0,1],[0,2],[1,2]]],
 ['yellow',[[1,0],[0,1],[1,1],[2,1]]],['red',[[0,1],[1,1],[1,0],[2,0]]]
];
const DICE=[
['A1','C1','D1','D2','E2','F3'],
['A2','B2','C2','A3','B1','B3'],
['C3','D3','E3','B4','C4','D4'],
['E1','F2','F2','B6','A5','A5'],
['A4','B5','C6','C5','D6','F6'],
['E4','F4','E5','F5','D5','E6'],
['F1','F1','F1','A6','A6','A6']
];
function orients(cells){const all=[],seen=new Set();for(const m of [0,1])for(let r=0;r<4;r++){
let a=cells.map(([x,y])=>[m?-x:x,y]);for(let t=0;t<r;t++)a=a.map(([x,y])=>[-y,x]);
const minX=Math.min(...a.map(v=>v[0])), minY=Math.min(...a.map(v=>v[1]));a=a.map(([x,y])=>[x-minX,y-minY]).sort((u,v)=>u[1]-v[1]||u[0]-v[0]);
const key=a.map(v=>v.join(',')).join('|');if(!seen.has(key)){seen.add(key);all.push(a)}
}return all;}
const neighborBits=Array.from({length:36},(_,i)=>{
const x=i%6,y=Math.floor(i/6);let n=0n;for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]])if(x+dx>=0&&x+dx<6&&y+dy>=0&&y+dy<6)n|=1n<<BigInt((y+dy)*6+x+dx);return n;});
const byCell=Array.from({length:36},()=>[]),count=[];let placements=0;
for(let i=0;i<pieces.length;i++){
 const [id,cells]=pieces[i];const variants=orients(cells);count.push(variants.length);
 for(let ori=0;ori<variants.length;ori++){
  const coords=variants[ori],w=Math.max(...coords.map(v=>v[0]))+1,h=Math.max(...coords.map(v=>v[1]))+1;
  for(let y=0;y<=6-h;y++)for(let x=0;x<=6-w;x++){
   const indexes=coords.map(([dx,dy])=>(y+dy)*6+x+dx);
   let mask=0n,adj=0n;for(const c of indexes){mask|=1n<<BigInt(c);adj|=neighborBits[c]}
   const p={id,i,ori,x,y,mask,adj};for(const idx of indexes)byCell[idx].push(p);placements++;
  }
 }
}
const restricted={STARTER:[],JUNIOR:[0,1],EXPERT:[0,1,2],MASTER:[1,2,3],WIZARD:[0,1,2,3]};
const FULL=(1n<<36n)-1n;
function solve(blockers,level='STARTER',limit=1){
 let occ=0n;for(const pos of blockers){const x=pos.charCodeAt(0)-65,y=Number(pos[1])-1;occ|=1n<<BigInt(y*6+x)}
 const blocked=occ;const candidates=restricted[level];const selected=[];let found=0,nodes=0,first=null;
 function visit(occupied,used){ nodes++;
  if(occupied===FULL){found++;if(!first)first=selected.map(p=>({id:p.id,x:p.x,y:p.y,ori:p.ori}));return found>=limit;}
  let cell=-1;let options=[];
  // minimal remaining valid placements per vacant cell
  for(let idx=0;idx<36;idx++){
   if((occupied & (1n<<BigInt(idx)))!==0n)continue;
   const applicable=[];
   for(const p of byCell[idx]){
    if((used & (1<<p.i)) || (occupied&p.mask))continue;
    if(candidates.includes(p.i) && selected.some(q=>candidates.includes(q.i) && (p.adj&q.mask)!==0n))continue;
    applicable.push(p);
   }
   if(applicable.length === 0)return false;
   if(cell === -1 || applicable.length<options.length){cell=idx;options=applicable;if(options.length===1)break;}
  }
  for(const p of options){selected.push(p);const stop=visit(occupied|p.mask,used|(1<<p.i));selected.pop();if(stop)return true;}
  return false;
 }
 visit(occ,0);return {found,first,nodes,blocked};
}

let arr=[];
for(let i=0;i<40;i++){
 const dice=DICE.map(a=>a[Math.floor(Math.random()*6)]), a=performance.now();
 const w=solve(dice,'WIZARD',Infinity), elapsed=performance.now()-a;
 arr.push({n:w.found,elapsed,dice});
 if(i<5)console.log(JSON.stringify(arr.at(-1)));
}
arr.sort((a,b)=>a.n-b.n);
console.log('samples',arr.length,'min',arr[0].n,'median',arr[20].n,'max',arr.at(-1).n,'avg',(arr.reduce((a,b)=>a+b.n,0)/arr.length).toFixed(1));
