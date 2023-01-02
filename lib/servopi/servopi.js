/** 
* ================================================
* AB Electronics UK Servo Pi PWM controller
* For use with the Servo Pi and Servo Pi Zero
*
* Version 2.0 Created 11/10/2018
* Requires rpio to be installed, install with: npm install rpio
* ================================================
*/

/** Class representing the PWM functions for the Servo Pi */
PWM = (function (address) {

    // Define registers values from the datasheet
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;
    const ALLCALLADR = 0x05;
    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;
    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;
    const PRE_SCALE = 0xFE;

    // define mode bits
    const MODE1_EXTCLK = 6; // use external clock
    const MODE1_SLEEP = 4; // sleep mode
    const MODE1_ALLCALL = 0; // all call address

    const MODE2_INVRT = 4; // invert output
    const MODE2_OCH = 3; // output type
    const MODE2_OUTDRV = 2; // output type
    const MODE2_OUTNE1 = 0; // output mode when not enabled

    // local variables
    var mode1_default = 0x00;
    var mode2_default = 0x0C;
    var i2caddress = 0x40;

    // rpio object and i2c address variable
    var rpio = require('rpio');

    /**
     * Read a byte from the i2c bus
     * @param  {number} register - Register address
     * @returns {number} - Value from selected register
     */
    function i2cReadByte(register) {
        var txbuf = new Buffer([register]);
        var rxbuf = new Buffer(1);
        rpio.i2cSetSlaveAddress(i2caddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    /**
     * Read a byte from the i2c bus
     * @param  {number} register - Register address
     * @param  {number} val - Value to write
     */
    function i2cWriteByte(register, val) {
        rpio.i2cSetSlaveAddress(i2caddress);
        var txbuf = new Buffer([register, val]);
        rpio.i2cWrite(txbuf);
    }
    
    /**
     * Internal method for reading the value of a single bit in a byte
     * @param  {number} byte - Number to be checked
     * @param  {number} bit - Bit position
     * @returns {number} - 0 or 1
     */
    function checkBit(byte, bit) {
        var value = 0;
        if (byte & 1 << bit) {
            value = 1;
        }
        return value;
    }

    /**
     * Initialize pwm object with i2c address, default is 0x40 for ServoPi board
     * @param  {number} address - 0x40 to 0x7F
     */
    function PWM(address) {
        i2caddress = address;
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(i2caddress);

        i2cWriteByte(MODE1, mode1_default);
        i2cWriteByte(MODE2, mode2_default);
        // set GPIO pin 7 as an output for controlling the OE pin.
        rpio.open(7, rpio.OUTPUT, rpio.LOW);
    }


    /**
     * Set the PWM frequency
     * @param  {number} freq - Frequency between 40 and 1000
     * @param  {number} calibration - Oscillator calibration offset. Use this to adjust for oscillator drift.  Value is normally between -10 and 10
     */
    PWM.prototype.setPWMFrequency = function (freq, calibration) {

        // check if the channel value was set
        if (calibration === undefined) calibration = 0;

        // check if the frequency is within range
        if (freq < 40 | freq > 1000){
            throw new Error("setPWMFrequency: frequency must be between 40 and 1000");
        }

        // calculate frequency register value
        var scaleval = 25000000.0;    // 25MHz
        scaleval /= 4096.0;       // 12 - bit
        scaleval /= freq;
        scaleval -= 1.0;
        var prescale = Math.floor(scaleval + 0.5);
        prescale = prescale + calibration;
        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode & 0x7F | 0x10;
        i2cWriteByte(MODE1, newmode);
        i2cWriteByte(PRE_SCALE, prescale);
        i2cWriteByte(MODE1, oldmode);
        i2cWriteByte(MODE1, oldmode | 0x80);
    };

    /**
     * Set the output on a single channel
     * @param  {number} channel - 1 to 16
     * @param  {number} on - 0 to 4095
     * @param  {number} off - 0 to 4095
     */
    PWM.prototype.setPWM = function (channel, on, off) {

        if (channel < 1 | channel > 16) {
            throw new Error("setPWM: channel out of range");
        }

        if (on < 0 | on > 4095) {
            throw new Error("setPWM: on out of range");
        }

        if (off < 0 | off > 4095) {
            throw new Error("setPWM: off out of range");
        }

        if (on > off) {
            throw new Error("setPWM: on greater than off");
        }

        channel = channel - 1;

        i2cWriteByte(LED0_ON_L + 4 * channel, on & 0xFF);
        i2cWriteByte(LED0_ON_H + 4 * channel, on >> 8);
        i2cWriteByte(LED0_OFF_L + 4 * channel, off & 0xFF);
        i2cWriteByte(LED0_OFF_H + 4 * channel, off >> 8);
    };

    /**
     * Set the on time on a single channel
     * @param  {number} channel - 1 to 16
     * @param  {number} on - 0 to 4095
     */
    PWM.prototype.setPWMOnTime = function (channel, on) {

        if (channel < 1 | channel > 16) {
            throw new Error("setPWMOnTime: channel out of range");
        }

        if (on < 0 | on > 4095) {
            throw new Error("setPWMOnTime: on out of range");
        }

        channel = channel - 1;
        on = Math.round(on);

        i2cWriteByte(LED0_ON_L + 4 * channel, on & 0xFF);
        i2cWriteByte(LED0_ON_H + 4 * channel, on >> 8);
    };

    /**
     * Set the off time on a single channel
     * @param  {number} channel - 1 to 16
     * @param  {number} off - 0 to 4095
     */
    PWM.prototype.setPWMOffTime = function (channel, off) {

        if (channel < 1 | channel > 16) {
            throw new Error("setPWMOffTime: channel out of range");
        }

        if (off < 0 | off > 4095) {
            throw new Error("setPWMOffTime: off out of range");
        }

        channel = channel - 1;
        off = Math.round(off);

        i2cWriteByte(LED0_OFF_L + 4 * channel, off & 0xFF);
        i2cWriteByte(LED0_OFF_H + 4 * channel, off >> 8);
    };

    /**
     * Get the off time on a single channel
     * @param  {number} channel - 1 to 16
     * @returns {number} - 0 to 4095
     */
    PWM.prototype.getPWMOffTime = function (channel) {

        if (channel < 1 | channel > 16) {
            throw new Error("setPWM: channel out of range");
        }

        channel = channel - 1;
        var lowbyte = i2cReadByte(LED0_OFF_L + 4 * channel);
        var highbyte = i2cReadByte(LED0_OFF_H + 4 * channel);
        var value = lowbyte | highbyte << 8;

        return value;
    };

    /**
     * Get the on time on a single channel
     * @param  {number} channel - 1 to 16
     * @returns {number} - 0 to 4095
     */
    PWM.prototype.getPWMOnTime = function (channel) {

        if (channel < 1 | channel > 16) {
            throw new Error("setPWM: channel out of range");
        }

        channel = channel - 1;
        var lowbyte = i2cReadByte(LED0_ON_L + 4 * channel);
        var highbyte = i2cReadByte(LED0_ON_H + 4 * channel);
        var value = lowbyte | highbyte << 8;

        return value;
    };

    
    /**
     * Set the output on all channels
     * @param  {number} on - 0 to 4095
     * @param  {number} off - 0 to 4095
     */
    PWM.prototype.setAllPWM = function (on, off) {
        i2cWriteByte(ALL_LED_ON_L, on & 0xFF);
        i2cWriteByte(ALL_LED_ON_H, on >> 8);
        i2cWriteByte(ALL_LED_OFF_L, off & 0xFF);
        i2cWriteByte(ALL_LED_OFF_H, off >> 8);
    };

    
    /**
     * Disable the output via the OE pin
     */
    PWM.prototype.outputDisable = function () {
        rpio.write(7, rpio.HIGH);
    };

    /**
     * Enable the output via the OE pin
     */
    PWM.prototype.outputEnable = function () {
        rpio.write(7, rpio.LOW);
    };

    
    /**
     * Set the I2C address for the All Call function
     * @param  {number} address - New I2C address for all call function
     */
    PWM.prototype.setAllCallAddress = function (address) {

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode | 1 << 0;
        i2cWriteByte(MODE1, newmode);
        i2cWriteByte(ALLCALLADR, address << 1);
    };

    /**
     * Enable the I2C address for the All Call function
     */
    PWM.prototype.enableAllCallAddress = function () {

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode | 1 << 0;
        i2cWriteByte(MODE1, newmode);
    };

    /**
     * Disable the I2C address for the All Call function
     */
    PWM.prototype.disableAllCallAddress = function () {

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode & ~(1 << 0);
        i2cWriteByte(MODE1, newmode);
    };

    /**
     * Put the device into a sleep state
     */
    PWM.prototype.sleep = function () {

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode | 1 << MODE1_SLEEP;
        i2cWriteByte(MODE1, newmode);
    };

    /**
     * Wake the device from its sleep state
     */
    PWM.prototype.wake = function () {

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode & ~(1 << MODE1_SLEEP);
        i2cWriteByte(MODE1, newmode);
    };

    /**
     * Check the sleep status of the device
     * @returns {boolean} - true = sleeping, false = awake
     */
    PWM.prototype.isSleeping = function () {
        /// <summary>
        /// Check the sleep status of the device
        /// </summary>

        var regval = i2cReadByte(MODE1);
        if (checkBit(regval, MODE1_SLEEP)) {
            return true;
        } else {
            return false;
        }
    };

    
    /**
     * Invert the PWM output on all channels
     * @param  {boolean} state - True = inverted, False = non-inverted
     */
    PWM.prototype.invertOutput = function (state) {

        var oldmode, newmode;
        if (state === true) {
            oldmode = i2cReadByte(MODE2);
            newmode = oldmode | 1 << MODE2_INVRT;
            i2cWriteByte(MODE2, newmode);
        } else {
            oldmode = i2cReadByte(MODE2);
            newmode = oldmode & ~(1 << MODE2_INVRT);
            i2cWriteByte(MODE2, newmode);
        }
    };

    return PWM;

})();

module.exports = PWM;

/** Class for controlling RC servos with the Servo Pi */
Servo = (function (address, low_limit, high_limit, reset) {

    var pwm = new PWM(0x40);
    var position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var lowpos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var highpos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var useoffset = false;
    var offset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var frequency = 50;

    /** Private function for refreshing the pulse position of each channel */
    function refreshChannels() {
        for (var i = 0; i < 16; i++) {
            if (position[i] === 0) {
                pwm.setPWM(i + 1, 0, 0);
            }
            else {
                if (useoffset === true) {
                    pwm.setPWM(i + 1, offset[i], position[i] + offset[i]);
                    
                }
                else {
                    pwm.setPWM(i + 1, 0, position[i]);
                }
            }
        }
    }

    /** Private function to calculate the start positions to stagger the servo position pulses */
    function calculateOffsets() {
        var x = 0;
        for (var i = 0; i < 16; i++) {
            x = x + highpos[i];
            if (x > 4095 - highpos[i]) {
                x = highpos[0] / 2;
            }
            offset[i] = x;
        }
        refreshChannels();
    }


    /**
     * Initialize the Servo object with default parameters
     * @param  {number} address - I2C address 0x40 to 0x7F
     * @param  {number} low_limit - Lower servo limit in milliseconds.  Typically 1.0
     * @param  {number} high_limit - Upper servo limit in milliseconds. Typically 2.0
     * @param  {boolean} reset - True = All channels reset to default off state, False = All channels retain their current state
     */
    function Servo(address, low_limit, high_limit, reset) {
        if (address === undefined) address = 0x40;
        if (low_limit === undefined) low_limit = 1.0;
        if (high_limit === undefined) high_limit = 2.0;
        if (reset === undefined) reset = true;

        pwm.address = address;
        this.setLowLimit(low_limit);
        this.setHighLimit(high_limit);

        if (reset === true){
            pwm.setPWMFrequency(50);
            calculateOffsets(); // reset the offset values
        }
        else{
            for (var i = 0; i < 16; i++) {
                offset[i] = pwm.getPWMOnTime(i + 1);
                position[i] = pwm.getPWMOffTime(i + 1);
            }
        }
    }

    /**
     * Move the servo to a new position
     * @param  {number} channel - 1 to 16
     * @param  {number} servopos - 0 to the number of steps
     * @param  {number} steps - Number of steps.  Typically 250 for an RC servo.
     */
    Servo.prototype.move = function (channel, servopos, steps) {

        // check if steps value was set
        if (steps === undefined) steps = 250;

        // set the position of the servo

        if (channel < 1 | channel > 16) {
            throw new Error("move: channel out of range");
        }

        if (steps < 0 | steps > 4095) {
            throw new Error("move: steps out of range");
        }

        if (servopos >= 0 && servopos <= steps) {
            high = highpos[channel - 1];
            low = lowpos[channel - 1];
            
            var pwm_value = ((high - low) / steps) * servopos + low;            

            position[channel - 1] = pwm_value;

            if (useoffset) {
                pwm.setPWM(channel, offset[channel - 1], pwm_value + offset[channel - 1]);
            }
            else {
                pwm.setPWM(channel,0, pwm_value);
            }
        }
        else {
            throw new Error("move: position out of range");
        }
    };

    /**
     * Get the current position of the servo.
     * Due to rounding errors the returned value may differ from the set value when steps is above 250.
     * @param  {number} channel - 1 to 16
     * @param  {number} steps - Number of steps.
     * @returns {number} - current position
     */
    Servo.prototype.getPosition = function (channel, steps) {

        // check if the steps value was set
        if (steps === undefined) steps = 250;

        // get the position of the servo

        if (channel < 1 | channel > 16) {
            throw new Error("move: channel out of range");
        }

        var pwm_value = pwm.getPWMOffTime(channel);

        if (useoffset) {
            pwm_value = pwm_value - offset[channel - 1];
        }

        var high = highpos[channel - 1];
        var low = lowpos[channel - 1];

        var position = Math.ceil(steps * (pwm_value - low) / (high - low));

        return position;
    };

    /**
     * Set the low limit in milliseconds
     * @param  {number} low_limit - Typically 1.0 milliseconds. Setting the value too low may damage your servo.
     * @param  {number} channel - 1 to 16. If the channel is omitted or set as 0 the value will be set for all channels.
     */
    Servo.prototype.setLowLimit = function (low_limit, channel) {

        // check if the channel value was set
        if (channel === undefined) channel = 0;

        if (channel < 0 | channel > 16) {
            throw new Error("setLowLimit: channel out of range");
        }

        var a = Math.round(4096.0 * (low_limit / 1000.0) * frequency);

        if (a < 0 | a > 4095) {
            throw new Error("setLowLimit: low limit out of range");
        }

        if (channel >= 1 && channel <= 16) {
            // update the specified channel
            lowpos[channel - 1] = a;
        }
        else {
            // no channel specified so update all channels
            for (var i = 0; i < 16; i++) {
                lowpos[i] = a;
            }
        }

        calculateOffsets();  // update the offset values
    };

     /**
     * Set the high limit in milliseconds
     * @param  {number} high_limit - Typically 2.0 milliseconds. Setting the value too high may damage your servo.
     * @param  {number} channel - 1 to 16. If the channel is omitted or set as 0 the value will be set for all channels.
     */
    Servo.prototype.setHighLimit = function (high_limit, channel) {

        // check if the channel value was set
        if (channel === undefined) channel = 0;

        if (channel < 0 | channel > 16) {
            throw new Error("setHighLimit: channel out of range");
        }

        var a = Math.round(4096.0 * (high_limit / 1000.0) * frequency);

        if (a < 0 | a > 4095) {
            throw new Error("setHighLimit: high limit out of range");
        }

        if (channel >= 1 && channel <= 16) {
            // update the specified channel
            highpos[channel - 1] = a;
        }
        else {
            // no channel specified so update all channels
            for (var i = 0; i < 16; i++) {
                highpos[i] = a;
            }
        }

        calculateOffsets();  // update the offset values
    };

    /**
     * Set the PWM frequency
     * @param  {number} freq - Frequency, typically 50 for an RC servo.
     * @param  {number} calibration - Oscillator calibration offset. Use this to adjust for oscillator drift.  Value is normally between -10 and 10
     */
    Servo.prototype.setFrequency = function (freq, calibration) {

        // check if the channel value was set
        if (calibration === undefined) calibration = 0;

        pwm.setPWMFrequency(freq, calibration);
        frequency = freq;
    };

    /**
     * Disable the output via the OE pin
     */
    Servo.prototype.outputDisable = function () {
        pwm.outputDisable();
    };

    /**
     * Disable the output via the OE pin
     */
    Servo.prototype.outputEnable = function () {
        pwm.outputEnable();
        calculateOffsets(false);  // update the offset values
    };

    /**
     * Enable pulse offsets
     * This will set servo pulses to be staggered across the channels to reduce surges in the current draw
     */
    Servo.prototype.offsetEnable = function () {
        useoffset = true;
        calculateOffsets(true); // update the offset values
    };

    /**
     * Disable pulse offsets
     * This will set all servo pulses to start at the same time
     */
    Servo.prototype.offsetDisable = function () {
        useoffset = false;
        refreshChannels(); // refresh the channel locations
    };

    /**
     * Put the device into a sleep state
     */
    Servo.prototype.sleep = function () {
        pwm.sleep();
    };

    /**
     * Wake the device from its sleep state
     */
    Servo.prototype.wake = function () {
        pwm.wake();
    };

    /**
     * Check the sleep status of the device
     * @returns {boolean} - true = sleeping, false = awake
     */
    Servo.prototype.isSleeping = function () {
        return pwm.isSleeping();
    };

    return Servo;

})();

module.exports = Servo;

/** 
 * Legacy class for backwards compatibility with version 1.0 library. 
 * Use the PWM class or Servo class for new projects.
*/
ServoPi = (function () {

    var pwm;

    function ServoPi(address) {
        pwm = new PWM(address);
    }

    ServoPi.prototype.setPWMFrequency = function (freq, calibration) {
        if (calibration === undefined) calibration = 0;
        pwm.setPWMFrequency(freq, calibration);
    };

    ServoPi.prototype.setPWM = function (channel, on, off) {
        pwm.setPWM(channel, on, off);
    };

    ServoPi.prototype.setAllPWM = function (on, off) {
        pwm.setAllPWM(on, off);
    };

    ServoPi.prototype.outputDisable = function () {
        pwm.outputDisable();
    };

    ServoPi.prototype.outputEnable = function () {
        pwm.outputEnable();
    };

    ServoPi.prototype.setAllCallAddress = function (address) {
        pwm.setAllCallAddress(address);
    };

    ServoPi.prototype.enableAllCallAddress = function () {
        pwm.enableAllCallAddress();
    };

    ServoPi.prototype.disableAllCallAddress = function () {
        pwm.disableAllCallAddress();
    };

    return ServoPi;

})();

module.exports = ServoPi;

