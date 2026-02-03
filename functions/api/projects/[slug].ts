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

export async function onRequestPut(context: any) {
    const { request, env, params } = context;
    const { slug } = params;

    try {
        const data = await request.json();
        const octokit = getGitHubClient(env);
        const filePath = `src/content/projects/${slug}.md`;

        // Get existing file to retrieve SHA
        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        // Build updated frontmatter
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

${data.body || ''}
`;

        // Update file with SHA
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: update project ${slug}`,
            content: Buffer.from(fileContent).toString('base64'),
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Project updated successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error updating project:', error);

        return new Response(JSON.stringify({
            error: 'Failed to update project',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestDelete(context: any) {
    const { env, params } = context;
    const { slug } = params;

    try {
        const octokit = getGitHubClient(env);
        const filePath = `src/content/projects/${slug}.md`;

        // Get file to retrieve SHA
        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        // Delete file
        await octokit.repos.deleteFile({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: delete project ${slug}`,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Project deleted successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error deleting project:', error);

        return new Response(JSON.stringify({
            error: 'Failed to delete project',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
