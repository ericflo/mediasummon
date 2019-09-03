webpackHotUpdate("static\\development\\pages\\login.js",{

/***/ "./setup.js":
/*!******************!*\
  !*** ./setup.js ***!
  \******************/
/*! exports provided: ensureInstalled, getInstalledCSRF, useRequiredUserConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureInstalled", function() { return ensureInstalled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInstalledCSRF", function() { return getInstalledCSRF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useRequiredUserConfig", function() { return useRequiredUserConfig; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./config.js");
/* harmony import */ var _fetchers_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fetchers/common */ "./fetchers/common.js");
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fetchers/userconfig */ "./fetchers/userconfig.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);







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
  req.addEventListener('load', function () {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('GET', _config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix, true);

  if (token) {
    req.setRequestHeader("Authorization", "Bearer " + token);
  }

  req.send(null);
  installed = true;
}
function getInstalledCSRF() {
  return installedCSRF;
}
function useRequiredUserConfig() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    userConfig: undefined,
    token: undefined
  }),
      state = _useState[0],
      setState = _useState[1];

  useEffect(function () {
    function fetchConfig() {
      return _fetchConfig.apply(this, arguments);
    }

    function _fetchConfig() {
      _fetchConfig = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var token, userConfig;
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return Object(_fetchers_common__WEBPACK_IMPORTED_MODULE_4__["loadAuthToken"])();

              case 3:
                token = _context.sent;
                _context.next = 6;
                return Object(_fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__["fetchCurrentUserConfig"])();

              case 6:
                userConfig = _context.sent;
                setState({
                  userConfig: userConfig,
                  token: token
                });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                next_router__WEBPACK_IMPORTED_MODULE_6___default.a.push('/login');

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
      }));
      return _fetchConfig.apply(this, arguments);
    }

    fetchConfig();
  }, []);
  return state;
}

/***/ })

})
//# sourceMappingURL=login.js.ef479f60bb76b0ca4748.hot-update.js.map