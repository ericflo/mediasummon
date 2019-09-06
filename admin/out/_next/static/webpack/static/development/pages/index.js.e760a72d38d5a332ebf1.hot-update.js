webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/OAuthAppForm.js":
/*!************************************!*\
  !*** ./components/OAuthAppForm.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OAuthAppForm; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fetchers/userconfig */ "./fetchers/userconfig.js");


var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\components\\OAuthAppForm.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;




function handleSaveClick(_x, _x2, _x3) {
  return _handleSaveClick.apply(this, arguments);
}

function _handleSaveClick() {
  _handleSaveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(secretName, params, setShowing) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_fetchers_userconfig__WEBPACK_IMPORTED_MODULE_3__["fetchUpdateSecrets"])(secretName, params);

          case 2:
            setShowing(false);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _handleSaveClick.apply(this, arguments);
}

function OAuthAppForm(_ref) {
  var secretName = _ref.secretName,
      setShowing = _ref.setShowing;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(undefined),
      clientID = _useState[0],
      setClientID = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(undefined),
      clientSecret = _useState2[0],
      setClientSecret = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(undefined),
      region = _useState3[0],
      setRegion = _useState3[1];

  var handleCancelClicked = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    setShowing(false);
  }, []);
  var handleSaveClicked = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    var id = clientID ? clientID.value : null;
    var secret = clientSecret ? clientSecret.value : null;
    var reg = region ? region.value : null;
    var params = null;

    if (secretName === 's3') {
      params = {
        aws_access_key_id: id,
        aws_secret_access_key: secret,
        region: reg
      };
    } else {
      params = {
        client_id: id,
        client_secret: secret
      };
    }

    handleSaveClick(secretName, params, setShowing);
  }, [secretName, clientID, clientSecret]);
  var clientIDLoaded = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setClientID(ref);
  }, []);
  var clientSecretLoaded = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setClientSecret(ref);
  }, []);
  var regionLoaded = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setRegion(ref);
  }, []);
  return __jsx("form", {
    className: "uk-form-stacked",
    onSubmit: handleSaveClicked,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, secretName === 's3' ? __jsx(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, "AWS Access Key ID"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "AWS Access Key ID",
    ref: clientIDLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }))), __jsx("div", {
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
  }, "AWS Secret Access Key"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "AWS Secret Access Key",
    ref: clientSecretLoaded,
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
  }, "Region"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "Region",
    ref: regionLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  })))) : __jsx(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, "Client ID"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "Client ID",
    ref: clientIDLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "Client Secret"), __jsx("div", {
    className: "uk-form-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input",
    type: "text",
    placeholder: "Client Secret",
    ref: clientSecretLoaded,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  })))), __jsx("div", {
    className: "uk-flex uk-flex-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    className: "uk-button",
    onClick: handleCancelClicked,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    },
    __self: this
  }, "Cancel"), __jsx("input", {
    type: "submit",
    className: "uk-button uk-button-primary",
    onSubmit: handleSaveClicked,
    value: "Save",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80
    },
    __self: this
  })));
}

/***/ })

})
//# sourceMappingURL=index.js.e760a72d38d5a332ebf1.hot-update.js.map