var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var System = require('./lib/system.js');

// var pirSensor = new sensors.PIR();
// var led = new actuator.LED();
var pirSensor = new sensors.FakePIR();
var led = new actuators.FakeLED();

var system = new System(pirSensor, led);

system.run();
