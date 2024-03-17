/** 
* ================================================
* AB Electronics UK IO Pi Pin Read demo 2
* Version 1.0 Created 20/01/2016
* Version 1.1 Updated 16/ 03 / 2024
* Requires i2c-bus to be installed, install with: npm install i2c-bus
* run with: sudo node iopiread2boards.js
* ================================================
* 
* This example reads the first 8 pins from both busses on two IO Pi boards.  The
* internal pull- up resistors are enabled so each pin will read as 1 unless
* the pin is connected to ground.
* 
* Initialise the IOPi devices using the default addresses for board 1 and addresses 0x22 and 0x23 for board 2.
* You will need to change the addresses if you have changed the jumpers on the IO Pi
*/

var iopi = require('../../lib/iopi/iopi');

var bus1 = new IoPi(0x20);
var bus2 = new IoPi(0x21);
var bus3 = new IoPi(0x22);
var bus4 = new IoPi(0x23);

// We will read the inputs 1 to 8 from each bus so set port 0 as inputs and
// enable the internal pull-up resistors

bus1.setPortDirection(0, 0xFF);
bus1.setPortPullups(0, 0xFF);

bus2.setPortDirection(0, 0xFF);
bus2.setPortPullups(0, 0xFF);

bus3.setPortDirection(0, 0xFF);
bus3.setPortPullups(0, 0xFF);

bus4.setPortDirection(0, 0xFF);
bus4.setPortPullups(0, 0xFF);

// create a timer object and read from pins 1 to 8 on the IO Pi busses every 100ms
var myVar = setInterval(myTimer, 500);


function myTimer() {
	console.log('\033[2J'); // clear the window

    console.log('IO Pi 1 Bus 1 Pin 1: %d', bus1.readPin(1));
    console.log('IO Pi 1 Bus 1 Pin 2: %d', bus1.readPin(2));
    console.log('IO Pi 1 Bus 1 Pin 3: %d', bus1.readPin(3));
    console.log('IO Pi 1 Bus 1 Pin 4: %d', bus1.readPin(4));
    console.log('IO Pi 1 Bus 1 Pin 5: %d', bus1.readPin(5));
    console.log('IO Pi 1 Bus 1 Pin 6: %d', bus1.readPin(6));
    console.log('IO Pi 1 Bus 1 Pin 7: %d', bus1.readPin(7));
    console.log('IO Pi 1 Bus 1 Pin 8: %d', bus1.readPin(8));

    console.log('IO Pi 1 Bus 2 Pin 1: %d', bus2.readPin(1));
	console.log('IO Pi 1 Bus 2 Pin 2: %d', bus2.readPin(2));
	console.log('IO Pi 1 Bus 2 Pin 3: %d', bus2.readPin(3));
	console.log('IO Pi 1 Bus 2 Pin 4: %d', bus2.readPin(4));
	console.log('IO Pi 1 Bus 2 Pin 5: %d', bus2.readPin(5));
	console.log('IO Pi 1 Bus 2 Pin 6: %d', bus2.readPin(6));
	console.log('IO Pi 1 Bus 2 Pin 7: %d', bus2.readPin(7));
    console.log('IO Pi 1 Bus 2 Pin 8: %d', bus2.readPin(8));

    console.log('IO Pi 2 Bus 1 Pin 1: %d', bus3.readPin(1));
	console.log('IO Pi 2 Bus 1 Pin 2: %d', bus3.readPin(2));
	console.log('IO Pi 2 Bus 1 Pin 3: %d', bus3.readPin(3));
	console.log('IO Pi 2 Bus 1 Pin 4: %d', bus3.readPin(4));
	console.log('IO Pi 2 Bus 1 Pin 5: %d', bus3.readPin(5));
	console.log('IO Pi 2 Bus 1 Pin 6: %d', bus3.readPin(6));
	console.log('IO Pi 2 Bus 1 Pin 7: %d', bus3.readPin(7));
    console.log('IO Pi 2 Bus 1 Pin 8: %d', bus3.readPin(8));

    console.log('IO Pi 2 Bus 2 Pin 1: %d', bus4.readPin(1));
	console.log('IO Pi 2 Bus 2 Pin 2: %d', bus4.readPin(2));
	console.log('IO Pi 2 Bus 2 Pin 3: %d', bus4.readPin(3));
	console.log('IO Pi 2 Bus 2 Pin 4: %d', bus4.readPin(4));
	console.log('IO Pi 2 Bus 2 Pin 5: %d', bus4.readPin(5));
	console.log('IO Pi 2 Bus 2 Pin 6: %d', bus4.readPin(6));
	console.log('IO Pi 2 Bus 2 Pin 7: %d', bus4.readPin(7));
    console.log('IO Pi 2 Bus 2 Pin 8: %d', bus4.readPin(8));
}