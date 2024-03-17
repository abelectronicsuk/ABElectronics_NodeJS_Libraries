/** 
* ================================================
* AB Electronics UK IO Pi Pin Read demo
* Version 1.0 Created 12/08/2016
* Version 1.1 Updated 16/ 03 / 2024
* Requires i2c-bus to be installed, install with: npm install i2c-bus

* run with: sudo node iopiread.js
* ================================================
*/

// This example reads the first 8 pins of bus 1 on the IO Pi board.  The
// internal pull- up resistors are enabled so each pin will read as 1 unless
// the pin is connected to ground.

// Initialise the IOPi device using the default addresses, you will need to
// change the addresses if you have changed the jumpers on the IO Pi

var iopi = require('../../lib/iopi/iopi');

var bus1 = new IoPi(0x20);

// We will read the inputs 1 to 16 from bus 1 so set ports 0 and 1 as inputs and
// enable the internal pull-up resistors

bus1.setPortDirection(0, 0xFF);
bus1.setPortPullups(0, 0xFF);

bus1.setPortDirection(1, 0xFF);
bus1.setPortPullups(1, 0xFF);

// create a timer object and read from pins 1 to 8 on the IO Pi bus every 100ms
var myVar = setInterval(myTimer, 100);

// read the state from all of the pins on the bus individually and then get the value from the overall bus
function myTimer() {
    console.clear();
    console.log('Pin 1: %d', bus1.readPin(1));
    console.log('Pin 2: %d', bus1.readPin(2));
    console.log('Pin 3: %d', bus1.readPin(3));
    console.log('Pin 4: %d', bus1.readPin(4));
    console.log('Pin 5: %d', bus1.readPin(5));
    console.log('Pin 6: %d', bus1.readPin(6));
    console.log('Pin 7: %d', bus1.readPin(7));
    console.log('Pin 8: %d', bus1.readPin(8));    
    console.log('Pin 9: %d', bus1.readPin(9));  
    console.log('Pin 10: %d', bus1.readPin(10));  
    console.log('Pin 11: %d', bus1.readPin(11));  
    console.log('Pin 12: %d', bus1.readPin(12));  
    console.log('Pin 13: %d', bus1.readPin(13));  
    console.log('Pin 14: %d', bus1.readPin(14));  
    console.log('Pin 15: %d', bus1.readPin(15));  
    console.log('Pin 16: %d', bus1.readPin(16));  
    console.log('Bus 1: %d', bus1.readBus());
}