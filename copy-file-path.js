// copy-file-path.js — Hauptlogik
// Nutzt Zotero.MenuManager (Zotero 8+) + XPCOM-Clipboard

CopyFilePath = {
  id: null,
  version: null,
  rootURI: null,
  initialized: false,
  menuHandle: null,

  init({ id, version, rootURI }) {
    if (this.initialized) return;
    this.id = id;
    this.version = version;
    this.rootURI = rootURI;
    this.initialized = true;
    this.registerMenu();
  },

  registerMenu() {
    const menuID = Zotero.MenuManager.registerMenu({
      menuID: "copy-file-path-item-menu",
      pluginID: this.id,
      target: "main/library/item",
      menus: [
        {
          menuType: "menuitem",
          l10nID: "copy-file-path-menu-pdf",
          onShowing: function (_event, context) {
            context.setL10nArgs(JSON.stringify({ icon: "\u{1F4CB}" }));
          },
          onCommand: function () {
            CopyFilePath.handlePdfCommand();
          },
        },
        {
          menuType: "menuitem",
          l10nID: "copy-file-path-menu-doi",
          onShowing: function (_event, context) {
            context.setL10nArgs(JSON.stringify({ icon: "\u{1F517}" }));
          },
          onCommand: function () {
            CopyFilePath.handleDoiUrlCommand();
          },
        },
      ],
    });
    this.menuHandle = menuID;
    Zotero.debug("CopyFilePath: MenuManager registriert");
  },

  shutdown() {
    if (this.menuHandle) {
      Zotero.MenuManager.unregisterMenu(this.menuHandle);
      this.menuHandle = null;
    }
  },

  handlePdfCommand() {
    try {
      const pane = Zotero.getActiveZoteroPane();
      if (!pane) return;

      const items = pane.getSelectedItems();
      if (!items || items.length === 0) return;

      const paths = [];

      for (const item of items) {
        for (const attID of item.getAttachments()) {
          const att = Zotero.Items.get(attID);
          const path = att.getFilePath();
          if (path && path.toLowerCase().endsWith(".pdf")) {
            paths.push(path);
          }
        }
      }

      if (paths.length === 0) return;

      this.copyText(paths.join("\n"));
    } catch (e) {
      Zotero.logError("CopyFilePath: " + e);
    }
  },

  handleDoiUrlCommand() {
    try {
      const pane = Zotero.getActiveZoteroPane();
      if (!pane) return;

      const items = pane.getSelectedItems();
      if (!items || items.length === 0) return;

      const results = [];

      for (const item of items) {
        // DOI priorisiert, mit https://doi.org/-Präfix
        const doi = item.getField("DOI");
        if (doi) {
          results.push("https://doi.org/" + doi);
          continue;
        }
        // URL als Fallback
        const url = item.getField("url");
        if (url) {
          results.push(url);
        }
      }

      if (results.length === 0) return;

      this.copyText(results.join("\n"));
    } catch (e) {
      Zotero.logError("CopyFilePath: " + e);
    }
  },

  copyText(text) {
    // XPCOM-Clipboard — primär, getestet stabil in Zotero 9 (Firefox 128)
    try {
      Cc["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Ci.nsIClipboardHelper)
        .copyString(text);
      return;
    } catch (e) {}

    // Zotero-interne Utility
    try {
      if (Zotero.Utilities && Zotero.Utilities.copyTextToClipboard) {
        Zotero.Utilities.copyTextToClipboard(text);
        return;
      }
    } catch (e) {}

    // execCommand-Fallback
    try {
      const win = Zotero.getMainWindow();
      const doc = win ? win.document : document;
      const ta = doc.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      doc.body.appendChild(ta);
      ta.select();
      doc.execCommand("copy");
      doc.body.removeChild(ta);
    } catch (e) {}
  },
};
