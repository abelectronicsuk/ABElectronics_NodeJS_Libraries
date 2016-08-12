//================================================
// ABElectronics Servo Pi demo
// Version 1.0 Created 29/07/2016
//
// Requires rpio to be installed, install with: npm install rpio
// run with: sudo node pwm.js
// ================================================

//This demo shows how to set a 1KHz output frequency and change the pulse width between the minimum and maximum values


// link to the servopi library
var servopi = require('../../lib/servopi/servopi');

// create an servopi object
var pwm = new ServoPi(0x40);

// Set PWM frequency to 1 Khz and enable the output
pwm.setPWMFrequency(1000);
pwm.outputEnable();

var x = 0;

while (1) {

    for (x = 0; x < 4095; x++){
        pwm.setPWM(0, 0, x);
    }
    for (x = 4095; x > 0; x--) {
        pwm.setPWM(0, 0, x);
    }
}
