webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./setup.js":
/*!******************!*\
  !*** ./setup.js ***!
  \******************/
/*! exports provided: ensureInstalled, getInstalledCSRF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureInstalled", function() { return ensureInstalled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInstalledCSRF", function() { return getInstalledCSRF; });
var installed = false;
var installedCSRF = {
  token: null
};
function ensureInstalled() {
  if (installed) {
    return;
  } // Load UIKit and tell it to use its 'Icons' plugin


  var UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");

  var Icons = __webpack_require__(/*! uikit/dist/js/uikit-icons */ "./node_modules/uikit/dist/js/uikit-icons.js");

  UIKit.use(Icons);

  var dayjs = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");

  var relativetime = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");

  dayjs.extend(relativetime);
  var req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    var headers = req.getAllResponseHeaders();
    console.log('req onload headers', headers, headers['x-csrf-token']);
    installedCSRF.token = headers['x-csrf-token'];
  });
  req.open('HEAD', document.location, true);
  req.send(null);
  installed = true;
}
function getInstalledCSRF() {
  return installedCSRF.token;
}

/***/ })

})
//# sourceMappingURL=index.js.a9364780a687d05a64fc.hot-update.js.map