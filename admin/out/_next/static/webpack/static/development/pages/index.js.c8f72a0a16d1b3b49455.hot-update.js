webpackHotUpdate("static\\development\\pages\\index.js",{

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
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(_config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix + '/resources/services.json', {
              headers: Object(_common__WEBPACK_IMPORTED_MODULE_5__["withAuthHeaders"])({
                'Content-Type': 'application/json'
              })
            });

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
              headers: Object(_common__WEBPACK_IMPORTED_MODULE_5__["withAuthHeaders"])({
                'Content-Type': 'application/json',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_4__["getInstalledCSRF"])()
              }),
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

/***/ })

})
//# sourceMappingURL=index.js.c8f72a0a16d1b3b49455.hot-update.js.map