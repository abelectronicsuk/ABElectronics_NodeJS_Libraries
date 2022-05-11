/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getInterruptDefaults function
*
* run with: node getInterruptDefaults
* ================================================

This test validates the getInterruptDefaults function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getInterruptDefaults()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

// out of bounds tests
try {
    bus.getInterruptDefaults(2);
    test.test_exception_failed("getInterruptDefaults high out of bounds");
}
catch (error) { }

for (var a = 0; a < 255; a++) {
    test.i2c_emulator_write_byte_data(test.MCP23017_DEFVALA, a);
    test.i2c_emulator_write_byte_data(test.MCP23017_DEFVALB, 0);
    x = bus.getInterruptDefaults(0);
    if (x != a) {
        test.test_fail("failed to get interrupt default on port 0");
        break;
    }
    test.i2c_emulator_write_byte_data(test.MCP23017_DEFVALA, 0);
    test.i2c_emulator_write_byte_data(test.MCP23017_DEFVALB, a);
    x = bus.getInterruptDefaults(1);
    if (x != a) {
        test.test_fail("failed to get interrupt default on port 1");
        break;
    }
}




// get test result
test.test_outcome();