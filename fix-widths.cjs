const fs = require("fs");

let path = "src/components/ExamSummaryView.tsx";
let content = fs.readFileSync(path, "utf8");
content = content.replace(/w-\[500px\]/g, "w-full max-w-[500px]");
// Replace grid-cols-[150px_1fr_1fr]
content = content.replace(/grid-cols-\[150px_1fr_1fr\]/g, "grid-cols-1 md:grid-cols-[150px_1fr_1fr]");
content = content.replace(/grid-cols-\[200px_1fr\]/g, "grid-cols-1 md:grid-cols-[200px_1fr]");
fs.writeFileSync(path, content);
console.log("Updated", path);

path = "src/components/CertificateRenewalModule.tsx";
content = fs.readFileSync(path, "utf8");
content = content.replace(/grid-cols-\[160px_1fr\]/g, "grid-cols-1 md:grid-cols-[160px_1fr]");
content = content.replace(/grid-cols-\[200px_1fr\]/g, "grid-cols-1 md:grid-cols-[200px_1fr]");
fs.writeFileSync(path, content);
console.log("Updated", path);

path = "src/components/Calon.tsx";
content = fs.readFileSync(path, "utf8");
content = content.replace(/grid-cols-\[120px_1fr\]/g, "grid-cols-1 sm:grid-cols-[120px_1fr]");
fs.writeFileSync(path, content);
console.log("Updated", path);

