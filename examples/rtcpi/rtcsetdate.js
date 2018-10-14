/** 
* ================================================
* ABElectronics RTC Pi demo
* Version 1.0 Created 26/07/2016
* 
* Requires rpio to be installed, install with: npm install rpio
* run with: sudo node rtcsetdate.js
* ================================================
*/

// link to the rtcpi library
var rtcpi = require('../../lib/rtcpi/rtcpi');

// create an rtc object
var rtc = new RTCPi();

// create a new javascript date object
var d = new Date(2016, 07, 04, 10, 23, 00, 00);

// set the date on the RTC Pi using the date object
rtc.setDate(d);

// create a timer object that runs every second 
var myClock = setInterval(clockTimer, 1000);

function clockTimer() {
    // read the date from the RTC and write it to the console
    console.log(rtc.readDate().toISOString());
}