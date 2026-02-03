import { useState } from 'react';
import { marked } from 'marked';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    minHeight?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    label = 'Content',
    placeholder = 'Write your markdown content here...',
    minHeight = '400px'
}: MarkdownEditorProps) {
    const [showPreview, setShowPreview] = useState(false);

    // Parse markdown safely
    const getPreview = () => {
        try {
            return marked.parse(value || '');
        } catch (error) {
            return '<p class="text-red-500">Error parsing markdown</p>';
        }
    };

    return (
        <div className="space-y-2">
            {/* Label & Toggle */}
            <div className="flex items-center justify-between">
                <label className="text-text-secondary text-sm font-medium">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-cyan-primary hover:text-green-acid transition-colors duration-300 font-medium"
                >
                    {showPreview ? '✏️ Edit' : '👁️ Preview'}
                </button>
            </div>

            {/* Editor or Preview */}
            <div className="relative">
                {!showPreview ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-glass-surface border border-glass-border text-text-primary rounded-lg px-4 py-3 focus:border-cyan-primary focus:ring-2 focus:ring-cyan-primary/20 transition-all duration-300 font-mono text-sm resize-y"
                        style={{ minHeight }}
                    />
                ) : (
                    <div
                        className="w-full bg-glass-surface border border-glass-border rounded-lg px-4 py-3 prose prose-invert prose-cyan prose-sm max-w-none"
                        style={{ minHeight }}
                        dangerouslySetInnerHTML={{ __html: getPreview() }}
                    />
                )}
            </div>

            {/* Helper Text */}
            <p className="text-xs text-text-muted">
                Supports <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:text-green-acid">Markdown syntax</a>
            </p>
        </div>
    );
}
