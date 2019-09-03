webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/common.js":
/*!****************************!*\
  !*** ./fetchers/common.js ***!
  \****************************/
/*! exports provided: setAuthToken, getAuthToken, extractMessageFromJSONError, throwMessageFromJSONError, encodeQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAuthToken", function() { return setAuthToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAuthToken", function() { return getAuthToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractMessageFromJSONError", function() { return extractMessageFromJSONError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwMessageFromJSONError", function() { return throwMessageFromJSONError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeQuery", function() { return encodeQuery; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/object/keys */ "./node_modules/@babel/runtime-corejs2/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");



var authToken = null;
function setAuthToken(token) {
  authToken = token;
}
function getAuthToken() {
  return authToken;
}
function extractMessageFromJSONError(_x) {
  return _extractMessageFromJSONError.apply(this, arguments);
}

function _extractMessageFromJSONError() {
  _extractMessageFromJSONError = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(resp) {
    var errJson;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return resp.json();

          case 3:
            errJson = _context.sent;

            if (!errJson.error) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", errJson.error);

          case 6:
            return _context.abrupt("return", 'Completed fetch but got error from resource: ' + errJson);

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", 'Completed fetch but got bad status from resource: ' + resp.status + ' (' + _context.t0 + ')');

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));
  return _extractMessageFromJSONError.apply(this, arguments);
}

function throwMessageFromJSONError(_x2) {
  return _throwMessageFromJSONError.apply(this, arguments);
}

function _throwMessageFromJSONError() {
  _throwMessageFromJSONError = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(resp) {
    var msg;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return extractMessageFromJSONError(resp);

          case 2:
            msg = _context2.sent;
            throw msg;

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _throwMessageFromJSONError.apply(this, arguments);
}

function encodeQuery(params) {
  return _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(params).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
}

/***/ })

})
//# sourceMappingURL=index.js.be31c64dba1fcf7c4f50.hot-update.js.map