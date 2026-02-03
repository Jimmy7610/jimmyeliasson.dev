import { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface ProjectFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        slug?: string;
        title_sv?: string;
        title_en?: string;
        description_sv?: string;
        description_en?: string;
        role_sv?: string;
        role_en?: string;
        status?: string;
        year?: number;
        tags?: string[];
        stack?: string[];
        repo_link?: string;
        live_link?: string;
        coverImage?: string;
        highlightBullets_sv?: string[];
        highlightBullets_en?: string[];
        body?: string;
    };
}

export default function ProjectForm({ mode, initialData }: ProjectFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [titleSv, setTitleSv] = useState(initialData?.title_sv || '');
    const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
    const [descSv, setDescSv] = useState(initialData?.description_sv || '');
    const [descEn, setDescEn] = useState(initialData?.description_en || '');
    const [roleSv, setRoleSv] = useState(initialData?.role_sv || '');
    const [roleEn, setRoleEn] = useState(initialData?.role_en || '');
    const [status, setStatus] = useState(initialData?.status || 'active');
    const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [stack, setStack] = useState<string[]>(initialData?.stack || []);
    const [repoLink, setRepoLink] = useState(initialData?.repo_link || '');
    const [liveLink, setLiveLink] = useState(initialData?.live_link || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [highlightsSv, setHighlightsSv] = useState<string[]>(initialData?.highlightBullets_sv || []);
    const [highlightsEn, setHighlightsEn] = useState<string[]>(initialData?.highlightBullets_en || []);
    const [body, setBody] = useState(initialData?.body || '');

    // Input helpers
    const [tagInput, setTagInput] = useState('');
    const [stackInput, setStackInput] = useState('');
    const [highlightSvInput, setHighlightSvInput] = useState('');
    const [highlightEnInput, setHighlightEnInput] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Auto-generate slug from English title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleEnChange = (value: string) => {
        setTitleEn(value);
        if (mode === 'create' && !slug) {
            setSlug(generateSlug(value));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/functions/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setCoverImage(data.path);
        } catch (err) {
            alert('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                slug,
                title_sv: titleSv,
                title_en: titleEn,
                description_sv: descSv,
                description_en: descEn,
                role_sv: roleSv || undefined,
                role_en: roleEn || undefined,
                status,
                year,
                tags,
                stack,
                repo_link: repoLink || undefined,
                live_link: liveLink || undefined,
                coverImage,
                highlightBullets_sv: highlightsSv.length > 0 ? highlightsSv : undefined,
                highlightBullets_en: highlightsEn.length > 0 ? highlightsEn : undefined,
                body
            };

            const endpoint = mode === 'create'
                ? '/functions/api/projects/create'
                : `/functions/api/projects/${initialData?.slug}`;

            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save project');
            }

            window.location.href = '/admin/projects';
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {/* Basic Info */}
            <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-text-primary border-b border-glass-border pb-2">
                    Grundläggande Information
                </h3>

                {/* Slug */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Slug (URL) *
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        required
                        disabled={mode === 'edit'}
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300 disabled:opacity-50"
                        placeholder="my-project"
                    />
                    <p className="text-xs text-text-muted mt-1">
                        Endast små bokstäver och bindestreck. {mode === 'edit' && 'Kan ej ändras efter skapande.'}
                    </p>
                </div>

                {/* Title SV */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Titel (Svenska) *
                    </label>
                    <input
                        type="text"
                        value={titleSv}
                        onChange={(e) => setTitleSv(e.target.value)}
                        required
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                    />
                </div>

                {/* Title EN */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Title (English) *
                    </label>
                    <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => handleTitleEnChange(e.target.value)}
                        required
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                    />
                </div>

                {/* Description SV */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Beskrivning (Svenska) *
                    </label>
                    <textarea
                        value={descSv}
                        onChange={(e) => setDescSv(e.target.value)}
                        required
                        rows={3}
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                    />
                </div>

                {/* Description EN */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Description (English) *
                    </label>
                    <textarea
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        required
                        rows={3}
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                    />
                </div>

                {/* Role (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            Roll (Svenska)
                        </label>
                        <input
                            type="text"
                            value={roleSv}
                            onChange={(e) => setRoleSv(e.target.value)}
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="T.ex. Fullstack-utvecklare"
                        />
                    </div>
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            Role (English)
                        </label>
                        <input
                            type="text"
                            value={roleEn}
                            onChange={(e) => setRoleEn(e.target.value)}
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="E.g. Fullstack Developer"
                        />
                    </div>
                </div>
            </div>

            {/* Status & Year */}
            <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-text-primary border-b border-glass-border pb-2">
                    Status & Tidpunkt
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            Status *
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                        >
                            <option value="active">Active</option>
                            <option value="done">Done</option>
                            <option value="paused">Paused</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            År *
                        </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            min={2020}
                            max={2030}
                            required
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Tags & Stack */}
            <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-text-primary border-b border-glass-border pb-2">
                    Taggar & Teknologi
                </h3>

                {/* Tags */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Taggar
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), tagInput && (setTags([...tags, tagInput]), setTagInput('')))}
                            className="flex-1 bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="Lägg till tagg..."
                        />
                        <button
                            type="button"
                            onClick={() => tagInput && (setTags([...tags, tagInput]), setTagInput(''))}
                            className="px-4 py-2 bg-glass-surface border border-glass-border text-cyan-primary rounded-lg hover:border-cyan-primary transition-all duration-300"
                        >
                            +
                        </button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/30 rounded-md text-sm flex items-center gap-2">
                                    {tag}
                                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stack */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Tech Stack *
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={stackInput}
                            onChange={(e) => setStackInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), stackInput && (setStack([...stack, stackInput]), setStackInput('')))}
                            className="flex-1 bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="T.ex. React, Node.js, PostgreSQL..."
                        />
                        <button
                            type="button"
                            onClick={() => stackInput && (setStack([...stack, stackInput]), setStackInput(''))}
                            className="px-4 py-2 bg-glass-surface border border-glass-border text-cyan-primary rounded-lg hover:border-cyan-primary transition-all duration-300"
                        >
                            +
                        </button>
                    </div>
                    {stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {stack.map(tech => (
                                <span key={tech} className="px-3 py-1 bg-green-acid/20 text-green-acid border border-green-acid/30 rounded-md text-sm flex items-center gap-2">
                                    {tech}
                                    <button type="button" onClick={() => setStack(stack.filter(t => t !== tech))} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Links & Image */}
            <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-text-primary border-b border-glass-border pb-2">
                    Länkar & Bild
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            GitHub Repository
                        </label>
                        <input
                            type="url"
                            value={repoLink}
                            onChange={(e) => setRepoLink(e.target.value)}
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="text-text-secondary text-sm font-medium block mb-2">
                            Live Demo
                        </label>
                        <input
                            type="url"
                            value={liveLink}
                            onChange={(e) => setLiveLink(e.target.value)}
                            className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Cover Image */}
                <div>
                    <label className="text-text-secondary text-sm font-medium block mb-2">
                        Cover Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-primary/20 file:text-cyan-primary hover:file:bg-cyan-primary/30 transition-all duration-300"
                    />
                    {uploadingImage && <p className="text-sm text-cyan-primary mt-2">Laddar upp...</p>}
                    {coverImage && (
                        <div className="mt-2">
                            <img src={coverImage} alt="Preview" className="max-w-xs rounded-lg border border-glass-border" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <h3 className="text-xl font-display font-semibold text-text-primary border-b border-glass-border pb-2">
                    Projektinnehåll
                </h3>

                <MarkdownEditor
                    value={body}
                    onChange={setBody}
                    label="Projektbeskrivning (Markdown) *"
                    placeholder="# Om projektet\n\nSkriv en detaljerad beskrivning av ditt projekt här..."
                    minHeight="500px"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-primary to-green-acid text-glass-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sparar...' : mode === 'create' ? 'Skapa Projekt' : 'Spara Ändringar'}
                </button>
                <a
                    href="/admin/projects"
                    className="px-6 py-3 bg-glass-surface border border-glass-border text-text-primary rounded-lg hover:border-cyan-primary transition-all duration-300"
                >
                    Avbryt
                </a>
            </div>
        </form>
    );
}
