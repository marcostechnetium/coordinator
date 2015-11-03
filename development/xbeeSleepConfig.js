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

var sleep_period =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "SP",
    commandParameter: [0xAF0],
}

var number_of_periods =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "SN",
    commandParameter: [0x02],
}

var time_before_sleep =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "ST",
    commandParameter: [0x2710],
}

var sleep_options =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "SO",
    commandParameter: [0x04],
}

var sleep_mode =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "SM",
    commandParameter: [0x02],
}

var apply_changes =
{
  type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
  //id: 0x01, // optional, nextFrameId() is called per default
  destination64: "0013a2004066b84b",
  //destination16: "fffe", // optional, "fffe" is default
  remoteCommandOptions: 0x02, // optional, 0x02 is default
    command: "AC",
    commandParameter: [],
}

serialport.on("open", function () {
    //serialport.write(xbeeAPI.buildFrame(sleep_period));
    //console.log('Sent Sleep Period.');
    //serialport.write(xbeeAPI.buildFrame(number_of_periods));
    //console.log('Sent Number of Periods.');
    //serialport.write(xbeeAPI.buildFrame(time_before_sleep));
    //console.log('Sent Time Before Sleep.');
    //serialport.write(xbeeAPI.buildFrame(sleep_options));
    //console.log('Sent Sleep Options.');
    serialport.write(xbeeAPI.buildFrame(sleep_mode));
    console.log('Sent Sleep Mode.');
    serialport.write(xbeeAPI.buildFrame(apply_changes));
    console.log('Sent Apply Changes.');
});

serialport.on('data', function (data) {
    console.log('data received: ' + data);
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
        console.log(">>", frame);
});
