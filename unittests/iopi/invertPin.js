/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test invertPin function
*
* run with: node invertPin
* ================================================

This test validates the invertPin function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > invertPin()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.invertPin(0, 0);
    test.test_exception_failed("pin low boundary out of bounds");
}
catch(error){	}

try
{
    bus.invertPin(17, 0);
    test.test_exception_failed("pin high boundary out of bounds");
}
catch(error){	}

try
{
    bus.invertPin(1, 2);
    test.test_exception_failed("value high boundary out of bounds");
}
catch(error){	}



for (var x = 1; x < 17; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_IPOLA, 0); // reset register
    bus.invertPin(x, 1);
    if (test.i2c_emulator_read_word_data(test.MCP23017_IPOLA) != Math.pow(2, x-1)) // check bit has been set in register
    {
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();