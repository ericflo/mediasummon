webpackHotUpdate("static\\development\\pages\\login.js",{

/***/ "./pages/login.js":
/*!************************!*\
  !*** ./pages/login.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Login; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/uikit/dist/css/uikit.min.css */ "./node_modules/uikit/dist/css/uikit.min.css");
/* harmony import */ var _node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_uikit_dist_css_uikit_min_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");
/* harmony import */ var _fetchers_login__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../fetchers/login */ "./fetchers/login.js");
/* harmony import */ var _fetchers_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../fetchers/common */ "./fetchers/common.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _components_Navbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/Navbar */ "./components/Navbar.js");


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\login.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;








function Login() {
  var _useRequiredUserConfi = Object(_setup__WEBPACK_IMPORTED_MODULE_4__["useRequiredUserConfig"])(),
      userConfig = _useRequiredUserConfi.userConfig;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      errorMessage = _useState[0],
      setErrorMessage = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      usernameField = _useState2[0],
      setUsernameField = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      passwordField = _useState3[0],
      setPasswordField = _useState3[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    Object(_setup__WEBPACK_IMPORTED_MODULE_4__["ensureInstalled"])(null);
  }, []);
  var loginCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();

    function cb() {
      return _cb.apply(this, arguments);
    }

    function _cb() {
      _cb = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var username, password, resp;
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                username = usernameField.value;
                password = passwordField.value;
                _context.prev = 2;
                _context.next = 5;
                return Object(_fetchers_login__WEBPACK_IMPORTED_MODULE_6__["fetchLogin"])(username, password);

              case 5:
                resp = _context.sent;
                Object(_fetchers_common__WEBPACK_IMPORTED_MODULE_7__["setAuthToken"])(resp.token);
                next_router__WEBPACK_IMPORTED_MODULE_8___default.a.push('/');
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](2);
                setErrorMessage('' + _context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 10]]);
      }));
      return _cb.apply(this, arguments);
    }

    cb();
  }, [usernameField, passwordField]);
  var usernameLoaded = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setUsernameField(ref);
  }, []);
  var passwordLoaded = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setPasswordField(ref);
  }, []);
  return __jsx("div", {
    className: "uk-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, __jsx(_components_Navbar__WEBPACK_IMPORTED_MODULE_9__["default"], {
    userConfig: userConfig,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }), __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_5__["default"], {
    title: "Mediasummon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, "Login to Mediasummon"), __jsx("form", {
    className: "uk-form-stacked",
    onSubmit: loginCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, "Username"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "Username",
    ref: usernameLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, "Password"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "password",
    placeholder: "",
    ref: passwordLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }))), __jsx("input", {
    type: "submit",
    onSubmit: loginCallback,
    value: "Login",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }))));
}

/***/ }),

/***/ "./setup.js":
/*!******************!*\
  !*** ./setup.js ***!
  \******************/
/*! exports provided: ensureInstalled, getInstalledCSRF, useRequiredUserConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureInstalled", function() { return ensureInstalled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInstalledCSRF", function() { return getInstalledCSRF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useRequiredUserConfig", function() { return useRequiredUserConfig; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./config.js");
/* harmony import */ var _fetchers_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fetchers/common */ "./fetchers/common.js");
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fetchers/userconfig */ "./fetchers/userconfig.js");






var installed = false;
var installedCSRF = null;
function ensureInstalled(token) {
  if (installed) {
    return;
  } // Load UIKit and tell it to use its 'Icons' plugin


  var UIKit = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js");

  var Icons = __webpack_require__(/*! uikit/dist/js/uikit-icons */ "./node_modules/uikit/dist/js/uikit-icons.js");

  UIKit.use(Icons);

  var dayjs = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");

  var relativetime = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");

  dayjs.extend(relativetime);
  var req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('GET', _config__WEBPACK_IMPORTED_MODULE_3__["default"].apiPrefix, true);

  if (token) {
    req.setRequestHeader("Authorization", "Bearer " + token);
  }

  req.send(null);
  installed = true;
}
function getInstalledCSRF() {
  return installedCSRF;
}
function useRequiredUserConfig() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    userConfig: undefined,
    token: undefined
  }),
      state = _useState[0],
      setState = _useState[1];

  useEffect(function () {
    function fetchConfig() {
      return _fetchConfig.apply(this, arguments);
    }

    function _fetchConfig() {
      _fetchConfig = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var token, userConfig;
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return Object(_fetchers_common__WEBPACK_IMPORTED_MODULE_4__["loadAuthToken"])();

              case 3:
                token = _context.sent;
                _context.next = 6;
                return Object(_fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__["fetchCurrentUserConfig"])();

              case 6:
                userConfig = _context.sent;
                setState({
                  userConfig: userConfig,
                  token: token
                });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                Router.push('/login');

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
      }));
      return _fetchConfig.apply(this, arguments);
    }

    fetchConfig();
  }, []);
  return state;
}

/***/ })

})
//# sourceMappingURL=login.js.c0c69869939b0e731c3a.hot-update.js.map