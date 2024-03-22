/**
 * ================================================
 * AB Electronics UK RTC Pi real-time clock
 * For use with the RTC Pi, RTC Pi Plus and RTC Pi Zero
 * Version 1.0 Created 06/07/2016
 * Version 1.1 Updated 21/03/2024
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
 * ================================================
 */

// Define registers values from the datasheet
const SECONDS = 0x00;
const MINUTES = 0x01;
const HOURS = 0x02;
const DAYOFWEEK = 0x03;
const DAY = 0x04;
const MONTH = 0x05;
const YEAR = 0x06;
const CONTROL = 0x07;

// variables
const rtcAddress = 0x68;  // I2C address
// initial configuration - square wave and output disabled, frequency set
// to 32.768KHz.
var config = 0x03;
// the DS1307 does not store the current century so that has to be added on
// manually.
var century = 2000;

const i2c = require('i2c-bus');

const busnumber = 1; // The number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...

/**
 * RTC Class
 */
RTCPi = (function () {

    /**
     * Initialise the RTC Pi I2C connection and set the default configuration to the control register
     */
    function RTCPi() {
        i2cWriteByte(CONTROL, config);
    }

// Private functions

    /**
     * Write a single byte to the I2C bus.
     * @param  {number} register - Target register
     * @param  {number} val - Value to be written
     */
    function i2cWriteByte(register, val) {
        const i2c1 = i2c.openSync(busnumber);
        i2c1.writeByteSync(rtcAddress, register, val);
        i2c1.closeSync();
    }

    /**
     * Update a single bit within a variable
     * @param  {number} oldByte - Variable to be updated
     * @param  {number} bit - The location of the bit to be changed
     * @param  {boolean} value - The new value for the bit.  true or false
     * @returns {number} - Updated value
     */
    function updateByte(oldByte, bit, value) {
        if (!value) {
            return oldByte & ~(1 << bit);
        } else {
            return oldByte | 1 << bit;
        }
    }

    /**
     * Convert a BCD formatted number to decimal.
     * @param  {number} val - BCD value
     * @returns {number} - Decimal value
     */
    function bcdToDec(val) {
        return val - 6 * (val >> 4);
    }

    /**
     * Convert a decimal to BCD formatted number.
     * @param  {number} val - Decimal value
     * @returns {number} - BCD value
     */
    function decToBcd(val) {
        return val / 10 << 4 | val % 10;
    }

    /**
     * Calculate the current century
     * @param  {number} val - Year
     */
    function getCentury(val) {
        if (val.length > 2) {
            var y = val[0] + val[1];
            century = int(y) * 100;
        }
    }

    // public functions

    /**
     * Set the date and time on the RTC
     * @param  {Date} date - Use a javascript Date object
     */
    RTCPi.prototype.setDate = function (date) {
        getCentury(date.getFullYear());
        i2cWriteByte(SECONDS, decToBcd(date.getSeconds()));
        i2cWriteByte(MINUTES, decToBcd(date.getMinutes()));
        i2cWriteByte(HOURS, decToBcd(date.getHours()));
        i2cWriteByte(DAYOFWEEK, decToBcd(date.getDay()));
        i2cWriteByte(DAY, decToBcd(date.getDate()));
        i2cWriteByte(MONTH, decToBcd(date.getMonth() - 1));
        i2cWriteByte(YEAR, decToBcd(date.getFullYear() - century));
    };

    /**
     * Read the date and time from the RTC
     * @returns  {Date} - Returns the date as a javascript Date object
     */
    RTCPi.prototype.readDate = function () {
        let txbuf = Buffer.alloc(1);
        let rxbuf = Buffer.alloc(7);

        const i2c1 = i2c.openSync(busnumber); // open the i2c bus       
        i2c1.i2cWriteSync(rtcAddress, 1, txbuf);
        i2c1.i2cReadSync(rtcAddress, 7, rxbuf);
        i2c1.closeSync(); // close the i2c bus

        return new Date(bcdToDec(rxbuf[6]) + century, bcdToDec(rxbuf[5]), bcdToDec(rxbuf[4]), bcdToDec(rxbuf[2] + 1), bcdToDec(rxbuf[1]), bcdToDec(rxbuf[0]),0);
    };

    /**
     * Enable the output pin
     */
    RTCPi.prototype.enableOutput = function () {
        config = updateByte(config, 7, true);
        config = updateByte(config, 4, true);
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Disable the output pin
     */
    RTCPi.prototype.disableOutput = function () {
        config = updateByte(config, 7, false);
        config = updateByte(config, 4, false);
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Set the frequency of the output pin square-wave
     * @param  {number} frequency - 1 = 1Hz, 2 = 4.096KHz, 3 = 8.192KHz, 4 = 32.768KHz
     */
    RTCPi.prototype.setFrequency = function (frequency) {
        switch (frequency) {
            case 1:
                config = updateByte(config, 0, false);
                config = updateByte(config, 1, false);
                break;
            case 2:
                config = updateByte(config, 0, true);
                config = updateByte(config, 1, false);
                break;
            case 3:
                config = updateByte(config, 0, false);
                config = updateByte(config, 1, true);
                break;
            case 4:
                config = updateByte(config, 0, true);
                config = updateByte(config, 1, true);
                break;
            default:
                throw new Error("Argument Out Of Range");
        }
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Write to the memory on the DS1307
     * The DS1307 contains 56 - Byte, battery-backed RAM with Unlimited Writes
     * @param  {number} address - 0x08 to 0x3F
     * @param  {Uint8Array} valuearray - byte array containing data to be written to memory. Length can not exceed the available address space.
     */
    RTCPi.prototype.writeMemory = function (address, valuearray) {
        if (address + valuearray.length <= 0x3F) {
            if (address >= 0x08 && address <= 0x3F) {

                const data = Buffer.from(valuearray);

                // Create a new Buffer that is one byte larger than the original
                const newBuffer = Buffer.alloc(data.length + 1);

                // Copy the original Buffer into the new Buffer, starting at the second byte
                data.copy(newBuffer, 1);

                // Set the first byte to 'address'
                newBuffer[0] = address;

                // write the array to the RTC memory
                const i2c1 = i2c.openSync(busnumber); // open the i2c bus
                i2c1.i2cWriteSync(rtcAddress, newBuffer.length, newBuffer);
                i2c1.closeSync(); // close the i2c bus
            }
            else {
                throw new Error("Memory address outside of range: 0x08 to 0x3F");
            }
        }
        else {
            throw new Error("Array is larger than the available memory space");
        }

    };

    /**
     * Read from the memory on the DS1307
     * The DS1307 contains 56 - Byte, battery-backed RAM with Unlimited Writes
     * @param  {Number} address - 0x08 to 0x3F
     * @param  {Number} length - Up to 32 bytes.  length can not exceed the available address space.
     * @returns  {Uint8Array} - Returns an array of the data read from memory
     */
    RTCPi.prototype.readMemory = function (address, length) {
        if (address >= 0x08 && address <= 0x3F) {
            if (address <= 0x3F - length) {
                let tx_buffer = Buffer.alloc(1, address);
                let rx_buffer = Buffer.alloc(length);

                const i2c1 = i2c.openSync(busnumber); // open the i2c bus
                i2c1.i2cWriteSync(rtcAddress, 1, tx_buffer);
                i2c1.i2cReadSync(rtcAddress, rx_buffer.length, rx_buffer);
                i2c1.closeSync(); // close the i2c bus

                // Convert it to a Uint8Array and return the array
                return new Uint8Array(rx_buffer.buffer, rx_buffer.byteOffset, rx_buffer.byteLength);
            }
            else {
                throw new Error("Memory overflow error: address + length exceeds 0x3F");
            }
        }
        else {
            throw new Error("Memory address outside of range: 0x08 to 0x3F");
        }
    };

    return RTCPi;

})();

module.exports = RTCPi;