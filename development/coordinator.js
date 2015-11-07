var mqtt = require('mqtt');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

//Broker MQTT de Hernan
var PORT = 10000;
var HOST = 'dev.e-mozart.com';
var server = {port:PORT, host:HOST};
var client = mqtt.connect(server);

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

//Nos conectamos al modulo Xbee mediante el puerto serial
var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

  serialport.on('data', function (data) {
      //console.log('data received: ' + data);
  });

  // All frames parsed by the XBee will be emitted here
  xbeeAPI.on("frame_object", function (frame) {

  //console.log("FULL FRAME:", frame);
  //Creamos el frame para dormir el modulo
  var sleep_frame_obj =
    {
      type: 0x17, // xbee_api.constants.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST
      //id: 0x01, // optional, nextFrameId() is called per default
      destination64: frame.remote64,
      //destination16: "fffe", // optional, "fffe" is default
      remoteCommandOptions: 0x02, // optional, 0x02 is default
      command: "SI",
      commandParameter: [] // Can either be string or byte array.
    }

  //Vamos a ver que tipo de datos vienen en el buffer
  try {
    dataTypeBuffer = new Buffer(frame.data.slice(0,2));
    dataType = dataTypeBuffer.readInt16BE(0);

    switch (dataType) {
      case 100: //Es del tipo parking
        xBuffer = new Buffer(frame.data.slice(2,4));
        x = xBuffer.readInt16BE(0);
        yBuffer = new Buffer(frame.data.slice(6,8));
        y = yBuffer.readInt16BE(0);
        zBuffer = new Buffer(frame.data.slice(4,6));
        z = zBuffer.readInt16BE(0);
        tempBuffer = new Buffer(frame.data.slice(8,9));
        temperatureRaw = tempBuffer.readUInt8(0)

        console.log('Parking');
        console.log(new Date().toString());
        console.log('x:' + x);
        console.log('y:' + y);
        console.log('z:' + z);
        console.log('temp:' + temperatureRaw);

        //Creamos el objeto JSON
        var parkingJSON =
        { "device" :
           {
             "zigbeeId" : frame.remote64,
             "deviceType" : "Parking",
             "measures" :
             {
               "magnetic" :
               {
                 "x" : x,
                 "y" : y,
                 "z" : z
               },
               "temperatureRaw" : temperatureRaw
             }
           }
         };

         //Enviamos el frame JSON al Broker MQTT
         client.publish('technetium/test/parking', JSON.stringify(parkingJSON));

         //Dormimos el dispositivo Xbee
         serialport.write(xbeeAPI.buildFrame(sleep_frame_obj));

      break;
    }

  } catch(e) {
    //console.log("NO DATA");
    //console.log(e);
  }

  });
