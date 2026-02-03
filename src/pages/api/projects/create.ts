import type { APIRoute } from 'astro';
import { Octokit } from '@octokit/rest';
import yaml from 'js-yaml';

const GITHUB_CONFIG = {
    owner: import.meta.env.GITHUB_OWNER || 'jimmyeliasson',
    repo: import.meta.env.GITHUB_REPO || 'jimmyeliasson.dev',
    branch: import.meta.env.GITHUB_BRANCH || 'main'
};

function getGitHubClient(): Octokit {
    const token = import.meta.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not set');
    return new Octokit({ auth: token });
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        if (!data.slug || !data.title_sv || !data.title_en) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        const frontmatter: any = {
            title: { sv: data.title_sv, en: data.title_en },
            description: { sv: data.description_sv || '', en: data.description_en || '' },
            status: data.status || 'active',
            year: data.year || new Date().getFullYear(),
            tags: data.tags || [],
            stack: data.stack || [],
            coverImage: data.coverImage || '/images/covers/placeholder.svg'
        };

        if (data.role_sv && data.role_en) {
            frontmatter.role = { sv: data.role_sv, en: data.role_en };
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

        const fileContent = `---
${yaml.dump(frontmatter, { indent: 2 })}---

${data.body || '# Project\n\nAdd content here...'}
`;

        const octokit = getGitHubClient();
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: `src/content/projects/${slug}.md`,
            message: `admin: add project ${slug}`,
            content: Buffer.from(fileContent).toString('base64'),
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({ success: true, slug }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
