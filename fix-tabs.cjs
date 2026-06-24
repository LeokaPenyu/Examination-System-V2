const fs = require("fs");

let path = "src/components/ProfilDaerah.tsx";
let content = fs.readFileSync(path, "utf8");
content = content.replace(/flex gap-2 border-b border-gray-100 mb-6/g, "flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto");
fs.writeFileSync(path, content);

path = "src/components/ProfilSubjek.tsx";
content = fs.readFileSync(path, "utf8");
content = content.replace(/flex gap-2 border-b border-gray-100 mb-4/g, "flex gap-2 border-b border-gray-100 mb-4 overflow-x-auto");
fs.writeFileSync(path, content);
