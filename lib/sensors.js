"use strict";
var EventEmitter = require('events').EventEmitter;

var STATE = { 
	UNDETECTED: 0,
	DETECTED: 	1
}; 

class Sensor extends EventEmitter {
	constructor(pollTime){
		super();
		this.pollTime = pollTime;
		this.state = STATE.UNDETECTED;
	}

	triggerDetect() {
		console.log('[SENSOR] trigger detect');
		this.emit('detected');
	}
	triggerUndetect() {
		console.log('[SENSOR] trigger undetect');
		this.emit('undetected');
	}

	poll(){
		var sensorState = this.GetSensorState();
		//state has changed?
		if(sensorState != this.state){
			if(sensorState == STATE.DETECTED){
				this.triggerDetect();
			}else{
				this.triggerUndetect();
			}
			this.state = sensorState;
		}
	}


	enable(){
		this.interval = setInterval(this.poll.bind(this), this.pollTime);
	}

	disable(){
		clearInterval(this.interval);
	}


	GetSensorState(){}
}

class PIR extends Sensor {
}

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

class FakePIR extends Sensor {
	constructor(pollTime){
		super(pollTime);
		this.fakeSensorState = STATE.UNDETECTED;
		this.lastDetected = 0;

		rl.on('line', (line) => {
			switch(line){
				case 'd': this.fakeSensorState = STATE.DETECTED; break;
				case 'u': this.fakeSensorState = STATE.UNDETECTED; break;
			}
		});
	}

	GetSensorState(){
		return this.fakeSensorState;
	}
}

module.exports = {
	PIR : PIR,
	FakePIR: FakePIR
};
