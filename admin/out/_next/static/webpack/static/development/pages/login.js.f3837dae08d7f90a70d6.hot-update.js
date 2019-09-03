webpackHotUpdate("static\\development\\pages\\login.js",{

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

var installed = false;
var installedCSRF = null;
function ensureInstalled(token) {
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

  if (token) {
    req.setRequestHeader("Authorization", "Bearer " + token);
  }

  req.addEventListener('load', function () {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('HEADA', _config__WEBPACK_IMPORTED_MODULE_0__["default"].apiPrefix, true);
  req.send(null);
  installed = true;
}
function getInstalledCSRF() {
  return installedCSRF;
}

/***/ })

})
//# sourceMappingURL=login.js.f3837dae08d7f90a70d6.hot-update.js.map