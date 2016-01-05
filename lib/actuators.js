"use strict";

var ws = require('rpi-ws128x-native');

class LED {
	constructor(NUM_LEDS){
		pixelData = new Uint32Array(NUM_LEDS);
		ws.init(NUM_LEDS);
	}
	enable() {
		this.setColor(0xFF0000);
	}
	
	disable() {
		ws.reset();
	}

	setColor(color){
		this.pixelData[0] = color;
		ws.render(this.pixelData)
	}
}

class FakeLED {
	enable(){
		this.setColor(0xFF0000);
	}

	disable(){
		this.setColor(0x000000);
	}

	setColor(color){
		console.log('[LED] color set', color);
	}
}

module.exports = {
	LED: LED,
	FakeLED: FakeLED
};
