/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test setBusPullups function
*
* run with: node setBusPullups
* ================================================

This test validates the setBusPullups function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > setBusPullups()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

for (var a = 0; a < 65535; a++){
    bus.setBusPullups(a); 

    var x = 0;
    
    x = test.i2c_emulator_read_word_data(test.MCP23017_GPPUA); // read value from registers
    if (x != a){
        test.test_fail("failed to set bus pullup");
        break;
    }
}




// get test result
test.test_outcome();