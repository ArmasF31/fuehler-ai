# Fühler AI — Freiberufler-Website

Portfolio-/Landingpage von **Armas Fühler** für KI-Automatisierung, automatisierte
B2C-E-Mail-Kampagnen und KI-gestützte Antwortfilterung.

Statische Website (HTML/CSS/JS, kein Build-Schritt nötig) — läuft direkt über
**GitHub Pages**.

## Struktur

- `index.html` — Seiteninhalt
- `styles.css` — Design
- `script.js` — Mobile-Navigation, Scroll-Animationen, aktiver Menüpunkt, animierter Hero-Hintergrund, dynamisches Jahr im Footer
- `logo/` — Logo-Dateien (siehe unten)
- `favicon.svg`, `apple-touch-icon.png`, `og-image.png` — Browser-Icon, iOS-Icon und Vorschaubild für geteilte Links
- `fonts/` — selbst gehostete Schriften (Inter, Manrope; SIL Open Font License), damit keine Anfragen an Google-Server gehen

## Lokal ansehen

`index.html` einfach im Browser öffnen, oder mit einem kleinen lokalen Server:

```bash
python -m http.server 8000
```

und dann `http://localhost:8000` aufrufen.

## Logo

Das Zeichen ist ein „F“ aus zwei Fühlern mit Knoten-Enden — Fühler, Signal und
Workflow-Knoten in einem. Der Schriftzug ist in Pfade umgewandelt, die Dateien
funktionieren also auch ohne installierte Schrift.

| Datei | Verwendung |
| --- | --- |
| `logo/fuehler-ai-logo.svg` / `.png` | Logo quer, für dunkle Hintergründe |
| `logo/fuehler-ai-logo-light.svg` / `.png` | Logo quer, für helle Hintergründe |
| `logo/fuehler-ai-mark.svg`, `fuehler-ai-mark-512.png` | Bildzeichen (Profilbild, App-Icon) |
| `logo/fuehler-ai-glyph.svg` | Zeichen ohne Kachel, im Markenverlauf |

Farben: `#5b8cff` → `#8b5cf6` (Verlauf), Schrift: Manrope ExtraBold.

## Änderungen an CSS/JS

GitHub Pages lässt Dateien 10 Minuten im Browser-Cache. Damit Besucher nach einem
Update nicht neues HTML mit altem CSS sehen, hängt in `index.html` eine Versionsnummer
an (z. B. `styles.css?v=3`, `script.js?v=3`). Bei Änderungen an `styles.css` oder `script.js`
diese Nummer einfach um eins erhöhen.

## Deployment mit GitHub Pages

1. Repo auf GitHub pushen (siehe unten).
2. Auf GitHub: **Settings → Pages → Source: `Deploy from a branch`**,
   Branch `master`, Ordner `/ (root)` auswählen, speichern.
3. Nach ein bis zwei Minuten ist die Seite unter
   `https://<dein-github-username>.github.io/<repo-name>/` erreichbar.

## Kontakt

Armas Fühler — stenfue@gmail.com
