var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var System = require('./lib/system.js');

var pirSensor = new sensors.PIR();
var led = new actuator.LED();
var system = new System({sensor: pirSensor, actuator: led});

system.run();