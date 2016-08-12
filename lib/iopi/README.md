AB Electronics UK IO Pi Node.js Library
=====

Node.js Library to use with IO Pi Raspberry Pi expansion board from https://www.abelectronics.co.uk

Install
====
To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_Python_Libraries.git
```

To download to your Raspberry Pi type in terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The IO Pi library is located in the /lib/iopi/ directory

The example files are located in the /examples/iopi/ directory

The IO Pi library requires the rpio library to run.

Install from https://www.npmjs.com/package/rpio with
```
npm install rpio
```


Functions:
----------

```
setPinDirection(pin, direction):
```
Sets the IO direction for an individual pin  
**Parameters:** pin - 1 to 16, direction - 1 = input, 0 = output  
**Returns:** null

```
setPortDirection(port, direction): 
```
Sets the IO direction for the specified IO port  
**Parameters:** port - 0 = pins 1 to 8, port 1 = pins 9 to 16, direction - 1 = input, 0 = output  
**Returns:** null

```
setPinPullup(pin, value)
```
Set the internal 100K pull-up resistors for an individual pin 
**Parameters:** pin - 1 to 16, value: 1 = Enabled, 0 = Disabled  
**Returns:** null

```
setPortPullups(port, value)
```
Set the internal 100K pull-up resistors for the selected IO port  
**Parameters:** port - 0 or 1, value: 0x00 to 0xFF  
**Returns:** null

```
writePin(pin, value)
```
Write to an individual pin 1 - 16  
**Parameters:** pin - 1 to 16, value - 1 = Enabled, 0 = Disabled
**Returns:** null
```
writePort(self, port, value)
```
Write to all pins on the selected port  
**Parameters:** port - 0 = pins 1 to 8, port 1 = pins 9 to 16, value -  number between 0 and 255 or 0x00 and 0xFF  
**Returns:** null
```
readPin(pin)
```
Read the value of an individual pin 1 - 16   
**Parameters:** pin: 1 to 16  
**Returns:** 0 = logic level low, 1 = logic level high
```
readPort(port)
```
Read all pins on the selected port  
**Parameters:** port - 0 = pins 1 to 8, port 1 = pins 9 to 16  
**Returns:** number between 0 and 255 or 0x00 and 0xFF
```
invertPort(port, polarity)
```
Invert the polarity of the pins on a selected port  
**Parameters:** port - 0 = pins 1 to 8, port 1 = pins 9 to 16, polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
**Returns:** null

```
invertPin(pin, polarity)
```
Invert the polarity of the selected pin  
**Parameters:** pin - 1 to 16, polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
**Returns:** null
```
mirrorInterrupts(value)
```
Mirror Interrupts  
**Parameters:** value - 1 = The INT pins are internally connected, 0 = The INT pins are not connected. INTA is associated with PortA and INTB is associated with PortB  
**Returns:** null
```
setInterruptType(port, value)
```
Sets the type of interrupt for each pin on the selected port  
**Parameters:** port 0 = pins 1 to 8, port 1 = pins 9 to 16, value: 1 = interrupt is fired when the pin matches the default value, 0 = the interrupt is fired on state change  
**Returns:** null
```

```
setInterruptPolarity(value)
```
This sets the polarity of the INT output pins
**Parameters:** 1 = Active-high, 0 = Active-low
**Returns:** null
```

setInterruptDefaults(port, value)
```
These bits set the compare value for pins configured for interrupt-on-change on the selected port.  
If the associated pin level is the opposite from the register bit, an interrupt occurs.    
**Parameters:** port 0 = pins 1 to 8, port 1 = pins 9 to 16, value: compare value  
**Returns:** null
```
setInterruptOnPort(port, value)
```
Enable interrupts for the pins on the selected port  
**Parameters:** port 0 = pins 1 to 8, port 1 = pins 9 to 16, value: number between 0 and 255 or 0x00 and 0xFF  
**Returns:** null

```
setInterruptOnPin(pin, value)
```
Enable interrupts for the selected pin  
**Parameters:** pin - 1 to 16, value - 0 = interrupt disabled, 1 = interrupt enabled  
**Returns:** null

```
readInterruptStatus(port)
```
Read the interrupt status for the pins on the selected port  
**Parameters:** port 0 = pins 1 to 8, port 1 = pins 9 to 16  
**Returns:** status

```
readInterruptCapture(port)
```
Read the value from the selected port at the time of the last interrupt trigger  
**Parameters:** port 0 = pins 1 to 8, port 1 = pins 9 to 16  
**Returns:** status
```
resetInterrupts()
```
Set the interrupts A and B to 0  
**Parameters:** null  
**Returns:** null
Usage
====
To use the IO Pi library in your code you must first import the library:
```
var iopi = require('../../lib/iopi/iopi');
```

Next you must initialise the IO object

```
var bus1 = new IoPi(0x20);
```

We will read the inputs 1 to 8 from bus 1 so set port 0 to be inputs and enable the internal pull-up resistors 

```
bus1.setPortDirection(0, 0xFF);
bus1.setPortPullups(0, 0xFF);
```

You can now read the pin 1 with:
```
console.log('Pin 1: %d', bus1.readPin(1));
```
