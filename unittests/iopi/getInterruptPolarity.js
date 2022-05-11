/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getInterruptPolarity function
*
* run with: node getInterruptPolarity
* ================================================

This test validates the getInterruptPolarity function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getInterruptPolarity()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

	test.i2c_emulator_write_byte_data(test.MCP23017_IOCON, 0xfd);
    x = bus.getInterruptPolarity();
    if (x != 0){
        test.test_exception_failed("get port failed when set to 0");
	}
    
	test.i2c_emulator_write_byte_data(test.MCP23017_IOCON, 0x02);
    x = bus.getInterruptPolarity();
    if (x != 1){
        test.test_exception_failed("get port failed when set to 0");
	}




// get test result
test.test_outcome();