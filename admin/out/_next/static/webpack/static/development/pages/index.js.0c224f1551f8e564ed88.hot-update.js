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



function nameForProtocol(protocol) {
  switch (protocol) {
    case 'file':
      return 'Local Directory';

    case 'gdrive':
      return 'Google Drive';

    case 'dropbox':
      return 'Dropbox';

    case 's3':
      return 'S3';
  }

  return 'Unknown';
}

function AddTargetModal(_ref) {
  var enabled = _ref.enabled,
      setIsAdding = _ref.setIsAdding;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      selfVal = _useState[0],
      setSelfVal = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('file'),
      protocol = _useState2[0],
      setProtocol = _useState2[1];

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
  var protocolChangeCallback = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(function (ev) {
    console.log('ev.target.value', ev.target.value, ev.target);
    setProtocol(ev.target.value);
  }, []);
  return __jsx("div", {
    "uk-modal": "true",
    ref: refCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, __jsx("div", {
    className: "uk-modal-dialog",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("button", {
    className: "uk-modal-close-default",
    type: "button",
    "uk-close": "true",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }), __jsx("div", {
    className: "uk-modal-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, __jsx("h2", {
    className: "uk-modal-title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }, "Summon your media to a new location")), __jsx("div", {
    className: "uk-modal-body",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, "Choose the additional location where you would like to save your media"), __jsx("form", {
    className: "uk-form",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, __jsx("span", {
    className: "uk-width-auto",
    "uk-form-custom": "target: true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, __jsx("label", {
    className: "uk-form-label",
    htmlFor: "form-stacked-select",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, nameForProtocol(protocol)), __jsx("select", {
    className: "uk-select",
    onChange: protocolChangeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, __jsx("option", {
    value: "file",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }, nameForProtocol('file')), __jsx("option", {
    value: "gdrive",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, nameForProtocol('gdrive')), __jsx("option", {
    value: "dropbox",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, nameForProtocol('dropbox')), __jsx("option", {
    value: "s3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }, nameForProtocol('s3')))), __jsx("input", {
    className: "uk-input uk-width-expand",
    type: "text",
    placeholder: "path/to/your/media",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-modal-footer uk-text-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, __jsx("button", {
    className: "uk-button uk-button-default",
    type: "button",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, "Cancel"), __jsx("button", {
    className: "uk-button uk-button-primary",
    type: "button",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "Save"))));
}

/***/ })

})
//# sourceMappingURL=index.js.0c224f1551f8e564ed88.hot-update.js.map