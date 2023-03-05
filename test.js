const test_data = require("./test_inputs.js");
const { getClicksSet } = require("./service.js");
const assert = require("assert");

describe("While creating subset", function () {
  context("have no input arguments", function () {
    it("should return an error", function () {
      const result = getClicksSet();
      assert.deepStrictEqual(result.message, "Invalid Arguments");
    });
  });
  context("with valid arguments", function () {
    it("test input match with test output", function () {
      const result = getClicksSet(test_data.input);
      assert.deepStrictEqual(result.data, test_data.output);
    });
  });
});
