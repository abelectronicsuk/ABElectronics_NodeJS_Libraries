# AB Electronics UK Servo Pi Node.js Library

Node.js Library to use with Servo Pi Raspberry PWM servo control board from https://www.abelectronics.co.uk

**Note:** Version 2.0 replaces the ServoPi class with the PWM class.  The new Servo class is a helper for using the Servo Pi with analogue radio control servos.

## Install

To download to your Raspberry Pi type in the terminal: 

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

# PWM Class

The PWM class contains the functions needed to control the frequency, pulse duration and other features of the PCA9685 PMW controller used on the Servo Pi.

```
PWM(address) 
```
**Parameter:** address - 0x40 to 0x7F. I2C address for the target device  

## Functions:

```
setPWMFrequency(freq, calibration) 
```
Set the PWM frequency  
**Parameter:** freq - Frequency between 40 and 1000  
**Parameter:** calibration - Oscillator calibration offset. Use this to adjust for oscillator drift. Value is normally between -10 and 10  
**Returns:** null  

```
setPWM(channel, on, off) 
```
Set the output on single channels  
**Parameter:** channel - 1 to 16,  
**Parameter:** on - 0 to 4095  
**Parameter:** off - 0 to 4095  
**Returns:** null  

```
setPWMOnTime(channel, on) 
```
Set the on time on a single channel  
**Parameter:** channel - 1 to 16,  
**Parameter:** on - 0 to 4095  
**Returns:** null  

```
setPWMOffTime(channel, off) 
```
Set the off time on a single channel  
**Parameter:** channel - 1 to 16,  
**Parameter:** off - 0 to 4095  
**Returns:** null  

```
getPWMOffTime(channel) 
```
Get the off time on a single channel  
**Parameter:** channel - 1 to 16,  
**Returns:** 0 to 4095  

```
getPWMOnTime(channel, off) 
```
Get the on time on a single channel  
**Parameter:** channel - 1 to 16,  
**Returns:** 0 to 4095  

```
setAllPWM(on, off) 
```
Set the output on all channels  
**Parameter:** channel - 1 to 16,  
**Parameter:** on - 0 to 4095  
**Parameter:** off - 0 to 4095  
**Returns:** null  

```
outputDisable()
```
Disable the output via the OE pin  
**Parameter:** null  
**Returns:** null  

```
outputEnable()
```
Enable the output via the OE pin  
**Parameter:** null  
**Returns:** null  

```
setAllCallAddress(address)
```
Set the I2C address for the All Call function  
**Parameter:** address  
**Returns:** null  

```
enableAllCallAddress()
```
Enable the I2C address for the All Call function  
**Parameter:** null  
**Returns:** null  

```
disableAllCallAddress()
```
Disable the I2C address for the All Call function  
**Parameter:** null  
**Returns:** null  

```
sleep()
```
Put the device into a sleep state  
**Parameter:** null  
**Returns:** null  

```
wake()
```
Wake the device from its sleep state  
**Parameter:** null  
**Returns:** null  

```
isSleeping()
```
Check the sleep status of the device  
**Parameter:** null  
**Returns:** true = sleeping, false = awake  

```
invertOutput()
```
Invert the PWM output on all channels  
**Parameter:** null  
**Returns:** null  

## Usage

To use the Servo Pi library in your code you must first import the library:
```
var servopi = require('../../lib/servopi/servopi')
```
Next you must initialise the PWM object:
```
var pwm = new PWM(0x40);
```
Set the PWM frequency to 60 Hz with a calibration value of 0 and enable the output
```
pwm.setPWMFrequency(60, 0);
pwm.outputEnable();
```
Create an array of pulse duty cycles 25%, 50% and 75%, and a counter variable
```
var positions = [1024, 2048, 3072];
var count = 0;
```
Create a timer object and change the pulse width on pin 1 between three values
```
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the
    pwm.setPWM(1, 0, positions[count]);
    count++;
    if (count > positions.length) {
        count = 0;
    }
}
```

