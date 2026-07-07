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
          l10nID: "copy-file-path-menu-copy",
          onShowing: function (_event, context) {
            context.setL10nArgs(JSON.stringify({ icon: "\u{1F4CB}" }));
          },
          onCommand: function () {
            CopyFilePath.handleMenuCommand();
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

  handleMenuCommand() {
    try {
      const pane = Zotero.getActiveZoteroPane();
      if (!pane) return;

      const items = pane.getSelectedItems();
      if (!items || items.length === 0) return;

      let paths = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // 1) Direkt getFilePath() aufrufen — funktioniert bei Attachments
        //    und ggf. auch bei regulären Items mit verknüpften Dateien
        try {
          const fp = item.getFilePath();
          if (fp) {
            paths.push(fp);
            continue;
          }
        } catch (e) {}

        // 2) URL-Feld (für verlinkte URLs)
        try {
          const url = item.getField("url");
          if (url) {
            paths.push(url);
            continue;
          }
        } catch (e) {}

        // 3) Kind-Attachments durchsuchen (reguläre Items)
        try {
          if (item.isRegularItem && item.isRegularItem()) {
            const attIDs = item.getAttachments();
            for (let j = 0; j < attIDs.length; j++) {
              const att = Zotero.Items.get(attIDs[j]);
              if (!att || !att.isAttachment()) continue;

              const fp = att.getFilePath();
              if (fp) {
                paths.push(fp);
                continue;
              }
              const url = att.getField("url");
              if (url) paths.push(url);
            }
          }
        } catch (e) {}
      }

      if (paths.length === 0) return;

      this.copyText(paths.join("\n"));
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
