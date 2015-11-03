var mqtt    = require('mqtt');
var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var CronJob = require('cron').CronJob;

var PORT = 10000;
var HOST = 'dev.e-mozart.com';
var server = {port:PORT, host:HOST};
var client = mqtt.connect(server);

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});



var sleep_frame_obj =
  {
    type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
    //id: 0x01, // optional, nextFrameId() is called per default
    destination64: "0013A20040B87DF3",
    //destination16: "fffe", // optional, "fffe" is default
    remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "SI",
    commandParameter: [] // Can either be string or byte array.
  }

  serialport.on('data', function (data) {
      console.log('data received: ' + data);
  });

  // All frames parsed by the XBee will be emitted here
  xbeeAPI.on("frame_object", function (frame) {

  console.log("FULL FRAME:", frame);

    if(frame.remote64 == '0013a20040b87df3'){
      //console.log("FULL FRAME:", frame);
      //console.log("ANALOG SAMPLES:",frame.analogSamples);
      //console.log("AD1:",frame.analogSamples.AD1);
      try {
        client.publish('technetium/sensing/temperature/bedroom', String(frame.analogSamples.AD1))
        //Aca tengo que mandar el sleep
        serialport.write(xbeeAPI.buildFrame(sleep_frame_obj));
        console.log(String(frame.analogSamples.AD1));
        console.log('SLEEP');
      } catch(e) {
        console.log('NO DATA');
      }
    }else{
      //Otros frames
    }
  });
