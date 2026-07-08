# Copy File Path – Zotero Plugin

A Zotero 9 plugin that copies PDF file paths and DOIs/URLs of selected items to the clipboard via right-click context menu.

![Screenshot](screenshot.png)

## Installation

1. Download the latest `.xpi` file from the [Releases](https://github.com/JustusHenke/zotero-copy-path/releases) page
2. Open Zotero
3. Go to `Tools` → `Add-ons`
4. Click the gear icon and select `Install Add-on From File...`
5. Select the downloaded `.xpi` file
6. Restart Zotero if prompted

## Usage

1. Select one or more items in Zotero
2. Right-click → context menu:
   - **📋 Copy PDF Path** — copies file paths of all `.pdf` attachments
   - **🔗 Copy DOI/URL** — copies `https://doi.org/…` (DOI preferred, otherwise URL)
3. Paths/links are placed in the clipboard and can be pasted with `Ctrl+V`

## Developer Info

### Project Structure

- `manifest.json` – Plugin metadata and compatibility
- `bootstrap.js` – Lifecycle hooks (Chrome registration, FTL)
- `copy-file-path.js` – Core logic (MenuManager + Clipboard)
- `locale/de/` and `locale/en-US/` – Fluent localization
- `updates.json` – Auto-update manifest
- `CHANGELOG.md` – Version history
- `README.md` – This guide

### Build Process

To package the plugin as an XPI file:

1. Navigate to the plugin directory
2. Zip all files in the root folder:

   ```bash
   zip -r copy-file-path.xpi manifest.json bootstrap.js copy-file-path.js README.md locale/
   ```

### Compatibility

- Zotero 9.0 or newer

## License

MIT