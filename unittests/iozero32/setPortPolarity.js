/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test setPortPolarity function
*
* run with: node setPortPolarity
* ================================================

This test validates the setPortPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > setPortPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

// out of bounds tests
try
{
    bus.setPortPolarity(2, 0);
    test.test_exception_failed("port high boundary out of bounds");
}
catch(error){	}

for (var x = 0; x < 256; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, 0); // reset registers

    bus.setPortPolarity(0, x);

    if (test.i2c_emulator_read_byte_data(test.PCA9535_INVERTPORT0) != x) // check value has been set in register
    {
        test.test_fail("unexpected register value");
    }

    test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, 0); // reset registers

    bus.setPortPolarity(1, x);
    
    if (test.i2c_emulator_read_byte_data(test.PCA9535_INVERTPORT1) != x) // check value has been set in register
    {
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();