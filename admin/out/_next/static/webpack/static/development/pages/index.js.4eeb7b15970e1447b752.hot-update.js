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
    var apiURL, resp, errJson, data;
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
              _context2.next = 18;
              break;
            }

            _context2.prev = 7;
            _context2.next = 10;
            return resp.json();

          case 10:
            errJson = _context2.sent;

            if (errJson.error) {
              setErrorMessage(errJson.error);
            } else {
              setErrorMessage('Completed fetch but got error from resource: ' + errJson);
            }

            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](7);
            setErrorMessage('Completed fetch but got bad status from resource: ' + resp.status);

          case 17:
            return _context2.abrupt("return");

          case 18:
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t1 = _context2["catch"](2);
            setErrorMessage('Could not complete fetch: ' + _context2.t1);
            return _context2.abrupt("return");

          case 24:
            _context2.prev = 24;
            _context2.next = 27;
            return resp.json();

          case 27:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 31:
            _context2.prev = 31;
            _context2.t2 = _context2["catch"](24);
            setErrorMessage('Could not parse JSON: ' + _context2.t2);

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 20], [7, 14], [24, 31]]);
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
//# sourceMappingURL=index.js.4eeb7b15970e1447b752.hot-update.js.map