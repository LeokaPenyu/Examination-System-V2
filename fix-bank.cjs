const fs = require("fs");
const file = "src/components/QuestionBankModule.tsx";
let cnt = fs.readFileSync(file, "utf8");
cnt = cnt.replace(/min-w-\[400px\]/g, "w-11/12 max-w-[400px]");
fs.writeFileSync(file, cnt);
