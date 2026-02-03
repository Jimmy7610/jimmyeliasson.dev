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
        const filePath = `src/content/updates/${slug}.md`;

        // Get existing file
        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        // Build frontmatter
        const frontmatter: any = {
            title: {
                sv: data.title_sv,
                en: data.title_en
            },
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

        return new Response(JSON.stringify({
            success: true,
            message: 'Update updated successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error updating update:', error);

        return new Response(JSON.stringify({
            error: 'Failed to update',
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
        const filePath = `src/content/updates/${slug}.md`;

        // Get file
        const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            ref: GITHUB_CONFIG.branch
        });

        if (Array.isArray(fileData) || fileData.type !== 'file') {
            throw new Error('Invalid file');
        }

        // Delete
        await octokit.repos.deleteFile({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: delete update ${slug}`,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Update deleted successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error deleting update:', error);

        return new Response(JSON.stringify({
            error: 'Failed to delete',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
