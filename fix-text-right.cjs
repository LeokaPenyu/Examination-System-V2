const fs = require('fs');

let file = "src/components/ExamApplicationModule.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/text-right/g, "md:text-right text-left");
fs.writeFileSync(file, content);

file = "src/components/ExamSummaryView.tsx";
content = fs.readFileSync(file, "utf8");
content = content.replace(/flex justify-end items-center/g, "flex justify-start md:justify-end items-center");
content = content.replace(/flex justify-end items-start mt-2/g, "flex justify-start md:justify-end items-start mt-2");
fs.writeFileSync(file, content);

file = "src/components/ExamTypeSelection.tsx";
content = fs.readFileSync(file, "utf8");
content = content.replace(/w-1\/4 text-right pr-4/g, "w-full md:w-1/4 md:text-right text-left md:pr-4 mb-2 md:mb-0");
content = content.replace(/<div className="px-4 md:px-8 py-10 flex /g, '<div className="px-4 md:px-8 py-10 flex flex-col md:flex-row ');
content = content.replace(/<div className="px-4 md:px-8 py-10 flex border-b/g, '<div className="px-4 md:px-8 py-10 flex flex-col md:flex-row border-b'); // just in case
fs.writeFileSync(file, content);

file = "src/components/Jurulatih.tsx";
content = fs.readFileSync(file, "utf8");
content = content.replace(/<div className="flex items-center gap-4">/g, '<div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">');
content = content.replace(/w-48 text-right/g, "w-auto md:w-48 text-left md:text-right");
fs.writeFileSync(file, content);

console.log("Fixed text alignment issues for mobile");
