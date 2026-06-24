const fs = require('fs');

let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<main className={`flex-1 lg:ml-72 min-h-screen flex flex-col w-full transition-all duration-300`}>/g,
  '<main className="flex-1 min-w-0 lg:ml-72 min-h-screen flex flex-col transition-all duration-300">'
);

content = content.replace(
  /<div className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">/g,
  '<div className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto overflow-x-hidden">'
);

fs.writeFileSync(file, content);
console.log('Fixed wrapper in App.tsx');
