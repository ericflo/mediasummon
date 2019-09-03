webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/common.js":
/*!****************************!*\
  !*** ./fetchers/common.js ***!
  \****************************/
/*! exports provided: extractMessageFromJSONError, throwMessageFromJSONError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractMessageFromJSONError", function() { return extractMessageFromJSONError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwMessageFromJSONError", function() { return throwMessageFromJSONError; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");


function extractMessageFromJSONError(_x) {
  return _extractMessageFromJSONError.apply(this, arguments);
}

function _extractMessageFromJSONError() {
  _extractMessageFromJSONError = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
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
  _throwMessageFromJSONError = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
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

/***/ }),

/***/ "./fetchers/services.js":
/*!******************************!*\
  !*** ./fetchers/services.js ***!
  \******************************/
/*! exports provided: fetchServices, fetchServiceSyncStart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchServices", function() { return fetchServices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchServiceSyncStart", function() { return fetchServiceSyncStart; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./fetchers/common.js");






function fetchServices() {
  return _fetchServices.apply(this, arguments);
}

function _fetchServices() {
  _fetchServices = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    var result, services, i, service, sync;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/services.json');

          case 3:
            result = _context.sent;

            if (!result.ok) {
              _context.next = 23;
              break;
            }

            _context.next = 7;
            return result.json();

          case 7:
            services = _context.sent;
            i = 0;

          case 9:
            if (!(i < services.length)) {
              _context.next = 20;
              break;
            }

            service = services[i];
            sync = service.last_sync;

            if (sync) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("continue", 17);

          case 14:
            sync.startString = sync.start;
            sync.start = Date.parse(sync.start);

            if (sync.end) {
              sync.endString = sync.end;
              sync.end = Date.parse(sync.end);
            }

          case 17:
            ++i;
            _context.next = 9;
            break;

          case 20:
            return _context.abrupt("return", services);

          case 23:
            _context.next = 25;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(result);

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](0);
            throw 'Could not complete fetch: ' + _context.t0;

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 27]]);
  }));
  return _fetchServices.apply(this, arguments);
}

function fetchServiceSyncStart(_x) {
  return _fetchServiceSyncStart.apply(this, arguments);
}

function _fetchServiceSyncStart() {
  _fetchServiceSyncStart = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(serviceID) {
    var url, resp, data;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = _config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/service/sync.json?service=' + serviceID;
            _context2.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_4__["getInstalledCSRF"])()
              },
              credentials: 'include'
            });

          case 3:
            resp = _context2.sent;

            if (resp.ok) {
              _context2.next = 7;
              break;
            }

            _context2.next = 7;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(resp);

          case 7:
            _context2.next = 9;
            return resp.json();

          case 9:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchServiceSyncStart.apply(this, arguments);
}

/***/ }),

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
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./fetchers/common.js");






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
            _context.next = 14;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(result);

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            throw 'Could not complete fetch: ' + _context.t0;

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
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
    var apiURL, resp;
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
              _context2.next = 9;
              break;
            }

            _context2.next = 9;
            return Object(_common__WEBPACK_IMPORTED_MODULE_5__["throwMessageFromJSONError"])(resp);

          case 9:
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](2);
            throw 'Could not complete fetch: ' + _context2.t0;

          case 14:
            _context2.prev = 14;
            _context2.next = 17;
            return resp.json();

          case 17:
            return _context2.abrupt("return", _context2.sent);

          case 20:
            _context2.prev = 20;
            _context2.t1 = _context2["catch"](14);
            throw 'Could not parse JSON: ' + _context2.t1;

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 11], [14, 20]]);
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

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs2/helpers/asyncToGenerator.js":
false

})
//# sourceMappingURL=index.js.0fcd55e75d533c7e2273.hot-update.js.map