webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/AddTargetModal.js":
/*!**************************************!*\
  !*** ./components/AddTargetModal.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AddTargetModal; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\components\\AddTargetModal.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


function AddTargetModal(setIsAdding) {
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {}, []);
  var closeCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ev) {
    ev.preventDefault();
    setIsAdding(false);
  }, []);
  var refCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ref) {
    UIkit.modal(ref);
  });
  return __jsx("div", {
    "uk-modal": "true",
    ref: refCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, __jsx("div", {
    className: "uk-modal-dialog",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, __jsx("button", {
    className: "uk-modal-close-default",
    type: "button",
    "uk-close": "true",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }), __jsx("div", {
    className: "uk-modal-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, __jsx("h2", {
    className: "uk-modal-title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "Modal Title")), __jsx("div", {
    className: "uk-modal-body",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")), __jsx("div", {
    className: "uk-modal-footer uk-text-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, __jsx("button", {
    className: "uk-button uk-button-default uk-modal-close",
    type: "button",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, "Cancel"), __jsx("button", {
    className: "uk-button uk-button-primary",
    type: "button",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "Save"))));
}

/***/ })

})
//# sourceMappingURL=index.js.45281d8154a3582904fd.hot-update.js.map