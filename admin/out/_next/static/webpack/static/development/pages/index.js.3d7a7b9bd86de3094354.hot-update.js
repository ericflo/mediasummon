webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./fetchers/common.js":
/*!****************************!*\
  !*** ./fetchers/common.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _regeneratorRuntime = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");

var _asyncToGenerator = __webpack_require__(/*! @babel/runtime-corejs2/helpers/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/asyncToGenerator.js");

function extractMessageFromJSONError(_x) {
  return _extractMessageFromJSONError.apply(this, arguments);
}

function _extractMessageFromJSONError() {
  _extractMessageFromJSONError = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(resp) {
    var errJson;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return resp.json();

          case 3:
            errJson = _context.sent;

            if (!errJson.error) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", errJson.error);

          case 6:
            return _context.abrupt("return", 'Completed fetch but got error from resource: ' + errJson);

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", 'Completed fetch but got bad status from resource: ' + resp.status + ' (' + _context.t0 + ')');

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));
  return _extractMessageFromJSONError.apply(this, arguments);
}

function throwMessageFromJSONError(resp) {
  throw extractMessageFromJSONError(resp);
}

/***/ })

})
//# sourceMappingURL=index.js.3d7a7b9bd86de3094354.hot-update.js.map