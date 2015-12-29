"use strict";
var EventEmitter = require('events').EventEmitter;

class Sensor extends EventEmitter {
	constructor(){
		super();
		EventEmitter.call(this);
	}

	TriggerDetect() {
		console.log('Sensor trigger detect');
		this.emit('detected');
	}
	TriggerUndetect() {
		console.log('Sensor trigger undetect');
		this.emit('undetected');
	}
}

class PIR extends Sensor {
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
				case 'd': this.onDetect(); break;
				case 'u': this.onUndetect(); break;
			}
		});
	}

	onDetect() {
		console.log('Detected something');
		this.TriggerDetect();
	}
	onUndetect() {
		console.log('Undetected something');
		this.TriggerUndetect();
	}
}

module.exports = {
	PIR : PIR,
	FakePIR: FakePIR
};
