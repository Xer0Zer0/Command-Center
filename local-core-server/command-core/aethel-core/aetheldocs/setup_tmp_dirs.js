const fs = require('fs');

const modules = [
    'corporate_identity',
    'commercial_operations',
    'community_engagement',
    'executive_management',
    'expansion_module',
    'system_administration',
    'working_files'
];

const basePath = path.join(__dirname);

modules.forEach(module => {
    const tmpPath = path.join(basePath, module, 'tmp');
    if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath, { recursive: true });
        console.log(`Created: ${module}/tmp/`);
    } else {
        console.log(`Already exists: ${module}/tmp/`);
    }
});

console.log('All pillar temporary staging directories are ready.');
