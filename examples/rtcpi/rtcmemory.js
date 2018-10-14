/** 
* ================================================
* ABElectronics RTC Pi demo
* Version 1.0 Created 26/07/2016
* 
* Requires rpio to be installed, install with: npm install rpio
* run with: sudo node rtcmemory.js
* ================================================
*/

intToArray = function (int) {
    // we want to represent the input as a 8-bytes array
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


// link to the rtcpi library
var rtcpi = require('../../lib/rtcpi/rtcpi');

// create an rtc object
var rtc = new RTCPi();

// create a number to save into memory

var a = 12345;

// convert the number into a Uint8Array array
var bytearray = intToArray(a);

// write the array to the RTC memory address 0x08

rtc.writeMemory(0x08, bytearray);

// read the data from memory into an array

var readarray = rtc.readMemory(0x08, bytearray.length);

// convert the array back into a number

var b = arrayToInt(readarray);

// print the number to the console

console.log(b);

