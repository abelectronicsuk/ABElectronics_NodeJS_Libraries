/** 
* ================================================
* AB Electronics UK Unit Test
*
* Functions and Registers for testing 
* ================================================
*/




UnitTests = (function () {

    // Device Register Addresses

    // Microchip MCP23017

    UnitTests.prototype.MCP23017_IODIRA = 0x00;   // IO direction A - 1= input 0 = output
    UnitTests.prototype.MCP23017_IODIRB = 0x01;   // IO direction B - 1= input 0 = output
    UnitTests.prototype.MCP23017_IPOLA = 0x02;    // Input polarity A
    UnitTests.prototype.MCP23017_IPOLB = 0x03;    // Input polarity B
    UnitTests.prototype.MCP23017_GPINTENA = 0x04; // Controls the interrupt-onchange on port A
    UnitTests.prototype.MCP23017_GPINTENB = 0x05; // Controls the interrupt-onchange on port B
    UnitTests.prototype.MCP23017_DEFVALA = 0x06;  // Default value for port A
    UnitTests.prototype.MCP23017_DEFVALB = 0x07;  // Default value for port B
    UnitTests.prototype.MCP23017_INTCONA = 0x08;  // Interrupt control register for port A
    UnitTests.prototype.MCP23017_INTCONB = 0x09;  // Interrupt control register for port B
    UnitTests.prototype.MCP23017_IOCON = 0x0A;    // see datasheet for configuration register
    UnitTests.prototype.MCP23017_GPPUA = 0x0C;    // pull-up resistors for port A
    UnitTests.prototype.MCP23017_GPPUB = 0x0D;    // pull-up resistors for port B
    UnitTests.prototype.MCP23017_INTFA = 0x0E;    // Interrupt condition on port A for any enabled pin
    UnitTests.prototype.MCP23017_INTFB = 0x0F;    // Interrupt condition on port B for any enabled pin
    UnitTests.prototype.MCP23017_INTCAPA = 0x10;  // Captures the GPIO port A value at the time the interrupt occurred
    UnitTests.prototype.MCP23017_INTCAPB = 0x11;  // Captures the GPIO port B value at the time the interrupt occurred
    UnitTests.prototype.MCP23017_GPIOA = 0x12;    // Data port A
    UnitTests.prototype.MCP23017_GPIOB = 0x13;    // Data port B
    UnitTests.prototype.MCP23017_OLATA = 0x14;    // Output latches for port A
    UnitTests.prototype.MCP23017_OLATB = 0x15;     // Output latches for port B

    // NXP PCA9535

    UnitTests.prototype.PCA9535_INPUTPORT0 = 0x00; // Command byte Input port 0
    UnitTests.prototype.PCA9535_INPUTPORT1 = 0x01; // Command byte Input port 1
    UnitTests.prototype.PCA9535_OUTPUTPORT0 = 0x02; // Command byte Output port 0
    UnitTests.prototype.PCA9535_OUTPUTPORT1 = 0x03; // Command byte Output port 1
    UnitTests.prototype.PCA9535_INVERTPORT0 = 0x04; // Command byte Polarity Inversion port 0
    UnitTests.prototype.PCA9535_INVERTPORT1 = 0x05; // Command byte Polarity Inversion port 1
    UnitTests.prototype.PCA9535_CONFIGPORT0 = 0x06; // Command byte Configuration port 0
    UnitTests.prototype.PCA9535_CONFIGPORT1 = 0x07; // Command byte Configuration port 1

    // Test Variables

    var failcount = 0;
    var registers = Buffer.alloc(256);
    var gpio_state = Buffer.alloc(256);
    var gpio_direction = Buffer.alloc(256);


    const Direction =
    {
        Input: 0,
        Output: 1
    };

    const State =
    {
        On: 1,
        Off: 0
    };

    // text colours

    const REDSTART = "\x1b[1;31m";
    const REDEND = "\x1b[0m";

    const GREENSTART = "\x1b[1;32m";
    const GREENEND = "\x1b[0m";

    function UnitTests() {
        return;
    }

    // I2C functions



    UnitTests.prototype.i2c_emulator_write_byte_data = function (reg, value) {
        registers[reg] = value;
    };

    UnitTests.prototype.i2c_emulator_write_word_data = function (reg, value) {
        registers[reg] = value & (0xff); // lower 8 bits
        registers[reg + 1] = (value >> 8) & 0xff; // upper 8 bits
    };

    UnitTests.prototype.i2c_emulator_read_byte_data = function (reg) {
        return registers[reg];
    };

    UnitTests.prototype.i2c_emulator_read_word_data = function (reg) {
        var value = (registers[reg + 1] << 8) | registers[reg];
        return value;
    };

    // Wiring Pi Functions

    UnitTests.prototype.digitalWrite = function (pin, value) {
        gpio_state[pin] = value;
    };

    UnitTests.prototype.pinMode = function (pin, mode) {
        gpio_direction[pin] = mode;
    };

    UnitTests.prototype.wiringPiSetup = function () {
        return 1;
    };


    // Test Functions

    UnitTests.prototype.start_test = function (functionname) {
        failcount = 0;
        console.log("TESTING: " + functionname);
    };

    UnitTests.prototype.test_outcome = function () {
        if (failcount == 0) { console.log(GREENSTART + "TEST PASSED" + GREENEND); }
        else { console.log(REDSTART + "TEST FAILED" + REDEND); }

        console.log("============================================================");
    };

    UnitTests.prototype.test_fail = function (message) {
        console.log(message);
        failcount += 1;
    };

    UnitTests.prototype.test_i2c_register = function (reg, value) {
        // tests if an i2c register has the correct value
        if (registers[reg] != value) {
            console.log(REDSTART + reg + " Register Set: FAILED" + REDEND);
            failcount += 1;
        }
    };

    UnitTests.prototype.test_gpio_state = function (gpio, value) {
        // tests if the wiring pi digitalWrite set the correct pin and state
        if (gpio_state[gpio] != value) {
            if (value == State.Off) { console.log(REDSTART + "GPIO " + gpio + " Unexpected State OFF: FAILED" + REDEND); }
            else if (value == State.On) { console.log(REDSTART + "GPIO " + gpio + " Unexpected State ON: FAILED" + REDEND); }
            else { console.log(REDSTART + "GPIO " + gpio + " Unexpected State UNKNOWN: FAILED" + REDEND); }
            failcount += 1;
        }
    };

    UnitTests.prototype.test_gpio_direction = function (gpio, value) {
        // tests if the wiring pi pinMode function set the correct pin and direction
        if (gpio_direction[gpio] != value) {
            if (value == Direction.Output) { console.log(REDSTART + "GPIO " + gpio + " Unexpected Direction OUTPUT: FAILED" + REDEND); }
            else if (value == Direction.Input) { console.log(REDSTART + "GPIO " + gpio + " Unexpected Direction INPUT: FAILED" + REDEND); }
            else { console.log(REDSTART + "GPIO " + gpio + " Unexpected Direction UNKNOWN: FAILED" + REDEND); }
            failcount += 1;
        }
    };

    UnitTests.prototype.test_exception_failed = function (message) {
        // This function is called inside a try catch if an exception failed to be called.
        console.log(REDSTART + "Execption Handling on " + message + " : FAILED" + REDEND);
        failcount += 1;
    };

    UnitTests.prototype.test_set_bit = function (oldByte, bit, value) {
        // update the value of a bit within a variable
        var newByte = 0;
        if (value == false) {
            newByte = oldByte & ~(1 << bit);
        } else {

            newByte = oldByte | 1 << bit;
        }
        return (newByte);
    };

    UnitTests.prototype.test_get_bit = function (byte, bit) {
        // checking the status of a bit within an variable
        if ((byte >> bit) % 2 != 0) return (true);
        else return (false);
    };
    return UnitTests;

})();

module.exports = UnitTests;