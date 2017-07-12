var curUrl = soyut.radiogram.origin.split(':');
var url = getParam("file");

soyut.radiogram.initPdfViewer = function () {
    function getPosition(str, m, i) { return str.split(m, i).join(m).length; }
    var safeUrl = url.substring(0, 8) + curUrl[0] + url.substring(getPosition(url, ':', 2));
    function getFile(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                // get binary data as a response
                callback(false, this.response);
            }
        };
        xhr.onerror = function (e) {
            callback(true, e);
        };
        xhr.send();
    }
    getFile(safeUrl, function(err, dataBuffer) {
        var blob = new Blob([dataBuffer],{type: 'application/pdf'});
        var geturl = URL.createObjectURL(blob);

        var html = '<iframe title="PDF" type="application/pdf" src="'+ geturl+'#page=1&zoom=100' +'" frameborder="1" scrolling="auto" style="width:100%; height: 95vh;"></iframe>';
        $('.showpdf').append(html);
    });
};

soyut.radiogram.initPdfViewer();