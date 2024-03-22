/** 
* ================================================
* AB Electronics UK Expander Pi - IO write demo
* Version 1.0 Created 19/06/2017
*
 * Requires rpio to be installed, install with: npm install rpio
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
* 
* run with: sudo node iowrite.js
* ================================================
*/

// This example creates a square wave output on pin 1 of the IO bus by switching a pin on and off at 100ms intervals

// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

var io = new ExpanderPiIO();

// Set port 0 to be outputs
io.setPortDirection(0, 0x00);

// Create a timer that runs every 100ms
var x = 0;
var myVar = setInterval(myTimer, 100);


// change the state of the output based on the x variable.  This will toggle the pin on and off
function myTimer() {

    io.writePin(1, x);

    if (x == 0) {
        x = 1;
    }
    else { x = 0; }
    
}