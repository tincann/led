var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var LedDriver = require('./lib/led-driver.js');
var System = require('./lib/system.js');

var pirSensor = new sensors.FakePIR(1000);

var led = new actuators.FakeLED();
var driver = new LedDriver(led);
var system = new System(pirSensor, driver);

system.run();
