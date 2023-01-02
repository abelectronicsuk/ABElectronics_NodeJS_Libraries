/** 
* ================================================
* AB Electronics UK Expander Pi - ADC Speed Test Demo
* Version 1.0 Created 19/06/2017
* 
* Requires rpio to be installed, install with: npm install rpio
* 
* run with: sudo node adcspeedtest.js
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


var numberOfSamples = 100000;

var sampleArray = [];
var a = 0;

var startTime = new Date();

for (var i = 0; i <= numberOfSamples; i++) {
    sampleArray[i] = adc.readADCVoltage(1, 0);
}

var endTime = new Date();

var sum = 0;

for (var x = 0; x <= numberOfSamples; x++) {
    sum += sampleArray[x];
}



var elapsedTime = (endTime.getTime() - startTime.getTime());
var sampleRate = (numberOfSamples / elapsedTime) * 1000;
var average = sum / numberOfSamples;

console.log("%d samples in %d ms.\nThe sample rate was %d samples per second\nThe average voltage was %dV", numberOfSamples, elapsedTime, sampleRate, average);
