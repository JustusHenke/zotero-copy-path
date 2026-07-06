# Copy File Path – Zotero Plugin

Plugin für Zotero, das den Dateipfad ausgewählter Einträge/Anhänge per Rechtsklick in die Zwischenablage kopiert.

## Installation

1. Lade die neueste `.xpi`-Datei von den [Releases](https://github.com/JustusHenke/zotero-copy-path/releases) herunter
2. Öffne Zotero
3. Gehe zu `Extras` → `Add-ons`
4. Klicke auf das Zahnrad und wähle `Add-on-Datei installieren...`
5. Wähle die heruntergeladene `.xpi`-Datei aus
6. Starte Zotero neu, wenn erforderlich

## Verwendung

1. Wähle einen oder mehrere Einträge in Zotero aus
2. Mache einen Rechtsklick, um das Kontextmenü zu öffnen
3. Wähle "Dateipfad kopieren"
4. Die Dateipfade sind nun in der Zwischenablage und können mit `Strg+V` eingefügt werden

## Entwickler-Infos

### Projektstruktur

- `manifest.json` – Plugin-Metadaten und Kompatibilität
- `bootstrap.js` – Lifecycle-Hooks (Chrome-Registrierung, FTL)
- `copy-file-path.js` – Hauptlogik (MenuManager + Clipboard)
- `locale/de/` und `locale/en-US/` – Fluent-Lokalisierung
- `README.md` – Diese Anleitung

### Build-Prozess

Um das Plugin als XPI-Datei zu packen:

1. Gehe in das Plugin-Verzeichnis
2. Zippe alle Dateien im Root-Ordner:

   ```bash
   zip -r copy-file-path.xpi manifest.json bootstrap.js copy-file-path.js README.md locale/
   ```

### Kompatibilität

- Zotero 9.0 oder neuer

## Lizenz

MIT
