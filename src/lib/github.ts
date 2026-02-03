import { Octokit } from '@octokit/rest';

// GitHub configuration
export const GITHUB_CONFIG = {
    owner: import.meta.env.GITHUB_OWNER || process.env.GITHUB_OWNER || 'jimmyeliasson',
    repo: import.meta.env.GITHUB_REPO || process.env.GITHUB_REPO || 'jimmyeliasson.dev',
    branch: import.meta.env.GITHUB_BRANCH || process.env.GITHUB_BRANCH || 'main'
};

// Get authenticated GitHub client
export function getGitHubClient(): Octokit {
    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

    if (!token) {
        throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    return new Octokit({
        auth: token
    });
}

// Helper to check if running in development
export function isDevelopment(): boolean {
    return import.meta.env.DEV || process.env.NODE_ENV === 'development';
}
