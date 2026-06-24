const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // gap-8, gap-6 too to prevent flex items overflowing
    const newContent = content
        .replace(/([\s'"])py-8([\s'"])/g, '$1py-4 md:py-8$2')
        .replace(/([\s'"])py-6([\s'"])/g, '$1py-4 md:py-6$2')
        .replace(/([\s'"])gap-8([\s'"])/g, '$1gap-4 md:gap-8$2')
        .replace(/([\s'"])gap-6([\s'"])/g, '$1gap-4 md:gap-6$2');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated py/gap in ${path.basename(filePath)}`);
    }
};

const files = fs.readdirSync(componentsDir);
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        replaceInFile(path.join(componentsDir, file));
    }
});
