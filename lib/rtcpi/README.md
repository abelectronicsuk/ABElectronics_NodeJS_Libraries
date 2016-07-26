AB Electronics UK RTC Pi Node JS Library
=====

Node JS Library to use with RTC Pi Raspberry Pi real-time clock board from https://www.abelectronics.co.uk

Install
====

To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The RTC Pi library is located in the /lib/rtcpi/ directory

The example files are located in the /examples/rtcpi/ directory

The RTC Pi library requires the rpio library to run.

Install from https://www.npmjs.com/package/rpio with
```
npm install rpio
```

Functions:
----------

```
setDate(date) 
```
Set the date and time on the RTC using a javascript Date object   
**Parameters:** date   
**Returns:** null

```
readDate() 
```
Returns the date from the RTC as a javascript Date object     
**Returns:** date object


```
enableOutput() 
```
Enable the square-wave output on the SQW pin.  
**Returns:** null

```
disableOutput()
```
Disable the square-wave output on the SQW pin.   
**Returns:** null

```
setFrequency()
```
Set the frequency for the square-wave output on the SQW pin.   
**Parameters:** frequency - options are: 1 = 1Hz, 2 = 4.096KHz, 3 = 8.192KHz, 4 = 32.768KHz   
**Returns:** null

Usage
====

To use the RTC Pi library in your code you must first import the library:
```
var rtcpi = require('../../lib/rtcpi/rtcpi');
```

Next you must create an RTCPi object:

```
var rtc = new RTCPi();
```
Set the current time using a date object:
```
var d = new Date(2016, 07, 04, 10, 23, 00, 00);
rtc.setDate(d);
```
Enable the square-wave output at 8.192KHz on the SQW pin:
```
rtc.set_frequency(3)
rtc.enable_output()
```
Read the current date and time from the RTC at 1 second intervals:
```
var myClock = setInterval(clockTimer, 1000);

function clockTimer() {    
    console.log(rtc.readDate().toISOString());
}
```
