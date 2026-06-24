const fs = require('fs');

let path = "src/components/PerananPengguna.tsx";
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/border border-gray-200 rounded-xl overflow-hidden shadow-sm/g, "border border-gray-200 rounded-xl overflow-x-auto shadow-sm");
fs.writeFileSync(path, content);
console.log("Updated", path);
