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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util */ "./util.js");
/* harmony import */ var _fetchers_services__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../fetchers/services */ "./fetchers/services.js");
/* harmony import */ var _fetchers_targets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../fetchers/targets */ "./fetchers/targets.js");
/* harmony import */ var _components_ServiceSummary__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/ServiceSummary */ "./components/ServiceSummary.js");
/* harmony import */ var _components_TargetSummary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/TargetSummary */ "./components/TargetSummary.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;










function handleTargetRemoveClick(_x, _x2, _x3, _x4, _x5) {
  return _handleTargetRemoveClick.apply(this, arguments);
}

function _handleTargetRemoveClick() {
  _handleTargetRemoveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(target, targets, setTargets, setErrorMessage, ev) {
    var UIKit, result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ev.stopPropagation();
            ev.preventDefault();
            UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");
            _context.prev = 3;
            _context.next = 6;
            return UIKit.modal.confirm('Are you sure you want to remove this sync target? (' + target.path + ')');

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return");

          case 11:
            _context.prev = 11;
            _context.next = 14;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_7__["fetchTargetRemove"])(target.url, setErrorMessage);

          case 14:
            result = _context.sent;
            console.log('remove result', result);
            setTargets(targets.filter(function (t) {
              return t.url !== target.url;
            }));
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](11);
            setErrorMessage('' + _context.t1);

          case 22:
            return _context.abrupt("return", false);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 8], [11, 19]]);
  }));
  return _handleTargetRemoveClick.apply(this, arguments);
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

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      isAdding = _useState4[0],
      setIsAdding = _useState4[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    Object(_setup__WEBPACK_IMPORTED_MODULE_4__["ensureInstalled"])();
    Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_6__["fetchServices"])(setServices, setErrorMessage);
    Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_7__["fetchTargets"])(setTargets, setErrorMessage);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    var timer = setInterval(function () {
      if (targets.length) {
        Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_6__["fetchServices"])(setServices, setErrorMessage);
      }
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, [targets]);
  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_10__["default"], {
    title: "Your Mediasummon Dashboard",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, "Target locations to sync media to"), targets.map(function (target) {
    return __jsx(_components_TargetSummary__WEBPACK_IMPORTED_MODULE_9__["default"], {
      key: target.url,
      target: target,
      onRemoveClick: handleTargetRemoveClick.bind(_this, target, targets, setTargets, setErrorMessage),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60
      },
      __self: this
    });
  }), __jsx("div", {
    className: "uk-flex uk-flex-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    "uk-icon": "icon: plus-circle; ratio: 2",
    onClick: Object(_util__WEBPACK_IMPORTED_MODULE_5__["preventDefaultAnd"])(function () {
      return setIsAdding(true);
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, "Services to sync from"), services.map(function (service) {
    return __jsx(_components_ServiceSummary__WEBPACK_IMPORTED_MODULE_8__["default"], {
      key: service.metadata.id,
      service: service,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76
      },
      __self: this
    });
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.9fa02810ebfdad5570b1.hot-update.js.map