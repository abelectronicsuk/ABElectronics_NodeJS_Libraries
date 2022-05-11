/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test setInterruptPolarity function
*
* run with: node setInterruptPolarity
* ================================================

This test validates the setInterruptPolarity function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > setInterruptPolarity()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.setInterruptPolarity(2);
    test.test_exception_failed("high boundary out of bounds");
}
catch(error){	}

test.i2c_emulator_write_byte_data(test.MCP23017_IOCON, 0x80);

bus.setInterruptPolarity(1);

var x = test.i2c_emulator_read_byte_data(test.MCP23017_IOCON);
if (x != 0x82){
        test.test_exception_failed("failed to set interrupt polarity to 1");
}

bus.setInterruptPolarity(0);
x = test.i2c_emulator_read_byte_data(test.MCP23017_IOCON);
if (x != 0x80){
        test.test_exception_failed("failed to set interrupt polarity to 0");
}




// get test result
test.test_outcome();