import { Octokit } from '@octokit/rest';

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
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return new Response(JSON.stringify({
                error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return new Response(JSON.stringify({
                error: 'File too large. Maximum size: 5MB'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const sanitizedName = file.name
            .replace(/\.[^/.]+$/, '') // Remove extension
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const filename = `${timestamp}-${sanitizedName}.${extension}`;

        // Read file as buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to GitHub
        const octokit = getGitHubClient(env);
        const filePath = `public/images/covers/${filename}`;

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.owner,
            repo: GITHUB_CONFIG.repo,
            path: filePath,
            message: `admin: upload cover image ${filename}`,
            content: buffer.toString('base64'),
            branch: GITHUB_CONFIG.branch
        });

        // Return public URL
        const publicPath = `/images/covers/${filename}`;

        return new Response(JSON.stringify({
            success: true,
            path: publicPath,
            filename,
            message: 'Image uploaded successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error uploading image:', error);

        return new Response(JSON.stringify({
            error: 'Failed to upload image',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
