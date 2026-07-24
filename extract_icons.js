const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const adminFiles = walkSync('/Volumes/CVS Sandisk 1TB SkyBlue/Kwickly/Garage/kwickly-admin-web/src');
const clientFiles = walkSync('/Volumes/CVS Sandisk 1TB SkyBlue/Kwickly/Garage/kwickly-client/src');

const allIcons = new Set();

const processFiles = (files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g);
    if (matches) {
      matches.forEach(match => {
        const iconsStr = match.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/)[1];
        const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
        icons.forEach(i => allIcons.add(i));
      });
    }
  });
}

processFiles(adminFiles);
processFiles(clientFiles);

const sortedIcons = Array.from(allIcons).sort();
console.log(`Total unique icons: ${sortedIcons.length}`);
console.log(sortedIcons.join(', '));
