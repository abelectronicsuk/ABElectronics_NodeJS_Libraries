/** 
* ================================================
* AB Electronics UK I2C Switch controller
* For use with the 4-channel I2C Switch
*
* Version 1.0 Created 28/11/2019
* Requires rpio to be installed, install with: npm install rpio
* ================================================
*/

/** Class representing the functions for the I2C Switch */
I2CSwitch = (function (address) {

    // Define GPIO Reset Pin
    const RESETPIN = 13;

    // local variables
    var ctl = 0x00;
    var i2caddress = 0x70;

    // rpio object and i2c address variable
    var rpio = require('rpio');

    /**
     * Private function for reading a byte from the i2c bus
     * @returns {number} - Value from selected register
     */
    function i2cReadByte() {
        var rxbuf = new Buffer(1);
        rpio.i2cSetSlaveAddress(i2caddress);
        rpio.i2cRead(rxbuf, 1);
        return rxbuf[0];
    }

    /**
     * Private function for writing a byte to the i2c bus
     * @param  {number} val - Value to write
     */
    function i2cWriteByte(val) {
        rpio.i2cSetSlaveAddress(i2caddress);
        var txbuf = new Buffer([val]);
        rpio.i2cWrite(txbuf);
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
     * Private function for reading the value of a single bit in a byte
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
     * Private function to sleep for several milliseconds
     */
    function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    /**
     * Initialize I2CSwitch object with i2c address, default is 0x70
     * @param  {number} address - 0x70 to 0x77
     */
    function I2CSwitch(address) {
        i2caddress = address;
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(i2caddress);

        // set the GPIO reset pin as an output and set it high.
        rpio.open(RESETPIN, rpio.OUTPUT, rpio.HIGH);
    }


    /**
     * Enable the switch on the selected channel and disable all other channels
     * @param  {number} channel - 1 to 4
     */
    I2CSwitch.prototype.switchChannel = function (channel) {

        // check if the channel is within range
        if (channel < 1 | channel > 4){
            throw new Error("switchChannel: channel must be between 1 and 4");
        }

        // set the channel bit and write the value to the i2c port
        var i = 0;
        i = updateByte(i, channel - 1, 1);
        i2cWriteByte(i);       
    };

    /**
     * Set the state of the specified channel while leaving the other channels in their current state.
     * @param  {number} channel - 1 to 4
     * @param  {boolean} channel - true = channel enabled, false = channel disabled
     */
    I2CSwitch.prototype.setChannelState = function (channel, state) {

        // check if the channel is within range
        if (channel < 1 | channel > 4){
            throw new Error("setChannelState: channel must be between 1 and 4");
        }

        if (state != true | state != false){
            throw new Error("setChannelState: state must be true or false");
        }

        // set the bit for the selected channel and write the value to the i2c port
        var i = i2cRead();
        if (state == true){
            i = updateByte(i, channel - 1, 1);
        }
        else{
            i = updateByte(i, channel - 1, 0);
        }
        i2cWriteByte(i);       
    };

    /**
     * Get the state of the specified channel
     * @param  {number} channel - 1 to 4
     * @returns {boolean} - true = channel enabled, false = channel disabled
     */
    I2CSwitch.prototype.getChannelState = function (channel) {

        // check if channel is within range
        if (channel < 1 | channel > 4){
            throw new Error("getChannelState: channel must be between 1 and 4");
        }

        // set the channel bit and write the value to the i2c port
        var i = i2cReadByte();
        if (checkBit(i, channel - 1,) == 1){
            return true;
        }
        else{
            return false;
        }      
    };

    /**
     * Reset the PCA9546A I2C switch.  
     * Resetting allows the PCA9546A to recover from a situation in which one of the downstream 
     * I2C buses are stuck in a low state.  All channels will be set to an off-state.
     */
    I2CSwitch.prototype.reset = function () {
        // set reset pin low
        rpio.write(RESETPIN, rpio.LOW);    
        // wait 1 millisecond before setting the pin high again
        sleep(1);
        rpio.write(RESETPIN, rpio.HIGH); 
        // wait another 1 millisecond for the device to reset
        sleep(1);
    };
 
    return I2CSwitch;

})();

module.exports = I2CSwitch;