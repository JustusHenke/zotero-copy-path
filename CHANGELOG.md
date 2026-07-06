# Changelog

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
