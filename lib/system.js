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
		this.sensor.on('no movement', this.onNoMovement.bind(this));
		this.sensor.on('redetected', this.onRedetected.bind(this));
	}

	onDetected(){
		this.actuator.occupied();
	}

	onUndetected(){
		this.actuator.free();
	}

	onNoMovement(timeout){
		this.actuator.noMovement(timeout);
	}

	onRedetected(){
		this.actuator.redetected();
	}
}

module.exports = System;