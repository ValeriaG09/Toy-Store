const fs = require('fs');
const path = require('path');

const frontDir = path.join(__dirname, 'front');
const backDir = path.join(__dirname, 'back');

// 1. Rename SVGs
const imagesDir = path.join(frontDir, 'public', 'images');
const vulvaPath = path.join(imagesDir, 'custom_vulva.svg');
const penePath = path.join(imagesDir, 'custom_pene.svg');
const newVulvaPath = path.join(imagesDir, 'shape_v.svg');
const newPenePath = path.join(imagesDir, 'shape_p.svg');

if (fs.existsSync(vulvaPath)) fs.renameSync(vulvaPath, newVulvaPath);
if (fs.existsSync(penePath)) fs.renameSync(penePath, newPenePath);

// 2. Emoji Removal Regex
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}]/gu;

// 3. Process Files
function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'public' || file.endsWith('.png') || file.endsWith('.svg')) continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.sql') || fullPath.endsWith('.html') || fullPath.endsWith('.md')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;

                // Fix ALPN error in vite.config.js
                if (file === 'vite.config.js') {
                    if (content.includes('http://localhost:5000')) {
                        content = content.replace(/http:\/\/localhost:5000/g, 'http://127.0.0.1:5000');
                        modified = true;
                    }
                }

                // Replace SVG names
                if (content.includes('custom_vulva.svg')) {
                    content = content.replace(/custom_vulva\.svg/g, 'shape_v.svg');
                    modified = true;
                }
                if (content.includes('custom_pene.svg')) {
                    content = content.replace(/custom_pene\.svg/g, 'shape_p.svg');
                    modified = true;
                }

                // Remove emojis
                if (emojiRegex.test(content)) {
                    content = content.replace(emojiRegex, '');
                    modified = true;
                }

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

processDir(frontDir);
processDir(backDir);
console.log('Done fixing errors and removing emojis!');
