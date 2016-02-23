"use strict";
var Stat = require('./statistics.js');

class System{
	constructor(sensor, actuator){
		this.sensor = sensor;
		this.actuator = actuator;

		this.stats = new Stat('./stats.txt');
		this.occupyTimeStamp;
		this.noMovementTimeStamps = [];
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
		this.occupyTimeStamp = new Date();
	}

	onUndetected(){
		this.actuator.free();
		this.stats.saveEntry(this.occupyTimeStamp, new Date(), this.noMovementTimeStamps);
		this.noMovementTimeStamps = [];
	}

	onNoMovement(timeout){
		this.actuator.noMovement(timeout);
		this.noMovementTimeStamps.push(new Date());
	}

	onRedetected(){
		this.actuator.redetected();
	}
}

module.exports = System;