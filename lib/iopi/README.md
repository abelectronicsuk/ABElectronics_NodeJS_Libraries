# AB Electronics UK IO Pi Node.js Library


Node.js Library to use with IO Pi Raspberry Pi expansion board from https://www.abelectronics.co.uk

**Note:** Microchip recommends that pin 8 (GPA7) and pin 16 (GPB7) are used as outputs only.  This change was made for revision D MCP23017 chips manufactured after June 2020. See the [MCP23017 datasheet](https://www.abelectronics.co.uk/docs/pdf/microchip-mcp23017.pdf) for more information.

## Install

To download to your Raspberry Pi type in the terminal: 

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

Classes:
----------  
```
IoPi(address, initialise)
```
**Parameters:**  
address: (number) i2c address for the target device. 0x20 to 0x27  
initialise (optional): (boolean) true = direction set as inputs, pull-ups disabled, ports not inverted. false = device state unaltered. defaults to true  


Functions:
----------

___
```
setPinDirection(pin, direction):
```
Sets the IO direction for an individual pin  
**Parameters:**  
pin: (number) 1 to 16   
direction: (number) 1 = input, 0 = output  
**Returns:** null
___
```
getPinDirection(pin)
```  
Get the IO direction for an individual pin  
**Parameters:**  
pin: (number) pin to read, 1 to 16   
**Returns:** (number) 1 = input, 0 = output  
___
```
setPortDirection(port, direction): 
```
Sets the IO direction for the specified IO port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
direction: (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = input, 0 = output  
**Returns:** null
___
```
getPortDirection(port): 
```
Get the direction from an IO port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) between 0 and 255 (0xFF)  
___
```
setBusDirection(direction): 
```
Sets the IO direction for all pins on the bus  
**Parameters:**  
direction: (number) 16-bit number 0 to 65535 (0xFFFF).  For each bit 1 = input, 0 = output  
**Returns:** null
___
```
getBusDirection()
```
Get the direction for an IO bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 1 = input, 0 = output  
___
```
setPinPullup(pin, value)
```
Set the internal 100K pull-up resistors for an individual pin  
**Parameters:**  
pin: (number) pin to update, 1 to 16 
value: (number) 1 = enabled, 0 = disabled  
**Returns:** null
___
```
getPinPullup(pin)
```  
Get the internal 100K pull-up resistors for an individual pin  
**Parameters:**  
pin: (number) pin to read, 1 to 16  
**Returns:** (number) 1 = enabled, 0 = disabled  
___
```
setPortPullups(port, value)
```
Set the internal 100K pull-up resistors for the selected IO port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
value: (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = Enabled, 0 = Disabled  
**Returns:** null  
___
```
getPortPullups(port): 
```
Get the internal pull-up status for the selected IO port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) between 0 and 255 (0xFF)  
___
```
setBusPullups(value)
```
Set internal 100K pull-up resistors for an IO bus  
**Parameters:**  
value: (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 1 = enabled, 0 = disabled  
**Returns:** null
___
```
getBusPullups()
```
Get the internal 100K pull-up resistors for an IO bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 1 = enabled, 0 = disabled  
___
```
writePin(pin, value)
```
Write to an individual pin 1 - 16  
**Parameters:**  
pin: (number) 1 to 16  
value: (number) 1 = logic high, 0 = logic low  
**Returns:** null  
___
```
writePort(port, value)
```
Write to all pins on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
value:  (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = logic high, 0 = logic low    
**Returns:** null  
___
```
writeBus(value)
```
Write to all pins on the selected bus  
**Parameters:**  
value: (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 1 = logic high, 0 = logic low  
**Returns:** null  
___
```
readPin(pin)
```
Read the value of an individual pin 1 - 16   
**Parameters:**  
pin: (number) 1 to 16  
**Returns:** (uint8_t) 0 = logic low, 1 = logic high  
___
```
readPort(port)
```
Read all pins on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
**Returns:** (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  0 = logic low, 1 = logic high
___
```
readBus()
```
Read all pins on the bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF) Each bit in the 16-bit number represents a pin on the port.  0 = logic low, 1 = logic high  
___
```
invertPin(pin, polarity)
```
Invert the polarity of the selected pin  
**Parameters:**  
pin: (number) 1 to 16  
polarity: (number) 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
**Returns:** null
___
```
getPinPolarity(pin)
```  
Get the polarity of the selected pin  
**Parameters:**  
pin: (number) pin to read, 1 to 16   
**Returns:** (number) 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
___
```
invertPort(port, polarity)
```
Invert the polarity of the pins on a selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
polarity: (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
**Returns:** null
___
```
getPortPolarity(port): 
```
Get the polarity for the selected IO port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) between 0 and 255 (0xFF) 
___
```
invertBus(polarity)
```
Invert the polarity of the pins on the bus  
**Parameters:**  
polarity: (number) 16-bit number 0 to 65535 (0xFFFF).  For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
**Returns:** null  
___
```
getBusPolarity()
```
Get the polarity of the pins on the bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
___
```
mirrorInterrupts(value)
```
Sets whether the interrupt pins INT A and INT B are independently connected to each port or internally connected  
**Parameters:**  
value: (number) 1 = The INT pins are internally connected, 0 = The INT pins are not connected. INT A is associated with PortA and INT B is associated with PortB    
**Returns:** null
___
```
setInterruptPolarity(value)
```
Sets the polarity of the INT output pins  
**Parameters:**  
value: (number) 0 = Active Low, 1 = Active High  
**Returns:** null  
___
```
getInterruptPolarity()
```
Get the polarity of the INT output pins  
**Returns:** (number) 1 = Active-high.  0 = Active-low.  
___
```
setInterruptType(port, value)
```
Sets the type of interrupt for each pin on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
value: (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = interrupt is fired when the pin matches the default value, 0 = the interrupt is fired on state change  
**Returns:** null  
___
```
getInterruptType(port): 
```
Get the type of interrupt for each pin on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) between 0 and 255 (0xFF)  
For each bit 1 = interrupt is fired when the pin matches the default value, 0 = interrupt fires on state change  
___
```
setInterruptDefaults(port, value)
```
These bits set the compare value for pins configured for interrupt-on-change on the selected port.  
If the associated pin level is the opposite of the register bit, an interrupt occurs.    
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
value: (number) compare value between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  
**Returns:** null  
___
```
getInterruptDefaults(port): 
```
Get the interrupt default value for each pin on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) number between 0 and 255 (0xFF)  
___
```
setInterruptOnPin(pin, value)
```
Enable interrupts for the selected pin  
**Parameters:**  
pin: (number) 1 to 16  
value: (number) 0 = interrupt disabled, 1 = interrupt enabled  
**Returns:** null
___
```
getInterruptOnPin(pin)
```  
Gets whether the interrupt is enabled for the selected pin  
**Parameters:**  
pin: (number) pin to read, 1 to 16   
**Returns:** (number) 1 = enabled, 0 = disabled
___
```
setInterruptOnPort(port, value)
```
Enable interrupts for the pins on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
value: (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  
**Returns:** null
___
```
getInterruptOnPort(port): 
```
Gets whether the interrupts are enabled for the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16   
**Returns:** (number) between 0 and 255 (0xFF).  For each bit 1 = enabled, 0 = disabled  
___
```
setInterruptOnBus(value)
```
Enable interrupts for the pins on the bus  
**Parameters:**  
value: (number) 16-bit number 0 to 65535 (0xFFFF).  For each bit 1 = enabled, 0 = disabled  
**Returns:** null
___
```
getInterruptOnBus()
```
Gets whether the interrupts are enabled for the bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 1 = enabled, 0 = disabled  
___
```
readInterruptStatus(port)
```
Read the interrupt status for the pins on the selected port  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
**Returns:**  (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = Enabled, 0 = Disabled
___
```
readInterruptCapture(port)
```
Read the value from the selected port at the time of the last interrupt trigger  
**Parameters:**  
port: (number) 0 = pins 1 to 8, 1 = pins 9 to 16  
**Returns:**  (number) between 0 and 255 or 0x00 and 0xFF.  Each bit in the 8-bit number represents a pin on the port.  1 = Enabled, 0 = Disabled
___
```
resetInterrupts()
```
Set the interrupts A and B to 0  
**Parameters:** null  
**Returns:** null

Usage
----------

To use the IO Pi library in your code you must first import the library:
```
var iopi = require('../../lib/iopi/iopi');
```

Next, you must initialise the IO object

```
var bus1 = new IoPi(0x20);
```

We will read the inputs 1 to 8 from bus 1 so set port 0 as inputs and enable the internal pull-up resistors 

```
bus1.setPortDirection(0, 0xFF);
bus1.setPortPullups(0, 0xFF);
```

You can now read pin 1 with:
```
console.log('Pin 1: %d', bus1.readPin(1));
```
