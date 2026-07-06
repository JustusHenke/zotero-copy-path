// bootstrap.js — Zotero Plugin: Copy File Path
// Lifecycle-Hooks für Zotero 9+ mit MenuManager-API

var CopyFilePath;
var chromeHandle;

const FTL_FILE = "copy-file-path.ftl";

function log(msg) {
  Zotero.debug("CopyFilePath: " + msg);
}

function install() {
  log("Plugin installiert");
}

async function startup({ id, version, rootURI }) {
  log("Plugin gestartet (Version " + version + ")");

  // Chrome-Registrierung für Locales
  const aomStartup = Cc[
    "@mozilla.org/addons/addon-manager-startup;1"
  ].getService(Ci.amIAddonManagerStartup);
  const manifestURI = Services.io.newURI(rootURI + "manifest.json");
  chromeHandle = aomStartup.registerChrome(manifestURI, [
    ["locale", "copy-file-path", "en-US", "locale/en-US/"],
    ["locale", "copy-file-path", "de", "locale/de/"],
  ]);

  Services.scriptloader.loadSubScript(rootURI + "copy-file-path.js");
  CopyFilePath.init({ id, version, rootURI });

  // FTL in bereits offene Fenster injizieren
  for (const win of Zotero.getMainWindows()) {
    if (win.MozXULElement) win.MozXULElement.insertFTLIfNeeded(FTL_FILE);
  }

  log("Startup abgeschlossen");
}

function onMainWindowLoad({ window }) {
  window.MozXULElement.insertFTLIfNeeded(FTL_FILE);
}

function onMainWindowUnload({ window }) {
  // MenuManager handled Cleanup automatisch
}

function shutdown() {
  log("Plugin beendet");
  if (CopyFilePath) CopyFilePath.shutdown();
  if (chromeHandle) {
    chromeHandle.destruct();
    chromeHandle = null;
  }
  CopyFilePath = undefined;
}

function uninstall() {
  log("Plugin deinstalliert");
}
