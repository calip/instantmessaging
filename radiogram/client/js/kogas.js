soyut.radiogramkogas = soyut.radiogramkogas || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogramkogas.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

soyut.radiogramkogas.renderCurrentUser = function () {
    var html = '<h4>' + soyut.Session.role.position + ' </h4>';
    $(getInstanceID("kogas-title")).html(html);
};

soyut.radiogramkogas.init = function(){
    soyut.radiogramkogas.renderCurrentUser();
};

soyut.radiogramkogas.init();