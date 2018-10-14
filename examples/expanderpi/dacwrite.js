/** 
* ================================================
* ABElectronics Expander Pi - DAC demo
* Version 1.0 Created 19/06/2017
* 
* Requires rpio to be installed, install with: npm install rpio
* 
* run with: sudo node dacwrite.js
* ================================================
*/

// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

// create a new instance of the DAC
dac = new ExpanderPiDAC();

// set the DAC gain to 1
dac.setDACGain(1);

// set the voltage
dac.setDACVoltage(1, 0.8);
dac.setDACVoltage(2, 1.5);