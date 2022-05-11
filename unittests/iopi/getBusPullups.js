/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getBusPullups function
*
* run with: node getBusPullups
* ================================================

This test validates the getBusPullups function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getBusPullups()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

for (var a = 0; a < 65534; a++) {
    test.i2c_emulator_write_word_data(test.MCP23017_GPPUA, a); // set register value
    x = bus.getBusPullups(); // read value from registers
    if (x != a) {
        test.test_fail("failed to get bus direction");
        break;
    }
}

// get test result
test.test_outcome();