/**
 * Created by TES on 5/11/2016.
 */
var radiogramService = soyut.Services.getInstance().getService("radiogramServer")
radiogramService.getOrigin(null, function(err,msg){
  radiogramService.origin = 'https://'+msg
  radiogramService.registerOrigin()
})
