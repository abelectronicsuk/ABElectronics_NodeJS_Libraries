/**
 * 
 * AB Electronics UK ADC  Pi 8 Channel Analogue to Digital Converter
 * For use with the ADC Pi, ADC Pi Plus and ADC Pi Zero
 * Version 1.0 Created 06/07/2016
 * Version 1.1 Updated 12/10/2018
 * Version 1.2 Updated 20/03/2024
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
 * 
*/

ADCPi = (function () {
    const i2c = require('i2c-bus');

    const busnumber = 1; // The number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...

    ADCPi.prototype.i2cAddress1 = 0x68;
    ADCPi.prototype.i2cAddress2 = 0x69;
    ADCPi.prototype.pga = 0.5;
    ADCPi.prototype.bitRate = 18;
    ADCPi.prototype.conversionMode = 1;

    ADCPi.prototype.config1 = 0x9C;  // PGAx1, 18 bit, continuous conversion, channel 1
    ADCPi.prototype.config2 = 0x9C;  // PGAx1, 18 bit, continuous-shot conversion, channel 1
    ADCPi.prototype.lsb = 0.0000078125;  // default this.lsb value for 18 bit
    ADCPi.prototype.signBit = false; // stores whether the value contains a sign bit showing it is positive or negative.

    /**
     * Create a new instance of the ADCPi object and initialise it with the specified parameters
     * @param  {number} address1 - I2C address for channels 1 to 4
     * @param  {number} address2 - I2C address for channels 5 to 8
     * @param  {number} rate - Bit rate for ADC sampling: 12, 14, 16, 18
     */
    function ADCPi(address1, address2, rate) {
        this.i2cAddress1 = address1;
        this.i2cAddress2 = address2;
        this.setBitRate(rate);
        this.setConversionMode(1);
    }

    /**
     * Private function for updating a single bit within a variable
     * @param  {number} oldByte - Variable to be updated
     * @param  {number} bit - The location of the bit to be changed
     * @param  {boolean} value - The new value for the bit.  true or false
     * @returns {number} - Updated number
     */
    function updateByte(oldByte, bit, value) {
        let newByte;
        if (value === false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return newByte;
    }

    /**
     * Private function for checking the status of a bit within a variable
     * @param  {number} num - Variable to be checked
     * @param  {number} bit - The location of the bit to be checked
     * @returns {boolean} - 1 or 0
     */
    function checkBit(num, bit) {
        return (num >> bit) % 2 !== 0;
    }

    /**
     * Checks to see if the selected channel is already the current channel.
     * If not then update the appropriate config to the new channel settings.
     * @param  {number} channel - New selected channel
     * @param  {number} config
     */

    function setChannel(channel, config) {
        // Clear bits 5 and 6
        let maskClear = ~(0b11 << 5);
        let new_config = config & maskClear;

        // Determine the new values for bits 5 and 6 based on the channel
        switch (channel) {
            case 1:
                // Bits 5 and 6 are already cleared
                break;
            case 2:
                new_config |= (0b01 << 5); // Set bit 5
                break;
            case 3:
                new_config |= (0b10 << 5); // Set bit 6
                break;
            case 4:
                new_config |= (0b11 << 5); // Set bits 5 and 6
                break;
        }

        return new_config;
    }

    /**
     * Returns the voltage from the selected ADC channel
     * @param  {number} channel - 1 to 8
     * @returns  {number} - Voltage from ADC channel
     */
    ADCPi.prototype.readVoltage = function (channel) {
        let raw = this.readRaw(channel); // get the raw value
        if (this.signBit) // check to see if the sign bit is present, if it is then the voltage is negative and can be ignored.
        {
            return 0.0;  // returned a negative voltage so return 0
        }
        else {
             // calculate the voltage and return it
            return raw * (this.lsb / this.pga) * 2.471;
        }
    };

    /**
     * Returns the raw value from the selected ADC channel
     * @param  {number} channel - 1 to 8
     * @returns  {number} - Raw integer value from ADC buffer
     */
    ADCPi.prototype.readRaw = function (channel) {
        let h = 0, l = 0, m = 0, s = 0, x = 0, config, i2c_address, t = 0;
        let timeout = 1000; // number of reads before a timeout occurs
        let tx_buffer = Buffer.alloc(1);
        let rx_buffer = Buffer.alloc(4);
        this.signBit = false;
        const i2c1 = i2c.openSync(busnumber); // open the i2c bus       

        // get the configuration and i2c address for the selected channel
        if (channel > 0 && channel < 5) {
            config = setChannel(channel, this.config1);
            i2c_address = this.i2cAddress1;
        }

        else if (channel >= 5 && channel <= 8) {
            config = setChannel(channel - 4, this.config2);
            i2c_address = this.i2cAddress2;
        }

        else {
            throw new Error("Argument Out Of Range");
        }

        // if the conversion mode is set to one-shot update the ready bit to 1
        if (this.conversionMode === 0) {
            config = updateByte(config, 7, true);
            tx_buffer[0] = config;
            i2c1.i2cWriteSync(i2c_address, 1, tx_buffer);
            config = updateByte(config, 7, false);
        }

        tx_buffer[0] = config;

        i2c1.i2cWriteSync(i2c_address, 1, tx_buffer);

        // keep reading the ADC data until the conversion result is ready
        do {
            if (this.bitRate === 18) {
                i2c1.i2cReadSync(i2c_address, 4, rx_buffer);
                h = rx_buffer[0];
                m = rx_buffer[1];
                l = rx_buffer[2];
                s = rx_buffer[3];
            }
            else {
                i2c1.i2cReadSync(i2c_address, 3, rx_buffer);
                h = rx_buffer[0];
                m = rx_buffer[1];
                s = rx_buffer[2];

            }

            // check bit 7 of s to see if the conversion result is ready
            if (checkBit(s, 7) === false) {
                break;
            }

            if (x > timeout) {
                // timeout occurred
                throw new Error("Timeout Occurred");
            }

            x++;
        } while (true);

        i2c1.closeSync(); // close the i2c bus

        // extract the returned bytes and combine them in the correct order
        switch (this.bitRate) {
            case 18:
                t = (h & 3) << 16 | m << 8 | l;
                this.signBit = checkBit(t, 17);

                if (this.signBit) {
                    t = updateByte(t, 17, false);
                }

                break;
            case 16:
                t = h << 8 | m;
                this.signBit = checkBit(t, 15);

                if (this.signBit) {
                    t = updateByte(t, 15, false);
                }

                break;
            case 14:

                t = (h & 63) << 8 | m;
                this.signBit = checkBit(t, 13);

                if (this.signBit) {
                    t = updateByte(t, 13, false);
                }

                break;
            case 12:
                t = (h & 15) << 8 | m;
                this.signBit = checkBit(t, 11);

                if (this.signBit) {
                    t = updateByte(t, 11, false);
                }

                break;
            default:
                throw new Error("Argument Out Of Range");
        }
        return t;
    };

    /**
     * Programmable Gain Amplifier gain selection
     * @param  {number} gain - Set to 1, 2, 4 or 8
     */
    ADCPi.prototype.setPGA = function (gain) {
        switch (gain) {
            case 1:
                this.config1 = updateByte(this.config1, 0, false);
                this.config1 = updateByte(this.config1, 1, false);
                this.config2 = updateByte(this.config2, 0, false);
                this.config2 = updateByte(this.config2, 1, false);
                this.pga = 0.5;
                break;
            case 2:
                this.config1 = updateByte(this.config1, 0, true);
                this.config1 = updateByte(this.config1, 1, false);
                this.config2 = updateByte(this.config2, 0, true);
                this.config2 = updateByte(this.config2, 1, false);
                this.pga = 1;
                break;
            case 4:
                this.config1 = updateByte(this.config1, 0, false);
                this.config1 = updateByte(this.config1, 1, true);
                this.config2 = updateByte(this.config2, 0, false);
                this.config2 = updateByte(this.config2, 1, true);
                this.pga = 2;
                break;
            case 8:
                this.config1 = updateByte(this.config1, 0, true);
                this.config1 = updateByte(this.config1, 1, true);
                this.config2 = updateByte(this.config2, 0, true);
                this.config2 = updateByte(this.config2, 1, true);
                this.pga = 4;
                break;
            default:
                throw new Error("Argument Out Of Range");
        }

        const i2c1 = i2c.openSync(busnumber);
        i2c1.i2cWriteSync(this.i2cAddress1, 1, Buffer.alloc(1, this.config1));
        i2c1.i2cWriteSync(this.i2cAddress2, 1, Buffer.alloc(1, this.config2));
        i2c1.closeSync();
    };

    /**
     * Set the sample resolution
     * @param  {number} rate - 12 = 12 bit(240SPS max), 14 = 14 bit(60SPS max), 16 = 16 bit(15SPS max), 18 = 18 bit(3.75SPS max)
     */
    ADCPi.prototype.setBitRate = function (rate) {
        switch (rate) {
            case 12:
                this.config1 = updateByte(this.config1, 2, false);
                this.config1 = updateByte(this.config1, 3, false);
                this.config2 = updateByte(this.config2, 2, false);
                this.config2 = updateByte(this.config2, 3, false);
                this.bitRate = 12;
                this.lsb = 0.0005;
                break;
            case 14:
                this.config1 = updateByte(this.config1, 2, true);
                this.config1 = updateByte(this.config1, 3, false);
                this.config2 = updateByte(this.config2, 2, true);
                this.config2 = updateByte(this.config2, 3, false);
                this.bitRate = 14;
                this.lsb = 0.000125;
                break;
            case 16:
                this.config1 = updateByte(this.config1, 2, false);
                this.config1 = updateByte(this.config1, 3, true);
                this.config2 = updateByte(this.config2, 2, false);
                this.config2 = updateByte(this.config2, 3, true);
                this.bitRate = 16;
                this.lsb = 0.00003125;
                break;
            case 18:
                this.config1 = updateByte(this.config1, 2, true);
                this.config1 = updateByte(this.config1, 3, true);
                this.config2 = updateByte(this.config2, 2, true);
                this.config2 = updateByte(this.config2, 3, true);
                this.bitRate = 18;
                this.lsb = 0.0000078125;
                break;
            default:
                throw new Error("Argument Out Of Range");
        }

        const i2c1 = i2c.openSync(busnumber);
        i2c1.i2cWriteSync(this.i2cAddress1, 1, Buffer.alloc(1, this.config1));
        i2c1.i2cWriteSync(this.i2cAddress2, 1, Buffer.alloc(1, this.config2));
        i2c1.closeSync();
    };

    /**
     * Set the conversion mode for ADC
     * @param  {number} mode - 0 = One shot conversion mode, 1 = Continuous conversion mode
     */
    ADCPi.prototype.setConversionMode = function (mode) {
        if (mode === 1) {
            this.config1 = updateByte(this.config1, 4, true);
            this.config2 = updateByte(this.config2, 4, true);
            this.conversionMode = 1;
        }

        else {
            this.config1 = updateByte(this.config1, 4, false);
            this.config2 = updateByte(this.config2, 4, false);
            this.conversionMode = 0;
        }
    };

    return ADCPi;

})();

module.exports = ADCPi;