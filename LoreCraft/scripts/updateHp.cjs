const fs = require('fs');
const files = ['src/data/python.ts', 'src/data/c.ts', 'src/data/cpp.ts', 'src/data/csharp.ts', 'src/data/java.ts'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/monsterHp:\s*120/g, 'monsterHp: 80');
  content = content.replace(/monsterHp:\s*130/g, 'monsterHp: 80');
  content = content.replace(/monsterHp:\s*150/g, 'monsterHp: 90');
  content = content.replace(/monsterHp:\s*160/g, 'monsterHp: 90');
  content = content.replace(/monsterHp:\s*200/g, 'monsterHp: 80');
  content = content.replace(/monsterHp:\s*250/g, 'monsterHp: 80');
  content = content.replace(/monsterHp:\s*300/g, 'monsterHp: 90');
  content = content.replace(/monsterHp:\s*350/g, 'monsterHp: 90');
  content = content.replace(/monsterHp:\s*400/g, 'monsterHp: 80');
  content = content.replace(/monsterHp:\s*500/g, 'monsterHp: 80');
  fs.writeFileSync(file, content);
}
console.log('HP updated');
