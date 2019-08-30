var installed = false;

export function ensureInstalled() {
  if (installed) {
    return;
  }

  // Load UIKit and tell it to use its 'Icons' plugin
  const UIKit = require('uikit');
  const Icons = require('uikit/dist/js/uikit-icons');
  UIKit.use(Icons);


  const dayjs = require('dayjs');
  const relativetime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativetime);

  installed = true;
}