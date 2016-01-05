var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var LedDriver = require('./led-driver.js');
var System = require('./lib/system.js');

var pirSensor = new sensors.FakePIR(1000);



var led = new actuators.LED(1);
var driver = new LedDriver(led);
var system = new System(pirSensor, driver);

system.run();
