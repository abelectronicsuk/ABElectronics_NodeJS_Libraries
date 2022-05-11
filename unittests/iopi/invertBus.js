/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test invertBus function
*
* run with: node invertBus
* ================================================

This test validates the invertBus function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > invertBus()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

for (var a = 0; a < 65535; a++){
    bus.invertBus(a);  
    if (a != test.i2c_emulator_read_word_data(test.MCP23017_IPOLA)){
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();