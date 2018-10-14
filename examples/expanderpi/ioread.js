/** 
* ================================================
* ABElectronics Expander Pi - IO read demo
* Version 1.0 Created 19/06/2017
* 
* Requires rpio to be installed, install with: npm install rpio
* 
* run with: sudo node ioread.js
* ================================================
*/

// This example reads the first 8 pins on the Exander Pi IO bus.  
// The internal pull- up resistors are enabled so each pin will read as 1 unless
// the pin is connected to ground.

console.reset = function () { // clear the console screen
    return process.stdout.write('\033c');
}

// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

var io = new ExpanderPiIO();

// We will read the inputs 1 to 16 so set port 0 and port 1 to be inputs and
// enable the internal pull-up resistors

io.setPortDirection(0, 0xFF);
io.setPortPullups(0, 0xFF);

io.setPortDirection(1, 0xFF);
io.setPortPullups(1, 0xFF);

// invert the ports so connecting a pin to ground will show as 1 instead of 0

io.invertPort(0, 0xFF);
io.invertPort(1, 0xFF);

// create a timer object and read from pins 1 to 8 every 100ms
var myVar = setInterval(myTimer, 100);


function myTimer() {
    console.reset();
    console.log('Pin 1: %d', io.readPin(1));
    console.log('Pin 2: %d', io.readPin(2));
    console.log('Pin 3: %d', io.readPin(3));
    console.log('Pin 4: %d', io.readPin(4));
    console.log('Pin 5: %d', io.readPin(5));
    console.log('Pin 6: %d', io.readPin(6));
    console.log('Pin 7: %d', io.readPin(7));
    console.log('Pin 8: %d', io.readPin(8));    
    console.log('Pin 9: %d', io.readPin(9));
    console.log('Pin 10: %d', io.readPin(10));
    console.log('Pin 11: %d', io.readPin(11));
    console.log('Pin 12: %d', io.readPin(12));
    console.log('Pin 13: %d', io.readPin(13));
    console.log('Pin 14: %d', io.readPin(14));
    console.log('Pin 15: %d', io.readPin(15));
    console.log('Pin 16: %d', io.readPin(16));
}