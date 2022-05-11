/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test getPortPolarity function
*
* run with: node getPortPolarity
* ================================================

This test validates the getPortPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > getPortPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

var x = 0;

	// out of bounds tests
	try
	{
		bus.getPortPolarity(2);
		test.test_exception_failed("port out of bounds");
	}
	catch (error){}

	for (var a = 0; a < 255; a++){
        test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT0, a);
        x = bus.getPortPolarity(0);
        if (x != a){
            test.test_exception_failed("get port failed when set to 0");
            break;
		}
        test.i2c_emulator_write_word_data(test.PCA9535_INVERTPORT1, a);
        x = bus.getPortPolarity(1);
        if (x != a){
            test.test_exception_failed("get port failed when set to 1");
            break;
		}
	}




// get test result
test.test_outcome();