webpackHotUpdate("static\\development\\pages\\login.js",{

/***/ "./fetchers/userconfig.js":
/*!********************************!*\
  !*** ./fetchers/userconfig.js ***!
  \********************************/
/*! exports provided: fetchCurrentUserConfig, fetchUpdateSecrets, fetchAppAuth */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCurrentUserConfig", function() { return fetchCurrentUserConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUpdateSecrets", function() { return fetchUpdateSecrets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchAppAuth", function() { return fetchAppAuth; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./fetchers/common.js");






function fetchCurrentUserConfig() {
  return _fetchCurrentUserConfig.apply(this, arguments);
}

function _fetchCurrentUserConfig() {
  _fetchCurrentUserConfig = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    var result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/config.json', {
              headers: Object(_common__WEBPACK_IMPORTED_MODULE_5__["withAuthHeaders"])({
                'Content-Type': 'application/json'
              })
            });

          case 3:
            result = _context.sent;

            if (!result.ok) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return result.json();

          case 7:
            return _context.abrupt("return", _context.sent);

          case 10:
            _context.next = 12;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(result);

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            throw 'Could not complete fetch: ' + _context.t0;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));
  return _fetchCurrentUserConfig.apply(this, arguments);
}

function fetchUpdateSecrets(_x, _x2) {
  return _fetchUpdateSecrets.apply(this, arguments);
}

function _fetchUpdateSecrets() {
  _fetchUpdateSecrets = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(service, params) {
    var resp, data;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = params || {};
            params.service = service;
            _context2.next = 4;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/config/secrets.json', {
              method: 'POST',
              headers: Object(_common__WEBPACK_IMPORTED_MODULE_5__["withAuthHeaders"])({
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_4__["getInstalledCSRF"])()
              }),
              credentials: 'include',
              body: Object(_common__WEBPACK_IMPORTED_MODULE_5__["encodeQuery"])(params)
            });

          case 4:
            resp = _context2.sent;

            if (resp.ok) {
              _context2.next = 8;
              break;
            }

            _context2.next = 8;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(resp);

          case 8:
            _context2.next = 10;
            return resp.json();

          case 10:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchUpdateSecrets.apply(this, arguments);
}

function fetchAppAuth() {
  return _fetchAppAuth.apply(this, arguments);
}

function _fetchAppAuth() {
  _fetchAppAuth = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
    var result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/config/appauth.json', {
              headers: Object(_common__WEBPACK_IMPORTED_MODULE_5__["withAuthHeaders"])({
                'Content-Type': 'application/json'
              })
            });

          case 3:
            result = _context3.sent;

            if (!result.ok) {
              _context3.next = 10;
              break;
            }

            _context3.next = 7;
            return result.json();

          case 7:
            return _context3.abrupt("return", _context3.sent);

          case 10:
            _context3.next = 12;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(result);

          case 12:
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            throw 'Could not complete fetch: ' + _context3.t0;

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));
  return _fetchAppAuth.apply(this, arguments);
}

/***/ })

})
//# sourceMappingURL=login.js.8996a092b2014c000d90.hot-update.js.map