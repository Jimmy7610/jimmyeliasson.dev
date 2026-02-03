import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Transform Decap CMS flat bilingual fields to nested structure
 * 
 * Decap CMS saves:
 *   title_sv: "Svenska"
 *   title_en: "English"
 * 
 * Astro expects:
 *   title:
 *     sv: "Svenska"
 *     en: "English"
 */

const COLLECTIONS = ['projects', 'updates'];

function transformFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    const transformed = { ...data };

    // Transform bilingual fields
    const bilingualFields = ['title', 'description', 'role', 'highlightBullets'];

    bilingualFields.forEach(field => {
        const svKey = `${field}_sv`;
        const enKey = `${field}_en`;

        if (transformed[svKey] !== undefined || transformed[enKey] !== undefined) {
            transformed[field] = {
                sv: transformed[svKey] || '',
                en: transformed[enKey] || ''
            };
            delete transformed[svKey];
            delete transformed[enKey];
        }
    });

    // Transform links
    if (transformed.repo_link || transformed.live_link) {
        transformed.links = {};
        if (transformed.repo_link) {
            transformed.links.repo = transformed.repo_link;
            delete transformed.repo_link;
        }
        if (transformed.live_link) {
            transformed.links.live = transformed.live_link;
            delete transformed.live_link;
        }
    }

    // Write back
    const newContent = matter.stringify(body, transformed);
    fs.writeFileSync(filePath, newContent, 'utf8');
}

function processCollection(collectionName) {
    const dirPath = path.join(process.cwd(), 'src', 'content', collectionName);

    if (!fs.existsSync(dirPath)) {
        console.log(`Collection ${collectionName} not found, skipping`);
        return;
    }

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        try {
            transformFile(filePath);
            console.log(`✓ Transformed ${collectionName}/${file}`);
        } catch (error) {
            console.error(`✗ Error transforming ${collectionName}/${file}:`, error.message);
        }
    });
}

// Run transformation
console.log('🔄 Transforming Decap CMS content to Astro format...\n');

COLLECTIONS.forEach(processCollection);

console.log('\n✅ Transformation complete!');
