/** 
*
* ABElectronics Expander Pi - 32 Digital IO, 8 ADC, 2 DAC and a real-time clock
* For use with the Expander Pi
* Version 1.0 Created 19/06/2017
*
* Requires rpio to be installed, install with: npm install rpio
*
*/
var rpio = require('rpio');

/**
 * ADC Class
 */
ExpanderPiADC = (function () {

    var adc;
    var adcRefVoltage = 3.3;  //reference voltage for the ADC chip.
    var tx = new Buffer([0x01, 0xC0, 0x00]);
    var rx = new Buffer([0, 0, 0]);
    var out;
    
    /**
     * Connect to the SPI bus and set the parameters
     */
    function ExpanderPiADC() {
        rpio.spiBegin();
        rpio.spiSetCSPolarity(0, rpio.LOW);
        rpio.spiSetDataMode(0);
        
    }
    /**
     * Returns the raw value from the selected ADC channel
     * When in differential mode setting channel to 1 will make IN1 = IN+ and IN2 = IN-
     * When in differential mode setting channel to 2 will make IN1 = IN- and IN2 = IN+
     * When in differential mode setting channel to 3 will make IN3 = IN+ and IN4 = IN-
     * When in differential mode setting channel to 4 will make IN3 = IN- and IN4 = IN+
     * When in differential mode setting channel to 5 will make IN5 = IN+ and IN6 = IN-
     * When in differential mode setting channel to 6 will make IN5 = IN- and IN6 = IN+
     * When in differential mode setting channel to 7 will make IN7 = IN+ and IN8 = IN-
     * When in differential mode setting channel to 8 will make IN7 = IN- and IN8 = IN+
     * @param  {number} channel - 1 to 8
     * @param  {number} mode - 0 = Single Ended or 1 = Differential
     * @returns  {number} - 12 bit value between 0 and 4096
     */
    ExpanderPiADC.prototype.readADCRaw = function (channel, mode) {
        if (channel < 1 || channel > 8) {
            throw new Error("Channel Argument Out Of Range");
        }

        channel = channel - 1;
        if (mode == 0) {
            tx[0] = 6 + (channel >> 2);
            tx[1] = (channel & 3) << 6;
        }
        else if (mode == 1) {
            tx[0] = 4 + (channel >> 2);
            tx[1] = (channel & 3) << 6;
        }
        else {
            throw new Error("Mode Argument Out Of Range");
        }
        rpio.spiChipSelect(0);			/* Use CE0 */
        rpio.spiSetClockDivider(140);
        rpio.spiTransfer(tx, rx, 3);
        out = ((rx[1] & 0x0F) << 8) + rx[2];

        return out;
    };

    
    /**
     * Returns the voltage from the selected ADC channel
     * When in differential mode setting channel to 1 will make IN1 = IN+ and IN2 = IN-
     * When in differential mode setting channel to 2 will make IN1 = IN- and IN2 = IN+
     * When in differential mode setting channel to 3 will make IN3 = IN+ and IN4 = IN-
     * When in differential mode setting channel to 4 will make IN3 = IN- and IN4 = IN+
     * When in differential mode setting channel to 5 will make IN5 = IN+ and IN6 = IN-
     * When in differential mode setting channel to 6 will make IN5 = IN- and IN6 = IN+
     * When in differential mode setting channel to 7 will make IN7 = IN+ and IN8 = IN-
     * When in differential mode setting channel to 8 will make IN7 = IN- and IN8 = IN+
     * @param  {number} channel - 1 to 8
     * @param  {number} mode - 0 = Single Ended or 1 = Differential
     * @returns  {number} - oltage between 0 and vref
     */
    ExpanderPiADC.prototype.readADCVoltage = function (channel, mode) {
        var raw = this.readADCRaw(channel, mode);
        var voltage = adcRefVoltage / 4096 * raw;
        return voltage;
    };

    /**
     * Sets the reference voltage for the ADC
     * @param  {number} voltage - This should be the voltage as measured on the Raspberry Pi 3.3V power rail.
     */
    ExpanderPiADC.prototype.setADCRefVoltage = function (voltage) {
        adcRefVoltage = voltage;
    };

    return ExpanderPiADC;

})();

module.exports = ExpanderPiADC;


/**
 * DAC Class
 */
