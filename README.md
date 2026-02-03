# Jimmy Eliasson - Portfolio 2.0

A bilingual (Swedish/English) portfolio built with Astro, React islands, and a futuristic control center aesthetic.

## 🚀 Features

- **Fully Bilingual**: Seamless Swedish/English language switching on all pages
- **Admin Portal**: Browser-based content editor at `/admin` (no Git/VS Code needed!)
- **Astro + React Islands**: Lightning-fast static site with interactive components where needed
- **Content Collections**: Type-safe content management with Zod schemas
- **Idea Lab**: AI-assisted project idea generator (template-based MVP, Ollama-ready)
- **Responsive Design**: Premium mobile-first design with glassmorphism effects
- **Performance First**: Optimized for Core Web Vitals

## 🎨 Design System

- **Colors**: Dark glass base with cyan/acid green accents (NO purple!)
- **Typography**: Inter (body), Outfit (headings), JetBrains Mono (code)
- **Effects**: Glassmorphism, subtle neon borders, smooth transitions
- **Accessibility**: WCAG AA compliant, keyboard navigation, reduced-motion support

## 📁 Project Structure

```
├── public/
│   ├── admin/               # **Admin Portal (Decap CMS)**
│   │   ├── config.yml       # CMS configuration
│   │   └── index.html       # Admin UI
│   ├── images/covers/       # Project cover images (SVG placeholders)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── i18n/
│   │   ├── sv.json          # Swedish translations
│   │   ├── en.json          # English translations
│   │   └── index.ts         # i18n helper functions
│   ├── content/
│   │   ├── config.ts        # Content Collections schema
│   │   ├── projects/        # Project MD files (4 examples)
│   │   └── updates/         # Build log MD files (6 examples)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   └── islands/
│   │       └── IdeaLab.tsx  # React island for idea generation
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro      # Home
│   │   ├── projects.astro   # Projects listing
│   │   ├── projects/[slug].astro  # Project detail
│   │   ├── build-log.astro  # Build log
│   │   ├── lab.astro        # Idea Lab
│   │   └── about.astro      # About page
│   └── styles/
│       └── global.css       # Global styles + design tokens
├── scripts/
│   └── transform-cms-content.mjs  # Transforms CMS data format
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── ADMIN.md                 # **Admin setup guide (Swedish)**
├── INNEHALL.md              # Content management guide (Swedish)
└── package.json
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:4321`

## 🎛️ Admin Portal (Decap CMS)

**NEW!** Edit your content directly in the browser - no Git/VS Code needed!

### Local Usage

1. Start dev server: `npm run dev`
2. Visit: **http://localhost:4321/admin**
3. Click "Login" (no authentication needed locally)
4. Create, edit, or delete Projects and Build Log entries
5. Changes save directly to `src/content/`

### Features

- ✅ Visual editor with live preview
- ✅ Bilingual forms (Swedish + English fields)
- ✅ Media upload for project covers
- ✅ Markdown editor with formatting toolbar
- ✅ No Git knowledge required

### Production Setup

For production (GitHub + Cloudflare Pages), see **[ADMIN.md](./ADMIN.md)** for:
- GitHub OAuth setup
- Cloudflare Pages configuration
- Authentication flow

**Quick note:** Content edited via `/admin` is automatically formatted correctly for Astro Content Collections via the `prebuild` script.

## ✍️ Adding Content

**Two ways to add content:**

1. **✨ Browser (Recommended):** Visit `/admin` and use the visual editor
2. **📝 Manual:** Create `.md` files in `src/content/` (see templates below)

---

### Method 1: Browser Admin (Easy!)

See section above - just visit `http://localhost:4321/admin`!

### Method 2: Manual Files

### Adding a Project

1. Create a new MDX file in `src/content/projects/`
2. Use this template:

```mdx
---
title:
  sv: "Projektnamn på Svenska"
  en: "Project Name in English"
description:
  sv: "Beskrivning på svenska..."
  en: "Description in English..."
role:
  sv: "Din roll"
  en: "Your role"
status: "active" | "done" | "paused"
year: 2026
tags: ["tag1", "tag2", "tag3"]
stack: ["Tech1", "Tech2", "Tech3"]
links:
  repo: "https://github.com/..."
  live: "https://..."
coverImage: "/images/covers/your-image.svg"
highlightBullets:
  sv:
    - "Första höjdpunkten"
    - "Andra höjdpunkten"
    - "Tredje höjdpunkten"
  en:
    - "First highlight"
    - "Second highlight"
    - "Third highlight"
---

## Your Content

Write your project description here (can be in either language, or both).
```

3. Add a cover image to `public/images/covers/` (SVG recommended)

### Adding a Build Log Entry

1. Create a new MDX file in `src/content/updates/` with format: `YYYY-MM-DD-slug.mdx`
2. Use this template:

```mdx
---
title:
  sv: "Titel på Svenska"
  en: "Title in English"
date: 2026-02-02
tags: ["tag1", "tag2"]
---

Your update content here (can be bilingual or single language).
```

### Adding UI Translations

Edit `src/i18n/sv.json` and `src/i18n/en.json`:

```json
{
  "your": {
    "new": {
      "key": "Translation text"
    }
  }
}
```

Then use in components:
```astro
<script>
  import { getLang, t } from '../i18n';
  const myText = t('your.new.key', getLang());
</script>
```

## 🎯 How i18n Works

1. **Initial Language**: Detected from localStorage → browser language → default (en)
2. **Persistence**: Saved to localStorage on change
3. **Event System**: Custom `langchange` event notifies all components
4. **React Islands**: `useTranslation()` hook for automatic updates
5. **SSR**: Server renders with default, client hydrates with user preference

## 🧪 Idea Lab

The Idea Lab generates project ideas using a template-based system. It combines:
- Project types (Task Manager, Learning Platform, etc.)
- Categories (SaaS Tools, Developer Tools, etc.)
- Features (AI Integration, Real-time Collaboration, etc.)
- Tech stacks (predefined combinations)

**Future Enhancement**: Ready for Ollama integration via feature flag. See `src/components/islands/IdeaLab.tsx` for stub.

## 🚀 Deployment

### Cloudflare Pages

1. Push repository to GitHub
2. Go to Cloudflare Pages dashboard
3. Create new project and connect to your repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. Deploy!

No environment variables needed for MVP.

### Custom Domain

Configure your custom domain in Cloudflare Pages settings. Update `site` in `astro.config.mjs`.

## 📊 Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

The site uses:
- Static generation for all pages (except where islands are needed)
- Optimized images (SVG placeholders)
- Minimal JavaScript (only for interactivity)
- prefers-reduced-motion support

## 🎨 Design Tokens

All design tokens are in `tailwind.config.mjs` and `src/styles/global.css`:

- **Glass Dark**: `hsl(220, 20%, 8%)`
- **Cyan Primary**: `hsl(180, 95%, 45%)`
- **Acid Green**: `hsl(80, 90%, 50%)`
- **Orange Warning**: `hsl(30, 100%, 55%)` (sparingly)

## 🔮 Future Enhancements

- [x] ~~Decap CMS integration for browser-based content editing~~ **DONE!**
- [ ] Ollama/LLM integration for Idea Lab
- [ ] Advanced project filtering (by tags, stack, status)
- [ ] Analytics (privacy-focused)
- [ ] Dark/light mode toggle (currently dark only)
- [ ] Blog section (separate from build log)
- [ ] Case study deep-dives

## 📝 License

© 2026 Jimmy Eliasson. All rights reserved.

## 🤝 Contributing

This is a personal portfolio, but feel free to use it as inspiration for your own projects!

---

Built with ❤️ using [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com).
