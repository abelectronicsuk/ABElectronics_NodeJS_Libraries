/** 
* ================================================
* AB Electronics UK IO Pi Unit Tests | test resetInterrupts function
*
* run with: node resetInterrupts
* ================================================

This test validates the resetInterrupts function in the IoPi class.

=== Expected Result ============================

> Console Output:
Test Passed

*/

var iopi = require('../../lib/iopi/iopi');

var ut = require("../unittests"); // import test framework
var test = new UnitTests();

test.start_test("IOPi class > resetInterrupts()");

var bus = new IoPi(0x20, false);  // new IoPi object without initialisation

bus.resetInterrupts();




// get test result
test.test_outcome();