"use strict";

class System{
	constructor(sensor, actuator){
		this.sensor = sensor;
		this.actuator = actuator;
	}

	run(){
		console.log('starting system...');
		this.sensor.on('detect', onDetect);
		this.sensor.on('undetect', onUndetect);
	}

	onDetect(){
		this.actuator.trigger('enabled');
	}

	onUndetect(){
		this.actuator.trigger('disabled');
	}
}

module.exports = System;