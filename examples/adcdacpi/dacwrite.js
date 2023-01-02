/** 
 * ================================================
 * AB Electronics UK ADC DAC Pi DAC demo
 * Version 1.0 Created 06/07/2016
 * 
 * Requires rpio to be installed, install with: npm install rpio
 * run with: sudo node adcread.js
 * ================================================
*/

// Initialise the ADC DAC device

var adcdac = require('../../lib/adcdacpi/adcdacpi');

dac = new ADCDAC();
dac.setDACGain(1);
dac.setDACVoltage(1, 1.0);