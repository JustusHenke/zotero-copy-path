# Changelog

## [1.3.0] — 2026-07-07

### Added
- Zweiter Menüeintrag: 🔗 DOI/URL kopieren
  - DOI mit `https://doi.org/`-Präfix (priorisiert)
  - URL als Fallback, wenn keine DOI vorhanden

## [1.2.0] — 2026-07-07

### Changed
- **Nur PDF-Dateipfade** kopieren — keine URLs, keine DOIs
- Menülabel: „📋 PDF-Pfad kopieren“
- Vereinfachte `handleMenuCommand`: exakt der vom User getestete Konsolen-Code

## [1.1.0] — 2026-07-07

### Fixed
- Emoji-Icon 📋 via `onShowing` + `setL10nArgs` statt FTL-Literal

## [1.0.0] — 2026-07-06

### Added
- Menüeintrag „📋 Dateipfad kopieren“ im Item-Kontextmenü
- Kopiert Dateipfad (gespeicherte/linked Dateien) oder URL (verlinkte URLs)
- Support für Mehrfachauswahl (Pfade zeilenweise kopiert)
- Fluent-Lokalisierung (de + en-US)
- Auto-Update via `updates.json`

### Changed
- Portiert auf Zotero.MenuManager (Zotero 8+ API)
- Clipboard: XPCOM `nsIClipboardHelper` als primäre Methode
- Plugin-ID: `copy-file-path@justushenke.github.io`
