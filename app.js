var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var System = require('./lib/system.js');

var pirSensor = new sensors.PIR();
var led = new actuators.LED(1);

var system = new System(pirSensor, led);

system.run();
