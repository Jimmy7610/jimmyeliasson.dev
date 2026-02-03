import { Octokit } from '@octokit/rest';
import yaml from 'js-yaml';

const GITHUB_CONFIG = {
    owner: 'jimmyeliasson',
    repo: 'jimmyeliasson.dev',
    branch: 'main'
};

function getGitHubClient(env: any): Octokit {
    return new Octokit({ auth: env.GITHUB_TOKEN });
}

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        const data = await request.json();

        // Validate required fields
        if (!data.title_sv || !data.title_en || !data.date) {
            return new Response(JSON.stringify({
                error: 'Missing required fields: title_sv, title_en, date'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate slug from date and title
        const date = new Date(data.date);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const titleSlug = data.title_en
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const slug = `${dateStr}-${titleSlug}`;

        // Build frontmatter
        const frontmatter: any = {
            title: {
                sv: data.title_sv,
                en: data.title_en
            },
            date: dateStr,
            tags: data.tags || []
        };

        const fileContent = `---
${yaml.dump(frontmatter, { indent: 2 })}---

${data.body || '# Update\n\nAdd your update content here...'}
`;

        // Commit to GitHub
        const octokit = getGitHubClient(env);
        const filePath = `src/content/updates/${slug}.md`;

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: add update ${slug}`,
            content: Buffer.from(fileContent).toString('base64'),
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({
            success: true,
            slug,
            message: 'Update created successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error creating update:', error);

        return new Response(JSON.stringify({
            error: 'Failed to create update',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
