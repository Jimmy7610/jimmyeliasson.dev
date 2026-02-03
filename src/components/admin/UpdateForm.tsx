import { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface UpdateFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        slug?: string;
        title_sv?: string;
        title_en?: string;
        date?: string;
        tags?: string[];
        body?: string;
    };
}

export default function UpdateForm({ mode, initialData }: UpdateFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [titleSv, setTitleSv] = useState(initialData?.title_sv || '');
    const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [body, setBody] = useState(initialData?.body || '');

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                title_sv: titleSv,
                title_en: titleEn,
                date,
                tags,
                body
            };

            const endpoint = mode === 'create'
                ? '/api/updates/create'
                : `/api/updates/${initialData?.slug}`;


            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save update');
            }

            // Redirect to updates list
            window.location.href = '/admin/updates';
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {/* Title (Swedish) */}
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
                    placeholder="T.ex. Portfolio 2.0 Lansering"
                />
            </div>

            {/* Title (English) */}
            <div>
                <label className="text-text-secondary text-sm font-medium block mb-2">
                    Title (English) *
                </label>
                <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    required
                    className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                    placeholder="E.g. Portfolio 2.0 Launch"
                />
            </div>

            {/* Date */}
            <div>
                <label className="text-text-secondary text-sm font-medium block mb-2">
                    Datum *
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                />
            </div>

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
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-2 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300"
                        placeholder="Lägg till tagg..."
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-glass-surface border border-glass-border text-cyan-primary rounded-lg hover:border-cyan-primary transition-all duration-300"
                    >
                        + Lägg till
                    </button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/30 rounded-md text-sm flex items-center gap-2"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-red-500 transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Body (Markdown) */}
            <MarkdownEditor
                value={body}
                onChange={setBody}
                label="Innehåll *"
                placeholder="Skriv ditt bygglogg-inlägg här..."
            />

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-acid to-cyan-primary text-glass-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-green-acid/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sparar...' : mode === 'create' ? 'Skapa Uppdatering' : 'Spara Ändringar'}
                </button>
                <a
                    href="/admin/updates"
                    className="px-6 py-3 bg-glass-surface border border-glass-border text-text-primary rounded-lg hover:border-cyan-primary transition-all duration-300"
                >
                    Avbryt
                </a>
            </div>
        </form>
    );
}
