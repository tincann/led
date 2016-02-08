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
		this.undetectDelay = 12; //in seconds
		this.undetectTimeout;
	}

	triggerDetect() {
		console.log('[SENSOR]', new Date(), 'trigger detect');
		this.emit('detected');
	}
	triggerUndetect() {
		console.log('[SENSOR]', new Date(), 'trigger undetect');
		this.emit('undetected');
	}

	onChanged(channel, state){
		if(state === true){
			console.log('[SENSOR]', new Date(), 'timeout cleared');
			clearTimeout(this.undetectTimeout);
		}

		//state hasn't changed
		if(this.state == state) return;

		if(state === true){
			this.triggerDetect();
			this.state = state;
		}else{
			this.undetectTimeout = setTimeout(() => {
				this.triggerUndetect();	
				this.state = state;
			}, this.undetectDelay * 1000);
			console.log('[SENSOR]', new Date(), 'setting delay timeout of', this.undetectDelay, 'seconds');
		}
		
	}
}

var gpio;
class PIR extends Sensor {
	constructor(pinNumber){
		super();
		this.pinNumber = pinNumber;
		gpio = require('rpi-gpio');
		gpio.on('change', this.onChanged.bind(this));
		gpio.setup(pinNumber, gpio.DIR_IN, gpio.EDGE_BOTH);

		this.delayTimeout;
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
