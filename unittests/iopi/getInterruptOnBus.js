/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getInterruptOnBus function
*
* run with: node getInterruptOnBus
* ================================================

This test validates the getInterruptOnBus function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > getInterruptOnBus()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

    for (var a = 0; a < 65535; a++){
        test.i2c_emulator_write_word_data(test.MCP23017_GPINTENA, a);
        x = bus.getInterruptOnBus();
        if (x != a){
            test.test_fail("failed to get interrupt on bus");
            break;
		}        
	}




// get test result
test.test_outcome();