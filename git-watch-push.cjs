const { watch } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('==================================================');
console.log('🔄 Git Auto-Sync Monitor: ACTIVE');
console.log('Watching for changes in src/, public/, and config files...');
console.log('==================================================');

let timeoutId = null;

const targetsToWatch = [
  path.join(__dirname, 'src'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'vite.config.ts'),
  path.join(__dirname, 'package.json')
];

function runGitSync() {
  try {
    // Check if there are actual unstaged/staged modifications
    const status = execSync('git status --porcelain').toString().trim();
    if (!status) {
      return;
    }
    
    console.log('\n⚡ Change detected. Syncing with GitHub...');
    execSync('git add .');
    
    const timestamp = new Date().toLocaleTimeString();
    const commitMsg = `Auto-sync updates [${timestamp}]`;
    execSync(`git commit -m "${commitMsg}"`);
    
    console.log('📤 Pushing to main branch...');
    execSync('git push origin main');
    console.log('✅ GitHub repository updated successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

function handleChange(eventType, filename) {
  // Ignore temp files, git directory files, or node_modules
  if (!filename || 
      filename.includes('.git') || 
      filename.includes('node_modules') || 
      filename.endsWith('~') || 
      filename.endsWith('.tmp')
  ) {
    return;
  }
  
  // Debounce the auto-commit by 1.5 seconds of inactivity
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = setTimeout(() => {
    runGitSync();
  }, 1500);
}

targetsToWatch.forEach(target => {
  try {
    watch(target, { recursive: true }, handleChange);
  } catch (err) {
    console.warn(`⚠️  Cannot monitor ${path.basename(target)}:`, err.message);
  }
});
