const fs = require('fs');

let file = "src/components/Jurulatih.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/text-nowrap/g, "");
fs.writeFileSync(file, content);
console.log("Removed text-nowrap from Jurulatih.tsx");
