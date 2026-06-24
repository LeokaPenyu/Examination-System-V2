const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We only want to replace p-8 and p-6 if they stand alone (not md:p-8 etc)
    // and aren't already part of a responsive declaration
    const newContent = content
        .replace(/([\s'"])p-8([\s'"])/g, '$1p-4 md:p-8$2')
        .replace(/([\s'"])p-6([\s'"])/g, '$1p-4 md:p-6$2');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated padding in ${path.basename(filePath)}`);
    }
};

const files = fs.readdirSync(componentsDir);
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        replaceInFile(path.join(componentsDir, file));
    }
});
