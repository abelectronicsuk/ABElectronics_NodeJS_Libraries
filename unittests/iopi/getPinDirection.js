/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getPinDirection function
*
* run with: node getPinDirection
* ================================================

This test validates the getPinDirection function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getPinDirection()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;
var y = 0;

	// out of bounds tests
	try
	{
		bus.getPinDirection(0);
		test.test_exception_failed("pin low out of bounds");
	}
	catch (error){}

	try
	{
		bus.getPinDirection(17);
		test.test_exception_failed("pin high out of bounds");
	}
	catch (error){}

	for (var a = 1; a < 17; a++){
		y = 65535;
		
		y = test.test_set_bit(y, a-1, false);	
		test.i2c_emulator_write_word_data(test.MCP23017_IODIRA, y);
        x = bus.getPinDirection(a);
        if (x != 0){
            test.test_exception_failed("get pin failed on set to 0");
            break;
		}
		y = 0;
		y = test.test_set_bit(y, a-1, true);
        test.i2c_emulator_write_word_data(test.MCP23017_IODIRA, y);
        x = bus.getPinDirection(a);
        if (x != 1){
            test.test_exception_failed("get pin failed on set to 1");
            break;
		}
	}




// get test result
test.test_outcome();