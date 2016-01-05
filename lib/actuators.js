"use strict";

var ws = require('rpi-ws281x-native');

class LED {
	constructor(NUM_LEDS){
		this.pixelData = new Uint32Array(NUM_LEDS);
		ws.init(NUM_LEDS);
	}
	enable() {
		this.setColor(0xFF0000);
	}

	disable() {
		this.setColor(0x000000);
	}

	setColor(color){
		this.pixelData[0] = color;
		ws.render(this.pixelData)
	}
}

process.on('exit', function () {
  ws.reset();
});


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
