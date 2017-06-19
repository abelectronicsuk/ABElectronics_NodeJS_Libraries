# AB Electronics UK ADC Differential Pi Node JS Library

Node JS Library to use with ADC Differential Pi Raspberry Pi expansion board from http://www.abelectronics.co.uk

## Install

To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The ADC Differential Pi library is located in the /lib/adcdifferentialpi/ directory

The example files are located in the /examples/adcdifferentialpi/ directory

The ADC Differential Pi library requires the rpio library to run.

Install from https://www.npmjs.com/package/rpio with
```
npm install rpio
```

## Functions:

```
readVoltage(channel) 
```
Read the voltage from the selected channel  
**Parameters:** channel - 1 to 8 
**Returns:** number between -2.048 and +2.048

```
readRaw(channel) 
```
Read the raw int value from the selected channel  
**Parameters:** channel - 1 to 8 
**Returns:** number

```
setPGA(gain)
```
Set the gain of the PGA on the chip  
**Parameters:** gain -  1, 2, 4, 8  
**Returns:** null

```
setBitRate(rate)
```
Set the sample bit rate of the adc  
**Parameters:** rate -  12, 14, 16, 18  
**Returns:** null  
12 = 12 bit (240SPS max)  
14 = 14 bit (60SPS max)  
16 = 16 bit (15SPS max)  
18 = 18 bit (3.75SPS max)  

```
setConversionMode(mode)
```
Set the conversion mode for the adc  
**Parameters:** mode -  0 = One-shot conversion, 1 = Continuous conversion  
**Returns:** null

## Usage

To use the ADC Differential Pi library in your code you must first import the library:
```
var adcpi = require('../../lib/adcpi/adcpi');
```

Next you must initialise the adc object and smbus:
```
var adc = new ADCPi(0x68, 0x69, 18);
```
The first two arguments are the I2C addresses of the ADC chips. The values shown are the default addresses of the ADC board.

The third argument is the sample bit rate you want to use on the adc chips. Sample rate can be 12, 14, 16 or 18


You can now read the voltage from channel 1 with:
```
adc.readVoltage(1);
```
