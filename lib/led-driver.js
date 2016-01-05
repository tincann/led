"use strict";
var timeout, interval;

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
		this.clear();
		var time = +new Date;
		fade(this.led, COLOR.OCCUPIED, 500, () =>{
			console.log(+new Date - time);
		});

		// blink(this.led, COLOR.JUSTOCCUPIED, COLOR.FREE, 5, 300, 300, () => {
		// 	this.led.setColor(COLOR.OCCUPIED);
		// });
	}

	//niet meer bezet
	free(){
		this.clear();
		blink(this.led, COLOR.JUSTFREE, COLOR.FREE, 5, 500, 500, () => {
			this.led.setColor(COLOR.FREE);
		});
	}

	clear(){
		clearTimeout(timeout);
		clearInterval(interval);
	}
}

module.exports = LedDriver;

function blink(led, color1, color2, count, duration1, duration2, cb){
	if(count === 0){
		cb();
		return;
	}

	led.setColor(color1);
	timeout = setTimeout(() => {
		led.setColor(color2)
		timeout = setTimeout(() => {
			blink(led, color1, color2, count - 1, duration1, duration2, cb);
		}, duration2);
	}, duration1);
}

var FADE_FREQUENCY = 10; //ms
function fade(led, toColor, duration, cb){
	var startColor = led.getColor();
	//100 percent, steps of 10 ms, over 'duration' ms
	var stepSize = 100 * (FADE_FREQUENCY / duration);
	var currentPercentage = 0;
	interval = setInterval(() => {
		console.log(currentPercentage);
		if(currentPercentage >= 100){
			clearInterval(interval);
			cb();
			return;
		}
		var color = interpolateColors(startColor, toColor, currentPercentage);
		led.setColor(color);
		currentPercentage += stepSize;
	}, FADE_FREQUENCY)
}

function interpolateColors(color1, color2, percentage){

	var c1 = toRGB(color1), c2 = toRGB(color2);
	var r = icc(c1.r, c2.r, percentage) << 4;
	var g = icc(c1.g, c2.g, percentage) << 2;
	var b = icc(c1.b, c2.b, percentage);

	return r + g + b;

	function toRGB(color){
		return { r: color & 0xFF0000 >> 4, g: color & 0x00FF00 >> 2, b: color & 0x0000FF };
	}

	//interpolate color components (r, g or b)
	function icc(c1, c2, percentage){
		return c1 + (c2 - c1) * percentage;
	}
}