//
// ================================================
// ABElectronics Servo Pi PWM controller
// For use with the Servo Pi and Servo Pi Zero
// Version 1.0 Created 27/07/2016
// Requires rpio to be installed, install with: npm install rpio
// ================================================
//

ServoPi = (function () {

    // Define registers values from datasheet
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

    var i2caddress = 0x00;

    // rpio object and i2c address variable
    var rpio = require('rpio');

    // internal functions for reading and writing to the i2c bus
    function i2cReadByte(val) {
        var txbuf = new Buffer([val]);
        var rxbuf = new Buffer(1);
        rpio.i2cSetSlaveAddress(i2caddress);
        rpio.i2cWrite(txbuf);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    function i2cWriteByte(register, val) {
        rpio.i2cSetSlaveAddress(i2caddress);
        var txbuf = new Buffer([register, val]);
        rpio.i2cWrite(txbuf);
    }

    function ServoPi(address) {
        /// <summary>
        /// init object with i2c address, default is 0x40 for ServoPi board
        /// </summary>
        /// <param name="address"></param>
        i2caddress = address;
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(i2caddress);

        i2cWriteByte(MODE1, 0x00);
        // set GPIO pin 7 as an output for controlling the OE pin.
        rpio.open(7, rpio.OUTPUT, rpio.LOW);

    }



    ServoPi.prototype.setPWMFrequency = function (freq) {
        /// <summary>
        /// Set the PWM frequency
        /// </summary>
        /// <param name="freq"></param>
        /// <returns type=""></returns>

        var scaleval = 25000000.0;    // 25MHz
        scaleval /= 4096.0;       // 12 - bit
        scaleval /= freq;
        scaleval -= 1.0;
        var prescale = Math.floor(scaleval + 0.5);
        var oldmode = i2cReadByte(MODE1);
        var newmode = (oldmode & 0x7F) | 0x10;
        i2cWriteByte(MODE1, newmode);
        i2cWriteByte(PRE_SCALE, prescale);
        i2cWriteByte(MODE1, oldmode);
        //time.sleep(0.005);
        i2cWriteByte(MODE1, oldmode | 0x80);
    }

    ServoPi.prototype.setPWM = function (channel, on, off) {
        /// <summary>
        /// set the output on a single channel
        /// </summary>
        /// <param name="channel"></param>
        /// <param name="on"></param>
        /// <param name="off"></param>
        i2cWriteByte(LED0_ON_L + 4 * channel, on & 0xFF);
        i2cWriteByte(LED0_ON_H + 4 * channel, on >> 8);
        i2cWriteByte(LED0_OFF_L + 4 * channel, off & 0xFF);
        i2cWriteByte(LED0_OFF_H + 4 * channel, off >> 8);
    }

    ServoPi.prototype.setAllPWM = function (on, off) {
        /// <summary>
        /// set the output on all channels
        /// </summary>
        /// <param name="on"></param>
        /// <param name="off"></param>

        i2cWriteByte(ALL_LED_ON_L, on & 0xFF);
        i2cWriteByte(ALL_LED_ON_H, on >> 8);
        i2cWriteByte(ALL_LED_OFF_L, off & 0xFF);
        i2cWriteByte(ALL_LED_OFF_H, off >> 8);
    }

    ServoPi.prototype.outputDisable = function () {
        /// <summary>
        /// disable the output via OE pin
        /// </summary>
        rpio.write(7, rpio.HIGH);
    }

    ServoPi.prototype.outputEnable = function () {
        /// <summary>
        /// enable the output via OE pin
        /// </summary>
        rpio.write(7, rpio.LOW);
    }

    ServoPi.prototype.setAllCallAddress = function (address) {
        /// <summary>
        /// Set the I2C address for the All Call function
        /// </summary>
        /// <param name="address"></param>

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode | (1 << 0);
        i2cWriteByte(MODE1, newmode);
        i2cWriteByte(ALLCALLADR, address << 1);
    }

    ServoPi.prototype.enableAllCallAddress = function () {
        /// <summary>
        /// Enable the I2C address for the All Call function
        /// </summary>

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode | (1 << 0);
        i2cWriteByte(MODE1, newmode);
    }

    ServoPi.prototype.disableAllCallAddress = function () {
        /// <summary>
        /// Disable the I2C address for the All Call function
        /// </summary>

        var oldmode = i2cReadByte(MODE1);
        var newmode = oldmode & ~(1 << 0);
        i2cWriteByte(MODE1, newmode);
    }

    return ServoPi;

})();

module.exports = ServoPi;