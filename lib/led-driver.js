"use strict";
var timeout, interval;

var COLOR = {
	OFF: 			0x000000, // off
	FREE: 			0x00FF00, // green
	JUSTFREE:		0xFFFFFF, // white
	OCCUPIED: 		0xFF0000, // red
	JUSTOCCUPIED: 	0xFFA800, // orange
	NOMOVEMENT: 	0x0080FF  // blue-ish
}

class LedDriver {
	constructor(led){
		this.led = led;
		this.led.setColor(COLOR.FREE);
	}

	//just occupied
	occupied(){
		this.clear();
		// fadelist(this.led, [0x30a2da, 0xfc4f30, 0xe5ae38, 0x6d904f, 0x8b8b8b], 500, 3);
		var offFade = 200, onFade = 400;
		fadeblink(this.led, COLOR.OFF, COLOR.JUSTOCCUPIED, 10, offFade, onFade, () => {
			fade(this.led, COLOR.OFF, offFade, () => {
				fade(this.led, COLOR.OCCUPIED, onFade);
			});
		});
	}

	//didn't move for a long time
	noMovement(movementTimeout){
		this.clear();
		var fadeDelay = movementTimeout * 0.6;
		timeout = setTimeout(() => {
			fade(this.led, COLOR.NOMOVEMENT, movementTimeout - fadeDelay);
		}, fadeDelay)
	}

	//redetected movement
	redetected(){
		this.clear();
		fade(this.led, COLOR.OCCUPIED, 1000);
	}

	//not occupied anymore
	free(){
		this.clear();
		fadeblink(this.led, COLOR.FREE, COLOR.JUSTFREE, 10, 500, 200, () => {
			fade(this.led, COLOR.FREE, 200);
		});
	}

	clear(){
		clearTimeout(timeout);
		clearInterval(interval);
	}
}

module.exports = LedDriver;

function callcb(cb){
	if(cb && typeof(cb) == 'function'){
		cb();
	}
}

function blink(led, color1, color2, count, duration1, duration2, cb){
	if(count === 0){
		callcb(cb);
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

function fadeblink(led, color1, color2, count, duration1, duration2, cb){
	if(count == 0){
		callcb(cb);
		return;
	}
	fade(led, color1, duration1, () => {
		fade(led, color2, duration2, () => {
			fadeblink(led, color1, color2, count - 1, duration1, duration2, cb);
		});
	});
}

function fadelist(led, colors, duration, loopCount, cb){
	if(colors.length == 0){
		callcb(cb);
		return;
	}
	if(loopCount && loopCount--){
		colors = colors.concat(colors);
	}
	fade(led, colors.shift(), duration, () => {
		fadelist(led, colors, duration, loopCount, cb);
	});
}

var FADE_FREQUENCY = 10; //ms
function fade(led, toColor, duration, cb){
	console.log('[LED] fade to', toColor.toString(16), 'over', duration, 'ms');
	var startColor = led.getColor();
	//100 percent, steps of 10 ms, over 'duration' ms
	var stepSize = 100 * (FADE_FREQUENCY / duration);
	var currentPercentage = 0;
	interval = setInterval(() => {
		if(currentPercentage >= 100){
			clearInterval(interval);
			callcb(cb);
			return;
		}
		var color = interpolateColors(startColor, toColor, currentPercentage / 100);
		led.setColor(color);
		currentPercentage += stepSize;
	}, FADE_FREQUENCY)
}

function interpolateColors(color1, color2, percentage){

	var c1 = toRGB(color1), c2 = toRGB(color2);
	var r = icc(c1.r, c2.r, percentage) << 16;
	var g = icc(c1.g, c2.g, percentage) << 8;
	var b = icc(c1.b, c2.b, percentage);
	return r + g + b;
}

function toRGB(color){
	return { r: (color & 0xFF0000) >> 16, g: (color & 0x00FF00) >> 8, b: color & 0x0000FF };
}

//interpolate color components (r, g or b)
function icc(c1, c2, percentage){
	return c1 + (c2 - c1) * percentage;
}
