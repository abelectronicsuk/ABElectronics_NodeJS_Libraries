/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getBusDirection function
*
* run with: node getBusDirection
* ================================================

This test validates the getBusDirection function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getBusDirection()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

for (var a = 0; a < 65534; a++) {
    test.i2c_emulator_write_word_data(test.MCP23017_IODIRA, a); // set register value
    x = bus.getBusDirection(); // read value from registers
    if (x != a) {
        test.test_fail("failed to get bus direction");
        break;
    }
}

// get test result
test.test_outcome();