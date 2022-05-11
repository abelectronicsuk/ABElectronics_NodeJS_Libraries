/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test mirrorInterrupts function
*
* run with: node mirrorInterrupts
* ================================================

This test validates the mirrorInterrupts function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > mirrorInterrupts()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.mirrorInterrupts(2);
    test.test_exception_failed("high boundary out of bounds");
}
catch(error){	}

bus.mirrorInterrupts(1);

var a = test.i2c_emulator_read_byte_data(test.MCP23017_IOCON);
if (a != 0x42) // check value has been set in register
{
    test.test_fail("unexpected register value");
}

bus.mirrorInterrupts(0);

a = test.i2c_emulator_read_byte_data(test.MCP23017_IOCON);
if (a != 0x02) // check value has been set in register
{
    test.test_fail("unexpected register value");
}




// get test result
test.test_outcome();