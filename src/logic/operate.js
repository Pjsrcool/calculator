"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = operate;

var _big = _interopRequireDefault(require("big.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function operate(numberOne, numberTwo, operation) {
  var one = (0, _big.default)(numberOne || "0");
  var two = (0, _big.default)(numberTwo || (operation === "÷" || operation === "x" ? "1" : "0")); //If dividing or multiplying, then 1 maintains current value in cases of null

  if (operation === "+") {
    return one.plus(two).toString();
  }

  if (operation === "-") {
    return one.minus(two).toString();
  }

  if (operation === "x") {
    return one.times(two).toString();
  }

  if (operation === "÷") {
    // ISSUE #77 & 105 - Error while dividing by zero
    if (two.eq(0)) {
      alert("Divide by 0 error");
      return "0";
    } else {
      return one.div(two).toString();
    }
  }

  throw Error("Unknown operation '".concat(operation, "'"));
}