ExpanderPiDAC = (function () {

    var dac;
    var maxDacVoltage = 2.048; // maximum voltage for the DAC output
    var dacGain = 1;

    var tx = new Buffer([0x00, 0x00]);
    var rx = new Buffer(2);
    

    /**
     * Connect to the DAC SPI bus and set the parameters
     */
    function ExpanderPiDAC() {
        rpio.spiBegin();
        rpio.spiSetCSPolarity(1, rpio.LOW);
        rpio.spiSetDataMode(0);
    }

    /**
     * Set the DAC voltage.
     * @param  {number} channel - 1 or 2
     * @param  {number} voltage - voltage can be between 0 and 2.047 volts when gain is 1 or 0 and 3.3V when gain is 2
     */
    ExpanderPiDAC.prototype.setDACVoltage = function (channel, voltage) {
        if (channel < 1 || channel > 2) {
            throw new Error("Channel Out Of Range");
        }

        if (voltage < 0 || voltage > maxDacVoltage) {
            throw new Error("Voltage Out Of Range");
        }

        var rawval = (voltage / 2.048) * 4096 / dacGain; // convert the voltage into a raw value
        this.setDACRaw(channel, rawval); // set the raw value

    };

    
    /**
     * Set the raw value for the selected dac channel
     * @param  {number} channel - 1 to 2
     * @param  {number} value - 0 to 4095
     */
    ExpanderPiDAC.prototype.setDACRaw = function (channel, value) {
        if (channel < 1 || channel > 2) {
            throw new Error("Channel Out Of Range");
        }

        if (value < 0 || value > 4095) {
            throw new Error("Value Out Of Range");
        }              

        tx[1] = value & 0xff;
        tx[0] = ((value >> 8) & 0xff) | (channel - 1) << 7 | 0x1 << 5 | 1 << 4;

        if (dacGain == 2) {
            tx[0] = tx[0] &= ~(1 << 5);
        }
        rpio.spiChipSelect(1);			/* Use CE1 */
        rpio.spiSetClockDivider(14);
        rpio.spiTransfer(tx, rx, 2);

    };

    
    /**
     * Set the gain for the DAC.  This is used to set the output based on the reference voltage of 2.048V.
     * When the gain is set to 2 the maximum voltage will be approximately 3.3V.
     * @param  {number} gain - 1 or 2<
     */
    ExpanderPiDAC.prototype.setDACGain = function (gain) {
        if (gain < 1 || gain > 2) {
            throw new Error("Gain Out Of Range");
        }

        if (gain == 1) {
            dacGain = 1;
            maxDacVoltage = 2.048;
        }
        if (gain == 2) {
            dacGain = 2;
            maxDacVoltage = 3.3;
        }
    };

    
    /**
     * Close the SPI bus
     */
    ExpanderPiDAC.prototype.closeSPI = function () {
        dac.close();
    };


    return ExpanderPiDAC;

})();

module.exports = ExpanderPiDAC;

/**
 * IO Class
 */
