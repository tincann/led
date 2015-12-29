"use strict";

class LED {
	enable() {}
	disable() {}
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
