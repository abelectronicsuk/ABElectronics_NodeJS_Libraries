/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test readBus function
*
* run with: node readBus
* ================================================

This test validates the readBus function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > readBus()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// Reset to 0
bus.writeBus(0x0000);

// Enable pullups
bus.setBusDirection(0xFFFF);

var x = 0;

for (var a = 0; a < 65534; a++){
    test.i2c_emulator_write_word_data(test.MCP23017_GPIOA, a); // set register value
    x = bus.readBus(); // read value from registers
    if (x != a){
        test.test_fail("failed to get bus value");
        break;
    }        
}




// get test result
test.test_outcome();