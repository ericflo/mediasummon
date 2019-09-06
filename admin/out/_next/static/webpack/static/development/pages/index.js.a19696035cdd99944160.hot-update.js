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
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fetchers_targets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fetchers/targets */ "./fetchers/targets.js");
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../fetchers/userconfig */ "./fetchers/userconfig.js");
/* harmony import */ var _OAuthAppForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./OAuthAppForm */ "./components/OAuthAppForm.js");
/* harmony import */ var _OAuthSetupPrompt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OAuthSetupPrompt */ "./components/OAuthSetupPrompt.js");


var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\components\\AddTargetModal.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;







function dismissSelf(setProtocol, setPathVal, setIsAdding) {
  setProtocol('file');
  setPathVal('');
  setIsAdding(false);
}

function handleSaveClick(_x, _x2, _x3, _x4, _x5) {
  return _handleSaveClick.apply(this, arguments);
}

function _handleSaveClick() {
  _handleSaveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(url, setErrorMessage, setProtocol, setPathVal, setIsAdding) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Object(_fetchers_targets__WEBPACK_IMPORTED_MODULE_3__["fetchTargetAdd"])(url);

          case 3:
            dismissSelf(setProtocol, setPathVal, setIsAdding);
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            setErrorMessage('' + _context.t0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _handleSaveClick.apply(this, arguments);
}

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

function placeholderForProtocol(protocol) {
  switch (protocol) {
    case 'file':
      return '/path/to/your/media/directory';

    case 'gdrive':
      return '/Mediasummon';

    case 'dropbox':
      return '/Mediasummon';

    case 's3':
      return 'bucketname';
  }

  return 'Unknown';
}

function initialPathForProtocol(protocol) {
  switch (protocol) {
    case 'gdrive':
      return '/Mediasummon';

    case 'dropbox':
      return '/Mediasummon';
  }

  return '';
}

function AddTargetModal(_ref) {
  var enabled = _ref.enabled,
      setIsAdding = _ref.setIsAdding;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      errorMessage = _useState[0],
      setErrorMessage = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      selfVal = _useState2[0],
      setSelfVal = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])('file'),
      protocol = _useState3[0],
      setProtocol = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(initialPathForProtocol(protocol)),
      pathVal = _useState4[0],
      setPathVal = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      configuring = _useState5[0],
      setConfiguring = _useState5[1];

  var closeListener = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function () {
    dismissSelf(setProtocol, setPathVal, setIsAdding);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function () {
    var showing = selfVal && enabled;
    var modal = null;

    if (selfVal) {
      modal = __webpack_require__(/*! uikit */ "./node_modules/uikit/dist/js/uikit.js").modal(selfVal);
      selfVal.addEventListener('hidden', closeListener);
    }

    if (modal && showing) {
      modal.show();
    }

    return function () {
      if (modal && showing) {
        modal.hide();
      }
    };
  }, [selfVal, enabled]);
  var closeCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    dismissSelf(setProtocol, setPathVal, setIsAdding);
  }, []);
  var refCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ref) {
    setSelfVal(ref);
  }, []);
  var protocolChangeCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    setProtocol(ev.target.value);
    setPathVal(initialPathForProtocol(ev.target.value));
  }, []);
  var pathValueChangeCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    setPathVal(ev.target.value);
  }, []);
  var saveCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    var extra = protocol === 'file' ? '/' : '';
    handleSaveClick(protocol + '://' + extra + pathVal, setErrorMessage, setProtocol, setPathVal, setIsAdding);
  }, [protocol, pathVal]);
  return __jsx("div", {
    "uk-modal": "true",
    ref: refCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }, __jsx("div", {
    className: "uk-modal-dialog",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 107
    },
    __self: this
  }, __jsx("button", {
    className: "uk-modal-close-default",
    type: "button",
    "uk-close": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 108
    },
    __self: this
  }), __jsx("div", {
    className: "uk-modal-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  }, __jsx("h2", {
    className: "uk-modal-title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113
    },
    __self: this
  }, "Summon your media to an additional location")), __jsx("div", {
    className: "uk-modal-body",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
    },
    __self: this
  }, errorMessage ? __jsx("div", {
    className: "uk-alert-danger",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 117
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }, __jsx("span", {
    "uk-icon": "warning",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }), " ", errorMessage)) : null, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 120
    },
    __self: this
  }, "Choose the additional location where you would like to save your media"), __jsx("form", {
    className: "uk-form uk-flex",
    onSubmit: saveCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 121
    },
    __self: this
  }, __jsx("input", {
    type: "submit",
    onSubmit: saveCallback,
    style: {
      display: 'none'
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 122
    },
    __self: this
  }), __jsx("span", {
    className: "uk-width-auto",
    "uk-form-custom": "target: true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 123
    },
    __self: this
  }, __jsx("input", {
    className: "uk-input uk-width-auto",
    type: "text",
    placeholder: nameForProtocol(protocol),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 124
    },
    __self: this
  }), __jsx("select", {
    className: "uk-select",
    onChange: protocolChangeCallback,
    value: protocol,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 125
    },
    __self: this
  }, __jsx("option", {
    value: "file",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 126
    },
    __self: this
  }, nameForProtocol('file')), __jsx("option", {
    value: "s3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }, nameForProtocol('s3')), __jsx("option", {
    value: "dropbox",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 128
    },
    __self: this
  }, nameForProtocol('dropbox')))), __jsx("input", {
    type: "text",
    className: "uk-input uk-width-expand",
    placeholder: placeholderForProtocol(protocol),
    onChange: pathValueChangeCallback,
    value: pathVal,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 134
    },
    __self: this
  }))), __jsx("div", {
    className: "uk-modal-footer uk-text-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    },
    __self: this
  }, __jsx("button", {
    className: "uk-button uk-button-default",
    type: "button",
    onClick: closeCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }, "Cancel"), __jsx("button", {
    className: "uk-button uk-button-primary",
    type: "button",
    onClick: saveCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 144
    },
    __self: this
  }, "Save"))));
}

/***/ })

})
//# sourceMappingURL=index.js.a19696035cdd99944160.hot-update.js.map