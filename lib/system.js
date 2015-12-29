"use strict";

class System{
	constructor(sensor, actuator){
		this.sensor = sensor;
		this.actuator = actuator;
	}

	run(){
		console.log('starting system...');
		this.sensor.on('detected', this.onDetected.bind(this));
		this.sensor.on('undetected', this.onUndetected.bind(this));
	}

	onDetected(){
		this.actuator.enable();
	}

	onUndetected(){
		this.actuator.disable();
	}
}

module.exports = System;