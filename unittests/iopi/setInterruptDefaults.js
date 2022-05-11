/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test setInterruptDefaults function
*
* run with: node setInterruptDefaults
* ================================================

This test validates the setInterruptDefaults function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > setInterruptDefaults()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
	try
	{
		bus.setInterruptDefaults(2, 0);
		test.test_exception_failed("port high boundary out of bounds");
	}
	catch(error){	}
	
    var x = 0;
    var y = 0;

    for (var i = 0; i < 256; i++)
	{
        bus.setInterruptDefaults(0, i);
		bus.setInterruptDefaults(1, i);
        
        x = test.i2c_emulator_read_byte_data(test.MCP23017_DEFVALA); // read value from registers
        if (x != i){
            test.test_fail("failed to set interrupt default for port 0");
            break;
		}

        y = test.i2c_emulator_read_byte_data(test.MCP23017_DEFVALB); // read value from registers
        if (y != i){
            test.test_fail("failed to set interrupt default for port 1");
            break;
		}
	}




// get test result
test.test_outcome();