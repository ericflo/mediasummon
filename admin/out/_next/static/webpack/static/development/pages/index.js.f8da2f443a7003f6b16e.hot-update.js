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
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../fetchers/userconfig */ "./fetchers/userconfig.js");
/* harmony import */ var _components_ServiceSummary__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/ServiceSummary */ "./components/ServiceSummary.js");
/* harmony import */ var _components_TargetSummary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/TargetSummary */ "./components/TargetSummary.js");
/* harmony import */ var _components_AddTargetModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/AddTargetModal */ "./components/AddTargetModal.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_12__);


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;












function handleTargetRemoveClick(_x, _x2, _x3, _x4) {
  return _handleTargetRemoveClick.apply(this, arguments);
}

function _handleTargetRemoveClick() {
  _handleTargetRemoveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(target, targets, setTargets, setErrorMessage) {
    var UIKit, result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");
            _context2.prev = 1;
            _context2.next = 4;
            return UIKit.modal.confirm('Are you sure you want to remove this sync target? (' + target.path + ')');

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return");

          case 9:
            _context2.prev = 9;
            _context2.next = 12;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_6__["fetchTargetRemove"])(target.url);

          case 12:
            result = _context2.sent;
            setTargets(targets.filter(function (t) {
              return t.url !== target.url;
            }));
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t1 = _context2["catch"](9);
            setErrorMessage('' + _context2.t1);

          case 19:
            return _context2.abrupt("return", false);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 6], [9, 16]]);
  }));
  return _handleTargetRemoveClick.apply(this, arguments);
}

function fullSetup(_x5, _x6, _x7) {
  return _fullSetup.apply(this, arguments);
}

function _fullSetup() {
  _fullSetup = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(setServices, setTargets, setErrorMessage) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            Object(_setup__WEBPACK_IMPORTED_MODULE_4__["ensureInstalled"])();
            _context3.prev = 1;
            _context3.t0 = setServices;
            _context3.next = 5;
            return Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])();

          case 5:
            _context3.t1 = _context3.sent;
            (0, _context3.t0)(_context3.t1);
            _context3.t2 = setTargets;
            _context3.next = 10;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_6__["fetchTargets"])();

          case 10:
            _context3.t3 = _context3.sent;
            (0, _context3.t2)(_context3.t3);
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t4 = _context3["catch"](1);
            setErrorMessage('' + _context3.t4);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 14]]);
  }));
  return _fullSetup.apply(this, arguments);
}

function updateServices(_x8, _x9) {
  return _updateServices.apply(this, arguments);
}

function _updateServices() {
  _updateServices = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(setServices, setErrorMessage) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.t0 = setServices;
            _context4.next = 4;
            return Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_5__["fetchServices"])();

          case 4:
            _context4.t1 = _context4.sent;
            (0, _context4.t0)(_context4.t1);
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t2 = _context4["catch"](0);
            setErrorMessage('' + _context4.t2);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return _updateServices.apply(this, arguments);
}

function useRequiredUserConfig() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(undefined),
      userConfig = _useState[0],
      setUserConfig = _useState[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    function fetchConfig() {
      return _fetchConfig.apply(this, arguments);
    }

    function _fetchConfig() {
      _fetchConfig = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var _userConfig;

        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return Object(_fetchers_userconfig__WEBPACK_IMPORTED_MODULE_7__["fetchCurrentUserConfig"])();

              case 3:
                _userConfig = _context.sent;
                setUserConfig(_userConfig);
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                next_router__WEBPACK_IMPORTED_MODULE_12___default.a.push('/login');

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }));
      return _fetchConfig.apply(this, arguments);
    }

    fetchConfig();
  });
  return userConfig;
}

function Home() {
  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])([]),
      services = _useState2[0],
      setServices = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])([]),
      targets = _useState3[0],
      setTargets = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      errorMessage = _useState4[0],
      setErrorMessage = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      isAdding = _useState5[0],
      setIsAdding = _useState5[1];

  var userConfig = useRequiredUserConfig();
  console.log('userConfig', userConfig);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    fullSetup(setServices, setTargets, setErrorMessage);
  }, [isAdding]);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    var timer = setInterval(function () {
      updateServices(setServices, setErrorMessage);
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  var removeTargetClickCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (target) {
    handleTargetRemoveClick(target, targets, setTargets, setErrorMessage);
  }, [targets]);
  var addTargetClickCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    setIsAdding(true);
  }, []);
  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }, __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_11__["default"], {
    title: "Mediasummon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  }), __jsx(_components_AddTargetModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
    setIsAdding: setIsAdding,
    enabled: isAdding,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97
    },
    __self: this
  }, "Summoning your media to these locations"), targets.map(function (target) {
    return __jsx(_components_TargetSummary__WEBPACK_IMPORTED_MODULE_9__["default"], {
      key: target.url,
      target: target,
      onRemoveClick: removeTargetClickCallback,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 100
      },
      __self: this
    });
  }), __jsx("div", {
    className: "uk-flex uk-flex-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    "uk-icon": "icon: plus-circle; ratio: 2",
    onClick: addTargetClickCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 107
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 114
    },
    __self: this
  }, "Summoning media from these services"), services.map(function (service) {
    return __jsx(_components_ServiceSummary__WEBPACK_IMPORTED_MODULE_8__["default"], {
      key: service.metadata.id,
      service: service,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 116
      },
      __self: this
    });
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.f8da2f443a7003f6b16e.hot-update.js.map