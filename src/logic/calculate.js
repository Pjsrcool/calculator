"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calculate;

var _big = _interopRequireDefault(require("big.js"));

var _operate = _interopRequireDefault(require("./operate"));

var _isNumber = _interopRequireDefault(require("./isNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a button name and a calculator data object, return an updated
 * calculator data object.
 *
 * Calculator data object contains:
 *   total:String      the running total
 *   next:String       the next number to be operated on with the total
 *   operation:String  +, -, etc.
 */
function calculate(obj, buttonName) {
  if (buttonName === "AC") {
    return {
      total: null,
      next: null,
      operation: null,
      // clear high order values
      higherOrder: {}
    };
  }

  if ((0, _isNumber.default)(buttonName)) {
    // ISSUE #25 The leftmost zero in a number
    buttonName = parseInt(buttonName, 10).toString();

    if (buttonName === "0" && obj.next === "0") {
      return {};
    } // If there is a higher order operation


    if (obj.higherOrder && obj.higherOrder.operation) {
      return {
        higherOrder: {
          // set higher order number
          next: buttonName,
          operation: obj.higherOrder.operation
        }
      };
    } // If there is an operation, update next


    if (obj.operation) {
      if (obj.next) {
        return {
          next: obj.next + buttonName
        };
      }

      return {
        next: buttonName
      };
    } // If there is no operation, update next and clear the value


    if (obj.next) {
      var next = obj.next === "0" ? buttonName : obj.next + buttonName;
      return {
        next: next,
        total: null
      };
    }

    return {
      next: buttonName,
      total: null
    };
  }

  if (buttonName === "%") {
    if (obj.operation && obj.next) {
      var result = (0, _operate.default)(obj.total, obj.next, obj.operation);
      return {
        total: (0, _big.default)(result).div((0, _big.default)("100")).toString(),
        next: null,
        operation: null
      };
    }

    if (obj.next) {
      return {
        next: (0, _big.default)(obj.next).div((0, _big.default)("100")).toString()
      };
    } // ISSUE 40 - Does not calculate the percentage after
    // addition or subtraction or multiplication or division


    if (obj.total) {
      return {
        total: (0, _big.default)(obj.total).div((0, _big.default)("100")).toString()
      };
    }

    return {};
  }

  if (buttonName === ".") {
    if (obj.next) {
      // ignore a . if the next number already has one
      if (obj.next.includes(".")) {
        return {};
      }

      return {
        next: obj.next + "."
      };
    }

    return {
      next: "0."
    };
  }

  if (buttonName === "=") {
    if (!obj.next || !obj.operation) {
      // '=' with no operation, nothing to do
      return {};
    }
  }

  if (buttonName === "+/-") {
    if (obj.next) {
      return {
        next: (-1 * parseFloat(obj.next)).toString()
      };
    }

    if (obj.total) {
      return {
        total: (-1 * parseFloat(obj.total)).toString()
      };
    }

    return {};
  } // Button must be an operation
  // When the user presses an operation button without having entered
  // a number first, do nothing.
  // if (!obj.next && !obj.total) {
  //   return {};
  // }
  // no operation yet, but the user typed one
  // The user hasn't typed a number yet, just save the operation
  // ISSUE #17 - Error while double click in divide button (moved up check)
  // ISSUE #39 - Error while double clicking on the multiply button after entering only one number (moved up check)


  if (!obj.next) {
    return {
      operation: buttonName
    };
  } // User pressed an operation button and there is an existing operation


  if (obj.operation || buttonName === "=") {
    // Prevent operation if button is "="
    buttonName = buttonName === "=" ? null : buttonName; // ISSUE #16 - Calculator makes the sum of the two previous numbers before multiplying
    // If there is a higher order value, perform calculation

    if (obj.higherOrder && obj.higherOrder.next) {
      // calculate higher operation with next values
      var higherOrderTotal = (0, _operate.default)(obj.next, obj.higherOrder.next, obj.higherOrder.operation);

      if (isHigherOrderOperation(buttonName)) {
        // Next is higher order operation
        return {
          // Don't calculate total yet
          next: higherOrderTotal,
          higherOrder: {
            next: null,
            // set higher order operation
            operation: buttonName
          }
        };
      } else {
        // Next is lower order operation
        return {
          // Calculate total
          total: (0, _operate.default)(obj.total, higherOrderTotal, obj.operation),
          next: null,
          // set lower order operation
          operation: buttonName,
          higherOrder: {
            next: null,
            operation: null
          }
        };
      }
    } // If operation is a higher order operation, perform calculation


    if (isHigherOrderOperation(obj.operation)) {
      return {
        // perform total calculation
        total: (0, _operate.default)(obj.total, obj.next, obj.operation),
        next: null,
        // set operation
        operation: buttonName
      };
    } // If next operation is a lower order operation


    if (!isHigherOrderOperation(buttonName)) {
      return {
        // perform total calculation
        total: (0, _operate.default)(obj.total, obj.next, obj.operation),
        next: null,
        // set operation
        operation: buttonName,
        higherOrder: {
          next: null,
          operation: null
        }
      };
    } // If next operation is a higher order operation


    if (isHigherOrderOperation(buttonName)) {
      return {
        higherOrder: {
          next: null,
          // set operation
          operation: buttonName
        }
      };
    }
  } // save the operation and shift 'next' into 'total'


  return {
    total: obj.next,
    next: null,
    operation: buttonName
  };
} // Did user press a higher order operation button


function isHigherOrderOperation(operation) {
  if (operation === "x" || operation === "÷") {
    return true;
  }
}