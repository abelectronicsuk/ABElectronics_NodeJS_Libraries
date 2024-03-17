/** 
*
* AB Electronics UK IO Pi 32- Channel Port Expander
* For use with the IO Pi, IO Pi Plus and IO Pi Zero
* Version 1.0 Created 06/ 07 / 2016
* Version 1.1 Updated 16/ 03 / 2024
* Requires i2c-bus to be installed, install with: npm install i2c-bus
* ================================================
* Each MCP23017 chip is split into two 8-bit ports.  port 0 controls
* pins 1 to 8 while port 1 controls pins 9 to 16.
* When writing to or reading from a port the least significant bit represents
* the lowest numbered pin on the selected port.
*
*/

const busnumber = 1; // The number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...

const TESTMODE = false; // used for unit tests

if (TESTMODE){
    var ut = require('../../unittests/unittests');
    var unittest = new UnitTests();
}
else{
    var i2c = require('i2c-bus');
}



/** 
 * IO Pi Class
 */
IoPi = (function () {
    // Define registers values from the datasheet
    const IODIRA = 0x00;  // IO direction A - 1= input 0 = output
    const IODIRB = 0x01;  // IO direction B - 1= input 0 = output
    // Input polarity A - If a bit is set, the corresponding GPIO register bit will reflect the inverted value on the pin.
    const IPOLA = 0x02;
    // Input polarity B - If a bit is set, the corresponding GPIO register bit will reflect the inverted value on the pin.
    const IPOLB = 0x03;
    // The GPINTEN register controls the interrupt-on-change feature for each pin on port A.
    const GPINTENA = 0x04;
    // The GPINTEN register controls the interrupt-on-change feature for each pin on port B.
    const GPINTENB = 0x05;
    // Default value for port A - These bits set the compare value for pins configured for interrupt-on-change.
    // If the associated pin level is the opposite of the register bit, an interrupt occurs.
    const DEFVALA = 0x06;
    // Default value for port B - These bits set the compare value for pins configured for interrupt-on-change. If the associated pin level is the
    // opposite from the register bit, an interrupt occurs.
    const DEFVALB = 0x07;
    // Interrupt control register for port A.  If 1 interrupt is fired when the pin matches the default value, if 0 the interrupt is fired on state change
    const INTCONA = 0x08;
    // Interrupt control register for port B.  If 1 interrupt is fired when the pin matches the default value, if 0 the interrupt is fired on state change
    const INTCONB = 0x09;
    const IOCON = 0x0A;  // see datasheet for configuration register
    const GPPUA = 0x0C;  // pull-up resistors for port A
    const GPPUB = 0x0D; // pull-up resistors for port B
    // The INTF register reflects the interrupt condition on the port A pins of any pin that is enabled for interrupts. A set bit indicates that the
    // associated pin caused the interrupt event.
    const INTFA = 0x0E;
    // The INTF register reflects the interrupt condition on the port B pins of any pin that is enabled for interrupts. A set bit indicates that the
    // associated pin caused the interrupt event.
    const INTFB = 0x0F;
    // The INTCAP register captures the GPIO port A value at the time the interrupt occurred.
    const INTCAPA = 0x10;
    // The INTCAP register captures the GPIO port B value at the time the interrupt occurred.
    const INTCAPB = 0x11;
    const GPIOA = 0x12;  // Data port A
    const GPIOB = 0x13;  // Data port B
    const OLATA = 0x14;  // Output latches A
    const OLATB = 0x15; // Output latches B

    // variables

    // initial configuration - see the IOCON page in the MCP23017 datasheet for more information.
    IoPi.prototype.config = 0x02;
    IoPi.prototype.i2caddress = 0x00;

    /**
     * Initialize the I2C bus based on the supplied address
     * Load the default configuration, all pins are inputs with pull-ups disabled
     * @param  {number} address - I2C address for MCP23017 device, 0x20 to 0x27. Default is 0x20 or 0x21
     * @param  {boolean} initialise (optional) - true = direction set as inputs, pull-ups disabled, ports not inverted.
                                      false = device state unaltered.
                                      Defaults to true
     */
    function IoPi(address, initialise=true) {
        if (address < 0x20 || address > 0x27) {
            throw new Error("i2c address out of range: 20 to 27");
        }

        this.i2caddress = address;       
        i2cWriteByte(address,IOCON, this.config);
        if (initialise){
            this.setBusDirection(0xFFFF)
            this.setBusPullups(0x00);
            this.invertBus(0x00);
        }
    }

    /**
     * private functions
    */

    function i2cReadByte(adr, register) {   
        if (TESTMODE){
            return unittest.i2c_emulator_read_byte_data(register);
        }
        else{
            const i2c1 = i2c.openSync(busnumber);
            const rxdata = i2c1.readByteSync(adr, register);
            i2c1.closeSync();

            return rxdata;
        }
    }

    function i2cWriteByte(adr, register, val) {
        if (TESTMODE){
            unittest.i2c_emulator_write_byte_data(register, val);
        }
        else{
            const i2c1 = i2c.openSync(busnumber);
            i2c1.writeByteSync(adr, register, val);
            i2c1.closeSync();            
        }
    }

    function updateByte(oldByte, bit, value) {
        var newByte = 0;
        if (value == false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return (newByte);
    }

    function checkBit(num, bit) {
        return ((num >> bit) % 2 != 0);
    }

    IoPi.prototype.setPin = function(pin, value, a_register, b_register) {
        /**
        * private method for setting the value of a single bit within the device registers
        */
        var reg = 0;
        var p = 0;
        if (pin >= 1 && pin <= 8) {
            reg = a_register;
            p = pin - 1;
        }
        else if (pin >= 9 && pin <= 16) {
            reg = b_register;
            p = pin - 9;
        }
        else {
            throw new Error("pin out of range: 1 to 16");
        }

        if (value > 1) {
            throw new Error("value out of range: 0 or 1");
        }

        var newval = updateByte(i2cReadByte(this.i2caddress, reg), p, value);
        i2cWriteByte(this.i2caddress, reg, newval);
    };

    IoPi.prototype.getPin = function(pin, a_register, b_register) {
        /**
        * private method for getting the value of a single bit within the device registers
        */

        var value = 0;

        if (pin >= 1 && pin <= 8) {
            value = checkBit(i2cReadByte(this.i2caddress, a_register), pin - 1);
        }
        else if (pin >= 9 && pin <= 16) {
            value = checkBit(i2cReadByte(this.i2caddress, b_register), pin - 9);
        }
        else {
            throw new Error("pin out of range: 1 to 16");
        }

        return value;
    };

    IoPi.prototype.setPort = function(port, value, a_register, b_register) {
        /**
        * private method for setting the value of a device register
        */
        if (port == 0) {
            i2cWriteByte(this.i2caddress, a_register, value);
        }
        else if (port == 1) {
            i2cWriteByte(this.i2caddress, b_register, value);
        }
        else {
            throw new Error("port out of range: 0 or 1");
        }
    };

    IoPi.prototype.getPort = function(port, a_register, b_register) {
        /**
        * private method for getting the value of a device register
        */
        if (port == 0) {
            return i2cReadByte(this.i2caddress, a_register);
        }
        else if (port == 1) {
            return i2cReadByte(this.i2caddress, b_register);
        }
        else {
            throw new Error("port out of range: 0 or 1");
        }
    };

    IoPi.prototype.setBus = function(value, register) {
        /**
        * private method for writing a 16-bit value to two consecutive device registers
        */
        if (TESTMODE){            
            unittest.i2c_emulator_write_word_data(register, value);
        }
        else{
            const i2c1 = i2c.openSync(busnumber);
            i2c1.writeWordSync(this.i2caddress, register, value);
            i2c1.closeSync();
            /*
            i2c.i2cBegin();
            i2c.i2cSetSlaveAddress(this.i2caddress);

            var txbuf = Buffer.from([register, value & (0xff), (value >> 8) & 0xff]);

            i2c.i2cWrite(txbuf);
            i2c.i2cEnd();
            */
        }
    };

    IoPi.prototype.getBus = function(register) {
        /**
        * private method for reading a 16-bit value from two consecutive device registers
        */
        if (TESTMODE){
            return unittest.i2c_emulator_read_word_data(register);
        }
        else{

            /*
            i2c.i2cBegin();
            i2c.i2cSetSlaveAddress(this.i2caddress);

            var txbuf = Buffer.from([register]);
            var rxbuf = Buffer.alloc(2);
            
            i2c.i2cWrite(txbuf);
            i2c.i2cRead(rxbuf, 2);
            i2c.i2cEnd();
            */
        
            const i2c1 = i2c.openSync(busnumber);
            const rxdata = i2c1.readWordSync(this.i2caddress, register);
            i2c1.closeSync();

            return rxdata;
            
            //return (rxbuf[1] << 8) | rxbuf[0];
        }
    };    

    /**
     * public functions
    */

    /**
     * Set IO direction for an individual pin
     * @param  {number} pin - 1 to 16
     * @param  {number} direction - 1 = input, 0 = output
     */
    IoPi.prototype.setPinDirection = function (pin, direction) {
        this.setPin(pin, direction, IODIRA, IODIRB);
    };

    /**
     * Get IO direction for an individual pin
     * @param  {number} pin - 1 to 16
     */
     IoPi.prototype.getPinDirection = function (pin) {
        return this.getPin(pin, IODIRA, IODIRB);
    };

    /**
     * Set direction for an IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
     * @param  {number} direction - 0 to 255. For each bit 1 = input, 0 = output
     */
    IoPi.prototype.setPortDirection = function (port, direction) {
        this.setPort(port, direction, IODIRA, IODIRB);        
    };

    /**
     * Get the direction for an IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
     */
     IoPi.prototype.getPortDirection = function (port) {
        return this.getPort(port, IODIRA, IODIRB);        
    };

    /**
     * Set the direction for the IO bus
     * @param  {number} direction - 0 to 65535. For each bit 1 = input, 0 = output
     */
     IoPi.prototype.setBusDirection = function (direction) {
        this.setBus(direction, IODIRA);        
    };

    /**
     * Get the direction for the IO bus
     */
     IoPi.prototype.getBusDirection = function () {
        return this.getBus(IODIRA);        
    };

    /**
     * Set the internal 100K pull-up resistors for an individual pin
     * @param  {number} pin - 1 to 16
     * @param  {number} value - 1 = enabled, 0 = disabled
     */
    IoPi.prototype.setPinPullup = function (pin, value) {
        this.setPin(pin, value, GPPUA, GPPUB);
    };

    /**
     * Get the state for the internal 100K pull-up resistor for an individual pin
     * @param  {number} pin - 1 to 16
     */
    IoPi.prototype.getPinPullup = function (pin) {
        return this.getPin(pin, GPPUA, GPPUB);
    };

    /**
     * Set the internal 100K pull-up resistors for the selected IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
     * @param  {number} value - 0 to 255. For each bit 1 = enabled, 0 = disabled
     */
    IoPi.prototype.setPortPullups = function (port, value) {
        this.setPort(port, value, GPPUA, GPPUB);
    };

    /**
     * Get the internal 100K pull-up resistors for the selected IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
     */
     IoPi.prototype.getPortPullups = function (port) {
        return this.getPort(port, GPPUA, GPPUB);
    };

    /**
     * Set internal 100K pull-up resistors for the IO bus
     * @param  {number} direction - 0 to 65535. For each bit 1 = enabled, 0 = disabled
     */
     IoPi.prototype.setBusPullups = function (direction) {
        this.setBus(direction, GPPUA);        
    };

    /**
     * Get the state of the internal 100K pull-up resistors on the IO bus
     */
     IoPi.prototype.getBusPullups = function () {
        return this.getBus(GPPUA);        
    };

    /**
    * Write to an individual pin
    * @param  {number} pin - 1 to 16
    * @param  {number} value - 1 = enabled, 0 = disabled
    */
    IoPi.prototype.writePin = function (pin, value) {
        this.setPin(pin, value, GPIOA, GPIOB);
    };

    /**
     * Write to all pins on the selected port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
     * @param  {number} value - number between 0 and 255 or 0x00 and 0xFF
     */
    IoPi.prototype.writePort = function (port, value) {
        this.setPort(port, value, GPIOA, GPIOB);
    };

    /**
	* Write to all pins on the selected bus
	* @param  {number} value - 0 to 65535 (0xFFFF). For each bit 1 = enabled, 0 = disabled
	*/
    IoPi.prototype.writeBus = function (value) {
        this.setBus(value, GPIOA);
    };

    /**
     * read the value of an individual pin 1 - 16
     * @param  {number} pin - 1 to 16
     * @returns {number} - 0 = logic level low, 1 = logic level high
     */
    IoPi.prototype.readPin = function (pin) {
        return this.getPin(pin, GPIOA, GPIOB);
    };

    /**
     * Read all pins on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @returns {number} - number between 0 and 255 or 0x00 and 0xFF
     */
    IoPi.prototype.readPort = function (port) {
        return this.getPort(port, GPIOA, GPIOB);
    };

    /**
	* Read all pins on the bus
	* @returns {number} 0 to 65535 (0xFFFF). For each bit 1 = logic high, 0 = logic low
	*/
    IoPi.prototype.readBus = function () {
        return this.getBus(GPIOA);
    };

    /**
     * Invert the polarity of the selected pin
     * @param  {number} pin - 1 to 16
     * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
     */
    IoPi.prototype.invertPin = function (pin, polarity) {
        this.setPin(pin, polarity, IPOLA, IPOLB);
    };

    /**
  	* Get the polarity of the selected pin
  	* @param  {number} pin - 1 to 16
  	*/
    IoPi.prototype.getPinPolarity = function (pin) {
        return this.getPin(pin, IPOLA, IPOLB);
    };

    /**
     * Invert the polarity of the pins on a selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
     */
    IoPi.prototype.invertPort = function (port, polarity) {
        this.setPort(port, polarity, IPOLA, IPOLB);
    };

    /**
  	* Get the polarity of the selected port
  	* @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
  	*/
      IoPi.prototype.getPortPolarity = function (port) {
        return this.getPort(port, IPOLA, IPOLB);
    };

    /**
     * Invert the polarity of the pins on the bus
     * @param  {number} 0 to 65535 (0xFFFF). For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin

     */
     IoPi.prototype.invertBus = function (polarity) {
        this.setBus(polarity, IPOLA);
    };

    /**
  	* Get the polarity of the bus
  	*/
      IoPi.prototype.getBusPolarity = function () {
        return this.getBus(IPOLA);
    };
    

    /**
     * Mirror interrupts across INTA and INTB
     * @param  {number} value - 1 = The INT pins are internally connected, 0 = The INT pins are not connected. INTA is associated with PortA and INTB is associated with PortB
     */
    IoPi.prototype.mirrorInterrupts = function (value) {
        if (value == 0) {
            this.config = updateByte(i2cReadByte(this.i2caddress, IOCON), 6, 0);
            i2cWriteByte(this.i2caddress, IOCON, this.config);
        }
        else if (value == 1) {
            this.config = updateByte(i2cReadByte(this.i2caddress, IOCON), 6, 1);
            i2cWriteByte(this.i2caddress, IOCON, this.config);
        }
        else{
            throw new Error("mirrorInterrupts value out of range: 0 or 1");
        }
    };

    /**
     * This sets the polarity of the INT output pins
     * @param  {number} value - 1 = Active-high. 0 = Active-low.
     */
    IoPi.prototype.setInterruptPolarity = function (value) {
        if (value == 0) {

            this.config = updateByte(i2cReadByte(this.i2caddress, IOCON), 1, 0);
            i2cWriteByte(this.i2caddress, IOCON, this.config);
        }
        else if (value == 1) {
            this.config = updateByte(i2cReadByte(this.i2caddress, IOCON), 1, 1);
            i2cWriteByte(this.i2caddress, IOCON, this.config);
        }
        else{
            throw new Error("setInterruptPolarity value out of range: 0 or 1");
        }
    };

    /**
     * Gets the polarity of the INT output pins
     * @returns  {number} value - 1 = Active-high. 0 = Active-low.
     */
     IoPi.prototype.getInterruptPolarity = function (value) {
        return checkBit(i2cReadByte(this.i2caddress, IOCON), 1);
     };

    /**
     * Sets the type of interrupt for each pin on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @param  {number} value - 0 to 255.  For each bit 1 = interrupt is fired when the pin matches the default value, 0 = the interrupt is fired on state change.
     */
    IoPi.prototype.setInterruptType = function (port, value) {
        this.setPort(port, value, INTCONA, INTCONB);
    };

    /**
     * Gets the type of interrupt for each pin on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     */
     IoPi.prototype.getInterruptType = function (port) {
        return this.getPort(port, INTCONA, INTCONB);
    };

    /**
     * These bits set the compare value for pins configured for interrupt-on-change on the selected port.
     * If the associated pin level is the opposite of the register bit, an interrupt occurs.
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @param  {number} value - 0 to 255 or 0x00 and 0xFF
     */
    IoPi.prototype.setInterruptDefaults = function (port, value) {
        this.setPort(port, value, DEFVALA, DEFVALB);
    };

    /**
     * Get the interrupt default state.
     * These bits set the compare value for pins configured for interrupt-on-change on the selected port.
     * If the associated pin level is the opposite of the register bit, an interrupt occurs.
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     */
     IoPi.prototype.getInterruptDefaults = function (port) {
        return this.getPort(port, DEFVALA, DEFVALB);
    };

    /**
	* Enable interrupts for the selected pin
	* @param pin - 1 to 16
	* @param value - 0 = interrupt disabled, 1 = interrupt enabled
	*/
    IoPi.prototype.setInterruptOnPin = function (pin, value) {
        this.setPin(pin, value, GPINTENA, GPINTENB);
    };

    /**
	* Get the interrupt-enable status for the selected pin
	* @param pin - 1 to 16
	*/
    IoPi.prototype.getInterruptOnPin = function (pin) {
        return this.getPin(pin, GPINTENA, GPINTENB);
    };

    /**
     * Enable interrupts for the pins on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @param  {number} value - 0 and 255 or 0x00 and 0xFF
     */
    IoPi.prototype.setInterruptOnPort = function (port, value) {
        this.setPort(port, value, GPINTENA, GPINTENB);
    };

    /**
     * Get the interrupt-enable status for the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     */
     IoPi.prototype.getInterruptOnPort = function (port) {
        return this.getPort(port, GPINTENA, GPINTENB);
    };

    /**
     * Enable interrupts for the pins on the bus
     * @param {number} value - 0 to 65535 (0xFFFF). For each bit 0 = interrupt disabled, 1 = interrupt enabled
     */
     IoPi.prototype.setInterruptOnBus = function (value) {
        this.setBus(value, GPINTENA);
    };

    /**
     * Get the interrupt-enable status for the bus
     * @returns {number} 0 to 65535 (0xFFFF). For each bit 0 = interrupt disabled, 1 = interrupt enabled
     */
     IoPi.prototype.getInterruptOnBus = function () {
        return this.getBus(GPINTENA);
    };

    /**
     * Read the interrupt status for the pins on the selected port
     * @param  {number} port - 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @returns  {number} - 0 to 255. Interrupt status, each pin represents one bit.
     */
    IoPi.prototype.readInterruptStatus = function (port) {
        return this.getPort(port, INTFA, INTFB);
    };

    /**
     * Read the value from the selected port at the time of the last interrupt trigger
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @returns  {number} - 0 to 255. Interrupt status, each pin represents one bit.
     */
    IoPi.prototype.readInterruptCapture = function (port) {
        return this.getPort(port, INTCAPA, INTCAPB);
    };

    /**
     * Set the interrupts A and B to 0
     */
    IoPi.prototype.resetInterrupts = function () {
        this.readInterruptCapture(0);
        this.readInterruptCapture(1);
    };

    return IoPi;

})();

module.exports = IoPi;
