"use strict";

class LED {
	enable() {}
	disable() {}
}

class FakeLED {
	enable(){
		console.log('Led enabled');
	}

	disable(){
		console.log('Led disabled');
	}	
}

module.exports = {
	LED: LED,
	FakeLED: FakeLED
};
