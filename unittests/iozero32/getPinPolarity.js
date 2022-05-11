/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test getPinPolarity function
*
* run with: node getPinPolarity
* ================================================

This test validates the getPinPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > getPinPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

var x = 0;
var y = 0;

	// out of bounds tests
	try
	{
		bus.getPinPolarity(0);
		test.test_exception_failed("pin low out of bounds");
	}
	catch (error){}

	try
	{
		bus.getPinPolarity(17);
		test.test_exception_failed("pin high out of bounds");
	}
	catch (error){}

	for (var a = 1; a < 17; a++){
		y = 65535;
		
		y = test.test_set_bit(y, a-1, false);	
		test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, y);
        x = bus.getPinPolarity(a);
        if (x != 0){
            test.test_exception_failed("get pin failed on set to 0");
            break;
		}
		y = 0;
		y = test.test_set_bit(y, a-1, true);
        test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, y);
        x = bus.getPinPolarity(a);
        if (x != 1){
            test.test_exception_failed("get pin failed on set to 1");
            break;
		}
	}




// get test result
test.test_outcome();