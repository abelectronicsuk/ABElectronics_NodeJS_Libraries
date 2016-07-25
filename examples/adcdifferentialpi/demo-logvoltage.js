//================================================
// ABElectronics ADC Differential Pi 8-Channel ADC demo
// Version 1.0 Created 06/07/2016
// 
// Requires rpio to be installed, install with: npm install rpio
// run with: sudo node demo-readvoltage.js
// ================================================

// Initialise the ADC device using the default addresses and sample rate,
// change this value if you have changed the address selection jumpers

// Sample rate can be 12, 14, 16 or 18

var adcpi = require('../../lib/adcdifferentialpi/adcdifferentialpi');
var fs = require('fs');

var logStream = fs.createWriteStream('./logFile.log', { flags: 'a' });

var spawn = require('child_process').spawn,
    ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.pipe(logStream);
ls.stderr.pipe(logStream);

ls.on('close', function (code) {
    console.log('child process exited with code ' + code);
});


var adc = new ADCDifferentialPi(0x68, 0x69, 18);


while (1) {
    console.log('Reading 1: ' + adc.readVoltage(1));
    console.log('Reading 2: ' + adc.readVoltage(2));
    console.log('Reading 3: ' + adc.readVoltage(3));
    console.log('Reading 4: ' + adc.readVoltage(4));
    console.log('Reading 5: ' + adc.readVoltage(5));
    console.log('Reading 6: ' + adc.readVoltage(6));
    console.log('Reading 7: ' + adc.readVoltage(7));
    console.log('Reading 8: ' + adc.readVoltage(8));


}