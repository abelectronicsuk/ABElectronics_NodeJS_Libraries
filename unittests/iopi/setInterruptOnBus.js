/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test setInterruptOnBus function
*
* run with: node setInterruptOnBus
* ================================================

This test validates the setInterruptOnBus function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > setInterruptOnBus()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

var x = 0;

    for (var a = 0; a < 65535; a++){
        bus.setInterruptOnBus(a);      

        x = test.i2c_emulator_read_word_data(test.MCP23017_GPINTENA); // read value from registers
        if (x != a){
            test.test_fail("failed to set bus direction");
            break;
		} 
	}




// get test result
test.test_outcome();