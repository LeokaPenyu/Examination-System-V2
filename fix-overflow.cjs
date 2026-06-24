const fs = require('fs');
let file = 'src/components/ProfilPengguna.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/overflow-hidden border border-t-0/g, 'overflow-x-auto border border-t-0');
fs.writeFileSync(file, content);
