/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test writeBus function
*
* run with: node writeBus
* ================================================

This test validates the writeBus function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > writeBus()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

for (var a = 0; a < 65535; a++){
    bus.writeBus(a); 

    var x = 0;
    
    x = test.i2c_emulator_read_word_data(test.MCP23017_GPIOA); // read value from registers
    if (x != a){
        test.test_fail("failed to set bus value");
        break;
    }
}




// get test result
test.test_outcome();