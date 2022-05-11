/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test invertPort function
*
* run with: node invertPort
* ================================================

This test validates the invertPort function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > invertPort()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.invertPort(2, 0);
    test.test_exception_failed("port high boundary out of bounds");
}
catch(error){	}

for (var x = 0; x < 256; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_IPOLA, 0); // reset registers

    bus.invertPort(0, x);

    if (test.i2c_emulator_read_byte_data(test.MCP23017_IPOLA) != x) // check value has been set in register
    {
        test.test_fail("unexpected register value");
    }

    test.i2c_emulator_write_word_data(test.MCP23017_IPOLA, 0); // reset registers

    bus.invertPort(1, x);
    
    if (test.i2c_emulator_read_byte_data(test.MCP23017_IPOLB) != x) // check value has been set in register
    {
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();