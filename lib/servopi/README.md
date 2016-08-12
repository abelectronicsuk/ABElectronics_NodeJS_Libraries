AB Electronics UK Servo Pi Node.js Library
=====

Node.js Library to use with Servo Pi Raspberry PWM servo control board from https://www.abelectronics.co.uk

Install
====

To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The Servo Pi library is located in the /lib/servopi/ directory

The example files are located in the /examples/servopi/ directory

The Servo Pi library requires the rpio library to run.

Install from https://www.npmjs.com/package/rpio with
```
npm install rpio
```

Functions:
----------

```
setPWMFrequency(freq) 
```
Set the PWM frequency
**Parameters:** freq - required frequency  
**Returns:** null

```
setPWM(channel, on, off) 
```
Set the output on single channels
**Parameters:** channel - 1 to 16, on - time period, off - time period
**Returns:** null


```
setAllPWM( on, off) 
```
Set the output on all channels
**Parameters:** on - time period, off - time period
**Returns:** null

```
outputDisable()
```
Disable the output via OE pin
**Parameters:** null
**Returns:** null

```
outputEnable()
```
Enable the output via OE pin
**Parameters:** null
**Returns:** null

```
setAllCallAddress(address)
```
Set the I2C address for the All Call function
**Parameters:** address
**Returns:** null

```
enableAllCallAddress()
```
Enable the I2C address for the All Call function
**Parameters:** null
**Returns:** null

```
disableAllCallAddress()
```
Disable the I2C address for the All Call function
**Parameters:** null
**Returns:** null



Usage
====

To use the Servo Pi library in your code you must first import the library:
```
var servopi = require('../../lib/servopi/servopi')
```
Next you must initialise the ServoPi object:
```
var pwm = new ServoPi(0x40);
```
Set PWM frequency to 60 Hz
```
pwm.setPWMFrequency(60);
pwm.outputEnable();
```
Create a positions array and a counter variable
```
var positions = [250, 375, 500];
var count = 0;
```
Create a timer object and move the servo on port 0 between three points
```
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the
    pwm.setPWM(0, 0, positions[count]);
    count++;
    if (count > positions.length) {
        count = 0;
    }
}
```
