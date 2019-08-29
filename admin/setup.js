var installed = false;

export function ensureUIKitInstalled() {
  if (installed) {
    return;
  }

  // Load UIKit and tell it to use its 'Icons' plugin
  const UIKit = require('uikit');
  const Icons = require('uikit/dist/js/uikit-icons');
  UIKit.use(Icons);

  installed = true;
}