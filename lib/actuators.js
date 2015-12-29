"use strict";
var EventEmitter = require('events').EventEmitter;

class Actuator extends EventEmitter {

}

class LED extends Actuator {
	onEnabled(){

	}

	onDisabled(){

	}
}

class FakeLED extends Actuator {
	onEnabled(){
		console.log('Led enabled');
	}

	onDisabled(){
		console.log('Led disabled');
	}	
}

module.exports = {
	LED: LED
};
