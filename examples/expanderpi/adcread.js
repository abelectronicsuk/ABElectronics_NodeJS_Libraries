/** 
* ================================================
* AB Electronics UK Expander Pi - ADC Read Demo
* Version 1.0 Created 19/06/2017
* 
* Requires rpio to be installed, install with: npm install rpio
* Requires i2c-bus to be installed, install with: npm install i2c-bus
* 
* run with: sudo node adcread.js
* ================================================
*/

console.reset = function () {
    return process.stdout.write('\033c');
}

// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

// create an instance of the adcdac class

var adc = new ExpanderPiADC();

// set the reference voltage

adc.setADCRefVoltage(4.096);

// read the raw value and voltage from channels 1 and 2 and print them on the console.

var x = 0;

    console.log('Reading 1 Voltage: ' + adc.readADCVoltage(1, 0));
    console.log('Reading 2 Voltage: ' + adc.readADCVoltage(2, 0));
    console.log('Reading 3 Voltage: ' + adc.readADCVoltage(3, 0));
    console.log('Reading 4 Voltage: ' + adc.readADCVoltage(4, 0));
    console.log('Reading 5 Voltage: ' + adc.readADCVoltage(5, 0));
    console.log('Reading 6 Voltage: ' + adc.readADCVoltage(6, 0));
    console.log('Reading 7 Voltage: ' + adc.readADCVoltage(7, 0));
    console.log('Reading 8 Voltage: ' + adc.readADCVoltage(8, 0));


