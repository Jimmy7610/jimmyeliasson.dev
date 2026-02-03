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
        const filePath = `src/content/updates/${slug}.md`;

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
            date: data.date,
            tags: data.tags || []
        };

        const fileContent = `---
${yaml.dump(frontmatter, { indent: 2 })}---

${data.body || ''}
`;

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: update ${slug}`,
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
        const filePath = `src/content/updates/${slug}.md`;

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
            message: `admin: delete update ${slug}`,
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
