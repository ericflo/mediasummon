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
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "C:\\Users\\flogu_000\\Development\\mediasummon\\admin\\components\\ServiceSummary.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


function ServiceSummary(_ref) {
  var service = _ref.service;
  var sync = service.last_sync;
  var start = sync ? dayjs__WEBPACK_IMPORTED_MODULE_1___default()(sync.start).fromNow() : 'Never';
  var startString = sync ? sync.startString : null;
  return __jsx("div", {
    className: "uk-card uk-card-default uk-card-hover uk-margin",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, __jsx("div", {
    className: "uk-card-header",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, __jsx("div", {
    className: "uk-grid-small uk-flex-middle",
    "uk-grid": "true",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, __jsx("div", {
    className: "uk-width-auto",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, __jsx("img", {
    className: "uk-border",
    width: "40",
    height: "40",
    src: '/static/images/logo-' + service.metadata.id + '.png',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  })), __jsx("div", {
    className: "uk-width-expand",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, __jsx("h3", {
    className: "uk-card-title uk-margin-remove-bottom",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, service.metadata.name), __jsx("p", {
    className: "uk-text-meta uk-margin-remove-top",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "Last synced: ", __jsx("time", {
    dateTime: startString,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, start), sync ? ' (' + (sync.fetch_count || 0) + ' downloaded)' : null)))), service.needs_credentials ? __jsx("div", {
    className: "uk-card-body",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, __jsx("div", {
    className: "uk-alert-warning",
    "uk-alert": "true",
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
  }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."))) : null, __jsx("div", {
    className: "uk-card-footer",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, __jsx("a", {
    href: "#",
    className: "uk-button uk-button-text",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "View details")));
}

/***/ })

})
//# sourceMappingURL=index.js.4108ba5a53c0139351aa.hot-update.js.map