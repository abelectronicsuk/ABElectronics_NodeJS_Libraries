//================================================
// ABElectronics ADCDAC Pi DAC demo
// Version 1.0 Created 06/07/2016
// 
// Requires rpio-spi to be installed, install with: npm install spi
// run with: sudo node dacwrite.js
// ================================================

// Initialise the ADC DAC device



var adcdac = require('../../lib/adcdacpi/adcdac');

dac = new ADCDAC();
dac.setDACGain(1);
dac.setDACVoltage(1, 1.8);