# Servo Class

The Servo class contains the functions for controlling analogue RC servos using the Servo Pi.

```
Servo(address, low_limit, high_limit, reset) 
```
**Parameter:** address - 0x40 to 0x7F. I2C address for the target device  
**Parameter:** low_limit - Lower servo limit in milliseconds.  Typically 1.0  
**Parameter:** high_limit - Upper servo limit in milliseconds. Typically 2.0  
**Parameter:** reset - True = All channels reset to default off state, False = All channels retain their current state  

## Functions:

```
move(channel, servopos, steps)
```
Move the servo to a new position  
**Parameter:** channel - 1 to 16  
**Parameter:** servopos - 0 to the number of steps  
**Parameter:** steps - Number of steps.  Typically 250 for an RC servo.  
**Returns:** null  

```
getPosition(channel, steps)
```
Get the current position of the servo. Due to rounding errors, the returned value may differ from the set value when steps is above 250.  
**Parameter:** channel - 1 to 16  
**Parameter:** steps - Number of steps.  Typically 250 for an RC servo.  
**Returns:** current position  

```
setLowLimit(low_limit, channel)
```
Set the low limit in milliseconds  
**Parameter:** low_limit - Typically 1.0 milliseconds. Setting the value too low may damage your servo.  
**Parameter:** channel - 1 to 16. If the channel is omitted or set as 0 the value will be set for all channels.  
**Returns:** null  

```
setHighLimit(high_limit, channel)
```
Set the low limit in milliseconds  
**Parameter:** high_limit - Typically 2.0 milliseconds. Setting the value too high may damage your servo.  
**Parameter:** channel - 1 to 16. If the channel is omitted or set as 0 the value will be set for all channels.  
**Returns:** null  

```
setPWMFrequency(freq, calibration) 
```
Set the PWM frequency.  For RC servos this should normally be set to 50Hz.  
**Parameter:** freq - Frequency between 40 and 1000  
**Parameter:** calibration - Oscillator calibration offset. Use this to adjust for oscillator drift. Value is normally between -10 and 10  
**Returns:** null  

```
outputDisable()
```
Disable the output via OE pin  
**Parameter:** null  
**Returns:** null  

```
outputEnable()
```
Enable the output via OE pin  
**Parameter:** null  
**Returns:** null  

```
offsetEnable()
```
Enable pulse offsets. This will set servo pulses to be staggered across the channels to reduce surges in the current draw  
**Parameter:** null  
**Returns:** null  

```
offsetDisable()
```
Disable pulse offsets. This will set all servo pulses to start at the same time  
**Parameter:** null  
**Returns:** null  

```
sleep()
```
Put the device into a sleep state  
**Parameter:** null  
**Returns:** null  

```
wake()
```
Wake the device from its sleep state  
**Parameter:** null  
**Returns:** null  

```
isSleeping()
```
Check the sleep status of the device  
**Parameter:** null  
**Returns:** true = sleeping, false = awake  

## Usage

To use the Servo Pi library in your code you must first import the library:
```
var servopi = require('../../lib/servopi/servopi')
```
Next, you must initialise the Servo object.  I2C channel 40, low limit of 1ms, high limit of 2ms and reset enabled.
```
var servo = new Servo(0x40, 1.0, 2.0, true);
```
Set the PWM frequency to 60 Hz with a calibration value of 0 and enable the output
```
servo.setPWMFrequency(60, 0);
servo.outputEnable();
```
Create a positions array and a counter variable
```
var positions = [1, 175, 250];
var count = 0;
```
Create a timer object and move the servo on pin 1 between three points
```
var myTimer = setInterval(clockTimer, 1000);

function clockTimer() {
    // move the servo channel 1 to the three positions
    servo.move(1, positions[count], 250);
    count++;
    if (count >= positions.length) {
        count = 0;
    }
}
```