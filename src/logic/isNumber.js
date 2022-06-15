"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumber;

function isNumber(item) {
  return /[0-9]+/.test(item);
}