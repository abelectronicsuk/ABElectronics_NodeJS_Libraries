/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getPortDirection function
*
* run with: node getPortDirection
* ================================================

This test validates the getPortDirection function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getPortDirection()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

	// out of bounds tests
	try
	{
		bus.getPortDirection(2);
        test.test_exception_failed("port out of bounds");
	}

	catch (error){}

	for (var a = 0; a < 255; a++){
		test.i2c_emulator_write_word_data(test.MCP23017_IODIRA, a);
        x = bus.getPortDirection(0);
        if (x != a){
            test.test_exception_failed("get port failed when set to 0");
            break;
		}
        test.i2c_emulator_write_word_data(test.MCP23017_IODIRB, a);
        x = bus.getPortDirection(1);
        if (x != a){
            test.test_exception_failed("get port failed when set to 1");
            break;
		}
	}




// get test result
test.test_outcome();