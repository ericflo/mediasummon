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
/* harmony import */ var _fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../fetchers/userconfig */ "./fetchers/userconfig.js");


var _jsxFileName = "Q:\\Development\\mediasummon\\admin\\components\\ServiceSummary.js";
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

function handleSaveClick(_x2, _x3, _x4, _x5) {
  return _handleSaveClick.apply(this, arguments);
}

function _handleSaveClick() {
  _handleSaveClick = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(name, clientID, clientSecret, setConfiguring) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Object(_fetchers_userconfig__WEBPACK_IMPORTED_MODULE_5__["fetchUpdateSecrets"])(name, clientID, clientSecret);

          case 2:
            setConfiguring(false);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _handleSaveClick.apply(this, arguments);
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
  var tooltipString = service.app_create_url.split('/')[2];
  return __jsx("div", {
    className: "uk-card uk-card-default uk-card-hover uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, __jsx("div", {
    className: "uk-card-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, __jsx("div", {
    className: "uk-grid-small uk-flex-middle",
    "uk-grid": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, __jsx("div", {
    className: "uk-width-auto",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, __jsx("img", {
    className: "uk-border",
    width: "40",
    height: "40",
    src: '/static/images/logo-' + service.metadata.id + '.png',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  })), __jsx("div", {
    className: "uk-width-expand",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, __jsx("h3", {
    className: "uk-card-title uk-margin-remove-bottom",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, service.metadata.name), __jsx("p", {
    className: "uk-text-meta uk-margin-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "Last synced: ", __jsx("time", {
    dateTime: startString,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, start), ' ', sync ? '(' + (sync.fetch_count || 0) + ' downloaded) ' : null, "\u2014 Next sync: ", __jsx("time", {
    dateTime: nextString,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, next.fromNow()))), configuring || !service.needs_credentials && !service.needs_app ? null : __jsx("a", {
    href: "#",
    onClick: handleConfigureClicked,
    "uk-icon": "icon: cog",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }))), configuring ? __jsx("div", {
    className: "uk-card-body uk-padding-remove-vertical uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, service.needs_app ? __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "Visit ", service.metadata.name, " to ", __jsx("a", {
    href: service.app_create_url,
    "uk-tooltip": tooltipString,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, "create an app"), ", then return here and enter the credentials below:") : __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "You already have credentials set up for ", service.metadata.name, ". If you would like to set new app credentials, head over to their site to ", __jsx("a", {
    href: service.app_create_url,
    "uk-tooltip": tooltipString,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }, "create or update your app"), ", then return here and enter the credentials below:"), __jsx(OAuthAppForm, {
    service: service,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  })) : null, !configuring && service.needs_app ? __jsx("div", {
    className: "uk-card-body uk-padding-remove-vertical uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, __jsx("div", {
    className: "uk-alert-warning",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, "Before you can download your photos, first you have to set up access. Please visit ", service.metadata.name, " and ", __jsx("a", {
    href: service.app_create_url,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, "create an app"), ", then return here and enter the credentials in settings."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    onClick: handleConfigureClicked,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, "Configure ", service.metadata.name))))) : null, !configuring && !service.needs_app && service.needs_credentials ? __jsx("div", {
    className: "uk-card-body uk-padding-remove-vertical uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, __jsx("div", {
    className: "uk-alert-primary",
    "uk-alert": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, __jsx("p", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75
    },
    __self: this
  }, "It looks like your permission is required before we can sync this service for you. Clicking this button will send you to ", service.metadata.name, "\u2019s website, where you can grant permission to download these items for you, and you\u2019ll be returned here afterwards."), __jsx("div", {
    className: "uk-panel",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }, __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: this
  }, __jsx("a", {
    href: service.credential_redirect_url,
    className: "uk-button uk-button-primary",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }, "Grant Permission"))))) : null, __jsx("div", {
    className: "uk-card-footer",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 83
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    className: "uk-button uk-button-text",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: this
  }, "View details"), __jsx("p", {
    className: "uk-align-right",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    },
    __self: this
  }, service.needs_credentials ? null : __jsx("button", {
    className: "uk-button uk-button-primary",
    disabled: service.current_sync,
    onClick: syncCallback,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87
    },
    __self: this
  }, service.current_sync ? 'Syncing...' : 'Sync now'))));
}

/***/ })

})
//# sourceMappingURL=index.js.56f623581fc15efa49e0.hot-update.js.map