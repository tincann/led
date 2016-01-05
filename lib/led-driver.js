"use strict";

var COLOR = {
	FREE: 			0x000000,
	JUSTFREE: 		0x00FF00,
	OCCUPIED: 		0xFF0000,
	JUSTOCCUPIED: 	0xFFA500
}

class LedDriver {
	constructor(led){
		this.led = led;
		this.led.setColor(COLOR.FREE);
	}

	//net bezet
	occupied(){
		blink(this.led, COLOR.JUSTOCCUPIED, COLOR.FREE, 5, 300, 300, () => {
			this.led.setColor(COLOR.OCCUPIED);
		});
	}

	//niet meer bezet
	free(){
		blink(this.led, COLOR.JUSTFREE, COLOR.FREE, 5, 500, 500, () => {
			this.led.setColor(COLOR.FREE);
		});
	}
}

module.exports = LedDriver;

function blink(led, color1, color2, count, duration1, duration2, cb){
	if(count === 0){
		cb();
		return;
	}

	led.setColor(color1);
	setTimeout(() => {
		led.setColor(color2)
		setTimeout(() => {
			blink(led, color1, color2, count - 1, duration1, duration2, cb);
		}, duration2);
	}, duration1);
}