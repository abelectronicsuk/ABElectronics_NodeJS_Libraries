/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test setBusPolarity function
*
* run with: node setBusPolarity
* ================================================

This test validates the setBusPolarity function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > setBusPolarity()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

for (var a = 0; a < 65535; a++){
    bus.setBusPolarity(a);  
    if (a != test.i2c_emulator_read_word_data(test.PCA9535_INVERTPORT0)){
        test.test_fail("unexpected register value");
    }
}




// get test result
test.test_outcome();