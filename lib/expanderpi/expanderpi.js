//
// ================================================
// ABElectronics Expander Pi - 32 Digital IO, 8 ADC, 2 DAC and a real-time clock
// For use with the Expander Pi
// Version 1.0 Created 19/06/2017
// 
// Requires rpio to be installed, install with: npm install rpio
// 
// ================================================
//
var rpio = require('rpio');

ExpanderPiADC = (function () {

    var adc;
    var adcRefVoltage = 3.3;  //reference voltage for the ADC chip.
    var tx = new Buffer([0x01, 0xC0, 0x00]);
    var rx = new Buffer([0, 0, 0]);
    var out;

    function ExpanderPiADC() {
        /// <summary>
        /// Connect to the SPI bus and set the parameters
        /// </summary>

        rpio.spiBegin();
        rpio.spiSetCSPolarity(0, rpio.LOW);
        rpio.spiSetDataMode(0);
        
    }

    ExpanderPiADC.prototype.readADCRaw = function (channel, mode) {
        /// <summary>
        /// Returns the raw value from the selected ADC channel
        /// </summary>
        /// <param name="channel" type="Number">1 to 8</param>
        /// <param name="mode" type="Number">Mode: 0 = Single Ended or 1 = Differential</param>
        /// When in differential mode setting channel to 1 will make IN1 = IN+ and IN2 = IN-
        /// When in differential mode setting channel to 2 will make IN1 = IN- and IN2 = IN+
        /// When in differential mode setting channel to 3 will make IN3 = IN+ and IN4 = IN-
        /// When in differential mode setting channel to 4 will make IN3 = IN- and IN4 = IN+
        /// When in differential mode setting channel to 5 will make IN5 = IN+ and IN6 = IN-
        /// When in differential mode setting channel to 6 will make IN5 = IN- and IN6 = IN+
        /// When in differential mode setting channel to 7 will make IN7 = IN+ and IN8 = IN-
        /// When in differential mode setting channel to 8 will make IN7 = IN- and IN8 = IN+
        /// <returns type="Number">Returns 12 bit value between 0 and 4096</returns>

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
    }

    ExpanderPiADC.prototype.readADCVoltage = function (channel, mode) {

        /// <summary>
        /// Returns the voltage from the selected ADC channel
        /// </summary>
        /// <param name="channel" type="Number">1 to 8</param>
        /// <param name="mode" type="Number">Mode: 0 = Single Ended or 1 = Differential</param>
        /// When in differential mode setting channel to 1 will make IN1 = IN+ and IN2 = IN-
        /// When in differential mode setting channel to 2 will make IN1 = IN- and IN2 = IN+
        /// When in differential mode setting channel to 3 will make IN3 = IN+ and IN4 = IN-
        /// When in differential mode setting channel to 4 will make IN3 = IN- and IN4 = IN+
        /// When in differential mode setting channel to 5 will make IN5 = IN+ and IN6 = IN-
        /// When in differential mode setting channel to 6 will make IN5 = IN- and IN6 = IN+
        /// When in differential mode setting channel to 7 will make IN7 = IN+ and IN8 = IN-
        /// When in differential mode setting channel to 8 will make IN7 = IN- and IN8 = IN+
        /// <returns type="Number">Returns voltage between 0 and vref</returns>
        var raw = this.readADCRaw(channel, mode);

        var voltage = (adcRefVoltage / 4096) * raw;
        return voltage;
    }

    ExpanderPiADC.prototype.setADCRefVoltage = function (voltage) {

        /// <summary>
        /// Sets the reference voltage for the ADC
        /// </summary>
        /// <param name="voltage" type="Number">This should be the voltage as measured on the Raspberry Pi 3.3V power rail.</param>

        adcRefVoltage = voltage;
    }

    return ExpanderPiADC;

})();

module.exports = ExpanderPiADC;



