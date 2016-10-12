//load environment variables from .env file
require('dotenv-safe').load();

var sensors = require('./lib/sensors.js');
var actuators = require('./lib/actuators.js');
var LedDriver = require('./lib/led-driver.js');
var System = require('./lib/system.js');
var Telegram = require('./lib/telegram.js');

var pirSensor = new sensors.PIR(26);

var led = new actuators.LED(1);
var driver = new LedDriver(led);

//logging
const logger = require('./lib/logger.js');
var tg = new Telegram(process.env.BOT_TOKEN, process.env.CHAT_ID);
logger.addListener(tg.log, true);

var system = new System(pirSensor, driver);

system.run();
