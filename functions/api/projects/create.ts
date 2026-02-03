import { Octokit } from '@octokit/rest';
import yaml from 'js-yaml';

const GITHUB_CONFIG = {
    owner: 'jimmyeliasson',  // TODO: Replace with your GitHub username
    repo: 'jimmyeliasson.dev',
    branch: 'main'
};

function getGitHubClient(env: any): Octokit {
    const token = env.GITHUB_TOKEN;

    if (!token) {
        throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    return new Octokit({ auth: token });
}

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        const data = await request.json();

        // Validate required fields
        if (!data.slug || !data.title_sv || !data.title_en) {
            return new Response(JSON.stringify({
                error: 'Missing required fields: slug, title_sv, title_en'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize slug
        const slug = data.slug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Build frontmatter in Astro Content Collections format
        const frontmatter: any = {
            title: {
                sv: data.title_sv,
                en: data.title_en
            },
            description: {
                sv: data.description_sv || '',
                en: data.description_en || ''
            },
            status: data.status || 'active',
            year: data.year || new Date().getFullYear(),
            tags: data.tags || [],
            stack: data.stack || [],
            coverImage: data.coverImage || '/images/covers/placeholder.svg'
        };

        // Optional fields
        if (data.role_sv && data.role_en) {
            frontmatter.role = {
                sv: data.role_sv,
                en: data.role_en
            };
        }

        if (data.repo_link || data.live_link) {
            frontmatter.links = {};
            if (data.repo_link) frontmatter.links.repo = data.repo_link;
            if (data.live_link) frontmatter.links.live = data.live_link;
        }

        if (data.highlightBullets_sv && data.highlightBullets_en) {
            frontmatter.highlightBullets = {
                sv: data.highlightBullets_sv,
                en: data.highlightBullets_en
            };
        }

        // Generate markdown file content
        const fileContent = `---
${yaml.dump(frontmatter, { indent: 2 })}---

${data.body || '# Project Content\n\nAdd your project description here...'}
`;

        // Commit to GitHub
        const octokit = getGitHubClient(env);
        const filePath = `src/content/projects/${slug}.md`;

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: add project ${slug}`,
            content: Buffer.from(fileContent).toString('base64'),
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({
            success: true,
            slug,
            message: 'Project created successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error creating project:', error);

        return new Response(JSON.stringify({
            error: 'Failed to create project',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
