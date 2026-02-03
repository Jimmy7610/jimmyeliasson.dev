---
title:
  sv: "Content Collections Implementation"
  en: "Content Collections Implementation"
date: 2026-01-20
tags: ["astro", "content", "typescript"]
---

Implementerade Astros Content Collections för typ-säker innehållshantering. Detta ger flera fördelar jämfört med vanliga markdown-filer.

## Fördelar

- **Typ-säkerhet**: Zod-scheman validerar allt innehåll vid byggtid
- **Tvåspråkigt innehåll**: Inbyggt stöd för svensk/engelsk innehållsstruktur
- **Automatisk generering**: Projektsidor och listor genereras automatiskt

## Schema Design

Skapade schemas för projekt och uppdateringar med stöd för tvåspråkiga fält, taggar, status och metadata. Very nice!
