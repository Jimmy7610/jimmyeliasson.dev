# Admin Portal Setup - Decap CMS

Din portfolio har nu ett admin-gränssnitt där du kan redigera innehåll direkt i webbläsaren!

## 🎯 Vad du kan göra

- ✅ Skapa, redigera och ta bort **projekt**
- ✅ Skapa, redigera och ta bort **bygglogg-inlägg**
- ✅ Ladda upp projektbilder
- ✅ Allt på svenska och engelska (tvåspråkiga fält)

---

## 🚀 Snabbstart (Lokal Utveckling)

### 1. Starta dev-servern

```bash
npm run dev
```

### 2. Öppna admin-portalen

Gå till: **http://localhost:4321/admin**

### 3. Logga in lokalt

Klicka på **"Login"** - ingen autentisering krävs i utvecklingsläge!

### 4. Börja redigera

- Se dina projekt och bygglogg
- Skapa nya inlägg
- Redigera befintliga
- Ändringar sparas direkt till `src/content/`

---

## 📝 Hur man lägger till nytt innehåll

### Skapa ett projekt

1. Gå till **http://localhost:4321/admin**
2. Klicka på **"Projects"** i sidomenyn
3. Klicka **"New Project"**
4. Fyll i formuläret:
   - **Title (Swedish)** - Projektnamn på svenska
   - **Title (English)** - Projektnamn på engelska  
   - **Description (Swedish)** - Beskrivning på svenska
   - **Description (English)** - Beskrivning på engelska
   - **Role** - Din roll (valfritt, båda språk)
   - **Status** - active/done/paused
   - **Year** - Årtal (2020-2030)
   - **Tags** - Taggar (klicka "Add" för fler)
   - **Tech Stack** - Tekniker (klicka "Add" för fler)
   - **Repository URL** - GitHub-länk (valfritt)
   - **Live Demo URL** - Live-demo (valfritt)
   - **Cover Image** - Ladda upp bild eller välj befintlig
   - **Highlights** - Höjdpunkter (båda språk, valfritt)
   - **Content** - Markdown-innehåll
5. Klicka **"Publish"**
6. Filen sparas i `src/content/projects/`

### Skapa en bygglogg-uppdatering

1. Gå till **http://localhost:4321/admin**
2. Klicka på **"Build Log"** i sidomenyn
3. Klicka **"New Update"**
4. Fyll i formuläret:
   - **Title (Swedish/English)** - Titel på båda språken
   - **Date** - Datum för uppdateringen
   - **Tags** - Taggar (valfritt)
   - **Content** - Markdown-innehåll
5. Klicka **"Publish"**
6. Filen sparas i `src/content/updates/YYYY-MM-DD-slug.md`

---

## 🔐 Produktion Setup (Cloudflare Pages + GitHub)

För att admin-portalen ska fungera i produktion måste du konfigurera GitHub OAuth.

### Steg 1: Aktivera Cloudflare Pages Git Gateway

1. Gå till din **Cloudflare Pages** dashboard
2. Gå till ditt projekt → **Settings** → **Integrations**
3. Under **Git Integration**, se till att GitHub är kopplad

### Steg 2: Aktivera Identity (via Cloudflare Workers)

Eftersom Cloudflare Pages inte har inbyggd Identity, använd **GitHub OAuth** direkt:

#### A) Skapa GitHub OAuth App

1. Gå till GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Klicka **"New OAuth App"**
3. Fyll i:
   - **Application name:** "Portfolio CMS"
   - **Homepage URL:** `https://jimmyeliasson.dev`
   - **Authorization callback URL:** `https://jimmyeliasson.dev/admin/`
4. Klicka **"Register application"**
5. Kopiera **Client ID** och **Client Secret**

#### B) Uppdatera Decap CMS config

Redigera `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: dittanvändarnamn/jimmyeliasson.dev  # Ändra till ditt repo
  branch: main
```

Ta bort eller kommentera ut:
```yaml
# local_backend: true  # Endast för lokal utveckling
```

#### C) Lägg till OAuth-provider i Cloudflare

Du har två alternativ:

