var withCSS = require('@zeit/next-css');

if (typeof window !== "undefined") {
  // Load UIKit and tell it to use its 'Icons' plugin
  var UIKit = require('uikit');
  var UIKitIcons = require('uikit/dist/js/uikit-icons');
  UIkit.use(UIKitIcons);
}

module.exports = withCSS({
  // TODO: Config opts
});