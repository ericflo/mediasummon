import config from './config';

var installed = false;
var installedCSRF = null;

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

  var req = new XMLHttpRequest();
  req.addEventListener('load', function() {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('HEAD', config.apiPrefix, true);
  req.send(null);

  installed = true;
}

export function getInstalledCSRF() {
  return installedCSRF;
}