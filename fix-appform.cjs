const fs = require("fs");
const file = "src/components/ExamApplicationModule.tsx";
let cnt = fs.readFileSync(file, "utf8");
cnt = cnt.replace(/grid-cols-\[160px_1fr\]/g, "grid-cols-1 md:grid-cols-[160px_1fr]");
cnt = cnt.replace(/w-\[120px\]/g, "w-full md:w-[120px]");
fs.writeFileSync(file, cnt);
