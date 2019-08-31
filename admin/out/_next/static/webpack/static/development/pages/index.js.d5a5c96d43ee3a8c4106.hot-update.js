webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./util.js":
/*!*****************!*\
  !*** ./util.js ***!
  \*****************/
/*! exports provided: preventDefaultAnd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "preventDefaultAnd", function() { return preventDefaultAnd; });
// If the first argument to the inner func is an event, it will prevent default on
// the event and then call that inner function as it normally would be called
function preventDefaultAnd(func) {
  return function () {
    var ev = arguments[0];

    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }

    return func.apply(this, arguments);
  };
}

/***/ })

})
//# sourceMappingURL=index.js.d5a5c96d43ee3a8c4106.hot-update.js.map