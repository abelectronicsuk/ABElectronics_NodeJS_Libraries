/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test getBusPullups function
*
* run with: node IoPi
* ================================================

This test validates the IoPi init function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > IoPi()");

// out of bounds tests
try
{
    var bus1 = new IoPi(0x19);
    test.test_exception_failed("I2C address low out of bounds");
}
catch(error){	}

try
{
    var bus2 = new IoPi(0x28);
    test.test_exception_failed("I2C address high out of bounds");
}
catch(error){	}

test.i2c_emulator_write_word_data(test.MCP23017_IODIRA, 0x0000); // Set IODIRA and IODIRB to be 0x00
test.i2c_emulator_write_word_data(test.MCP23017_GPPUA, 0xFFFF); // Set GPPUA and GPPUB to be 0xFF
test.i2c_emulator_write_word_data(test.MCP23017_IPOLA, 0xFFFF); // Set IPOLA and IPOLB to be 0xFF

var bus2 = new IoPi(0x20, true); // create IoPi object

test.test_i2c_register(test.MCP23017_IOCON, 0x02); // IOCON expected to be 0x02

test.test_i2c_register(test.MCP23017_IODIRA, 0xFF); // IODIRA expected to be 0xFF
test.test_i2c_register(test.MCP23017_IODIRB, 0xFF); // IODIRB expected to be 0xFF

test.test_i2c_register(test.MCP23017_GPPUA, 0x00); // GPPUA expected to be 0xFF
test.test_i2c_register(test.MCP23017_GPPUB, 0x00); // IODIRB expected to be 0xFF

test.test_i2c_register(test.MCP23017_IPOLA, 0x00); // IPOLA expected to be 0xFF
test.test_i2c_register(test.MCP23017_IPOLB, 0x00); // IPOLB expected to be 0xFF

test.test_outcome();




// get test result
test.test_outcome();