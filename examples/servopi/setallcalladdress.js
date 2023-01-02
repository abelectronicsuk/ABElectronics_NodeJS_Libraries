/**
 * 
 * 
 * AB Electronics UK Servo Pi demo
 * Version 1.0 Created 29/07/2016
 * 
 * Requires rpio to be installed, install with: npm install rpio
 * run with: sudo node setallcalladdress.js
 * ================================================

 * This demo shows how to set the I2C address for the All Call function
 * All Call allows you to control several Servo Pi boards simultaneously on the same I2C address
 */


// link to the servopi library
var servopi = require('../../lib/servopi/servopi');

// create a servopi object
var pwm = new PWM(0x40);

// Set the all-call address to 0x30
pwm.setAllCallAddress(0x30);

// Disable the all call address
// pwm.disableAllCallAddress();

// Enable the all call address
pwm.enableAllCallAddress();
