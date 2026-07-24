import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []): string[] => {
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

const allIcons = new Set<string>();

const processFiles = (files: string[]) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g);
    if (matches) {
      matches.forEach(match => {
        const regexMatch = match.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
        if (regexMatch) {
            const iconsStr = regexMatch[1];
            const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
            icons.forEach(i => allIcons.add(i));
        }
      });
    }
  });
}

processFiles(adminFiles);
processFiles(clientFiles);

const sortedIcons = Array.from(allIcons).sort();
console.log(`Total unique icons: ${sortedIcons.length}`);
console.log(sortedIcons.join(', '));
