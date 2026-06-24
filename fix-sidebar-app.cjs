const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '          setIsSidebarOpen(false);\n          if (view === \'ExamApplication\') {',
  '          if (window.innerWidth < 1024) setIsSidebarOpen(false);\n          if (view === \'ExamApplication\') {'
);

content = content.replace(
  '<main className="flex-1 min-w-0 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">',
  '<main className={`flex-1 min-w-0 ${isSidebarOpen ? \'lg:ml-72\' : \'\'} min-h-screen flex flex-col transition-all duration-300`}>'
);

fs.writeFileSync(file, content);
console.log('Fixed App.tsx sidebar logic');