ExpanderPiIO = (function () {
    // Define registers values from datasheet
    const IODIRA = 0x00;  // IO direction A - 1= input 0 = output
    const IODIRB = 0x01;  // IO direction B - 1= input 0 = output
    // Input polarity A - If a bit is set, the corresponding GPIO register bit will reflect the inverted value on the pin.
    const IPOLA = 0x02;
    // Input polarity B - If a bit is set, the corresponding GPIO register bit will reflect the inverted value on the pin.
    const IPOLB = 0x03;
    // The GPINTEN register controls the interrupt-onchange feature for each pin on port A.
    const GPINTENA = 0x04;
    // The GPINTEN register controls the interrupt-onchange feature for each pin on port B.
    const GPINTENB = 0x05;
    // Default value for port A - These bits set the compare value for pins configured for interrupt-on-change.
    // If the associated pin level is the opposite from the register bit, an interrupt occurs.
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
    // associated pin caused the interrupt.
    const INTFA = 0x0E;
    // The INTF register reflects the interrupt condition on the port B pins of any pin that is enabled for interrupts. A set bit indicates that the
    // associated pin caused the interrupt.
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
    ExpanderPiIO.prototype.portADir = 0x00;  // port a direction
    ExpanderPiIO.prototype.portBDir = 0x00;  // port b direction
    ExpanderPiIO.prototype.portAVal = 0x00;  // port a value
    ExpanderPiIO.prototype.portBVal = 0x00;  // port b value
    ExpanderPiIO.prototype.portAPullup = 0x00;  // port a pull-up resistors
    ExpanderPiIO.prototype.portBPullup = 0x00;  // port a pull-up resistors
    ExpanderPiIO.prototype.portAPolarity = 0x00; // input polarity for port a
    ExpanderPiIO.prototype.portBPolarity = 0x00;  // input polarity for port b
    ExpanderPiIO.prototype.intA = 0x00; // interrupt control for port a
    ExpanderPiIO.prototype.intB = 0x00;  // interrupt control for port a
    // initial configuration - see IOCON page in the MCP23017 datasheet for more information.
    ExpanderPiIO.prototype.config = 0x22;

    ExpanderPiIO.prototype.i2caddress = 0x20;

    /**
     * Initialize the I2C bus based on the supplied address
     * Load the default configuration, all pins are inputs with pull- ups disabled
     */
    function ExpanderPiIO() {
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(this.i2caddress);
        this.i2cWriteByte(IOCON, this.config);
        this.portAVal = this.i2cReadByte(GPIOA);
        this.portBVal = this.i2cReadByte(GPIOB);
        this.i2cWriteByte(IODIRA, 0xFF);
        this.i2cWriteByte(IODIRB, 0xFF);
        this.setPortPullups(0, 0x00);
        this.setPortPullups(1, 0x00);
        this.invertPort(0, 0x00);
        this.invertPort(1, 0x00);
    }

    /**
     * private functions
    */

    ExpanderPiIO.prototype.i2cReadByte = function (val) {
        var txbuf = new Buffer([val]);
        var rxbuf = new Buffer(1);
        rpio.i2cSetSlaveAddress(this.i2caddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    };

    ExpanderPiIO.prototype.i2cWriteByte = function (register, val) {
        rpio.i2cSetSlaveAddress(this.i2caddress);
        var txbuf = new Buffer([register, val]);
        var rxbuf = new Buffer(1);
        rpio.i2cWrite(txbuf);
    };


    updateByte = function (oldByte, bit, value) {
        // internal function for setting the value of a single bit within a byte
        var newByte = 0;
        if (value == false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return newByte;
    };

    function checkBit(num, bit) {
        return (num >> bit) % 2 != 0;
    }

    /**
     * public functions
    */

    /**
     * Set IO direction for an individual pin
     * @param  {number} pin - 1 to 16
     * @param  {number} direction - 1 = input, 0 = output
     */
    ExpanderPiIO.prototype.setPinDirection = function (pin, direction) {
        pin = pin - 1;
        if (pin < 8) {
            this.portADir = updateByte(this.portADir, pin, direction);
            this.i2cWriteByte(IODIRA, portADir);
        } else {
            this.portBDir = updateByte(this.portBDir, pin - 8, direction);
            this.i2cWriteByte(IODIRB, portBDir);
        }
    };

    /**
     * Set direction for an IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 8 to 16
     * @param  {number} direction - 0 to 255. For each bit 1 = input, 0 = output
     */
    ExpanderPiIO.prototype.setPortDirection = function (port, direction) {
        if (port == 1) {
            this.i2cWriteByte(IODIRB, direction);
            this.portBDir = direction;
        }
        else {
            this.i2cWriteByte(IODIRA, direction);
            this.portADir = direction;
        }
    };

    /**
     * Set the internal 100K pull-up resistors for an individual pin
     * @param  {number} pin - 1 to 16
     * @param  {number} value - 1 = enabled, 0 = disabled
     */
    ExpanderPiIO.prototype.setPinPullup = function (pin, value) {
        pin = pin - 1;
        if (pin < 8) {
            this.portAPullup = updateByte(this.portAPullup, pin, value);
            this.i2cWriteByte(GPPUA, this.portAPullup);
        } else {
            this.portBPullup = updateByte(this.portBPullup, pin - 8, value);
            this.i2cWriteByte(GPPUB, this.portBPullup);
        }
    };

    /**
     * Set the internal 100K pull-up resistors for the selected IO port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 8 to 16
     * @param  {number} value - 0 to 255. For each bit 1 = input, 0 = output
     */
    ExpanderPiIO.prototype.setPortPullups = function (port, value) {
        if (port == 1) {
            this.portBPullup = value;
            this.i2cWriteByte(GPPUB, value);
        } else {
            this.portAPullup = value;
            this.i2cWriteByte(GPPUA, value);
        }
    };

    /**
     * Write to an individual pin
     * @param  {number} pin - 1 to 16
     * @param  {number} value - 1 = enabled, 0 = disabled
     */
    ExpanderPiIO.prototype.writePin = function (pin, value) {
        //
        //  write to an individual pin 1 - 16
        //
        pin = pin - 1;
        if (pin < 8) {
            this.portAVal = updateByte(this.portAVal, pin, value);
            this.i2cWriteByte(GPIOA, this.portAVal);
        } else {
            this.portBVal = updateByte(this.portBVal, pin - 8, value);
            this.i2cWriteByte(GPIOB, this.portBVal);
        }
    };

    /**
     * Write to all pins on the selected port
     * @param  {number} port - 0 = pins 1 to 8, 1 = pins 8 to 16
     * @param  {number} value - number between 0 and 255 or 0x00 and 0xFF
     */
    ExpanderPiIO.prototype.writePort = function (port, value) {
        if (port == 1) {
            this.i2cWriteByte(GPIOB, value);
            this.portBVal = value;
        } else {
            this.i2cWriteByte(GPIOA, value);
            this.portAVal = value;
        }
    };

    /**
     * read the value of an individual pin 1 - 16
     * @param  {number} pin - 1 to 16
     * @returns {number} - 0 = logic level low, 1 = logic level high
     */
    ExpanderPiIO.prototype.readPin = function (pin) {
        pin = pin - 1;
        if (pin < 8) {
            this.portAVal = this.i2cReadByte(GPIOA);
            return checkBit(this.portAVal, pin);
        } else {
            pin = pin - 8;
            this.portBVal = this.i2cReadByte(GPIOB);
            return checkBit(this.portBVal, pin);
        }
    };

    /**
     * Read all pins on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @returns {number} - number between 0 and 255 or 0x00 and 0xFF
     */
    ExpanderPiIO.prototype.readPort = function (port) {
        if (port == 1) {
            this.portBVal = this.i2cReadByte(GPIOB);
            return this.portBVal;
        } else {
            this.portAVal = this.i2cReadByte(GPIOA);
            return this.portAVal;
        }
    };

    /**
     * Invert the polarity of the pins on a selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
     */
    ExpanderPiIO.prototype.invertPort = function (port, polarity) {
        if (port == 1) {
            this.i2cWriteByte(IPOLB, polarity);
            this.portBPolarity = polarity;
        } else {
            this.i2cWriteByte(IPOLA, polarity);
            this.portAPolarity = polarity;
        }
    };

    /**
     * Invert the polarity of the selected pin
     * @param  {number} pin - 1 to 16
     * @param  {number} polarity - 0 = same logic state of the input pin, 1 = inverted logic state of the input pin
     */
    ExpanderPiIO.prototype.invertPin = function (pin, polarity) {
        pin = pin - 1;
        if (pin < 8) {
            this.portAPolarity = updateByte(this.portAPolarity, pin, polarity);
            this.i2cWriteByte(IPOLA, this.portAPolarity);
        } else {
            this.portBPolarity = updateByte(this.portBPolarity, pin - 8, polarity);
            this.i2cWriteByte(IPOLB, this.portBPolarity);
        }
    };

    /**
     * Mirror interrupts across INTA and INTB
     * @param  {number} value - 1 = The INT pins are internally connected, 0 = The INT pins are not connected. INTA is associated with PortA and INTB is associated with PortB
     */
    ExpanderPiIO.prototype.mirrorInterrupts = function (value) {
        if (value == 0) {
            this.config = updateByte(this.config, 6, 0);
        }
        if (value == 1) {
            this.config = updateByte(this.config, 6, 1);
        }
        this.i2cWriteByte(IOCON, this.config);

    };

    /**
     * This sets the polarity of the INT output pins
     * @param  {number} value - 1 = Active-high. 0 = Active-low.
     */
    ExpanderPiIO.prototype.setInterruptPolarity = function (value) {
        if (value == 0) {
            this.config = updateByte(this.config, 1, 0);
        }
        if (value == 1) {
            this.config = updateByte(this.config, 1, 1);

        }
        this.i2cWriteByte(IOCON, this.config);
    };

    /**
     * Sets the type of interrupt for each pin on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @param  {number} value - 0 to 255.  For each bit 1 = interrupt is fired when the pin matches the default value, 0 = the interrupt is fired on state change.
     */
    ExpanderPiIO.prototype.setInterruptType = function (port, value) {
        if (port == 0) {
            this.i2cWriteByte(INTCONA, value);
        } else {
            this.i2cWriteByte(INTCONB, value);
        }
    };

    /**
     * These bits set the compare value for pins configured for interrupt-on-change on the selected port.
     * If the associated pin level is the opposite from the register bit, an interrupt occurs.
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @param  {number} value - 0 to 255 or 0x00 and 0xFF
     */
    ExpanderPiIO.prototype.setInterruptDefaults = function (port, value) {
        if (port == 0) {
            this.i2cWriteByte(DEFVALA, value);
        } else {
            this.i2cWriteByte(DEFVALB, value);
        }
    };

    /**
     * Enable interrupts for the pins on the selected port
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @param  {number} value - 0 and 255 or 0x00 and 0xFF
     */
    ExpanderPiIO.prototype.setInterruptOnPort = function (port, value) {
        if (port == 0) {
            this.i2cWriteByte(GPINTENA, value);
            intA = value;
        } else {
            this.i2cWriteByte(GPINTENB, value);
            intB = value;
        }
    };

    /**
     * Enable interrupts for the selected pin
     * @param  {number} pin - 1 to 16
     * @param  {number} value - 0 = interrupt disabled, 1 = interrupt enabled
     */
    ExpanderPiIO.prototype.setInterruptOnPin = function (pin, value) {
        pin = pin - 1;
        if (pin < 8) {
            this.intA = updateByte(this.intA, pin, value);
            this.i2cWriteByte(GPINTENA, this.intA);
        } else {
            this.intB = updateByte(this.intB, pin - 8, value);
            this.i2cWriteByte(GPINTENB, this.intB);
        }
    };

    /**
     * Read the interrupt status for the pins on the selected port
     * @param  {number} port - 0 = pins 1 to 8, port 1 = pins 9 to 16
     * @returns  {number} - 0 to 255. Interrupt status, each pin represents one bit.
     */
    ExpanderPiIO.prototype.readInterruptStatus = function (port) {
        if (port == 0) {
            return this.i2cReadByte(INTFA);
        } else {
            return this.i2cReadByte(INTFB);
        }
    };

    /**
     * Read the value from the selected port at the time of the last interrupt trigger
     * @param  {number} port - port 0 = pins 1 to 8, port 1 = pins 8 to 16
     * @returns  {number} - 0 to 255. Interrupt status, each pin represents one bit.
     */
    ExpanderPiIO.prototype.readInterruptCapture = function (port) {
        if (port == 0) {
            return this.i2cReadByte(INTCAPA);
        }
        else {
            return this.i2cReadByte(INTCAPB);
        }
    };

    /**
     * Set the interrupts A and B to 0
     */
    ExpanderPiIO.prototype.resetInterrupts = function () {
        this.readInterruptCapture(0);
        this.readInterruptCapture(1);
    };


    return ExpanderPiIO;

})();

module.exports = ExpanderPiIO;


/**
 * RTC Class
 */
ExpanderPiRTC = (function () {

    // Define registers values from datasheet
    const SECONDS = 0x00;
    const MINUTES = 0x01;
    const HOURS = 0x02;
    const DAYOFWEEK = 0x03;
    const DAY = 0x04;
    const MONTH = 0x05;
    const YEAR = 0x06;
    const CONTROL = 0x07;

    // variables
    var rtcAddress = 0x68;  // I2C address
    // initial configuration - square wave and output disabled, frequency set
    // to 32.768KHz.
    var config = 0x03;
    // the DS1307 does not store the current century so that has to be added on
    // manually.
    var century = 2000;

    /**
     * Initialise the RTC I2C connection and set the default configuration to the control register
     */
    function ExpanderPiRTC() {
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(rtcAddress);
        i2cWriteByte(CONTROL, config);
    }
    
    // Private functions

    /**
     * Write a single byte to the I2C bus.
     * @param  {number} register - Target register
     * @param  {number} val - Value to be written
     */
    function i2cWriteByte(register, val) {
        var txbuf = new Buffer([register, val]);
        rpio.i2cSetSlaveAddress(rtcAddress);
        rpio.i2cWrite(txbuf);
    }

    /**
     * Update a single bit within a variable
     * @param  {number} oldByte - Variable to be updated
     * @param  {number} bit - The location of the bit to be changed
     * @param  {boolean} value - The new value for the bit.  true or false
     * @returns {number} - Updated value
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
    ExpanderPiRTC.prototype.setDate = function (date) {
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
    ExpanderPiRTC.prototype.readDate = function () {
        var txbuf = new Buffer(1);
        var rxbuf = new Buffer(7);
        txbuf[0] = 0;
        rpio.i2cSetSlaveAddress(rtcAddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 7);

        var d = new Date(bcdToDec(rxbuf[6]) + century, bcdToDec(rxbuf[5]), bcdToDec(rxbuf[4]), bcdToDec(rxbuf[2]), bcdToDec(rxbuf[1]), bcdToDec(rxbuf[0]),0);

        return d;
    };

    /**
     * Enable the output pin
     */
    ExpanderPiRTC.prototype.enableOutput = function () {
        config = updateByte(config, 7, 1);
        config = updateByte(config, 4, 1);
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Disable the output pin
     */
    ExpanderPiRTC.prototype.disableOutput = function () {
        config = updateByte(config, 7, 0);
        config = updateByte(config, 4, 0);
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Set the frequency of the output pin square- wave
     * @param  {number} frequency - 1 = 1Hz, 2 = 4.096KHz, 3 = 8.192KHz, 4 = 32.768KHz
     */
    ExpanderPiRTC.prototype.setFrequency = function (frequency) {
        switch (frequency) {
            case 1:
                config = updateByte(config, 0, 0);
                config = updateByte(config, 1, 0);
                break;
            case 2:
                config = updateByte(config, 0, 1);
                config = updateByte(config, 1, 0);
                break;
            case 3:
                config = updateByte(config, 0, 0);
                config = updateByte(config, 1, 1);
                break;
            case 4:
                config = updateByte(config, 0, 1);
                config = updateByte(config, 1, 1);
                break;
            default:
                throw new Error("Argument Out Of Range");
        }
        i2cWriteByte(CONTROL, config);
    };

    /**
     * Write to the memory on the DS1307
     * The DS1307 contains 56 - Byte, battery - backed RAM with Unlimited Writes
     * @param  {number} address - 0x08 to 0x3F
     * @param  {Uint8Array} valuearray - byte array containing data to be written to memory. Length can not exceed the avaiable address space.
     */
    ExpanderPiRTC.prototype.writeMemory = function (address, valuearray) {
        if (address + valuearray.length <= 0x3F) {
            if (address >= 0x08 && address <= 0x3F) {
                // create a new array with the address at the start of the array
                var data = new Uint8Array(valuearray.length + 1);
                data[0] = address;
                // copy the data from the valuearray into data
                for (var a = 0; a < data.length; a++) {
                    data[a + 1] = valuearray[a];
                }

                // write the array to the RTC memory
                rpio.i2cSetSlaveAddress(rtcAddress);
                rpio.i2cWrite(data);
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
     * The DS1307 contains 56 - Byte, battery - backed RAM with Unlimited Writes
     * @param  {Number} address - 0x08 to 0x3F
     * @param  {Number} length - Up to 32 bytes.  length can not exceed the avaiable address space.
     * @returns  {Uint8Array} - Returns an array of the data read from memory
     */
    ExpanderPiRTC.prototype.readMemory = function (address, length) {
        if (address >= 0x08 && address <= 0x3F) {
            if (address <= 0x3F - length) {
                var txbuf = new Uint8Array(1);
                var rxbuf = new Uint8Array(length);
                txbuf[0] = address;

                rpio.i2cSetSlaveAddress(rtcAddress);
                rpio.i2cWrite(txbuf);
                rpio.i2cRead(rxbuf, length);

                return rxbuf;
            }
            else {
                throw new Error("Memory overflow error: address + length exceeds 0x3F");
            }
        }
        else {
            throw new Error("Memory address outside of range: 0x08 to 0x3F");
        }
     };

    return ExpanderPiRTC;

})();

module.exports = ExpanderPiRTC;