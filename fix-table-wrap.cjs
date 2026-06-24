const fs = require('fs');

const wrapTable = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<table/g, '<div className="overflow-x-auto">\n        <table');
    content = content.replace(/<\/table>/g, '</table>\n        </div>');
    fs.writeFileSync(filePath, content);
};

wrapTable('src/components/RetestModule.tsx');
wrapTable('src/components/ExamResultsEntry.tsx');
console.log("Wrapped tables in Retest and ExamResultsEntry");
