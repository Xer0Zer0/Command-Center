const fs = require('fs').promises;

const modules = [
    'corporate_identity',
    'commercial_operations',
    'community_engagement',
    'executive_management',
    'expansion_module',
    'system_administration',
    'working_files'
];

async function processLocalStaging() {
    console.log('Starting offline-resilient local processing cycle...');
    
    for (const mod of modules) {
        const tmpDir = path.join(__dirname, mod, 'tmp');
        const processedDir = path.join(__dirname, mod, 'processed');
        
        try {
            await fs.mkdir(processedDir, { recursive: true });
            const files = await fs.readdir(tmpDir);
            if (files.length === 0) continue;

            for (const file of files) {
                if (!file.endsWith('.json') && !file.endsWith('.ndjson')) continue;
                
                const filePath = path.join(tmpDir, file);
                const destPath = path.join(processedDir, file);
                
                const content = await fs.readFile(filePath, 'utf8');
                const lines = content.trim().split('\n');
                
                let validRecords = 0;
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            JSON.parse(line);
                            validRecords++;
                        } catch (err) {
                            console.error(`Malformed JSON in ${mod}/tmp/${file}:`, err.message);
                        }
                    }
                }

                if (validRecords > 0) {
                    await fs.copyFile(filePath, destPath);
                    console.log(`Locally archived ${validRecords} records from ${mod}/${file} to processed/`);
                }

                await fs.unlink(filePath);
                console.log(`Cleaned local staging buffer: ${mod}/tmp/${file}`);
            }
        } catch (err) {
            console.error(`Error processing directory ${mod}/tmp/:`, err.message);
        }
    }
    console.log('Offline synchronization cycle complete.');
}

processLocalStaging();
