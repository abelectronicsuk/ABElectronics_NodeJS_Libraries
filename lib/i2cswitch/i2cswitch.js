/** 
* ================================================
* AB Electronics UK I2C Switch controller
* For use with the 4-channel I2C Switch
*
* Version 1.0 Created 28/11/2019
* Version 1.1 Updated 22/03/2024
* 
* Requires rpio to be installed, install with: npm install rpio
* Requires i2c-switch to be installed, install with: npm install i2c-switch
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
    const rpio = require('rpio');

    const i2c = require('i2c-bus');

    const busnumber = 1; // The number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...

    /**
     * Private function for reading a byte from the i2c bus
     * @returns {number} - Value from selected register
     */
    function i2cReadByte() {
        var rxbuf = Buffer.alloc(1);
        const i2c1 = i2c.openSync(busnumber);
        i2c1.i2cReadSync(i2caddress, 1, rxbuf);
        i2c1.closeSync();
        return rxbuf[0];
    }

    /**
     * Private function for writing a byte to the i2c bus
     * @param  {number} val - Value to write
     */
    function i2cWriteByte(val) {
        var txbuf = Buffer.alloc(1, val);
        const i2c1 = i2c.openSync(busnumber);
        i2c1.i2cWriteSync(i2caddress, 1, txbuf);
        i2c1.closeSync();
    }

    /**
     * Private function for updating a single bit within a variable
     * @param  {number} oldByte - Variable to be updated
     * @param  {number} bit - The location of the bit to be changed
     * @param  {boolean} value - The new value for the bit.  true or false
     * @returns {number} - Updated number
     */
    function updateByte(oldByte, bit, value) {
        let newByte = 0;
        if (value === false) {
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
        if (byte & 1 << bit) { return 1; }
        else{return 0;}
        
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
        // set the GPIO reset pin as an output and set it high.
        rpio.open(RESETPIN, rpio.OUTPUT, rpio.HIGH);
    }


    /**
     * Enable the switch on the selected channel and disable all other channels
     * @param  {number} channel - 1 to 4
     */
    I2CSwitch.prototype.switchChannel = function (channel) {

        // check if the channel is within range
        if (channel < 1 || channel > 4){
            throw new Error("switchChannel: channel must be between 1 and 4");
        }

        // set the channel bit and write the value to the i2c port
        let i = 0;
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
        if (channel < 1 || channel > 4){
            throw new Error("setChannelState: channel must be between 1 and 4");
        }

        if (state !== true || state !== false){
            throw new Error("setChannelState: state must be true or false");
        }

        // set the bit for the selected channel and write the value to the i2c port
        let i = i2cReadByte();
        if (state === true){
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
        if (channel < 1 || channel > 4){
            throw new Error("getChannelState: channel must be between 1 and 4");
        }

        // set the channel bit and write the value to the i2c port
        let i = i2cReadByte();
        return checkBit(i, channel - 1,) === 1;      
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