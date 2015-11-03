var mqtt    = require('mqtt');
var PORT = 10000;
var HOST = 'dev.e-mozart.com';
var server = {port:PORT, host:HOST};

// dev.e-mozart.com:10000

var client = mqtt.connect(server);


client.on('connect', function () {
//  client.subscribe('technetium/mqtt/test');
  console.log('connected');
  client.publish('technetium/test/parking', 'MQTT Test');
  console.log('message sent');
});

/*
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
*/
