/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getInterruptType function
*
* run with: node getInterruptType
* ================================================

This test validates the getInterruptType function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getInterruptType()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

	// out of bounds tests
	try
	{
		bus.getInterruptType(2);
		test.test_exception_failed("port out of bounds");
	}
	catch (error){}

	for (var a = 0; a < 255; a++){
		test.i2c_emulator_write_byte_data(test.MCP23017_INTCONB, 0);
		test.i2c_emulator_write_byte_data(test.MCP23017_INTCONA, a);
        x = bus.getInterruptType(0);
        if (x != a){
            test.test_exception_failed("get port failed when set to 0");
            break;
		}
		test.i2c_emulator_write_byte_data(test.MCP23017_INTCONA, 0);
        test.i2c_emulator_write_byte_data(test.MCP23017_INTCONB, a);
        x = bus.getInterruptType(1);
        if (x != a){
            test.test_exception_failed("get port failed when set to 1");
            break;
		}
	}




// get test result
test.test_outcome();