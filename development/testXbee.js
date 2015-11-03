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

var frame_obj =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
  command: "IS",
  commandParameter: [] // Can either be string or byte array.
}

serialport.on("open", function () {
    //serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Sent to serial port.');
});

serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
        console.log(">>", frame);
});