**Alternativ 1: Använd extern OAuth-tjänst**
- Lägg till https://oauth-provider.netlify.app/ (gratis tjänst)
- Eller använd https://github.com/vencax/netlify-cms-github-oauth-provider (deploy din egen på Cloudflare Workers)

**Alternativ 2: Enklare - Använd bara lokalt**
- Redigera endast via `localhost:4321/admin`
- Pusha ändringar till GitHub manuellt med:
  ```bash
  git add .
  git commit -m "Update content"
  git push
  ```
- Cloudflare Pages deployas automatiskt

### Steg 3: Testa produktion

1. Gå till **https://jimmyeliasson.dev/admin**
2. Logga in med GitHub
3. Redigera innehåll
4. Ändringar commit:as automatiskt till GitHub
5. Cloudflare Pages bygger om automatiskt

---

## 🛠️ Hur det fungerar tekniskt

### Filstruktur

```
public/
  admin/
    config.yml        # Decap CMS konfiguration
    index.html        # Admin-gränssnitt
    
src/content/
  projects/           # Projekt (Decap redigerar dessa)
  updates/            # Bygglogg (Decap redigerar dessa)
  
scripts/
  transform-cms-content.mjs  # Transformerar CMS → Astro-format
```

### Dataflöde

1. **Du redigerar i** `/admin` → Decap CMS UI
2. **Decap sparar till** `src/content/projects/fil.md` med flat struktur:
   ```yaml
   title_sv: "Svenska"
   title_en: "English"
   ```
3. **Build-script kör** `transform-cms-content.mjs` som ändrar till:
   ```yaml
   title:
     sv: "Svenska"
     en: "English"
   ```
4. **Astro bygger** med rätt format från Content Collections

### Varför transformation behövs

- **Decap CMS** sparar fält som `title_sv` och `title_en` (flat)
- **Astro Content Collections** förväntar sig `title.sv` och `title.en` (nested)
- `prebuild`-scriptet konverterar automatiskt innan bygget

---

## 📋 Vanliga frågor

**Q: Kan jag redigera direkt i VS Code fortfarande?**  
A: Ja! Du kan fortsätta redigera `.md`-filer i VS Code. Använd bara den **nested** strukturen (`title.sv` etc.).

**Q: Vad händer om jag glömmer fylla i engelska?**  
A: Adminen varnar dig - alla tvåspråkiga fält är required.

**Q: Kan jag ladda upp bilder direkt?**  
A: Ja! Använd fältet "Cover Image" i admin. Bilder sparas i `public/images/covers/`.

**Q: Funkar det offline?**  
A: Lokalt (`localhost:4321/admin`) - Ja! Produktion - Nej, kräver GitHub-anslutning.

**Q: Kan jag ångra ändringar?**  
A: Ja! Alla ändringar commit:as till Git. Använd `git log` och `git revert` om något går fel.

**Q: Vad händer när jag klickar "Publish"?**  
A: Lokalt: Sparar fil direkt. Produktion: Skapar en Git commit och pushar till GitHub.

---

## 🆘 Felsökning

### Admin laddar inte

- Kolla att dev-servern kör (`npm run dev`)
- Besök exakt `http://localhost:4321/admin` (med slash på slutet)
- Öppna Developer Console (F12) för felmeddelanden

### "Unable to load entries"

- Kontrollera att `src/content/projects/` och `src/content/updates/` finns
- Se till att filerna har giltig frontmatter

### Ändringar syns inte på sidan

- Kör `npm run build` för att se om transformation fungerar
- Kolla `src/content/` - har filerna ändrats?
- Kolla terminaloutput för buildfel

### OAuth fungerar inte i produktion

- Dubbelkolla OAuth callback URL i GitHub
- Se till att `backend.repo` i `config.yml` är korrekt
- Använd alternativ 2 (redigera lokalt, pusha manuellt)

---

## 🎉 Du är klar!

Nu kan du:
- Redigera innehåll i webbläsaren på `localhost:4321/admin`
- Hantera projekt och bygglogg utan att röra kod
- Fortsätta använda VS Code om du vill

**Lycka till med din portfolio! 🚀**

---

## 📚 Resurser

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Decap + Cloudflare Pages Guide](https://decapcms.org/docs/cloudflare-pages/)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