ExpanderPiDAC = (function () {

    var dac;
    var maxDacVoltage = 2.048; // maximum voltage for the DAC output
    var dacGain = 1;

    var tx = new Buffer([0x00, 0x00]);
    var rx = new Buffer(2);
    

    function ExpanderPiDAC() {
        /// <summary>
        /// Connect to the SPI bus and set the parameters
        /// </summary>

        rpio.spiBegin();        
        rpio.spiSetCSPolarity(1, rpio.LOW);        
        rpio.spiSetDataMode(0);

    }


    ExpanderPiDAC.prototype.setDACVoltage = function (channel, voltage) {
        /// <summary>
        /// Set the DAC voltage.
        /// </summary>
        /// <param name="channel">1 or 2</param>
        /// <param name="voltage">voltage can be between 0 and 2.047 volts when gain is 1 or 0 and 3.3V when gain is 2</param>

        if (channel < 1 || channel > 2) {
            throw new Error("Channel Out Of Range");
        }

        if (voltage < 0 || voltage > maxDacVoltage) {
            throw new Error("Voltage Out Of Range");
        }

        var rawval = ((voltage / 2.048) * 4096) / dacGain; // convert the voltage into a raw value
        this.setDACRaw(channel, rawval); // set the raw value

    }

    ExpanderPiDAC.prototype.setDACRaw = function (channel, value) {
        /// <summary>
        /// Set the raw value for the selected dac channel
        /// </summary>
        /// <param name="channel">1 to 2</param>
        /// <param name="value">0 to 4095</param>

        if (channel < 1 || channel > 2) {
            throw new Error("Channel Out Of Range");
        }

        if (value < 0 || value > 4095) {
            throw new Error("Value Out Of Range");
        }              

        tx[1] = (value & 0xff);
        tx[0] = (((value >> 8) & 0xff) | (channel - 1) << 7 | 0x1 << 5 | 1 << 4);

        if (dacGain == 2) {
            tx[0] = (tx[0] &= ~(1 << 5));
        }
        rpio.spiChipSelect(1);			/* Use CE1 */
        rpio.spiSetClockDivider(14);
        rpio.spiTransfer(tx, rx, 2);

    }

    ExpanderPiDAC.prototype.setDACGain = function (gain) {
        /// <summary>
        /// Set the gain for the DAC.  This is used to set the output based on the reference voltage of 2.048V.
        /// When the gain is set to 2 the maximum voltage will be approximately 3.3V.
        /// </summary>
        /// <param name="gain">1 or 2</param>
        /// <returns type=""></returns>
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
    }

    ExpanderPiDAC.prototype.closeSPI = function () {
        /// <summary>
        /// Close the SPI bus
        /// </summary>
        dac.close();
    }


    return ExpanderPiDAC;

})();

