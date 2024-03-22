/** 
*
* AB Electronics UK - IO Zero 32 - 32 Channel Port Expander
* For use with the IO Zero 32
* Version 1.0 Created 09/05/2022
* Version 1.1 Updated 22/03/2024
*
* Requires i2c-bus to be installed, install with: npm install i2c-bus
* ================================================
* Each PCA9535 chip is split into two 8-bit ports.  port 0 controls
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
 * IO Zero 32 Class
 */
IOZero32 = (function () {
    // Define registers values from the datasheet
    const INPUTPORT0 = 0x00; // Command byte Input port 0
    const INPUTPORT1 = 0x01; // Command byte Input port 1
    const OUTPUTPORT0 = 0x02; // Command byte Output port 0
    const OUTPUTPORT1 = 0x03; // Command byte Output port 1
    const INVERTPORT0 = 0x04; // Command byte Polarity Inversion port 0
    const INVERTPORT1 = 0x05; // Command byte Polarity Inversion port 1
    const CONFIGPORT0 = 0x06; // Command byte Configuration port 0
    const CONFIGPORT1 = 0x07; // Command byte Configuration port 1

    // variables
    IOZero32.prototype.i2caddress = 0x00;

    /**
     * Initialize the I2C bus based on the supplied address
     * Load the default configuration, all pins are inputs with pull-ups disabled
     * @param  {number} address - I2C address for device. Default is 0x20 or 0x21
     */
    function IOZero32(address) {
        if (address < 0x20 || address > 0x27) {
            throw new Error("i2c address out of range: 20 to 27");
        }

        this.i2caddress = address;
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
        let newByte = 0;
        if (value === false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return (newByte);
    }

    function checkBit(num, bit) {
        return (num >> bit) & 1;
    }

    IOZero32.prototype.setPin = function (pin, value, a_register, b_register) {
        /**
         * private method for setting the value of a single bit within the device registers
         */
        let reg = 0;
        let p = 0;
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

        const new_value = updateByte(i2cReadByte(this.i2caddress, reg), p, value);
        i2cWriteByte(this.i2caddress, reg, new_value);
    };

    IOZero32.prototype.getPin = function (pin, a_register, b_register) {
        /**
         * private method for getting the value of a single bit within the device registers
         */
        let value = 0;

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

    IOZero32.prototype.setPort = function (port, value, a_register, b_register) {
        /**
        * private method for setting the value of a device register
        */
        if (port === 0) {
            i2cWriteByte(this.i2caddress, a_register, value);
        }
        else if (port === 1) {
            i2cWriteByte(this.i2caddress, b_register, value);
        }
        else {
            throw new Error("port out of range: 0 or 1");
        }
    };

    IOZero32.prototype.getPort = function (port, a_register, b_register) {
        /**
        * private method for getting the value of a device register
        */
        if (port === 0) {
            return i2cReadByte(this.i2caddress, a_register);
        }
        else if (port === 1) {
            return i2cReadByte(this.i2caddress, b_register);
        }
        else {
            throw new Error("port out of range: 0 or 1");
        }
    };

    IOZero32.prototype.setBus = function (value, register) {
        /**
        * private method for writing a 16-bit value to two consecutive device registers
        */
        if (TESTMODE) {
            unittest.i2c_emulator_write_word_data(register, value);
        }
        else{
            const i2c1 = i2c.openSync(busnumber);
            i2c1.writeWordSync(this.i2caddress, register, value);
            i2c1.closeSync();
        }
    };

    IOZero32.prototype.getBus = function (register) {
        /**
        * private method for reading a 16-bit value from two consecutive device registers
        */
        if (TESTMODE) {
            return unittest.i2c_emulator_read_word_data(register);
        }
        else{
            const i2c1 = i2c.openSync(busnumber);
            const rxdata = i2c1.readWordSync(this.i2caddress, register);
            i2c1.closeSync();

            return rxdata;
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
    IOZero32.prototype.setPinDirection = function (pin, direction) {
        this.setPin(pin, direction, CONFIGPORT0, CONFIGPORT1);
    };

    /**
    * Get IO direction for an individual pin
    * @param  {number} pin - 1 to 16
    */
    IOZero32.prototype.getPinDirection = function (pin) {
        return this.getPin(pin, CONFIGPORT0, CONFIGPORT1);
    };

    /**
     * Set direction for an IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 8 to 16
     * @param  {number} direction - 0 to 255. For each bit 1 = input, 0 = output
     */
    IOZero32.prototype.setPortDirection = function (port, direction) {
        this.setPort(port, direction, CONFIGPORT0, CONFIGPORT1);
    };

    /**
    * Get the direction for an IO port
    * @param  {number} port - 0 = pins 1 to 8, 1 = pins 9 to 16
    */
    IOZero32.prototype.getPortDirection = function (port) {
        return this.getPort(port, CONFIGPORT0, CONFIGPORT1);
    };

    /**
    * Set the direction for the IO bus
    * @param  {number} direction - 0 to 65535. For each bit 1 = input, 0 = output
    */
    IOZero32.prototype.setBusDirection = function (direction) {
        this.setBus(direction, CONFIGPORT0);
    };

    /**
    * Get the direction for the IO bus
    */
    IOZero32.prototype.getBusDirection = function () {
        return this.getBus(CONFIGPORT0);
    };

    /**
    * Write to an individual pin
    * @param  {number} pin - 1 to 16
    * @param  {number} value - 1 = enabled, 0 = disabled
    */
    IOZero32.prototype.writePin = function (pin, value) {
        this.setPin(pin, value, OUTPUTPORT0, OUTPUTPORT1);
    };

    /**
    * Write to all pins on the selected port
    * @param  {number} port - 0 = pins 1 to 8, 1 = pins 8 to 16
    * @param  {number} value - number between 0 and 255 or 0x00 and 0xFF
    */
    IOZero32.prototype.writePort = function (port, value) {
        this.setPort(port, value, OUTPUTPORT0, OUTPUTPORT1);
    };

    /**
    * Write to all pins on the selected bus
    * @param  {number} value - 0 to 65535 (0xFFFF). For each bit 1 = enabled, 0 = disabled
    */
    IOZero32.prototype.writeBus = function (value) {
        this.setBus(value, OUTPUTPORT0);
    };

    /**
    * read the value of an individual pin 1 - 16
    * @param  {number} pin - 1 to 16
    * @returns {number} - 0 = logic level low, 1 = logic level high
    */
    IOZero32.prototype.readPin = function (pin) {
        return this.getPin(pin, INPUTPORT0, INPUTPORT1);
    };

    /**
     * Read all pins on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @returns {number} - number between 0 and 255 or 0x00 and 0xFF
     */
    IOZero32.prototype.readPort = function (port) {
        return this.getPort(port, INPUTPORT0, INPUTPORT1);
    };

    /**
    * Read all pins on the bus
    * @returns {number} 0 to 65535 (0xFFFF). For each bit 1 = logic high, 0 = logic low
    */
    IOZero32.prototype.readBus = function () {
        return this.getBus(INPUTPORT0);
    };

    /**
    * Set the polarity of the selected pin
    * @param  {number} pin - 1 to 16
    * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
    */
    IOZero32.prototype.setPinPolarity = function (pin, polarity) {
        this.setPin(pin, polarity, INVERTPORT0, INVERTPORT1);
    };

    /**
    * Get the polarity of the selected pin
    * @param  {number} pin - 1 to 16
    */
    IOZero32.prototype.getPinPolarity = function (pin) {
        return this.getPin(pin, INVERTPORT0, INVERTPORT1);
    };

    /**
    * Set the polarity of the pins on a selected port
    * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
    * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
    */
    IOZero32.prototype.setPortPolarity = function (port, polarity) {
        this.setPort(port, polarity, INVERTPORT0, INVERTPORT1);
    };

    /**
    * Get the polarity of the selected port
    * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 9 to 16
    */
    IOZero32.prototype.getPortPolarity = function (port) {
        return this.getPort(port, INVERTPORT0, INVERTPORT1);
    };

    /**
    * Set the polarity of the pins on the bus
    * @param  {number} polarity - 0 to 65535 (0xFFFF). For each bit 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
    */
    IOZero32.prototype.setBusPolarity = function (polarity) {
        this.setBus(polarity, INVERTPORT0);
    };

    /**
    * Get the polarity of the bus
    */
    IOZero32.prototype.getBusPolarity = function () {
        return this.getBus(INVERTPORT0);
    };

    return IOZero32;

})();

module.exports = IOZero32;
