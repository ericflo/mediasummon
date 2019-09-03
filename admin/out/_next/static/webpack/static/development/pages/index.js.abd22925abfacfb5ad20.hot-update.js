webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/ServiceSummary.js":
/*!**************************************!*\
  !*** ./components/ServiceSummary.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ServiceSummary; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _fetchers_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../fetchers/services */ "./fetchers/services.js");


var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\components\\ServiceSummary.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;





function handleSyncClick(_x) {
  return _handleSyncClick.apply(this, arguments);
}

function _handleSyncClick() {
  _handleSyncClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(service) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_fetchers_services__WEBPACK_IMPORTED_MODULE_4__["fetchServiceSyncStart"])(service.metadata.id);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _handleSyncClick.apply(this, arguments);
}

function ServiceSummary(_ref) {
  var service = _ref.service;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      configuring = _useState[0],
      setConfiguring = _useState[1];

  var sync = service.last_sync;
  var start = sync ? dayjs__WEBPACK_IMPORTED_MODULE_3___default()(sync.start).fromNow() : 'Never';
  var next = sync && sync.end ? dayjs__WEBPACK_IMPORTED_MODULE_3___default()(sync.end).add(service.hours_per_sync, 'hour') : dayjs__WEBPACK_IMPORTED_MODULE_3___default()();
  var nextString = next ? '' + next : '';
  var startString = sync ? sync.startString : null;
  var syncCallback = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.stopPropagation();
    handleSyncClick(service);
  }, [service]);
  var handleConfigureClicked = Object(react__WEBPACK_IMPORTED_MODULE_2__["useCallback"])(function (ev) {
    ev.preventDefault();
    setConfiguring(true);
  }, []);
  return __jsx("div", {
    className: "uk-card uk-card-default uk-card-hover uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, __jsx("div", {
    className: "uk-card-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, __jsx("div", {
    className: "uk-grid-small uk-flex-middle",
    "uk-grid": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, __jsx("div", {
    className: "uk-width-auto",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, __jsx("img", {
    className: "uk-border",
    width: "40",
    height: "40",
    src: '/static/images/logo-' + service.metadata.id + '.png',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  })), __jsx("div", {
    className: "uk-width-expand",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, __jsx("h3", {
    className: "uk-card-title uk-margin-remove-bottom",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, service.metadata.name), __jsx("p", {
    className: "uk-text-meta uk-margin-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, "Last synced: ", __jsx("time", {
    dateTime: startString,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, start), ' ', sync ? '(' + (sync.fetch_count || 0) + ' downloaded) ' : null, "\u2014 Next sync: ", __jsx("time", {
    dateTime: nextString,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, next.fromNow()))))), service.needs_app ? __jsx("div", {
    className: "uk-card-body uk-padding-remove-vertical uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, __jsx("div", {
    className: "uk-alert-warning",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "Before you can download your photos, first you have to set up access. Please visit ", service.metadata.name, " and ", __jsx("a", {
    href: service.metadata.app_create_url,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "create an app"), ", then return here and enter the credentials in settings."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    onClick: handleConfigureClicked,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, "Configure ", service.metadata.name))))) : null, service.needs_credentials && !service.needs_app ? __jsx("div", {
    className: "uk-card-body uk-padding-remove-vertical uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, __jsx("div", {
    className: "uk-alert-primary",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "It looks like your permission is required before we can sync this service for you. Clicking this button will send you to ", service.metadata.name, "\u2019s website, where you can grant permission to download these items for you, and you\u2019ll be returned here afterwards."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }, "Grant Permission"))))) : null, __jsx("div", {
    className: "uk-card-footer",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    className: "uk-button uk-button-text",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }, "View details"), __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, service.needs_credentials ? null : __jsx("button", {
    className: "uk-button uk-button-primary",
    disabled: service.current_sync,
    onClick: syncCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, service.current_sync ? 'Syncing...' : 'Sync now'))));
}

/***/ })

})
//# sourceMappingURL=index.js.abd22925abfacfb5ad20.hot-update.js.map