const fs = require('fs');
let file = 'src/components/CandidateTable.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/overflow-y-auto p-4 bg-white flex-1 min-h-\[300px\]/g, 'overflow-auto p-4 bg-white flex-1 min-h-[300px]');
fs.writeFileSync(file, content);
console.log('Fixed CandidateTable');
