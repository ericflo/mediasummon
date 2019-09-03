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
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./config.js");
/* harmony import */ var _fetchers_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fetchers/common */ "./fetchers/common.js");


var installed = false;
var installedCSRF = null;
function ensureInstalled() {
  if (installed) {
    return;
  }

  Object(_fetchers_common__WEBPACK_IMPORTED_MODULE_1__["loadAuthToken"])(); // Load UIKit and tell it to use its 'Icons' plugin

  var UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");

  var Icons = __webpack_require__(/*! uikit/dist/js/uikit-icons */ "./node_modules/uikit/dist/js/uikit-icons.js");

  UIKit.use(Icons);

  var dayjs = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");

  var relativetime = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");

  dayjs.extend(relativetime);
  var req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('HEAD', _config__WEBPACK_IMPORTED_MODULE_0__["default"].apiPrefix, true);
  req.send(null);
  installed = true;
}
function getInstalledCSRF() {
  return installedCSRF;
}

/***/ })

})
//# sourceMappingURL=index.js.7df03ac107171a8a9734.hot-update.js.map