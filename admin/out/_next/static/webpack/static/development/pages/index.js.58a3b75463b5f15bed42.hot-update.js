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


function AddTargetModal(_ref) {
  var enabled = _ref.enabled,
      setIsAdding = _ref.setIsAdding;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      selfVal = _useState[0],
      setSelfVal = _useState[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var showing = selfVal && enabled;

    if (showing) {
      __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js").modal(selfVal).show();
    }

    return function () {
      if (showing) {
        __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js").modal(selfVal).hide();
      }
    };
  }, [selfVal, enabled]);
  var closeCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ev) {
    ev.preventDefault();
    setIsAdding(false);
  }, [selfVal]);
  var refCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ref) {
    setSelfVal(ref);
  }, []);
  return __jsx("div", {
    "uk-modal": "true",
    ref: refCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, __jsx("div", {
    className: "uk-modal-dialog",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, __jsx("button", {
    className: "uk-modal-close-default",
    type: "button",
    "uk-close": "true",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }), __jsx("div", {
    className: "uk-modal-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, __jsx("h2", {
    className: "uk-modal-title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, "Summon your media to a new location")), __jsx("div", {
    className: "uk-modal-body",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, "Choose the additional location where you would like to save your media")), __jsx("div", {
    className: "uk-modal-footer uk-text-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, __jsx("button", {
    className: "uk-button uk-button-default",
    type: "button",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, "Cancel"), __jsx("button", {
    className: "uk-button uk-button-primary",
    type: "button",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Save"))));
}

/***/ })

})
//# sourceMappingURL=index.js.58a3b75463b5f15bed42.hot-update.js.map