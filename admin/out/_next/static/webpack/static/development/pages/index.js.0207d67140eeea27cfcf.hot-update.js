webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/OAuthSetupPrompt.js":
/*!****************************************!*\
  !*** ./components/OAuthSetupPrompt.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return OAuthSetupPrompt; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\components\\OAuthSetupPrompt.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

function OAuthSetupPrompt(_ref) {
  var service = _ref.service,
      onConfigureClick = _ref.onConfigureClick;
  return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5
    },
    __self: this
  }, service.needs_app ? __jsx("div", {
    className: "uk-alert-warning",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "Before you can download your photos, first you have to set up access. Please visit ", service.metadata.name, " and ", __jsx("a", {
    href: service.app_create_url,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, "create an app"), ", then return here and enter the credentials in settings."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    onClick: onConfigureClick,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, "Configure ", service.metadata.name)))) : null, !service.needs_app && service.needs_credentials ? __jsx("div", {
    className: "uk-alert-primary",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "It looks like your permission is required before we can sync this service for you. Clicking this button will send you to ", service.metadata.name, "\u2019s website, where you can grant permission to download these items for you, and you\u2019ll be returned here afterwards."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, "Grant Permission")))) : null);
}

/***/ })

})
//# sourceMappingURL=index.js.0207d67140eeea27cfcf.hot-update.js.map