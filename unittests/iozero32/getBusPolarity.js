/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test getBusPolarity function
*
* run with: node getBusPolarity
* ================================================

This test validates the getBusPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > getBusPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

var x = 0;

for (var a = 0; a < 65534; a++) {
    test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, a); // set register value
    x = bus.getBusPolarity(); // read value from registers
    if (x != a) {
        test.test_fail("failed to get bus direction");
        break;
    }
}

// get test result
test.test_outcome();