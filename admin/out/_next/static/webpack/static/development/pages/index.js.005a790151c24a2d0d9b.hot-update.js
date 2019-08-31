webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/targets.js":
/*!*****************************!*\
  !*** ./fetchers/targets.js ***!
  \*****************************/
/*! exports provided: fetchTargets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchTargets", function() { return fetchTargets; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./config.js");




function fetchTargets(_x, _x2) {
  return _fetchTargets.apply(this, arguments);
}

function _fetchTargets() {
  _fetchTargets = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(setTargets, setErrorMessage) {
    var result, targets;
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
              _context.next = 11;
              break;
            }

            _context.next = 7;
            return result.json();

          case 7:
            targets = _context.sent;
            setTargets(targets);
            _context.next = 12;
            break;

          case 11:
            setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            setErrorMessage('Could not complete fetch: ' + _context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));
  return _fetchTargets.apply(this, arguments);
}

/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/uikit/dist/css/uikit.min.css */ "./node_modules/uikit/dist/css/uikit.min.css");
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _fetchers_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fetchers/services */ "./fetchers/services.js");
/* harmony import */ var _fetchers_targets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../fetchers/targets */ "./fetchers/targets.js");
/* harmony import */ var _components_ServiceSummary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/ServiceSummary */ "./components/ServiceSummary.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");
var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;







function Home() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      services = _useState[0],
      setServices = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      targets = _useState2[0],
      setTargets = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      errorMessage = _useState3[0],
      setErrorMessage = _useState3[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    Object(_setup__WEBPACK_IMPORTED_MODULE_2__["ensureInstalled"])();
    Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_3__["fetchServices"])(setServices, setErrorMessage);
    Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_4__["fetchTargets"])(setTargets, setErrorMessage);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var timer = setInterval(function () {
      Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_3__["fetchServices"])(setServices, setErrorMessage);
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_6__["default"], {
    title: "Your Mediasummon Dashboard",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, "Services to sync"), services.map(function (service) {
    return __jsx(_components_ServiceSummary__WEBPACK_IMPORTED_MODULE_5__["default"], {
      key: service.metadata.id,
      service: service,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      },
      __self: this
    });
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.005a790151c24a2d0d9b.hot-update.js.map