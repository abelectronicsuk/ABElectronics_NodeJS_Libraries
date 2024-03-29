﻿/** 
* ================================================
* AB Electronics UK - IO Zero 32 - Pin Write demo
* Version 1.0 Created 10/05/2022
* 
* Requires i2c-bus to be installed, install with: npm install i2c-bus
* run with: sudo node iopiwrite.js
* ================================================
* 
* This example creates a square wave output on pin 1 of bus 1 by switching a pin on and off at 100ms intervals
* 
* Initialise the IOZero32 device using the default addresses, you will need to
* change the addresses if you have changed the jumpers on the IO Zero 32
*/

const IOZero32 = require('../../lib/iozero32/iozero32');

const bus1 = new IOZero32(0x20);

// Set port 0 as outputs
bus1.setPortDirection(0, 0x00);

// Create a timer that runs every 100ms
let x = 0;
const myVar = setInterval(myTimer, 100);


// change the state of the output based on the x variable.  This will toggle the pin on and off
function myTimer() {

    bus1.writePin(1, x);

        if (x === 0) {
            x = 1;
        }
        else { x = 0; }
    
}