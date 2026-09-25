# Fühler AI — Freiberufler-Website

Portfolio-/Landingpage von **Armas Fühler** für KI-Automatisierung, automatisierte
B2C-E-Mail-Kampagnen und KI-gestützte Antwortfilterung.

Statische Website (HTML/CSS/JS, kein Build-Schritt nötig) — läuft direkt über
**GitHub Pages**.

## Struktur

- `index.html` — Seiteninhalt
- `styles.css` — Design
- `script.js` — Mobile-Navigation, Scroll-Animationen, aktiver Menüpunkt, dynamisches Jahr im Footer
- `fonts/` — selbst gehostete Schriften (Inter, Manrope; SIL Open Font License), damit keine Anfragen an Google-Server gehen

## Lokal ansehen

`index.html` einfach im Browser öffnen, oder mit einem kleinen lokalen Server:

```bash
python -m http.server 8000
```

und dann `http://localhost:8000` aufrufen.

## Deployment mit GitHub Pages

1. Repo auf GitHub pushen (siehe unten).
2. Auf GitHub: **Settings → Pages → Source: `Deploy from a branch`**,
   Branch `main`, Ordner `/ (root)` auswählen, speichern.
3. Nach ein bis zwei Minuten ist die Seite unter
   `https://<dein-github-username>.github.io/<repo-name>/` erreichbar.

## Kontakt

Armas Fühler — stenfue@gmail.com
