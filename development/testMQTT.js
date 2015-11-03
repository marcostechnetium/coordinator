var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.2.9');

client.on('connect', function () {
  //client.subscribe('presence');
  client.publish('technetium/mqtt/test', 'MQTT Test');
  console.log('message sent');
});

/*client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
*/
