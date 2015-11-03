var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

var CronJob = require('cron').CronJob;

var frame_azul_ON = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013A20040B87DF3",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
  command: "D2",
  commandParameter: [ 0x05 ] // Can either be string or byte array.
};

var frame_azul_OFF = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013A20040B87DF3",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
  command: "D2",
  commandParameter: [ 0x04 ] // Can either be string or byte array.
};

var frame_verde_ON = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013A20040B87DF3",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
  command: "D3",
  commandParameter: [ 0x05 ] // Can either be string or byte array.
};

var frame_verde_OFF = {
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013A20040B87DF3",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
  command: "D3",
  commandParameter: [ 0x04 ] // Can either be string or byte array.
};


new CronJob('*/1 * * * * *', function() {
  console.log("Azul ON");
  serialport.write(xbeeAPI.buildFrame(frame_azul_ON));
}, null, true, 'America/Argentina/Buenos_Aires');

new CronJob('*/3 * * * * *', function() {
  console.log("Azul OFF");
  serialport.write(xbeeAPI.buildFrame(frame_azul_OFF));
}, null, true, 'America/Argentina/Buenos_Aires');

new CronJob('*/2 * * * * *', function() {
  console.log("Verde ON");
  serialport.write(xbeeAPI.buildFrame(frame_verde_ON));
}, null, true, 'America/Argentina/Buenos_Aires');

new CronJob('*/5 * * * * *', function() {
  console.log("Verde OFF");
  serialport.write(xbeeAPI.buildFrame(frame_verde_OFF));
}, null, true, 'America/Argentina/Buenos_Aires');
