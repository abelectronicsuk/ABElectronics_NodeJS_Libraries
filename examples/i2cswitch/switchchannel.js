/**
* AB Electronics UK I2C Switch demo
* Version 1.0 Created 28/11/2019
*
* Requires rpio to be installed, install with: npm install rpio
* run with: sudo node switchchannel.js
* 
* This demo shows how to switch the I2C bus to a selected channel 
* and then read the state of that channel to confirm it has been enabled.
*/

// link to the i2cswitch library
var i2cswitch = require('../../lib/i2cswitch/i2cswitch');

// create an I2CSwitch object
var switchobject = new I2CSwitch(0x70);

// channel to select
var channel = 4

// Set the switch to channel 4
switchobject.switchChannel(channel);

// get the status of the selected channel
var result = switchobject.getChannelState(channel)

if (result == true){
    console.log('Switched to channel ' + channel)
}
else{
    console.log('Error switching to channel ' + channel)
}



