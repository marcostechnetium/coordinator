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

//MQTT Server de e-mozart
var PORT = 10000;
var HOST = 'dev.e-mozart.com';
var mqttServer = {port:PORT, host:HOST};

var mqttClient  = mqtt.connect(mqttServer);

//Data recieves from Xbee module on serial port
serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
  if(frame.remote64 == '0013a20040b87df3'){
    try {
      console.log("AD1:", String(frame.analogSamples.AD1));
      mqttClient.publish('technetium/mqtt/test/temperatura', String(frame.analogSamples.AD1))
    } catch(e) {
      console.log('NO DATA');
    }
  };

});

/*
// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
  if(frame.remote64 == '0013a20040b87df3'){
    try {
      console.log("FULL FRAME:", frame);
      mqttClient.publish('beehive/arduino/sensor', String(frame.analogSamples.AD1))
    } catch(e) {
      console.log('NO DATA');
    }
  };
});
*/
