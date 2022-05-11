/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test writePort function
*
* run with: node writePort
* ================================================

This test validates the writePort function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > writePort()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.writePort(2, 0);
    test.test_exception_failed("port high boundary out of bounds");
}
catch(error){	}


var y = 0;

for (var x = 0; x < 256; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_GPIOA, 0x00);
    test.i2c_emulator_write_word_data(test.MCP23017_GPIOB, 0x00);

    bus.writePort(0, x);
    
    y = test.i2c_emulator_read_word_data(test.MCP23017_GPIOA);
    if (x != y){
        test.test_exception_failed("set port failed on port 0");
        break;
    }

    test.i2c_emulator_write_word_data(test.MCP23017_GPIOA, 0x00);
    test.i2c_emulator_write_word_data(test.MCP23017_GPIOB, 0x00);

    bus.writePort(1, x);
    
    y = test.i2c_emulator_read_word_data(test.MCP23017_GPIOB);
    if (x != y){
        test.test_exception_failed("set port failed on port 1");
        break;
    }
}




// get test result
test.test_outcome();