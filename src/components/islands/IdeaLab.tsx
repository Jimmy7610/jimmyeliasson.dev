import { useState, useEffect } from 'react';

type Lang = 'sv' | 'en';

interface Idea {
    title: string;
    pitch: string;
    features: string[];
    stack: string[];
}

const categories = {
    sv: ['SaaS-verktyg', 'Utvecklarverktyg', 'Spel', 'Produktivitet', 'Kreativt', 'Utbildning'],
    en: ['SaaS Tools', 'Developer Tools', 'Games', 'Productivity', 'Creative', 'Education'],
};

const features = {
    sv: ['AI-integration', 'Realtidssamarbete', 'Gamification', 'Analytik', 'Automatisering', 'Offline-first'],
    en: ['AI Integration', 'Real-time Collaboration', 'Gamification', 'Analytics', 'Automation', 'Offline-first'],
};

const stacks = [
    ['Next.js', 'Supabase', 'Tailwind'],
    ['Astro', 'Cloudflare', 'React'],
    ['React Native', 'Expo', 'Firebase'],
    ['Unity', 'C#', 'Photon'],
    ['Python', 'FastAPI', 'PostgreSQL'],
    ['Svelte', 'SvelteKit', 'PocketBase'],
];

const projectTypes = {
    sv: [
        'Uppgiftshanterare', 'Noteringsapp', 'Budgetverktyg', 'Fitnesscoach', 'Receptbok',
        'Lärplattform', 'Portfolio-byggare', 'Kodutmaning', 'Tidshantering', 'Vana-tracker',
    ],
    en: [
        'Task Manager', 'Note-taking App', 'Budget Tool', 'Fitness Coach', 'Recipe Book',
        'Learning Platform', 'Portfolio Builder', 'Code Challenge', 'Time Management', 'Habit Tracker',
    ],
};

function generateRandomIdea(lang: Lang): Idea {
    const categoryList = categories[lang];
    const featureList = features[lang];
    const typeList = projectTypes[lang];

    const randomType = typeList[Math.floor(Math.random() * typeList.length)];
    const randomCat = categoryList[Math.floor(Math.random() * categoryList.length)];
    const randomStack = stacks[Math.floor(Math.random() * stacks.length)];

    const selectedFeatures = [];
    const featureCount = 3;
    const shuffledFeatures = [...featureList].sort(() => Math.random() - 0.5);
    for (let i = 0; i < featureCount && i < shuffledFeatures.length; i++) {
        selectedFeatures.push(shuffledFeatures[i]);
    }

    const title = `${randomType} (${randomCat})`;
    const pitch = lang === 'sv'
        ? `En innovativ ${randomType.toLowerCase()} som kombinerar ${randomCat.toLowerCase()} med moderna tekniker för att lösa verkliga problem.`
        : `An innovative ${randomType.toLowerCase()} that combines ${randomCat.toLowerCase()} with modern technologies to solve real-world problems.`;

    return {
        title,
        pitch,
        features: selectedFeatures,
        stack: randomStack,
    };
}

export default function IdeaLab() {
    const [lang, setLang] = useState<Lang>('en');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [seed, setSeed] = useState('');
    const [backlog, setBacklog] = useState<Idea[]>([]);

    useEffect(() => {
        // Get initial language
        const stored = localStorage.getItem('lang');
        setLang((stored === 'sv' || stored === 'en') ? stored : 'en');

        // Load backlog
        const savedBacklog = localStorage.getItem('idea_backlog');
        if (savedBacklog) {
            try {
                setBacklog(JSON.parse(savedBacklog));
            } catch (e) {
                console.error('Failed to parse backlog:', e);
            }
        }

        // Listen for language changes
        const handleLangChange = (e: CustomEvent<{ lang: Lang }>) => {
            setLang(e.detail.lang);
        };

        window.addEventListener('langchange', handleLangChange as EventListener);
        return () => window.removeEventListener('langchange', handleLangChange as EventListener);
    }, []);

    const handleGenerate = () => {
        const newIdeas: Idea[] = [];
        for (let i = 0; i < 5; i++) {
            newIdeas.push(generateRandomIdea(lang));
        }
        setIdeas(newIdeas);
    };

    const handleSave = (idea: Idea) => {
        const updated = [...backlog, idea];
        setBacklog(updated);
        localStorage.setItem('idea_backlog', JSON.stringify(updated));
    };

    const handleRemoveFromBacklog = (index: number) => {
        const updated = backlog.filter((_, i) => i !== index);
        setBacklog(updated);
        localStorage.setItem('idea_backlog', JSON.stringify(updated));
    };

    const t = (key: string) => {
        const translations: Record<string, Record<Lang, string>> = {
            generate: { sv: 'Generera idéer', en: 'Generate ideas' },
            seedPlaceholder: { sv: 'Valfri utgångspunkt...', en: 'Optional seed prompt...' },
            saveToBacklog: { sv: 'Spara till backlog', en: 'Save to backlog' },
            saved: { sv: 'Sparad!', en: 'Saved!' },
            backlog: { sv: 'Sparade Idéer', en: 'Saved Ideas' },
            emptyBacklog: { sv: 'Ingen backlog än. Generera och spara idéer!', en: 'No backlog yet. Generate and save ideas!' },
            remove: { sv: 'Ta bort', en: 'Remove' },
            pitch: { sv: 'Pitch', en: 'Pitch' },
            features: { sv: 'Funktioner', en: 'Features' },
            stack: { sv: 'Föreslagen stack', en: 'Suggested stack' },
        };
        return translations[key]?.[lang] || key;
    };

    return (
        <div className="space-y-8">
            {/* Generator */}
            <div className="glass-card p-6 space-y-4">
                <div className="space-y-3">
                    <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder={t('seedPlaceholder')}
                        className="w-full px-4 py-3 bg-glass-dark border border-glass-border rounded-lg focus:outline-none focus:border-cyan-primary transition-colors text-text-primary"
                    />
                    <button
                        onClick={handleGenerate}
                        className="btn-primary w-full"
                    >
                        {t('generate')}
                    </button>
                </div>
            </div>

            {/* Generated Ideas */}
            {ideas.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {ideas.map((idea, index) => (
                        <div key={index} className="glass-card p-5 space-y-3 hover:-translate-y-1 transition-transform">
                            <h3 className="text-lg font-display font-semibold text-gradient">
                                {idea.title}
                            </h3>

                            <p className="text-text-secondary text-sm">
                                <span className="text-text-muted">{t('pitch')}:</span> {idea.pitch}
                            </p>

                            <div>
                                <p className="text-xs text-text-muted mb-2">{t('features')}:</p>
                                <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                                    {idea.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs text-text-muted mb-2">{t('stack')}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {idea.stack.map((tech, i) => (
                                        <span key={i} className="px-2 py-1 text-xs rounded bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/50">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => handleSave(idea)}
                                className="btn-secondary w-full text-sm"
                            >
                                {t('saveToBacklog')}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Backlog */}
            {backlog.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold">{t('backlog')}</h2>
                    <div className="grid gap-3">
                        {backlog.map((idea, index) => (
                            <div key={index} className="glass-card p-4 flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-cyan-primary">{idea.title}</h4>
                                    <p className="text-sm text-text-secondary mt-1">{idea.pitch}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveFromBacklog(index)}
                                    className="text-text-muted hover:text-orange-warning transition-colors text-sm"
                                >
                                    {t('remove')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {backlog.length === 0 && ideas.length === 0 && (
                <p className="text-center text-text-muted py-12">
                    {t('emptyBacklog')}
                </p>
            )}
        </div>
    );
}
