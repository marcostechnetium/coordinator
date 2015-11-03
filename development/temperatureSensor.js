var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var mqtt    = require('mqtt');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

var client  = mqtt.connect('mqtt://192.168.2.21');
/*
client.on('connect', function () {
  //client.subscribe('presence');
  client.publish('presence', "Hola");
  //client.publish('presence', 'Hello mqtt');
});
*/

serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
  if(frame.remote64 == '0013a20040b87df3'){
    try {
      console.log("FULL FRAME:", frame);
      client.publish('beehive/temperatura', String(frame.analogSamples.AD1))
    } catch(e) {
      console.log('NO DATA');
    }
  };

});
