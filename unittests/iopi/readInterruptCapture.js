/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test readInterruptCapture function
*
* run with: node readInterruptCapture
* ================================================

This test validates the readInterruptCapture function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > readInterruptCapture()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation


// out of bounds tests
try
{
    bus.readInterruptCapture(2);
    test.test_exception_failed("high boundary out of bounds");
}
catch(error){	}

for (var a = 0; a < 255; a++){
    test.i2c_emulator_write_word_data(test.MCP23017_INTCAPA, a);
    x = bus.readInterruptCapture(0);
    if (x != a){
        test.test_exception_failed("get interrupt capture failed when set to 0");
        break;
    }
    test.i2c_emulator_write_word_data(test.MCP23017_INTCAPB, a);
    x = bus.readInterruptCapture(1);
    if (x != a){
        test.test_exception_failed("get interrupt capture failed when set to 1");
        break;
    }
}



// get test result
test.test_outcome();