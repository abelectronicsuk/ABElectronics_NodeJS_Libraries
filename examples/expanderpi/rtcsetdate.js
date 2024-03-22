﻿/** 
* ================================================
* AB Electronics UK Expander Pi - RTC date demo
* Version 1.0 Created 19/06/2017
*
 * Requires rpio to be installed, install with: npm install rpio
 * Requires i2c-bus to be installed, install with: npm install i2c-bus
* 
* run with: sudo node rtcsetdate.js
* ================================================
*/

// link to the expanderpi library
var expanderpi = require('../../lib/expanderpi/expanderpi');

// create an rtc object
var rtc = new ExpanderPiRTC();

// create a new javascript date object
var d = new Date(2016, 07, 04, 9, 23, 00, 00);

// set the date on the RTC Pi using the date object
rtc.setDate(d);

// create a timer object that runs every second 
var myClock = setInterval(clockTimer, 1000);

function clockTimer() {
    // read the date from the RTC and write it to the console
    console.log(rtc.readDate().toISOString());
}