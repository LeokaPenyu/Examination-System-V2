const fs = require('fs');
let file = 'src/components/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '${isOpen ? \'translate-x-0\' : \'-translate-x-full lg:translate-x-0\'}',
  '${isOpen ? \'translate-x-0\' : \'-translate-x-full\'}'
);

fs.writeFileSync(file, content);
console.log('Fixed Sidebar visibility');
