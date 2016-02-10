"use strict";

var ws = require('rpi-ws281x-native');

class LED {
	constructor(NUM_LEDS){
		this.pixelData = new Uint32Array(NUM_LEDS);
		ws.init(NUM_LEDS);
	}

	setColor(color){
		this.pixelData[0] = color;
		ws.render(this.pixelData)
	}

	getColor(){
		return this.pixelData[0];
	}
}

process.on('exit', function () {
  ws.reset();
});


class FakeLED {
	setColor(color){
		this.color = color;
		// console.log('[LED] color set', color);
	}

	getColor(){
		return this.color;
	}
}

module.exports = {
	LED: LED,
	FakeLED: FakeLED
};
