//================================================
// ABElectronics ADCDAC Pi ADC demo
// Version 1.0 Created 06/07/2016
// 
// Requires rpio-spi to be installed, install with: npm install spi
// run with: sudo node adcread.js
// ================================================

// link to the adcdacpi library

var adcdac = require('../../lib/adcdacpi/adcdacpi');

// create an instance of the adcdac class

var adc = new ADCDAC();

// set the reference voltage

adc.setADCRefVoltage(3.3);

// read the raw value and voltage from channels 1 and 2 and print them on the console.

var x = 0;

while (x < 10) {
    x++;
    console.log('Reading 1 Voltage: ' + adc.readADCVoltage(1, 0));
    console.log('Reading 1 Raw: ' + adc.readADCRaw(1, 0));
    console.log('Reading 2 Voltage: ' + adc.readADCVoltage(2, 0));
    console.log('Reading 2 Raw: ' + adc.readADCRaw(2, 0));
}