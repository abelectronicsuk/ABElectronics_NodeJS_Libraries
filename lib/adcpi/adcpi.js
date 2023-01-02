/**
 * 
 * AB Electronics UK ADC  Pi 8 Channel Analogue to Digital Converter
 * For use with the ADC Pi, ADC Pi Plus and ADC Pi Zero
 * Version 1.0 Created 06/07/2016
 * Version 1.1 Updated 12/10/2018
 * Requires rpio to be installed, install with: npm install rpio
 * 
*/




ADCPi = (function () {

    var rpio = require('rpio');
    var config1 = 0x9C;  // PGAx1, 18 bit, continuous conversion, channel 1
    var currentChannel1 = 0;  // channel variable for ADC 1
    var config2 = 0x9C;  // PGAx1, 18 bit, continuous-shot conversion, channel 1
    var currentChannel2 = 0;  // channel variable for ADC 2
    var pga = 0.5;  // current PGA setting
    var lsb = 0.0000078125;  // default LSB value for 18 bit
    var signBit = false; // stores whether the value contains a sign bit showing it is positive or negative.

    ADCPi.prototype.address1 = 0x68;
    ADCPi.prototype.address2 = 0x69;
    ADCPi.prototype.pga = 1;
    ADCPi.prototype.bitRate = 18;
    ADCPi.prototype.conversionMode = 1;

    /**
     * Create a new instance of the ADC Pi object and initialise it with the specified parameters
     * @param  {number} address1 - I2C address for channels 1 to 4
     * @param  {number} address2 - I2C address for channels 5 to 8
     * @param  {number} rate - Bit rate for ADC sampling: 12, 14, 16, 18
     */
    function ADCPi(address1, address2, rate) {
        this.address1 = address1;
        this.address2 = address2;
        this.setBitRate(rate);
        this.setConversionMode(1);
        rpio.i2cBegin();
        rpio.i2cSetBaudRate(10000);
    }

    /**
     * Private function for updating a single bit within a variable
     * @param  {number} oldByte - Variable to be updated
     * @param  {number} bit - The location of the bit to be changed
     * @param  {boolean} value - The new value for the bit.  true or false
     * @returns {number} - Updated number
     */
    function updateByte(oldByte, bit, value) {
        var newByte = 0;
        if (value == false) {
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
     * @returns {number} - 1 or 0
     */
    function checkBit(num, bit) {
        return (num >> bit) % 2 !== 0;
    }

    /**
     * Checks to see if the selected channel is already the current channel.
     * If not then update the appropriate config to the new channel settings.
     * @param  {number} channel - New selected channel
     */
    function setChannel(channel) {
        if (channel < 5 && channel !== currentChannel1) {
            switch (channel) {
                case 1:
                    config1 = updateByte(config1, 5, false);
                    config1 = updateByte(config1, 6, false);
                    currentChannel1 = 1;
                    break;
                case 2:
                    config1 = updateByte(config1, 5, true);
                    config1 = updateByte(config1, 6, false);
                    currentChannel1 = 2;
                    break;
                case 3:
                    config1 = updateByte(config1, 5, false);
                    config1 = updateByte(config1, 6, true);
                    currentChannel1 = 3;
                    break;
                case 4:
                    config1 = updateByte(config1, 5, true);
                    config1 = updateByte(config1, 6, true);
                    currentChannel1 = 4;
                    break;
            }
        }
        
        else if (channel >= 5 && channel <= 8 && channel !== currentChannel2) {
            switch (channel) {
                case 5:
                    config2 = updateByte(config2, 5, false);
                    config2 = updateByte(config2, 6, false);
                    currentChannel2 = 5;
                    break;
                case 6:
                    config2 = updateByte(config2, 5, true);
                    config2 = updateByte(config2, 6, false);
                    currentChannel2 = 6;
                    break;
                case 7:
                    config2 = updateByte(config2, 5, false);
                    config2 = updateByte(config2, 6, true);
                    currentChannel2 = 7;
                    break;
                case 8:
                    config2 = updateByte(config2, 5, true);
                    config2 = updateByte(config2, 6, true);
                    currentChannel2 = 8;
                    break;
            }
        }
    }


    /**
     * Returns the voltage from the selected ADC channel
     * @param  {number} channel - 1 to 8
     * @returns  {number} - Voltage from ADC channel
     */
    ADCPi.prototype.readVoltage = function (channel) {
        var raw = this.readRaw(channel); // get the raw value

        if (signBit) // check to see if the sign bit is present, if it is then the voltage is negative and can be ignored.
        {
            return 0.0;  // returned a negative voltage so return 0
        }
        else {
            var voltage = raw * (lsb / pga) * 2.471; // calculate the voltage and return it
            return voltage;
        }
    };

    /**
     * Returns the raw value from the selected ADC channel
     * @param  {number} channel - 1 to 8
     * @returns  {number} - Raw integer value from ADC buffer
     */
    ADCPi.prototype.readRaw = function (channel) {
        var h = 0, l = 0, m = 0, s = 0, x = 0, config, address, t = 0;
        var timeout = 1000; // number of reads before a timeout occurs
        var txbuf = new Buffer(1);
        var rxbuf = new Buffer(4);
        signBit = false;

        setChannel(channel);

        // get the configuration and i2c address for the selected channel
        if (channel < 5) {
            config = config1;
            rpio.i2cSetSlaveAddress(this.address1);
        }

        else if (channel >= 5 && channel <= 8) {
            config = config2;
            rpio.i2cSetSlaveAddress(this.address2);
        }

        else {
            throw new Error("Argument Out Of Range");
        }

        // if the conversion mode is set to one-shot update the ready bit to 1
        if (conversionMode == 0) {
            config = updateByte(config, 7, true);
            txbuf[0] = config;
            rpio.i2cWrite(txbuf);
            config = updateByte(config, 7, false);
        }
        txbuf[0] = config;

        // keep reading the ADC data until the conversion result is ready
        do {
            rpio.i2cWrite(txbuf);
            if (bitRate == 18) {

                rpio.i2cRead(rxbuf, 4);
                h = rxbuf[0];
                m = rxbuf[1];
                l = rxbuf[2];
                s = rxbuf[3];
            }
            else {
                rpio.i2cRead(rxbuf, 3);
                h = rxbuf[0];
                m = rxbuf[1];
                s = rxbuf[2];

            }

            // check bit 7 of s to see if the conversion result is ready
            if (checkBit(s, 7) == 0) {
                break;
            }

            if (x > timeout) {
                // timeout occurred
                throw new Error("Timeout Occurred");
            }

            x++;
        } while (true);

        // extract the returned bytes and combine them in the correct order
        switch (bitRate) {
            case 18:
                t = (h & 3) << 16 | m << 8 | l;
                signBit = checkBit(t, 17);

                if (signBit) {
                    t = updateByte(t, 17, false);
                }

                break;
            case 16:
                t = h << 8 | m;
                signBit = checkBit(t, 15);

                if (signBit) {
                    t = updateByte(t, 15, false);
                }

                break;
            case 14:

                t = (h & 63) << 8 | m;
                signBit = checkBit(t, 13);

                if (signBit) {
                    t = updateByte(t, 13, false);
                }

                break;
            case 12:
                t = (h & 15) << 8 | m;
                signBit = checkBit(t, 11);

                if (signBit) {
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
                config1 = updateByte(config1, 0, false);
                config1 = updateByte(config1, 1, false);
                config2 = updateByte(config2, 0, false);
                config2 = updateByte(config2, 1, false);
                pga = 0.5;
                break;
            case 2:
                config1 = updateByte(config1, 0, true);
                config1 = updateByte(config1, 1, false);
                config2 = updateByte(config2, 0, true);
                config2 = updateByte(config2, 1, false);
                pga = 1;
                break;
            case 4:
                config1 = updateByte(config1, 0, false);
                config1 = updateByte(config1, 1, true);
                config2 = updateByte(config2, 0, false);
                config2 = updateByte(config2, 1, true);
                pga = 2;
                break;
            case 8:
                config1 = updateByte(config1, 0, true);
                config1 = updateByte(config1, 1, true);
                config2 = updateByte(config2, 0, true);
                config2 = updateByte(config2, 1, true);
                pga = 4;
                break;
            default:
                throw new Error("Argument Out Of Range");
        }
    };

    /**
     * Set the sample resolution
     * @param  {number} rate - 12 = 12 bit(240SPS max), 14 = 14 bit(60SPS max), 16 = 16 bit(15SPS max), 18 = 18 bit(3.75SPS max)
     */
    ADCPi.prototype.setBitRate = function (rate) {
        switch (rate) {
            case 12:
                config1 = updateByte(config1, 2, false);
                config1 = updateByte(config1, 3, false);
                config2 = updateByte(config2, 2, false);
                config2 = updateByte(config2, 3, false);
                bitRate = 12;
                lsb = 0.0005;
                break;
            case 14:
                config1 = updateByte(config1, 2, true);
                config1 = updateByte(config1, 3, false);
                config2 = updateByte(config2, 2, true);
                config2 = updateByte(config2, 3, false);
                bitRate = 14;
                lsb = 0.000125;
                break;
            case 16:
                config1 = updateByte(config1, 2, false);
                config1 = updateByte(config1, 3, true);
                config2 = updateByte(config2, 2, false);
                config2 = updateByte(config2, 3, true);
                bitRate = 16;
                lsb = 0.00003125;
                break;
            case 18:
                config1 = updateByte(config1, 2, true);
                config1 = updateByte(config1, 3, true);
                config2 = updateByte(config2, 2, true);
                config2 = updateByte(config2, 3, true);
                bitRate = 18;
                lsb = 0.0000078125;
                break;
            default:
                throw new Error("Argument Out Of Range");
        }
    };

    /**
     * Set the conversion mode for ADC
     * @param  {number} mode - 0 = One shot conversion mode, 1 = Continuous conversion mode
     */
    ADCPi.prototype.setConversionMode = function (mode) {
        if (mode == 1) {
            config1 = updateByte(config1, 4, true);
            config2 = updateByte(config2, 4, true);
            conversionMode = 1;
        }

        else {
            config1 = updateByte(config1, 4, false);
            config2 = updateByte(config2, 4, false);
            conversionMode = 0;
        }
    };

    return ADCPi;

})();

module.exports = ADCPi;