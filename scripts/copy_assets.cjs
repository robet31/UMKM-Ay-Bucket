const fs = require('fs');
const path = require('path');
const src = path.resolve('D:/SEMESTER 6 (MBKM) dll/PROJECT-DEPLOY-COBA BOT/AY BUCKET LANDING PAGE/High-End Portfolio Design/ASSETS-AY BUCKET');
const dst = path.resolve('./public/assets');
function walk(d){
  for(const f of fs.readdirSync(d)){
    const p = path.join(d,f);
    const stat = fs.statSync(p);
    if(stat.isDirectory()){
      walk(p);
    } else if(stat.isFile()){
      const dest = path.join(dst, f);
      try{
        fs.copyFileSync(p, dest);
        console.log('COPIED:', p, '->', dest);
      } catch(e){
        console.error('ERROR copying', p, e.message);
      }
    }
  }
}
walk(src);
console.log('Done');
