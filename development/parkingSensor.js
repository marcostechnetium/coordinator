function createJSON (measuresBuffer,remoteZigbeeId){
  //Procesamos el Buffer
  xBuffer = new Buffer(measuresBuffer.slice(2,4));
  x = xBuffer.readInt16BE(0);
  yBuffer = new Buffer(measuresBuffer.slice(6,8));
  y = yBuffer.readInt16BE(0);
  zBuffer = new Buffer(measuresBuffer.slice(4,6));
  z = zBuffer.readInt16BE(0);
  tempBuffer = new Buffer(measuresBuffer.slice(8,9));
  temperatureRaw = tempBuffer.readUInt8(0);

  //Creamos el objeto JSON
  var parkingJSON =
  { "device" :
     {
       "zigbeeId" : remoteZigbeeId,
       "measuresType" : "100.Parking",
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

   return parkingJSON;

}
