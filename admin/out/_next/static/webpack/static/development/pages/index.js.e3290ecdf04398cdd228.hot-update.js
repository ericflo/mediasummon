webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/uikit/dist/css/uikit.min.css */ "./node_modules/uikit/dist/css/uikit.min.css");
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _fetchers_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../fetchers/services */ "./fetchers/services.js");
/* harmony import */ var _fetchers_targets__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../fetchers/targets */ "./fetchers/targets.js");
/* harmony import */ var _components_ServiceSummary__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/ServiceSummary */ "./components/ServiceSummary.js");
/* harmony import */ var _components_TargetSummary__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/TargetSummary */ "./components/TargetSummary.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;









function handleTargetDeleteClick(_x, _x2) {
  return _handleTargetDeleteClick.apply(this, arguments);
}

function _handleTargetDeleteClick() {
  _handleTargetDeleteClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(target, ev) {
    var result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ev.stopPropagation();
            ev.preventDefault();
            _context.next = 4;
            return fetchServiceSyncStart(service.metadata.id);

          case 4:
            result = _context.sent;
            console.log('result', result);
            return _context.abrupt("return", false);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _handleTargetDeleteClick.apply(this, arguments);
}

function Home() {
  var _this = this;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])([]),
      services = _useState[0],
      setServices = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])([]),
      targets = _useState2[0],
      setTargets = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      errorMessage = _useState3[0],
      setErrorMessage = _useState3[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    Object(_setup__WEBPACK_IMPORTED_MODULE_4__["ensureInstalled"])();
    Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])(setServices, setErrorMessage);
    Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_6__["fetchTargets"])(setTargets, setErrorMessage);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    var timer = setInterval(function () {
      Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])(setServices, setErrorMessage);
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_9__["default"], {
    title: "Your Mediasummon Dashboard",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, "Target locations to sync media to"), targets.map(function (target) {
    return __jsx(_components_TargetSummary__WEBPACK_IMPORTED_MODULE_8__["default"], {
      key: target.url,
      target: target,
      onDeleteClick: handleTargetDeleteClick.bind(_this, target),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 44
      },
      __self: this
    });
  })), __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, "Services to sync"), services.map(function (service) {
    return __jsx(_components_ServiceSummary__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: service.metadata.id,
      service: service,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      },
      __self: this
    });
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.e3290ecdf04398cdd228.hot-update.js.map