# Innehållshantering - Så uppdaterar du din portfolio

Detta är din guide för hur du lägger till och redigerar innehåll på din portfolio.

## 📁 Projektstruktur

Din portfolio använder **Content Collections** för att hantera projekt och bygglogg-inlägg:

- **Projekt:** `src/content/projects/` - Dina portfolio-projekt
- **Bygglogg:** `src/content/updates/` - Uppdateringar och inlägg
- **Översättningar:** `src/i18n/` - UI-texter på svenska och engelska

---

## 🎯 Lägga till ett nytt projekt

### Steg 1: Skapa projektfil

Skapa en ny `.md`-fil i `src/content/projects/`:

```bash
# Exempel: src/content/projects/mitt-projekt.md
```

### Steg 2: Kopiera denna mall

```markdown
---
title:
  sv: "Projektets namn på svenska"
  en: "Project name in English"
description:
  sv: "Kort beskrivning av projektet på svenska (1-2 meningar)"
  en: "Short description of the project in English (1-2 sentences)"
role:
  sv: "Din roll (t.ex. 'Fullstack-utvecklare')"
  en: "Your role (e.g. 'Fullstack Developer')"
status: "active"
year: 2026
tags: ["tag1", "tag2", "tag3"]
stack: ["React", "Node.js", "PostgreSQL"]
links:
  repo: "https://github.com/dittanvändarnamn/projekt"
  live: "https://ditt-projekt.se"
coverImage: "/images/covers/mitt-projekt.svg"
highlightBullets:
  sv:
    - "Första viktiga funktionen eller prestation"
    - "Andra viktiga funktionen eller prestation"
    - "Tredje viktiga funktionen eller prestation"
  en:
    - "First important feature or achievement"
    - "Second important feature or achievement"
    - "Third important feature or achievement"
---

## Om projektet

Skriv här en längre beskrivning av projektet. Du kan använda markdown för formatering.

### Utmaningar

Beskriv tekniska utmaningar du löste.

### Resultat

Vad blev resultatet? Mätbara data är bra!
```

### Steg 3: Fyll i dina uppgifter

**Status-värden:**
- `"active"` - Projektet är aktivt/pågående (visas med grön badge)
- `"done"` - Projektet är färdigt (visas med cyan badge)
- `"paused"` - Projektet är pausat (visas med grå badge)

**Links (valfritt):**
- `repo` - Länk till GitHub/GitLab-repo
- `live` - Länk till live-demo eller produktionssida
- Ta bort hela `links:` om du inte vill ha några länkar

**CoverImage:**
Du behöver en bild i `public/images/covers/`. Du kan:
- Skapa en egen SVG (rekommenderat för snabbhet)
- Använda en PNG/JPG (max 1920x1080px)
- Använda en av de befintliga placeholder-bilderna

### Steg 4: Ta bort exempel-projekten

När du har lagt till dina egna projekt, ta bort dessa testfiler:
```
src/content/projects/ai-code-mentor.md
src/content/projects/smart-home-hub.md
src/content/projects/beadifier.md
src/content/projects/tactical-game.md
```

---

## 📝 Lägga till bygglogg-inlägg

### Steg 1: Skapa uppdateringsfil

Filnamn måste följa formatet: `YYYY-MM-DD-slug.md`

```bash
# Exempel: src/content/updates/2026-02-03-lansering.md
```

### Steg 2: Använd denna mall

```markdown
---
title:
  sv: "Titel på svenska"
  en: "Title in English"
date: 2026-02-03
tags: ["tag1", "tag2"]
---

Skriv ditt innehåll här. Text kan vara på svenska, engelska eller båda.

## Underrubrik

Du kan använda markdown för formatering.

- Punktlistor
- Kodblock
- Länkar
- Bilder

Allt fungerar!
```

### Steg 3: Ta bort exempel-inlägg

Ta bort dessa testfiler när du har dina egna:
```
src/content/updates/2026-02-01-launch.md
src/content/updates/2026-01-28-design-system.md
src/content/updates/2026-01-20-content-architecture.md
src/content/updates/2026-01-15-astro-migration.md
src/content/updates/2026-01-10-idea-lab.md
src/content/updates/2026-01-05-kickoff.md
```

---

## 🌐 Uppdatera översättningar

All UI-text på sidan finns i två filer:

- `src/i18n/sv.json` - Svenska texter
- `src/i18n/en.json` - Engelska texter

### Exempel: Ändra hero-texten på startsidan

**sv.json:**
```json
{
  "hero": {
    "tagline": "Din egna text här på svenska",
    "subtitle": "Din underrubrik",
    "cta": "Utforska mina projekt"
  }
}
```

**en.json:**
```json
{
  "hero": {
    "tagline": "Your own text here in English",
    "subtitle": "Your subtitle",
    "cta": "Explore my projects"
  }
}
```

