const fs = require('fs');
let file = 'src/components/ApplicationForm.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /className="max-w-\[1200px\] mx-auto space-y-8 pb-20"/g,
    'className="max-w-[1200px] mx-auto space-y-8 pb-20 px-2 sm:px-4 md:px-0"'
);

fs.writeFileSync(file, content);
console.log('Fixed ApplicationForm padding');
