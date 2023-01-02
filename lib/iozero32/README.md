# AB Electronics UK IO Zero 32 Node.js Library


Node.js Library to use with IO Zero 32 Raspberry Pi expansion board from https://www.abelectronics.co.uk

## Install

To download to your Raspberry Pi type in the terminal: 

```
git clone https://github.com/abelectronicsuk/ABElectronics_NodeJS_Libraries.git
```
The IO Zero 32 library is located in the /lib/iozero32/ directory

The example files are located in the /examples/iozero32/ directory

The IO Zero 32 library requires the rpio library to run.

Install from https://www.npmjs.com/package/rpio with
```
npm install rpio
```

___
Classes:
----------  
```
IOZero32(address)
```
**Parameters:**  
address: (number) i2c address for the target device. 0x20 to 0x27  

  
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
setPinPolarity(pin, polarity)
```
Set the polarity of the selected pin  
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
setPortPolarity(port, polarity)
```
Set the polarity of the pins on a selected port  
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
setBusPolarity(polarity)
```
Set the polarity of the pins on the bus  
**Parameters:**  
polarity: (number) 16-bit number 0 to 65535 (0xFFFF).  For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  
**Returns:** null  
___
```
getBusPolarity()
```
Get the polarity of the pins on the bus  
**Returns:** (number) 16-bit number 0 to 65535 (0xFFFF). For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin  


## Usage

To use the IO Zero 32 library in your code you must first import the library:
```
var IOZero32 = require('../../lib/iozero32/iozero32');
```

Next, you must initialise the IOZero32 object

```
var bus1 = new IOZero32(0x20);
```

We will read the inputs 1 to 8 from bus 1 so set port 0 to be inputs  

```
bus1.setPortDirection(0, 0xFF);
```

You can now read pin 1 with:
```
console.log('Pin 1: %d', bus1.readPin(1));
```
