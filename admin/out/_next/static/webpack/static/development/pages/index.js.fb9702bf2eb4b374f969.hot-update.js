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
/* harmony import */ var _components_AddTargetModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/AddTargetModal */ "./components/AddTargetModal.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");
/* harmony import */ var _components_Navbar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/Navbar */ "./components/Navbar.js");


var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;











function handleTargetRemoveClick(_x, _x2, _x3, _x4) {
  return _handleTargetRemoveClick.apply(this, arguments);
}

function _handleTargetRemoveClick() {
  _handleTargetRemoveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(target, targets, setTargets, setErrorMessage) {
    var UIKit, result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");
            _context.prev = 1;
            _context.next = 4;
            return UIKit.modal.confirm('Are you sure you want to remove this sync target? (' + target.path + ')');

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return");

          case 9:
            _context.prev = 9;
            _context.next = 12;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_6__["fetchTargetRemove"])(target.url);

          case 12:
            result = _context.sent;
            setTargets(targets.filter(function (t) {
              return t.url !== target.url;
            }));
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t1 = _context["catch"](9);
            setErrorMessage('' + _context.t1);

          case 19:
            return _context.abrupt("return", false);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6], [9, 16]]);
  }));
  return _handleTargetRemoveClick.apply(this, arguments);
}

function fullSetup(_x5, _x6, _x7, _x8) {
  return _fullSetup.apply(this, arguments);
}

function _fullSetup() {
  _fullSetup = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(token, setServices, setTargets, setErrorMessage) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            Object(_setup__WEBPACK_IMPORTED_MODULE_4__["ensureInstalled"])(token);
            _context2.t0 = setServices;
            _context2.next = 5;
            return Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])();

          case 5:
            _context2.t1 = _context2.sent;
            (0, _context2.t0)(_context2.t1);
            _context2.t2 = setTargets;
            _context2.next = 10;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_6__["fetchTargets"])();

          case 10:
            _context2.t3 = _context2.sent;
            (0, _context2.t2)(_context2.t3);
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t4 = _context2["catch"](0);
            setErrorMessage('' + _context2.t4);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));
  return _fullSetup.apply(this, arguments);
}

function updateServices(_x9, _x10) {
  return _updateServices.apply(this, arguments);
}

function _updateServices() {
  _updateServices = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(setServices, setErrorMessage) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.t0 = setServices;
            _context3.next = 4;
            return Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])();

          case 4:
            _context3.t1 = _context3.sent;
            (0, _context3.t0)(_context3.t1);
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t2 = _context3["catch"](0);
            setErrorMessage('' + _context3.t2);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return _updateServices.apply(this, arguments);
}

function Home() {
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

  var _useRequiredUserConfi = Object(_setup__WEBPACK_IMPORTED_MODULE_4__["useRequiredUserConfig"])(),
      userConfig = _useRequiredUserConfi.userConfig,
      token = _useRequiredUserConfi.token;

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    if (userConfig === undefined) {
      return;
    }

    fullSetup(token, setServices, setTargets, setErrorMessage);
  }, [userConfig, token, isAdding]);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    if (userConfig === undefined) {
      return;
    }

    var timer = null;

    function runUpdate() {
      updateServices(setServices, setErrorMessage);
      timer = setTimeout(runUpdate, 1000);
    }

    timer = setTimeout(runUpdate, 1000);
    return function () {
      return clearTimeout(timer);
    };
  }, [userConfig]);
  var removeTargetClickCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (target) {
    handleTargetRemoveClick(target, targets, setTargets, setErrorMessage);
  }, [targets]);
  var addTargetClickCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    setIsAdding(true);
  }, []);

  if (userConfig === undefined) {
    return null;
  }

  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, __jsx(_components_Navbar__WEBPACK_IMPORTED_MODULE_11__["default"], {
    userConfig: userConfig,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87
    },
    __self: this
  }), __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_10__["default"], {
    title: "Mediasummon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }), __jsx(_components_AddTargetModal__WEBPACK_IMPORTED_MODULE_9__["default"], {
    setIsAdding: setIsAdding,
    enabled: isAdding,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }, "Summoning your media to these locations"), targets.map(function (target) {
    return __jsx(_components_TargetSummary__WEBPACK_IMPORTED_MODULE_8__["default"], {
      key: target.url,
      target: target,
      onRemoveClick: removeTargetClickCallback,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 99
      },
      __self: this
    });
  }), __jsx("div", {
    className: "uk-flex uk-flex-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 105
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    "uk-icon": "icon: plus-circle; ratio: 2",
    onClick: addTargetClickCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113
    },
    __self: this
  }, "Summoning media from these services"), services.map(function (service) {
    return __jsx(_components_ServiceSummary__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: service.metadata.id,
      service: service,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115
      },
      __self: this
    });
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.fb9702bf2eb4b374f969.hot-update.js.map