"use strict";
var EventEmitter = require('events').EventEmitter;

var STATE = { 
	UNDETECTED: false,
	DETECTED: 	true
}; 

class Sensor extends EventEmitter {
	constructor(){
		super();
		this.state = STATE.UNDETECTED;
	}

	triggerDetect() {
		console.log('[SENSOR] ', new Date(), ' trigger detect');
		this.emit('detected');
	}
	triggerUndetect() {
		console.log('[SENSOR] ', new Date(),'trigger undetect');
		this.emit('undetected');
	}

	onChanged(channel, state){
		//state has changed?
		if(state === true){
			this.triggerDetect();
		}else{
			this.triggerUndetect();
		}
		this.state = state;
	}
}

var gpio = require('rpi-gpio');
class PIR extends Sensor {
	constructor(pinNumber){
		super();
		this.pinNumber = pinNumber;
		gpio.on('change', this.onChanged.bind(this));
		gpio.setup(pinNumber, gpio.DIR_IN, gpio.EDGE_BOTH);
	}

	onChanged(channel, state){
		if(channel != this.pinNumber) return;

		super.onChanged(channel, state);
	}
}

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

class FakePIR extends Sensor {
	constructor(){
		super();
		this.fakeSensorState = STATE.UNDETECTED;
		this.lastDetected = 0;

		rl.on('line', (line) => {
			switch(line){
				case 'd': this.fakeSensorState = this.onChanged(26, STATE.DETECTED); break;
				case 'u': this.fakeSensorState = this.onChanged(26, STATE.UNDETECTED); break;
			}
		});
	}
}

module.exports = {
	PIR : PIR,
	FakePIR: FakePIR
};
