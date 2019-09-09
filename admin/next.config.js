var withCSS = require('@zeit/next-css');

if (typeof window !== "undefined") {
  // Load UIKit and tell it to use its 'Icons' plugin
  var UIKit = require('uikit');
  var UIKitIcons = require('uikit/dist/js/uikit-icons');
  UIkit.use(UIKitIcons);
}

async function exportPathMap(
  defaultPathMap,
  { dev, dir, outDir, distDir, buildId }
) {
  return {
    '/': { page: '/' },
    '/login': { page: '/login' },
    '/logout': { page: '/logout' },
    '/settings': { page: '/settings' },
  }
}

module.exports = withCSS({
  exportTrailingSlash: true,
  exportPathMap,
});