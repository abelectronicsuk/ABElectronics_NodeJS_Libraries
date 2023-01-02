/**
* AB Electronics UK Servo Pi demo
* Version 2.0 Created 04/09/2018
*
* Requires rpio to be installed, install with: npm install rpio
* run with: sudo node servomove.js
* ================================================

* This demo shows how to move a servo between 3 different positions.
* The low limit is set with a value of 1ms
* The high limit is set with a value of 2ms
* Both of these values can be adjusted to match the limits on the servo being tested.
*/

// link to the servopi library
var servo = require('../../lib/servopi/servopi');

// create a servo object on I2C channel 0x40 with a lower limit of 1ms, 
// a high limit of 2ms and reset the Servo Pi to its default state
servo = new Servo(0x40, 1.0, 2.0, true);

// Set PWM frequency to 50Hz (20ms) and enable the output
servo.setFrequency(50);
servo.outputEnable();

// create a positions array and a counter variable
var positions = [1, 175, 250];
var count = 0;

// create a timer object that runs every second
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the servo channel 1 to the three positions
    servo.move(1, positions[count], 250);
    count++;
    if (count >= positions.length) {
        count = 0;
    }
}

