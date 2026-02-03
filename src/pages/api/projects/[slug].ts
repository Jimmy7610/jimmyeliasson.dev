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

export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const { slug } = params;
        const data = await request.json();
        const octokit = getGitHubClient();
        const filePath = `src/content/projects/${slug}.md`;

        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        const frontmatter: any = {
            title: { sv: data.title_sv, en: data.title_en },
            description: { sv: data.description_sv, en: data.description_en },
            status: data.status,
            year: data.year,
            tags: data.tags || [],
            stack: data.stack || [],
            coverImage: data.coverImage
        };

        if (data.role_sv && data.role_en) {
            frontmatter.role = { sv: data.role_sv, en: data.role_en };
        }

        if (data.repo_link || data.live_link) {
            frontmatter.links = {};
            if (data.repo_link) frontmatter.links.repo = data.repo_link;
            if (data.live_link) frontmatter.links.live = data.live_link;
        }

        const fileContent = `---
${yaml.dump(frontmatter, { indent: 2 })}---

${data.body || ''}
`;

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: update project ${slug}`,
            content: Buffer.from(fileContent).toString('base64'),
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({ success: true }), {
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

export const DELETE: APIRoute = async ({ params }) => {
    try {
        const { slug } = params;
        const octokit = getGitHubClient();
        const filePath = `src/content/projects/${slug}.md`;

        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        await octokit.repos.deleteFile({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: delete project ${slug}`,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({ success: true }), {
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
