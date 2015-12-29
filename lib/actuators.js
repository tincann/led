"use strict";
var EventEmitter = require('events').EventEmitter;

class Actuator extends EventEmitter {
	enable() {}
	disable() {}
}

class LED extends Actuator {
	enable() {}
	disable() {}
}

class FakeLED extends Actuator {
	enable(){
		console.log('Led enabled');
	}

	disable(){
		console.log('Led disabled');
	}	
}

module.exports = {
	LED: LED,
	FakeLED: FakeLED
};
