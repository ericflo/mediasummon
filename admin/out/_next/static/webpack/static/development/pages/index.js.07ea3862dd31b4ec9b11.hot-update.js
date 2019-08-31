webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/targets.js":
/*!*****************************!*\
  !*** ./fetchers/targets.js ***!
  \*****************************/
/*! exports provided: fetchTargets, fetchTargetDelete */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargets", function() { return fetchTargets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargetDelete", function() { return fetchTargetDelete; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");





function fetchTargets(_x, _x2) {
  return _fetchTargets.apply(this, arguments);
}

function _fetchTargets() {
  _fetchTargets = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(setTargets, setErrorMessage) {
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
              target.path = split[1];
            }

            setTargets(targets);
            _context.next = 13;
            break;

          case 12:
            setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            setErrorMessage('Could not complete fetch: ' + _context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));
  return _fetchTargets.apply(this, arguments);
}

function fetchTargetDelete(_x3, _x4, _x5) {
  return _fetchTargetDelete.apply(this, arguments);
}

function _fetchTargetDelete() {
  _fetchTargetDelete = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(url, setTargets, setErrorMessage) {
    var _url, _resp, data;

    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _url = _config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/service/sync.json?service=' + serviceID;
            _context2.next = 4;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_4__["getInstalledCSRF"])()
              },
              credentials: 'include'
            });

          case 4:
            _resp = _context2.sent;
            _context2.next = 11;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            setErrorMessage('Could not complete fetch: ' + _context2.t0);
            return _context2.abrupt("return");

          case 11:
            _context2.prev = 11;
            _context2.next = 14;
            return resp.json();

          case 14:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 18:
            _context2.prev = 18;
            _context2.t1 = _context2["catch"](11);
            setErrorMessage('Could not parse JSON: ' + _context2.t1);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7], [11, 18]]);
  }));
  return _fetchTargetDelete.apply(this, arguments);
}

/***/ })

})
//# sourceMappingURL=index.js.07ea3862dd31b4ec9b11.hot-update.js.map