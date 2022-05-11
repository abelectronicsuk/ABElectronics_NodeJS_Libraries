/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test writeBus function
*
* run with: node writeBus
* ================================================

This test validates the writeBus function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > writeBus()");

var bus = new IOZero32(0x20, false);  // new IOZero32 object without initialisation

for (var a = 0; a < 65535; a++){
    bus.writeBus(a); 

    var x = 0;
    
    x = test.i2c_emulator_read_word_data(test.PCA9535_OUTPUTPORT0); // read value from registers
    if (x != a){
        test.test_fail("failed to set bus value");
        break;
    }
}




// get test result
test.test_outcome();