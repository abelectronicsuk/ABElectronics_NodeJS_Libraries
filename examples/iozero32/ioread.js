/** 
* ================================================
* AB Electronics UK - IO Zero 32 - Pin Read demo
* Version 1.0 Created 10/05/2022
* 
* Requires rpio to be installed, install with: npm install rpio
* run with: sudo node iopiread.js
* ================================================
*/

// This example reads all 32 pins of both bus 1 and 2 on the IO Zero 32 board.
// Pull-up or pull-down resistors may be required if the inputs are normally in a floating state.

// Initialise the IOZero32 device using the default addresses, you will need to
// change the addresses if you have changed the jumpers on the IO Zero 32

var IOZero32 = require('../../lib/iozero32/iozero32');

var bus1 = new IOZero32(0x20);
var bus2 = new IOZero32(0x20);

// We will read the inputs 1 to 16 from bus 1 and 2 so set both busses to be inputs

bus1.setBusDirection(0xFFFF);
bus2.setBusDirection(0xFFFF);

// create a timer object and read from pins 1 to 8 on the IO bus every 100ms
var myVar = setInterval(myTimer, 100);

function myTimer() {
    console.clear();
    console.log('Bus 1 Pin 1:  %d       Bus 2 Pin 1:  %d', bus1.readPin(1), bus2.readPin(1));
    console.log('Bus 1 Pin 2:  %d       Bus 2 Pin 2:  %d', bus1.readPin(2), bus2.readPin(2));
    console.log('Bus 1 Pin 3:  %d       Bus 2 Pin 3:  %d', bus1.readPin(3), bus2.readPin(3));
    console.log('Bus 1 Pin 4:  %d       Bus 2 Pin 4:  %d', bus1.readPin(4), bus2.readPin(4));
    console.log('Bus 1 Pin 5:  %d       Bus 2 Pin 5:  %d', bus1.readPin(5), bus2.readPin(5));
    console.log('Bus 1 Pin 6:  %d       Bus 2 Pin 6:  %d', bus1.readPin(6), bus2.readPin(6));
    console.log('Bus 1 Pin 7:  %d       Bus 2 Pin 7:  %d', bus1.readPin(7), bus2.readPin(7));
    console.log('Bus 1 Pin 8:  %d       Bus 2 Pin 8:  %d', bus1.readPin(8), bus2.readPin(8));
    console.log('Bus 1 Pin 9:  %d       Bus 2 Pin 9:  %d', bus1.readPin(9), bus2.readPin(9));
    console.log('Bus 1 Pin 10: %d       Bus 2 Pin 10: %d', bus1.readPin(10), bus2.readPin(10));
    console.log('Bus 1 Pin 11: %d       Bus 2 Pin 11: %d', bus1.readPin(11), bus2.readPin(11));
    console.log('Bus 1 Pin 12: %d       Bus 2 Pin 12: %d', bus1.readPin(12), bus2.readPin(12));
    console.log('Bus 1 Pin 13: %d       Bus 2 Pin 13: %d', bus1.readPin(13), bus2.readPin(13));
    console.log('Bus 1 Pin 14: %d       Bus 2 Pin 14: %d', bus1.readPin(14), bus2.readPin(14));
    console.log('Bus 1 Pin 15: %d       Bus 2 Pin 15: %d', bus1.readPin(15), bus2.readPin(15));
    console.log('Bus 1 Pin 16: %d       Bus 2 Pin 16: %d', bus1.readPin(16), bus2.readPin(16));   
}