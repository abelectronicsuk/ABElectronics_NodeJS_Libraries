/** 
* ================================================
* AB Electronics UK IO Zero 32 Unit Tests | test getBusPullups function
*
* run with: node IOZero32
* ================================================

This test validates the IOZero32 init function in the IOZero32 class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var IOZero32 = require('../../lib/iozero32/iozero32');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOZero32 class > IOZero32()");

// out of bounds tests
try
{
    var bus1 = new IOZero32(0x19);
    test.test_exception_failed("I2C address low out of bounds");
}
catch(error){	}

try
{
    var bus2 = new IOZero32(0x28);
    test.test_exception_failed("I2C address high out of bounds");
}
catch(error){	}

// get test result
test.test_outcome();