import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove Drawings from PROJECTS_DATA
content = content.replace(/,\s*{\s*id:\s*4[\s\S]*?}\s*\]/, '\n]');

// 2. Remove BLOGS_DATA
content = content.replace(/\/\/ Preset blogs data[\s\S]*?const BLOGS_DATA = \[[\s\S]*?\];\n/, '');

// 3. Remove Services Estimator Budget logic (from lines ~484 to ~614)
content = content.replace(/\/\/ Services Estimator Budget logic[\s\S]*?const handleCopyProposal = \(\) => {[\s\S]*?};\n/, '');

// 4. Remove blog search helper
content = content.replace(/\/\/ Blog search helper[\s\S]*?\}\);\n/, '');

// 5. Remove Services and Blog sections from JSX
// Replace from id="services" up to id="contact"
content = content.replace(/\{\/\* Services Section Scope Builder \*\/\}[\s\S]*?(?=\{\/\* Contact Section \*\/\}|id="contact")/, '');

// 6. Remove blog from navbar
content = content.replace(/<a href="#blog"[\s\S]*?Blog<\/a>/, '');

// 7. Update Portfolio section
// Make it only Development
content = content.replace(/\{\["All", "Development", "Drawings"\].map\(filter/g, '{["All", "Development"].map(filter');

fs.writeFileSync(appPath, content);
console.log("Refactoring complete.");
