//================================================
// ABElectronics Servo Pi demo
// Version 1.0 Created 29/07/2016
//
// Requires rpio to be installed, install with: npm install rpio
// run with: sudo node servomove.js
// ================================================

//This demo shows how to move a servo between 3 different positions.
// The minimum position is set with a value of 250
// The maximum position is set with a value of 500
// Both of these values can be adjusted to match the limits on the servo being tested.


// link to the servopi library
var servopi = require('../../lib/servopi/servopi');

// create an servopi object
var pwm = new ServoPi(0x40);

// Set PWM frequency to 1 Khz and enable the output
pwm.setPWMFrequency(60);
pwm.outputEnable();

// create a positions array and a counter variable
var positions = [250, 375, 500];
var count = 0;

// create a timer object that runs every second
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the
    pwm.setPWM(0, 0, positions[count]);
    count++;
    if (count > positions.length) {
        count = 0;
    }
}