### Lägga till nya översättningar

1. Lägg till samma nyckel i **både** `sv.json` och `en.json`
2. Använd sedan nyckeln på sidan med `t('din.nyckel', lang)`

---

## 🖼️ Hantera bilder

### Projektbilder (covers)

1. Placera bilder i: `public/images/covers/`
2. Referera till dem i projektfilen: `coverImage: "/images/covers/din-bild.svg"`

**Rekommenderade format:**
- SVG (bäst för prestanda)
- PNG eller JPG (max 1920x1080px)

### Generera SVG-placeholders

Du kan använda verktyg som:
- Figma/Sketch → Exportera som SVG
- [Hero Patterns](https://heropatterns.com/) - Mönster
- [Haikei](https://haikei.app/) - Gradients och former

---

## 🎨 Ändra om dig-sidan

Redigera filen: `src/pages/about.astro`

Innehållet finns i `<div id="bio-content">`. Du kan:
- Ändra text
- Lägga till/ta bort tech-kort
- Uppdatera social-länkar

---

## ✅ Snabbguide - Rensa ut testdata

Här är en checklista för att rensa ut all testdata och lägga till ditt eget innehåll:

### 1. Projekt
```bash
# Ta bort dessa:
rm src/content/projects/ai-code-mentor.md
rm src/content/projects/smart-home-hub.md
rm src/content/projects/beadifier.md
rm src/content/projects/tactical-game.md

# Skapa dina egna:
# src/content/projects/mitt-riktiga-projekt.md
```

### 2. Bygglogg
```bash
# Ta bort dessa:
rm src/content/updates/2026-02-01-launch.md
rm src/content/updates/2026-01-28-design-system.md
rm src/content/updates/2026-01-20-content-architecture.md
rm src/content/updates/2026-01-15-astro-migration.md
rm src/content/updates/2026-01-10-idea-lab.md
rm src/content/updates/2026-01-05-kickoff.md

# Skapa dina egna:
# src/content/updates/2026-02-03-min-uppdatering.md
```

### 3. Bilder
```bash
# Ta bort placeholder-bilder:
rm public/images/covers/ai-code-mentor.svg
rm public/images/covers/smart-home-hub.svg
rm public/images/covers/beadifier.svg
rm public/images/covers/tactical-game.svg

# Lägg till dina egna bilder i samma mapp
```

### 4. Om-sidan
Redigera: `src/pages/about.astro`
- Uppdatera din bio
- Lägg till/ta bort teknologier
- Uppdatera social-länkar

### 5. Översättningar
Redigera: `src/i18n/sv.json` och `src/i18n/en.json`
- Anpassa hero-texten
- Uppdatera footern
- Ändra navigation om du vill

---

## 🚀 Deploya ändringar

När du har uppdaterat innehållet:

1. **Testa lokalt:** Dev-servern uppdaterar automatiskt
2. **Bygg produktion:** `npm run build`
3. **Deploya:** Pusha till GitHub → Cloudflare Pages deployas automatiskt

---

## 💡 Tips

### Projektordning
Projekt sorteras automatiskt efter `year` (nyast först). Sätt rätt årtal för att styra ordningen.

### Språk i markdown
Projektbeskrivningen (efter `---`) kan vara på vilket språk som helst. Det är bara frontmatter (titel, beskrivning, etc.) som måste vara tvåspråkig.

### Länkar
Om ett projekt inte har repo eller live-demo, ta bort hela `links:`-sektionen eller specifika nycklar.

### Status-badges
Färgerna styrs automatiskt:
- `active` = Grön
- `done` = Cyan
- `paused` = Grå

---

## ❓ Vanliga frågor

**Q: Måste jag skriva allt på både svenska och engelska?**  
A: Endast frontmatter (titel, beskrivning, etc.) behöver vara tvåspråkig. Själva markdown-innehållet kan vara på ett språk.

**Q: Kan jag ändra färgerna?**  
A: Ja! Redigera `tailwind.config.mjs` och `src/styles/global.css`. OBS: Använd INTE lila/purple enligt designreglerna.

**Q: Hur lägger jag till fler sidor?**  
A: Skapa en ny `.astro`-fil i `src/pages/`. Lägg till länken i `src/components/Nav.astro`.

**Q: Fungerar bilder i markdown?**  
A: Ja! Använd standard markdown-syntax: `![Alt text](/sökväg/till/bild.jpg)`

---

## 🆘 Support

Om något inte fungerar:
1. Kolla dev-serverns terminaloutput för felmeddelanden
2. Se till att alla filer har korrekt frontmatter-format
3. Kontrollera att bildlänkar pekar på filer som faktiskt finns

**Lycka till med din portfolio! 🎉**
