soyut.radiogram = soyut.radiogram || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogram.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

if (Promise.promisifyAll) {
    Promise.promisifyAll(soyut.radiogram);
}

socket.on('new_radiogram', function (data) {
    data.new_val.receivers.forEach(function(i){
        if(roleName.id == i){
            if(data.new_val.composeStatus == 'inbox'){
                SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
    
                soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
            }
        }  
    });

});