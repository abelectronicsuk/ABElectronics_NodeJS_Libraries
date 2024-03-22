/** 
* ================================================
* AB Electronics UK Expander Pi - RTC SRAM memory demo
* Version 1.0 Created 19/06/2017
*
 * Requires rpio to be installed, install with: npm install rpio
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
* 
* run with: sudo node rtcmemory.js
* ================================================
*/

intToArray = function (int) {
    // we want to represent the input as an 8-bytes array
    var array = new Uint8Array([0, 0, 0, 0]);

    for (var i = 0; i < array.length; i++) {
        var byte = int & 0xff;
        array[i] = byte;
        int = (int - byte) / 256;
    }
    return array;
};

arrayToInt = function (array) {
    var int = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        int = (int * 256) + array[i];
    }
    return int;
};


// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

// create an rtc object
var rtc = new ExpanderPiRTC();

// create a number to save into memory

var a = 123456;

// convert the number into a Uint8Array array
var bytearray = intToArray(a);


// write the array to the RTC memory address 0x08

rtc.writeMemory(0x09, bytearray);

// read the data from memory into an array

var readarray = rtc.readMemory(0x09, bytearray.length);

// convert the array back into a number

var b = arrayToInt(readarray);

// print the number to the console

console.log(b);

