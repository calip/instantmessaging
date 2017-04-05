var radiogramService = soyut.Services.getInstance().getService("radiogramServer");

var file = "https://" + radiogramService.origin + "/data/"+getParam("file");
console.log(file)
var html = "<iframe title=\"Radiogram\" src=\""+file+"\" frameborder=\"1\" scrolling=\"auto\" style=\"width:100vw; height:100vw\" ></iframe>";

/* load html */
$('.showpdf').html(html);
