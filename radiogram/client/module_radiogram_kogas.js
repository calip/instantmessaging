var radiogram_kogas_boot = function(radiogramService){

    radiogramService.getOrigin(null, function(err, origin){

        radiogramService.origin = origin;
        radiogramService.registerOrigin();

        var builder = new soyut.Platform.AppBuilder();
        builder.setOrigin('https://' + origin);

        builder.setConfigURL('https://' + origin + '/module_radiogram_kogas.json', function(err, builder){
            if(!err)
                builder.build()
        });
        soyut.Event.getInstance().invokeSystemEvent("activateModule","radiogram")
    });
};

soyut.Event.getInstance().invokeSystemEvent("registerModule","radiogram")
soyut.Services.getInstance().subscribeOnAttachService("radiogramServer", function(radiogramService){
    radiogram_kogas_boot(radiogramService)
});