/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test setPinPullup function
*
* run with: node setPinPullup
* ================================================

This test validates the setPinPullup function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > setPinPullup()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

// out of bounds tests
try
{
    bus.setPinPullup(0, 0);
    test.test_exception_failed("pin low boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinPullup(17, 0);
    test.test_exception_failed("pin high boundary out of bounds");
}
catch(error){	}

try
{
    bus.setPinPullup(1, 2);
    test.test_exception_failed("value high boundary out of bounds");
}
catch(error){	}

for (var x = 1; x <= 8; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_GPPUA, 0x00);
    bus.setPinPullup(x, 1);

    var y = test.i2c_emulator_read_word_data(test.MCP23017_GPPUA);
    if (!test.test_get_bit(y, x - 1)){
        test.test_exception_failed("set pin to 1 failed on port 0");
        break;
    }
}

for (var x = 1; x <= 8; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_GPPUA, 0xFF);
    bus.setPinPullup(x, 0);

    var y = test.i2c_emulator_read_word_data(test.MCP23017_GPPUA);
    if (test.test_get_bit(y, x - 1)){
        test.test_exception_failed("set pin to 0 failed on port 0");
        break;
    }
}

for (var x = 9; x <= 16; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_GPPUB, 0x00);
    bus.setPinPullup(x, 1);

    var y = test.i2c_emulator_read_word_data(test.MCP23017_GPPUB);
    if (!test.test_get_bit(y, x - 9)){
        test.test_exception_failed("set pin to 1 failed on port 1");
        break;
    }
}

for (var x = 9; x <= 16; x++)
{
    test.i2c_emulator_write_word_data(test.MCP23017_GPPUB, 0xFF);
    bus.setPinPullup(x, 0);

    var y = test.i2c_emulator_read_word_data(test.MCP23017_GPPUB);
    if (test.test_get_bit(y, x - 9)){
        test.test_exception_failed("set pin to 1 failed on port 1");
        break;
    }
}




// get test result
test.test_outcome();