/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test setPinDirection function
*
* run with: node setPinDirection
* ================================================

This test validates the setPinDirection function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > setPinDirection()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

// out of bounds tests
try
{
    bus.setPinDirection(0, 0);
    test.test_exception_failed("pin low boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinDirection(17, 0);
    test.test_exception_failed("pin high boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinDirection(1, 2);
    test.test_exception_failed("value high boundary out of bounds");
}
catch(error){	}

for (var x = 1; x <= 8; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT0, 0x00);
    bus.setPinDirection(x, 1);

    var y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT0);
    if (!test.test_get_bit(y, x - 1)){
        test.test_exception_failed("set pin to 1 failed on port 0");
        break;
    }
}

for (var x = 1; x <= 8; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT0, 0xFF);
    bus.setPinDirection(x, 0);

    var y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT0);
    if (test.test_get_bit(y, x - 1)){
        test.test_exception_failed("set pin to 0 failed on port 0");
        break;
    }
}

for (var x = 9; x <= 16; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT1, 0x00);
    bus.setPinDirection(x, 1);

    var y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT1);
    if (!test.test_get_bit(y, x - 9)){
        test.test_exception_failed("set pin to 1 failed on port 1");
        break;
    }
}

for (var x = 9; x <= 16; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT1, 0xFF);
    bus.setPinDirection(x, 0);

    var y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT1);
    if (test.test_get_bit(y, x - 9)){
        test.test_exception_failed("set pin to 1 failed on port 1");
        break;
    }
}




// get test result
test.test_outcome();