const fs = require("fs");
const path = require("path");

const dir = "src/components";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".tsx"));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, "utf8");
  
  // Fix the corrupted grid-cols-1
  let newContent = content.replace(/grid-cols-1 md:grid-cols-\[150px_1fr\]/g, "grid-cols-1");
  
  // Also properly fix ExamSummaryView.tsx's grid-cols-[150px_1fr] to be grid-cols-1 md:grid-cols-[150px_1fr]
  if (f === "ExamSummaryView.tsx") {
      newContent = newContent.replace(/grid-cols-\[150px_1fr\]/g, "grid-cols-1 md:grid-cols-[150px_1fr]");
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log("Updated", filePath);
  }
});
