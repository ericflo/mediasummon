webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/TargetSummary.js":
/*!*************************************!*\
  !*** ./components/TargetSummary.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TargetSummary; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\components\\TargetSummary.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


function TargetSummary(_ref) {
  var target = _ref.target,
      onRemoveClick = _ref.onRemoveClick;
  var clickCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ev) {
    ev.preventDefault();
    onRemoveClick(target);
  }, [target, onRemoveClick]);
  return __jsx("div", {
    className: "uk-card uk-card-default uk-card-hover uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, __jsx("div", {
    className: "uk-card-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, __jsx("div", {
    className: "uk-grid-small uk-flex-middle",
    "uk-grid": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, __jsx("div", {
    className: "uk-width-auto",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, target.kind === 'file' ? __jsx("span", {
    className: "uk-border",
    "uk-icon": "icon: folder; ratio: 2",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }) : __jsx("img", {
    width: "40",
    height: "40",
    className: "uk-border",
    src: '/static/images/logo-' + target.kind + '.png',
    alt: "Dropbox logo",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  })), __jsx("div", {
    className: "uk-width-expand",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, __jsx("h3", {
    className: "uk-card-title uk-margin-remove-bottom uk-text-middle",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, target.path)), __jsx("div", {
    className: "uk-width-auto",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, __jsx("a", {
    className: "uk-close-small",
    "uk-close": "true",
    onClick: clickCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  })))));
}

/***/ })

})
//# sourceMappingURL=index.js.43d1c0690a415a795d41.hot-update.js.map