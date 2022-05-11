/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test setPortDirection function
*
* run with: node setPortDirection
* ================================================

This test validates the setPortDirection function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > setPortDirection()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

// out of bounds tests
try
{
    bus.setPortDirection(2, 0);
    test.test_exception_failed("port high boundary out of bounds");
}
catch(error){	}


var y = 0;

for (var x = 0; x < 256; x++)
{
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT0, 0x00);
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT1, 0x00);

    bus.setPortDirection(0, x);
    
    y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT0);
    if (x != y){
        test.test_exception_failed("set port failed on port 0");
        break;
    }

    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT0, 0x00);
    test.i2c_emulator_write_word_data(test.PCA9535_CONFIGPORT1, 0x00);

    bus.setPortDirection(1, x);
    
    y = test.i2c_emulator_read_word_data(test.PCA9535_CONFIGPORT1);
    if (x != y){
        test.test_exception_failed("set port failed on port 1");
        break;
    }
}




// get test result
test.test_outcome();