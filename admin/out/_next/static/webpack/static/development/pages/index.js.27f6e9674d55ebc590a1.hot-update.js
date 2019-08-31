webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/targets.js":
/*!*****************************!*\
  !*** ./fetchers/targets.js ***!
  \*****************************/
/*! exports provided: fetchTargets, fetchTargetRemove, fetchTargetAdd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargets", function() { return fetchTargets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargetRemove", function() { return fetchTargetRemove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargetAdd", function() { return fetchTargetAdd; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");





function fetchTargets() {
  return _fetchTargets.apply(this, arguments);
}

function _fetchTargets() {
  _fetchTargets = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    var result, targets, i, target, split;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/targets.json');

          case 3:
            result = _context.sent;

            if (!result.ok) {
              _context.next = 12;
              break;
            }

            _context.next = 7;
            return result.json();

          case 7:
            targets = _context.sent;

            for (i = 0; i < targets.length; ++i) {
              target = targets[i];
              split = target.url.split('://');
              target.kind = split[0];
              target.path = decodeURIComponent(split[1].substring(1));
            }

            return _context.abrupt("return", targets);

          case 12:
            throw 'Completed fetch but got bad status from resource: ' + result.status;

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            throw 'Could not complete fetch: ' + _context.t0;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));
  return _fetchTargets.apply(this, arguments);
}

function fetchTargetOperation(_x, _x2) {
  return _fetchTargetOperation.apply(this, arguments);
}

function _fetchTargetOperation() {
  _fetchTargetOperation = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(operation, url) {
    var apiURL, resp, errorToThrow, errJson;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            apiURL = _config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/target/' + operation + '.json?url=' + encodeURIComponent(url);
            resp = null;
            _context2.prev = 2;
            _context2.next = 5;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(apiURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_4__["getInstalledCSRF"])()
              },
              credentials: 'include'
            });

          case 5:
            resp = _context2.sent;

            if (resp.ok) {
              _context2.next = 19;
              break;
            }

            errorToThrow = null;
            _context2.prev = 8;
            _context2.next = 11;
            return resp.json();

          case 11:
            errJson = _context2.sent;

            if (errJson.error) {
              errToReturn = null;
              errorToThrow = errJson.error;
            } else {
              errorToThrow = 'Completed fetch but got error from resource: ' + errJson;
            }

            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](8);
            throw 'Completed fetch but got bad status from resource: ' + resp.status + ' (' + _context2.t0 + ')';

          case 18:
            throw errorToThrow;

          case 19:
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2["catch"](2);
            throw 'Could not complete fetch: ' + _context2.t1;

          case 24:
            _context2.prev = 24;
            _context2.next = 27;
            return resp.json();

          case 27:
            return _context2.abrupt("return", _context2.sent);

          case 30:
            _context2.prev = 30;
            _context2.t2 = _context2["catch"](24);
            throw 'Could not parse JSON: ' + _context2.t2;

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 21], [8, 15], [24, 30]]);
  }));
  return _fetchTargetOperation.apply(this, arguments);
}

function fetchTargetRemove(_x3) {
  return _fetchTargetRemove.apply(this, arguments);
}

function _fetchTargetRemove() {
  _fetchTargetRemove = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(url) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", fetchTargetOperation('remove', url));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _fetchTargetRemove.apply(this, arguments);
}

function fetchTargetAdd(_x4) {
  return _fetchTargetAdd.apply(this, arguments);
}

function _fetchTargetAdd() {
  _fetchTargetAdd = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(url) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", fetchTargetOperation('add', url));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _fetchTargetAdd.apply(this, arguments);
}

/***/ })

})
//# sourceMappingURL=index.js.27f6e9674d55ebc590a1.hot-update.js.map