/** 
 * ================================================
 * AB Electronics UK ADC Differential Pi 8-Channel ADC read voltage demo
 * Version 1.0 Created 06/07/2016
 * Version 1.1 Updated 20/03/2024
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
 * run with: sudo node demo-readvoltage.js
 * ================================================
*/

// Initialise the ADC device using the default addresses and sample rate,
// change this value if you have changed the address selection jumpers

// Sample rate can be 12, 14, 16 or 18

var adcpi = require('../../lib/adcdifferentialpi/adcdifferentialpi');


var adc = new ADCDifferentialPi(0x68, 0x69, 16);

process.stdout.write('\x1B[2J\x1B[0f'); // Clear console and move cursor to top

while (1) {
    process.stdout.write('\x1B[0f'); // move cursor to top
    process.stdout.write('Reading 1: ' + adc.readVoltage(1) + '                             \n');
    process.stdout.write('Reading 2: ' + adc.readVoltage(2) + '                             \n');
    process.stdout.write('Reading 3: ' + adc.readVoltage(3) + '                             \n');
    process.stdout.write('Reading 4: ' + adc.readVoltage(4) + '                             \n');
    process.stdout.write('Reading 5: ' + adc.readVoltage(5) + '                             \n');
    process.stdout.write('Reading 6: ' + adc.readVoltage(6) + '                             \n');
    process.stdout.write('Reading 7: ' + adc.readVoltage(7) + '                             \n');
    process.stdout.write('Reading 8: ' + adc.readVoltage(8) + '                             \n');    
}