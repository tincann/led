"use strict";

var COLOR {
	FREE: 		0x000000
	OCCUPIED: 	0xFF0000,
	JUSTFREE: 	0x00FF00
}

class LedDriver {
	constructor(led){
		this.led = led;
		this.led.setColor(COLOR.FREE);
	}

	//net bezet
	occupied(){
		this.led.setColor(COLOR.OCCUPIED);
	}

	//niet meer bezet
	free(){
		this.led.setColor(COLOR.FREE);
	}
}