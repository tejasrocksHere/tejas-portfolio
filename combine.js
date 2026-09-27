import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File types to include
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.html'];

// Folders or files to ignore
const IGNORED_NAMES = [
    'node_modules',
    'dist',
    '.git',
    'combine.js',
    'package-lock.json', // ignored because it is huge, remove this line if you need it
    'all_code.txt'
];

const OUTPUT_FILE = path.join(__dirname, 'all_code.txt');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        // Skip ignored files and folders
        if (IGNORED_NAMES.includes(file)) return;

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ALLOWED_EXTENSIONS.includes(ext)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

function combineFiles() {
    const files = getAllFiles(__dirname);
    let combinedContent = '';

    files.forEach((filePath) => {
        const relativePath = path.relative(__dirname, filePath);
        const content = fs.readFileSync(filePath, 'utf-8');

        combinedContent += `\n${'='.repeat(80)}\n`;
        combinedContent += `FILE: ${relativePath}\n`;
        combinedContent += `${'='.repeat(80)}\n\n`;
        combinedContent += content;
        combinedContent += '\n\n';
    });

    fs.writeFileSync(OUTPUT_FILE, combinedContent, 'utf-8');
    console.log(`✅ Successfully combined ${files.length} files into: all_code.txt`);
}

combineFiles();