"use strict";
var EventEmitter = require('events').EventEmitter;

var STATE = { 
	UNDETECTED: 0,
	DETECTED: 	1,
	NOMOVE: 	2
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
		this.state = STATE.DETECTED;
		this.emit('detected');
	}
	triggerUndetect() {
		console.log('[SENSOR]', new Date(), '## trigger undetect ##');
		this.state = STATE.UNDETECTED;
		this.emit('undetected');
	}

	triggerNoMovement(timeout){
		console.log('[SENSOR]', new Date(), '.. trigger no movement - delay of', this.undetectDelay, 'seconds ..');
		this.state = STATE.NOMOVE;
		this.emit('no movement', timeout);
	}

	triggerRedetected(){
		console.log('[SENSOR]', new Date(), '// trigger redetected //');
		this.state = STATE.DETECTED;
		this.emit('redetected');
	}

	onChanged(channel, state){
		switch(this.state){
			case STATE.UNDETECTED:
				if(state === true){
					this.triggerDetect();	
				}				
			break;
			case STATE.DETECTED:
				if(state === false){
					var timeout = this.undetectDelay * 1000;
					this.undetectTimeout = setTimeout(this.triggerUndetect.bind(this), timeout);
					this.triggerNoMovement(timeout);
				}
			break;
			case STATE.NOMOVE:
				if(state === true){
					clearTimeout(this.undetectTimeout);
					this.triggerRedetected();
				}
			break;
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
				case 'd': this.onChanged(26, true); break;
				case 'u': this.onChanged(26, false); break;
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
