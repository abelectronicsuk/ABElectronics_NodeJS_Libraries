AB Electronics UK ADCDAC Pi Node JS Library
=====

Node JS Library to use with ADCDAC Pi and ADCDAC Pi Zero Raspberry Pi expansion boards from http://www.abelectronics.co.uk

Install
====

To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The ADCDAC Pi library is located in the /lib/adcdacpi/ directory

The example files are located in the /examples/adcdacpi/ directory

The ADC DAC Pi library requires the node-spi library to run.

Uses node-spi from https://github.com/RussTheAerialist/node-spi
Install from https://www.npmjs.com/package/spi with

```
npm install spi
```

Functions:
----------

```
readADCVoltage(channel, mode) 
```
Read the voltage from the selected channel on the ADC  
**Parameters:** channel - 1 or 2; mode - 0 = single ended, 1 = differential
**Returns:** number as float between 0 and 2.048

```
readADCRaw(channel, mode) 
```
Read the raw value from the selected channel on the ADC  
**Parameters:** channel - 1 or 2; mode - 0 = single ended, 1 = differential
**Returns:** int
```
setADCRefVoltage(voltage)
```
Set the reference voltage for the analogue to digital converter.  
The ADC uses the raspberry pi 3.3V power as a voltage reference so using this method to set the reference to match the exact output voltage from the 3.3V regulator will increase the accuracy of the ADC readings.  
**Parameters:** voltage - float between 0.0 and 7.0  
**Returns:** null

```
setDACVoltage(channel, voltage)
```
Set the voltage for the selected channel on the DAC.  The DAC has two gain values, 1 or 2, which can be set when the ADCDAC object is created.  A gain of 1 will give a voltage between 0 and 2.047 volts.  A gain of 2 will give a voltage between 0 and 3.3 volts.  
**Parameters:** channel - 1 or 2,  voltage can be between 0 and 2.047 volts  
**Returns:** null 

```
setDACRaw(channel, value)
```
Set the raw value from the selected channel on the DAC  
**Parameters:** channel - 1 or 2,value int between 0 and 4095  
**Returns:** null 
Usage
====

To use the ADCDAC Pi library in your code you must first import the library:
```
var adcdac = require('../../lib/adcdacpi/adcdacpi');
```
Next you must initialise the adcdac object and set a gain of 1 or 2 for the DAC:
```
var adc = new ADCDAC();
```
Set the reference voltage.
```
adc.setADCRefVoltage(3.3);
```
Read the voltage from channel 1 and display on the screen
```
console.log('Reading 1 Voltage: ' + adc.readADCVoltage(1, 0));
```
