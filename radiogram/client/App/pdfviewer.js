var radiogramService = soyut.Services.getInstance().getService("radiogramServer");

var file = "https://" + radiogramService.origin + "/data/"+getParam("file");

var html = '<iframe title="Radiogram" type="application/pdf" src="'+ file +'#page=1&zoom=100' +'" frameborder="1" scrolling="auto" style="width:100%; height: 95vh;"></iframe>';

/* load html */
$('.showpdf').html(html);
