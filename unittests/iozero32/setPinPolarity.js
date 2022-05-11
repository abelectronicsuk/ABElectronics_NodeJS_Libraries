/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test setPinPolarity function
*
* run with: node setPinPolarity
* ================================================

This test validates the setPinPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > setPinPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

// out of bounds tests
try
{
    bus.setPinPolarity(0, 0);
    test.test_exception_failed("pin low boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinPolarity(17, 0);
    test.test_exception_failed("pin high boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinPolarity(1, 2);
    test.test_exception_failed("value high boundary out of bounds");
}
catch(error){	}



for (var x = 1; x < 17; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, 0); // reset register
    bus.setPinPolarity(x, 1);
    if (test.i2c_emulator_read_word_data(test.PCA9535_INVERTPORT0) != Math.pow(2, x-1)) // check bit has been set in register
    {
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();