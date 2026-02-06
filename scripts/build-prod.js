import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const deployDir = path.join(rootDir, 'deploy');

// Ensure deploy directory exists
if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir);

console.log('Building frontend...');
try {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}

console.log('Copying files to deploy directory...');

// Copy dist
fs.cpSync(path.join(rootDir, 'dist'), path.join(deployDir, 'dist'), { recursive: true });

// Copy server
// Create server directory
fs.mkdirSync(path.join(deployDir, 'server'));

// Read server directory and copy everything EXCEPT database.sqlite
// We don't want to overwrite the production DB with a local dev DB usually, 
// OR we do if it's the first time. checking user intent. 
// User asked "where to allocate", implies they want to know where it lives.
// I'll copy the source files. If they want to upload a seeded DB they can.
const serverFiles = fs.readdirSync(path.join(rootDir, 'server'));
serverFiles.forEach(file => {
    if (file === 'node_modules') return; // Should not exist there but just in case
    // Optional: Exclude database.sqlite if you don't want to ship local data
    // if (file === 'database.sqlite') return; 

    // Copy wasm file if present
    if (file.endsWith('.wasm')) {
        fs.copyFileSync(path.join(rootDir, 'server', file), path.join(deployDir, 'server', file));
        return;
    }


    fs.cpSync(
        path.join(rootDir, 'server', file),
        path.join(deployDir, 'server', file),
        { recursive: true }
    );
});

// Copy package.json and other root configs
fs.cpSync(path.join(rootDir, 'package.json'), path.join(deployDir, 'package.json'));
// Copy package-lock.json if exists
if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
    fs.cpSync(path.join(rootDir, 'package-lock.json'), path.join(deployDir, 'package-lock.json'));
}

// Copy .npmrc if exists
if (fs.existsSync(path.join(rootDir, '.npmrc'))) {
    fs.cpSync(path.join(rootDir, '.npmrc'), path.join(deployDir, '.npmrc'));
}

// Copy .node-version if exists
if (fs.existsSync(path.join(rootDir, '.node-version'))) {
    fs.cpSync(path.join(rootDir, '.node-version'), path.join(deployDir, '.node-version'));
}

// Copy uploads folder structure (empty)
if (!fs.existsSync(path.join(deployDir, 'uploads'))) {
    fs.mkdirSync(path.join(deployDir, 'uploads'));
}

// Create tmp folder (useful for shared hosting enviroments to set TMPDIR)
if (!fs.existsSync(path.join(deployDir, 'tmp'))) {
    fs.mkdirSync(path.join(deployDir, 'tmp'));
}

console.log('Deployment build created in "deploy" folder.');
console.log('Instructions:');
console.log('1. Upload the contents of the "deploy" folder to your server.');
console.log('2. Run "npm install --production" on the server.');
console.log('3. Set the startup file to "server/index.cjs".');
