"use strict";

var _calculate = _interopRequireDefault(require("./calculate"));

var _chai = _interopRequireDefault(require("chai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/chaijs/chai/issues/469
_chai.default.config.truncateThreshold = 0;
var expect = _chai.default.expect;

function pressButtons(buttons) {
  var value = {};
  buttons.forEach(function (button) {
    Object.assign(value, (0, _calculate.default)(value, button));
  }); // no need to distinguish between null and undefined values

  Object.keys(value).forEach(function (key) {
    if (value[key] === null) {
      delete value[key];
    }
  });
  return value;
}

function expectButtons(buttons, expectation) {
  expect(pressButtons(buttons)).to.deep.equal(expectation);
}

function test(buttons, expectation) {
  var only = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var func = only ? it.only : it;
  func("buttons ".concat(buttons.join(","), " -> ").concat(JSON.stringify(expectation)), function () {
    expectButtons(buttons, expectation);
  });
}

describe("calculate", function () {
  test(["6"], {
    next: "6"
  });
  test(["6", "6"], {
    next: "66"
  });
  test(["6", "+", "6"], {
    next: "6",
    total: "6",
    operation: "+"
  });
  test(["6", "+", "6", "="], {
    total: "12",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["0", "0", "+", "0", "="], {
    total: "0",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["6", "+", "6", "=", "9"], {
    next: "9",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["3", "+", "6", "=", "+"], {
    total: "9",
    operation: "+",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["3", "+", "6", "=", "+", "9"], {
    total: "9",
    operation: "+",
    next: "9",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["3", "+", "6", "=", "+", "9", "="], {
    total: "18",
    higherOrder: {
      next: null,
      operation: null
    }
  }); // When '=' is pressed and there is not enough information to complete
  // an operation, the '=' should be disregarded.

  test(["3", "+", "=", "3", "="], {
    total: "6",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["+"], {
    operation: "+"
  });
  test(["+", "2"], {
    next: "2",
    operation: "+"
  });
  test(["+", "2", "+"], {
    total: "2",
    operation: "+",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["+", "2", "+", "+"], {
    total: "2",
    operation: "+",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["+", "2", "+", "5"], {
    next: "5",
    total: "2",
    operation: "+",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["+", "2", "5"], {
    next: "25",
    operation: "+"
  });
  test(["+", "2", "5"], {
    next: "25",
    operation: "+"
  });
  test(["+", "6", "+", "5", "="], {
    total: "11",
    higherOrder: {
      next: null,
      operation: null
    }
  });
  test(["0", ".", "4"], {
    next: "0.4"
  });
  test([".", "4"], {
    next: "0.4"
  });
  test([".", "4", "-", ".", "2"], {
    total: "0.4",
    next: "0.2",
    operation: "-"
  });
  test([".", "4", "-", ".", "2", "="], {
    total: "0.2",
    higherOrder: {
      next: null,
      operation: null
    }
  }); // should clear the operator when AC is pressed

  test(["1", "+", "2", "AC"], {
    higherOrder: {}
  });
  test(["+", "2", "AC"], {
    higherOrder: {}
  });
  test(["4", "%"], {
    next: "0.04"
  });
  test(["4", "%", "x", "2", "="], {
    total: "0.08"
  });
  test(["4", "%", "x", "2"], {
    total: "0.04",
    operation: "x",
    next: "2"
  }); // the percentage sign should also act as '='

  test(["2", "x", "2", "%"], {
    total: "0.04"
  }); //Test that pressing the multiplication or division sign multiple times should not affect the current computation

  test(["2", "x", "x"], {
    total: "2",
    operation: "x"
  });
  test(["2", "÷", "÷"], {
    total: "2",
    operation: "÷"
  });
  test(["2", "÷", "x", "+", "-", "x"], {
    total: "2",
    operation: "x"
  });
});