module.exports = ExpanderPiDAC;

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

    function ExpanderPiIO() {
        /// <summary>
        /// Initialize the I2C bus based on the supplied address
        /// Load the default configuration, all pins are inputs with pull- ups disabled
        /// </summary>
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
    // local methods

    // <summary>
    // Internal function for updating the configuration to the selected channel
    // </summary>
    // <param name="channel">ADC channel, 1 - 8</param>

    ExpanderPiIO.prototype.i2cReadByte = function (val) {
        var txbuf = new Buffer([val]);
        var rxbuf = new Buffer(1);
        rpio.i2cSetSlaveAddress(this.i2caddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    ExpanderPiIO.prototype.i2cWriteByte = function (register, val) {
        rpio.i2cSetSlaveAddress(this.i2caddress);
        var txbuf = new Buffer([register, val]);
        var rxbuf = new Buffer(1);
        rpio.i2cWrite(txbuf);
    }


    updateByte = function (oldByte, bit, value) {
        // internal function for setting the value of a single bit within a byte
        var newByte = 0;
        if (value == false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return (newByte);
    }

    // <summary>
    // Internal function for updating the configuration to the selected channel
    // </summary>
    // <param name="channel">ADC channel, 1 - 8</param>
    function checkBit(num, bit) {
        return ((num >> bit) % 2 != 0)
    }

    // public methods

    ExpanderPiIO.prototype.setPinDirection = function (pin, direction) {
        //
        // set IO direction for an individual pin
        // pins 1 to 16
        // direction 1 = input, 0 = output
        //
        pin = pin - 1;
        if (pin < 8) {
            this.portADir = updateByte(this.portADir, pin, direction);
            this.i2cWriteByte(IODIRA, portADir);
        } else {
            this.portBDir = updateByte(this.portBDir, pin - 8, direction);
            this.i2cWriteByte(IODIRB, portBDir);
        }
    }

    ExpanderPiIO.prototype.setPortDirection = function (port, direction) {
        //
        // set direction for an IO port
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        // 1 = input, 0 = output
        //
        if (port == 1) {
            this.i2cWriteByte(IODIRB, direction);
            this.portBDir = direction;
        }
        else {
            this.i2cWriteByte(IODIRA, direction);
            this.portADir = direction;
        }
    }

    ExpanderPiIO.prototype.setPinPullup = function (pinval, value) {
        //
        // set the internal 100K pull-up resistors for an individual pin
        // pins 1 to 16
        // value 1 = enabled, 0 = disabled
        //
        pin = pinval - 1;
        if (pin < 8) {
            this.portAPullup = updateByte(this.portAPullup, pin, value);
            this.i2cWriteByte(GPPUA, this.portAPullup);
        } else {
            this.portBPullup = updateByte(this.portBPullup, pin - 8, value);
            this.i2cWriteByte(GPPUB, this.portBPullup);
        }
    }

    ExpanderPiIO.prototype.setPortPullups = function (port, value) {
        //
        // set the internal 100K pull-up resistors for the selected IO port
        //
        if (port == 1) {
            this.portBPullup = value;
            this.i2cWriteByte(GPPUB, value);
        } else {
            this.portAPullup = value;
            this.i2cWriteByte(GPPUA, value);
        }
    }

    ExpanderPiIO.prototype.writePin = function (pin, value) {
        //
        //  write to an individual pin 1 - 16
        //
        pin = pin - 1;
        if (pin < 8) {
            this.portAVal = updateByte(this.portAVal, pin, value)
            this.i2cWriteByte(GPIOA, this.portAVal)
        } else {
            this.portBVal = updateByte(this.portBVal, pin - 8, value)
            this.i2cWriteByte(GPIOB, this.portBVal)
        }
    }

    ExpanderPiIO.prototype.writePort = function (port, value) {
        //
        // write to all pins on the selected port
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        // value = number between 0 and 255 or 0x00 and 0xFF
        //
        if (port == 1) {
            this.i2cWriteByte(GPIOB, value);
            this.portBVal = value;
        } else {
            this.i2cWriteByte(GPIOA, value);
            this.portAVal = value;
        }
    }

    ExpanderPiIO.prototype.readPin = function (pinval) {
        //
        // read the value of an individual pin 1 - 16
        //  returns 0 = logic level low, 1 = logic level high
        //
        pin = pinval - 1;
        if (pin < 8) {
            this.portAVal = this.i2cReadByte(GPIOA);
            return checkBit(this.portAVal, pin);
        } else {
            pin = pin - 8
            this.portBVal = this.i2cReadByte(GPIOB);
            return checkBit(this.portBVal, pin);
        }
    }

    ExpanderPiIO.prototype.readPort = function (port) {
        //
        // read all pins on the selected port
        //  port 0 = pins 1 to 8, port 1 = pins 8 to 16
        //  returns number between 0 and 255 or 0x00 and 0xFF
        //
        if (port == 1) {
            this.portBVal = this.i2cReadByte(GPIOB);
            return this.portBVal;
        } else {
            this.portAVal = this.i2cReadByte(GPIOA);
            return this.portAVal;
        }
    }

    ExpanderPiIO.prototype.invertPort = function (port, polarity) {
        //
        // invert the polarity of the pins on a selected port
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        // polarity 0 = same logic state of the input pin, 1 = inverted logic
        // state of the input pin
        //
        if (port == 1) {
            this.i2cWriteByte(IPOLB, polarity);
            this.portBPolarity = polarity;
        } else {
            this.i2cWriteByte(IPOLA, polarity);
            this.portAPolarity = polarity;
        }
    }

    ExpanderPiIO.prototype.invertPin = function (pin, polarity) {
        //
        // invert the polarity of the selected pin
        //  pins 1 to 16
        //  polarity 0 = same logic state of the input pin, 1 = inverted logic
        //  state of the input pin
        //
        pin = pin - 1;
        if (pin < 8) {
            this.portAPolarity = updateByte(this.portAPolarity, pin, polarity);
            this.i2cWriteByte(IPOLA, this.portAPolarity);
        } else {
            this.portBPolarity = updateByte(this.portBPolarity, pin - 8, polarity);
            this.i2cWriteByte(IPOLB, this.portBPolarity);
        }
    }

    ExpanderPiIO.prototype.mirrorInterrupts = function (value) {
        //
        // 1 = The INT pins are internally connected, 0 = The INT pins are not
        // connected. INTA is associated with PortA and INTB is associated with
        // PortB
        //
        if (value == 0) {
            this.config = updateByte(this.config, 6, 0);
        }
        if (value == 1) {
            this.config = updateByte(this.config, 6, 1);
        }
        this.i2cWriteByte(IOCON, this.config);

    }

    ExpanderPiIO.prototype.setInterruptPolarity = function (value) {
        //
        // This sets the polarity of the INT output pins - 1 = Active-high.
        //  0 = Active-low.
        //
        if (value == 0) {
            this.config = updateByte(this.config, 1, 0);
        }
        if (value == 1) {
            this.config = updateByte(this.config, 1, 1);

        }
        this.i2cWriteByte(IOCON, this.config);
    }

    ExpanderPiIO.prototype.setInterruptType = function (port, value) {
        //
        // Sets the type of interrupt for each pin on the selected port
        // 1 = interrupt is fired when the pin matches the default value
        // 0 = the interrupt is fired on state change
        //
        if (port == 0) {
            this.i2cWriteByte(INTCONA, value);
        } else {
            this.i2cWriteByte(INTCONB, value);
        }
    }

    ExpanderPiIO.prototype.setInterruptDefaults = function (port, value) {
        //
        // These bits set the compare value for pins configured for
        // interrupt-on-change on the selected port.
        // If the associated pin level is the opposite from the register bit, an
        // interrupt occurs.
        //
        if (port == 0) {
            this.i2cWriteByte(DEFVALA, value);
        } else {
            this.i2cWriteByte(DEFVALB, value);
        }
    }

    ExpanderPiIO.prototype.setInterruptOnPort = function (port, value) {
        //
        // Enable interrupts for the pins on the selected port
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        // value = number between 0 and 255 or 0x00 and 0xFF
        //
        if (port == 0) {
            this.i2cWriteByte(GPINTENA, value);
            intA = value;
        } else {
            this.i2cWriteByte(GPINTENB, value);
            intB = value;
        }
    }

    ExpanderPiIO.prototype.setInterruptOnPin = function (pin, value) {
        //
        // Enable interrupts for the selected pin
        // Pin = 1 to 16
        // Value 0 = interrupt disabled, 1 = interrupt enabled
        //
        pin = pin - 1;
        if (pin < 8) {
            this.intA = updateByte(this.intA, pin, value);
            this.i2cWriteByte(GPINTENA, this.intA);
        } else {
            this.intB = updateByte(this.intB, pin - 8, value);
            this.i2cWriteByte(GPINTENB, this.intB);
        }
    }

    ExpanderPiIO.prototype.readInterruptStatus = function (port) {
        //
        // read the interrupt status for the pins on the selected port
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        //
        if (port == 0) {
            return this.i2cReadByte(INTFA);
        } else {
            return this.i2cReadByte(INTFB);
        }
    }

    ExpanderPiIO.prototype.readInterruptCapture = function (port) {
        //
        // read the value from the selected port at the time of the last
        // interrupt trigger
        // port 0 = pins 1 to 8, port 1 = pins 8 to 16
        //
        if (port == 0) {
            return this.i2cReadByte(INTCAPA);
        }
        else {
            return this.i2cReadByte(INTCAPB);
        }
    }

    ExpanderPiIO.prototype.resetInterrupts = function () {
        //
        // set the interrupts A and B to 0
        //
        this.readInterruptCapture(0);
        this.readInterruptCapture(1);
    }


    return ExpanderPiIO;

})();

module.exports = ExpanderPiIO;



ExpanderPiRTC = (function () {

    // Define registers values from datasheet
    const SECONDS = 0x00
    const MINUTES = 0x01
    const HOURS = 0x02
    const DAYOFWEEK = 0x03
    const DAY = 0x04
    const MONTH = 0x05
    const YEAR = 0x06
    const CONTROL = 0x07

    // variables
    var rtcAddress = 0x68  // I2C address
    // initial configuration - square wave and output disabled, frequency set
    // to 32.768KHz.
    var config = 0x03
    // the DS1307 does not store the current century so that has to be added on
    // manually.
    var century = 2000

    function ExpanderPiRTC() {
        /// <summary>
        //  Initialise the RTC Pi I2C connection and set the default configuration to the control register
        /// </summary>
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(rtcAddress);
        i2cWriteByte(CONTROL, config);
    }
    // local methods

    function i2cWriteByte(register, val) {
        /// <summary>
        /// Write a single byte to the I2C bus.
        /// </summary>
        /// <param name="register">Register to write to</param>
        /// <param name="val">Value to be written</param>
        var txbuf = new Buffer([register, val]);
        rpio.i2cSetSlaveAddress(rtcAddress);
        rpio.i2cWrite(txbuf);
    }


    function updateByte(oldByte, bit, value) {
        /// <summary>
        /// Internal function for updating a single bit within a variable
        /// </summary>
        /// <param name="oldByte" type="Number">Variable to be updated</param>
        /// <param name="bit" type="Number">The location of the bit to be changed</param>
        /// <param name="value" type="Boolean">The new value for the bit.  true or false</param>
        var newByte = 0;
        if (value == false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return (newByte);
    }


    function bcdToDec(val) {
        /// <summary>
        /// Internal function for converting BCD formatted number to decimal.
        /// </summary>
        /// <param name="x">Number to convert</param>
        /// <returns type="Number">Decimal formatted number</returns>
        return val - 6 * (val >> 4);
    }

    function decToBcd(val) {
        /// <summary>
        /// Internal function for converting decimal to BCD formatted number
        /// </summary>
        /// <param name="val">Number to convert</param>
        /// <returns type="">BCD formatted number</returns>
        return (((val / 10) << 4) | (val % 10));
    }

    function getCentury(val) {
        /// <summary>
        /// Internal function for calculating the current century
        /// </summary>
        /// <param name="val">Year</param>
        if (val.length > 2) {
            var y = val[0] + val[1];
            century = int(y) * 100;
        }
    }



    // public methods
    ExpanderPiRTC.prototype.setDate = function (date) {
        /// <summary>
        /// Set the date and time on the RTC
        /// </summary>
        /// <param name="date" type="Date">Use a javascript Date object</param>

        getCentury(date.getFullYear())
        i2cWriteByte(SECONDS, decToBcd(date.getSeconds()));
        i2cWriteByte(MINUTES, decToBcd(date.getMinutes()));
        i2cWriteByte(HOURS, decToBcd(date.getHours()));
        i2cWriteByte(DAYOFWEEK, decToBcd(date.getDay()));
        i2cWriteByte(DAY, decToBcd(date.getDate()));
        i2cWriteByte(MONTH, decToBcd(date.getMonth() - 1));
        i2cWriteByte(YEAR, decToBcd(date.getFullYear() - century));
       
    }

    ExpanderPiRTC.prototype.readDate = function () {
        /// <summary>
        /// Read the date and time from the RTC
        /// </summary>
        /// <returns type="Date">Returns the date as a javascript Date object</returns>

        var txbuf = new Buffer(1);
        var rxbuf = new Buffer(7);
        txbuf[0] = 0;
        rpio.i2cSetSlaveAddress(rtcAddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 7);

        var d = new Date(bcdToDec(rxbuf[6]) + century, bcdToDec(rxbuf[5]), bcdToDec(rxbuf[4]), bcdToDec(rxbuf[2]), bcdToDec(rxbuf[1]), bcdToDec(rxbuf[0]),0);

        return d;
    }

    ExpanderPiRTC.prototype.enableOutput = function () {
        /// <summary>
        /// Enable the output pin
        /// </summary>

        config = updateByte(config, 7, 1);
        config = updateByte(config, 4, 1);
        i2cWriteByte(CONTROL, config);
    }

    ExpanderPiRTC.prototype.disableOutput = function () {
        /// <summary>
        /// Disable the output pin
        /// </summary>

        config = updateByte(config, 7, 0);
        config = updateByte(config, 4, 0);
        i2cWriteByte(CONTROL, config);
    }

    ExpanderPiRTC.prototype.setFrequency = function (frequency) {
        /// <summary>
        /// Set the frequency of the output pin square- wave
        /// </summary>
        /// <param name="frequency" type="Number">1 = 1Hz, 2 = 4.096KHz, 3 = 8.192KHz, 4 = 32.768KHz</param>

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
    }

    ExpanderPiRTC.prototype.writeMemory = function (address, valuearray) {
        /// <summary>
        /// Write to the memory on the DS1307
        /// The DS1307 contains 56 - Byte, battery - backed RAM with Unlimited Writes
        /// </summary>
        /// <param name="address" type="Number">0x08 to 0x3F</param>
        /// <param name="valuearray" type="Uint8Array">byte array containing data to be written to memory</param>
        if (address + valuearray.length <= 0x3F) {
            if ((address >= 0x08) && (address <= 0x3F)) {
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
                return true;
            }
            else {
                throw new Error("Memory address outside of range: 0x08 to 0x3F");
            }
        }
        else {
            throw new Error("Array is larger than the available memory space");
        }

    }

    ExpanderPiRTC.prototype.readMemory = function (address, length) {
        /// <summary>
        /// Read from the memory on the DS1307
        /// The DS1307 contains 56 - Byte, battery - backed RAM with Unlimited Writes
        /// </summary>
        /// <param name="address" type="Number">0x08 to 0x3F</param>
        /// <param name="length" type="Number">Up to 32 bytes.  length can not exceed the avaiable address space.</param>
        /// <returns type="Uint8Array">Returns an array of the data read from memory</returns>
        if (address >= 0x08 && address <= 0x3F) {
            if (address <= (0x3F - length)) {
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
     }

    return ExpanderPiRTC;

})();

module.exports = ExpanderPiRTC;