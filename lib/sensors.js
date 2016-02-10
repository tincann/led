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
		console.log('[SENSOR]', new Date(), '!! trigger detect !!');
		this.emit('detected');
	}
	triggerUndetect() {
		console.log('[SENSOR]', new Date(), '## trigger undetect ##');
		this.emit('undetected');
	}

	triggerNoMovement(timeout){
		console.log('[SENSOR]', new Date(), '.. trigger no movement - delay of', this.undetectDelay, 'seconds ..');
		this.emit('no movement', timeout);
	}

	onChanged(channel, state){
		if(this.undetectTimeout && state === true){
			console.log('[SENSOR]', new Date(), '// timeout cleared //');
			clearTimeout(this.undetectTimeout);
		}

		//state hasn't changed
		if(this.state == state) return;

		if(state === true){
			this.triggerDetect();
			this.state = state;
		}else{
			var timeout = this.undetectDelay * 1000;
			this.undetectTimeout = setTimeout(() => {
				this.triggerUndetect();	
				this.state = state;
			}, timeout);
			this.triggerNoMovement(timeout);
		}
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
		rl.on('line', (line) => {
			switch(line){
				case 'd': this.onChanged(26, STATE.DETECTED); break;
				case 'u': this.onChanged(26, STATE.UNDETECTED); break;
			}
		});
	}
}

var gpio;
class PIR extends FakePIR {
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

module.exports = {
	PIR : PIR,
	FakePIR: FakePIR
};
