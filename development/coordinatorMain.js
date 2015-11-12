//Importamos la librerias necesarios
var mqtt = require('mqtt');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

//Importamos las funciones para procesar los datos de los sensores
var parkingSensor = require ('parkingSensor.js');

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

  console.log("FULL FRAME:", frame);

  //Procesamos el mensaje recibido
  try {
    //Tomamos el header del buffer
    measuresTypeBuffer = new Buffer(frame.data.slice(0,2));
    measuresType = measuresTypeBuffer.readInt16BE(0);

    //Vemos de que tipo es el buffer para procesarlo
    switch (measuresType) {
      case 100: //Es del tipo parking
        measuresJSON = parkingSensor.createJSON(frame.data,frame.remote64);
        mqttTopic = 'technetium/test/parking';
      break;
    }

    //Enviamos el frame JSON al Broker MQTT
    client.publish(mqttTopic, JSON.stringify(measuresJSON));

  } catch(e) {
    console.log(e);
  }

});
