const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const newContent = content
        .replace(/([\s'"])px-8([\s'"])/g, '$1px-4 md:px-8$2')
        .replace(/([\s'"])px-6([\s'"])/g, '$1px-4 md:px-6$2');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated px in ${path.basename(filePath)}`);
    }
};

const files = fs.readdirSync(componentsDir);
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        replaceInFile(path.join(componentsDir, file));
    }
});
