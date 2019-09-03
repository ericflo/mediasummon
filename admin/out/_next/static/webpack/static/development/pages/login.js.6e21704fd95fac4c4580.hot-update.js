webpackHotUpdate("static\\development\\pages\\login.js",{

/***/ "./fetchers/login.js":
/*!***************************!*\
  !*** ./fetchers/login.js ***!
  \***************************/
/*! exports provided: fetchLogin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchLogin", function() { return fetchLogin; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch */ "./fetch.js");
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../setup */ "./setup.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common */ "./fetchers/common.js");





function fetchLogin(_x, _x2) {
  return _fetchLogin.apply(this, arguments);
}

function _fetchLogin() {
  _fetchLogin = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(username, password) {
    var result;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Object(_fetch__WEBPACK_IMPORTED_MODULE_2__["default"])(config.apiPrefix + '/auth/login.json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': Object(_setup__WEBPACK_IMPORTED_MODULE_3__["getInstalledCSRF"])()
              },
              credentials: 'include'
            });

          case 3:
            result = _context.sent;

            if (!result.ok) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return result.json();

          case 7:
            return _context.abrupt("return", _context.sent);

          case 10:
            _context.next = 12;
            return Object(_common__WEBPACK_IMPORTED_MODULE_4__["throwMessageFromJSONError"])(result);

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            throw 'Could not complete fetch: ' + _context.t0;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));
  return _fetchLogin.apply(this, arguments);
}

/***/ }),

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
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Header */ "./components/Header.js");
/* harmony import */ var _fetchers_login__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../fetchers/login */ "./fetchers/login.js");


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\pages\\login.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;




function Login() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      errorMessage = _useState[0],
      setErrorMessage = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      usernameField = _useState2[0],
      setUsernameField = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      passwordField = _useState3[0],
      setPasswordField = _useState3[1];

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
                _context.next = 4;
                return Object(_fetchers_login__WEBPACK_IMPORTED_MODULE_5__["fetchLogin"])(username, password);

              case 4:
                resp = _context.sent;
                console.log('resp', resp);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
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
      lineNumber: 27
    },
    __self: this
  }, __jsx(_components_Header__WEBPACK_IMPORTED_MODULE_4__["default"], {
    title: "Mediasummon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }), errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, __jsx("a", {
    className: "uk-alert-close",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }), __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("div", {
    className: "uk-section uk-section-default uk-padding-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, __jsx("h3", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, "Login to Mediasummon"), __jsx("form", {
    className: "uk-form-stacked",
    onSubmit: loginCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, "Username"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "Username",
    ref: usernameLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, "Password"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "password",
    placeholder: "",
    ref: passwordLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }))), __jsx("input", {
    type: "submit",
    onSubmit: loginCallback,
    value: "Login",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }))));
}

/***/ })

})
//# sourceMappingURL=login.js.6e21704fd95fac4c4580.hot-update.js.map