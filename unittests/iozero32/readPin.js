/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test readPin function
*
* run with: node readPin
* ================================================

This test validates the readPin function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > readPin()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

// out of bounds tests
try
{
    bus.readPin(0);
    test.test_exception_failed("value low boundary out of bounds");
}
catch(error){	}

try
{
    bus.readPin(17);
    test.test_exception_failed("value high boundary out of bounds");
}
catch(error){	}

for (var a = 1; a < 17; a++){
    test.i2c_emulator_write_word_data(test.PCA9535_INPUTPORT0, Math.pow(2, a-1)); // set register
    if (bus.readPin(a) != 1)
    {
        test.test_fail("unexpected register value");
    }     
}




// get test result
test.test_outcome();