"use strict";
var fs = require('fs');
var EOL = require('os').EOL;
class Statistics {
	constructor(path){
		this.path = path;
	}

	saveEntry(startTime, endTime, noMovementTimestamps){
		var duration = endTime - startTime;
		var text = startTime.toISOString() + '|' + 
					duration + '|' + 
					noMovementTimestamps.map(t => t.toISOString()).join(',') + EOL;
		fs.appendFile(this.path, text, err => {
			if(err){
				console.log('[STAT] Can\'t write to file', this.path);
			}else{
				console.log('[STAT] Successfully written to', this.path);
			}
		});
		console.log('duration', duration);
	}
}

module.exports = Statistics;