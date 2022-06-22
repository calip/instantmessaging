var pdf = require('html-pdf');
var printer = require('printer');
var fs = require('fs');

var _ = require('underscore');
const RADIOGRAM_USER_TOKEN = "ccccccfltvkgjgtbgflhdgbdnvgehbcrnvhhgdrilvel" +
    "d65sa4d561aws231f65sg465a8df4f65v1abv";

module.exports = {
  public: {
    PrintToPDF: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
      var panggilan = reqMsg.data.params.panggilan;
      var jenis = reqMsg.data.params.jenis;
      var nomor = reqMsg.data.params.nomor;
      var derajat = reqMsg.data.params.derajat;
      var datetime = reqMsg.data.params.datetime;
      var sender = reqMsg.data.params.sender;
      var kepada = reqMsg.data.params.receivers;
      var tembusan = reqMsg.data.params.tembusan;
      var sender_Name = reqMsg.data.params.sender_Name;
      var receiver_Name = reqMsg.data.params.receiver_Name;
      var tembusan_Name = reqMsg.data.params.tembusan_Name;
      var klasifikasi = reqMsg.data.params.klasifikasi;
      var title = reqMsg.data.params.title;
      var number = reqMsg.data.params.number;
      var instruksi = reqMsg.data.params.instruksi;
      var tanda_dinas = reqMsg.data.params.tanda_dinas;
      var group = reqMsg.data.params.group;
      var sendername = reqMsg.data.params.sendername;
      var senderpangkat = reqMsg.data.params.senderpangkat;
      var tanda_tangan = reqMsg.data.params.tanda_tangan;
      var alamataksi = reqMsg.data.params.alamataksi;
      var alamattembusan = reqMsg.data.params.alamattembusan;
      var jam = reqMsg.data.params.jam;
      var tanggal = reqMsg.data.params.tanggal;
      var cara = reqMsg.data.params.cara;
      var paraf = reqMsg.data.params.paraf;
      var message = reqMsg.data.params.message;
      var simtime = reqMsg.data.params.simtime;
      var kop = reqMsg.data.params.kop;
      var renderKop = kop.replace(/(?:\r\n|\r|\n)/g, '<br />');
      var renderMessage = message.replace(/(?:\r\n|\r|\n)/g, '<br />');
      var txtMessage = message.split('\n');
      console.log(txtMessage.length);

      var context = "./client/views/pdf.html";
      var curNumber = "000";
      if(number != ""){
        curNumber = replaceall(number,'/','-');
        curNumber = replaceall(curNumber,' ','');
        curNumber = replaceall(curNumber,'\"','');
        curNumber = replaceall(curNumber,"'",'');
        curNumber = replaceall(curNumber,'"','');
      }
      // var pdfName = curNumber + "-" + getDateTime() + ".pdf";
      var pdfName = curNumber + ".pdf";

      var html = fs.readFileSync(context, 'utf8');

      html = html.replace('{{panggilan}}', panggilan);
      html = html.replace('{{jenis}}', jenis);
      html = html.replace('{{nomor}}', nomor);
      html = html.replace('{{derajat}}', derajat);
      html = html.replace('{{datetime}}', datetime);
      html = html.replace('{{sender_Name}}', sender_Name);
      html = html.replace('{{receiver_Name}}', receiver_Name);
      html = html.replace('{{tembusan_Name}}', tembusan_Name);
      html = html.replace('{{klasifikasi}}', klasifikasi);
      html = html.replace('{{title}}', title);
      html = html.replace('{{number}}', number);
      html = html.replace('{{instruksi}}', instruksi);
      html = html.replace('{{tanda_dinas}}', tanda_dinas);
      html = html.replace('{{group}}', group);
      html = html.replace('{{sendername}}', sendername);
      html = html.replace('{{senderpangkat}}', senderpangkat);
      html = html.replace('{{tanda_tangan}}', tanda_tangan);
      html = html.replace('{{alamataksi}}', alamataksi);
      html = html.replace('{{alamattembusan}}', alamattembusan);
      html = html.replace('{{jam}}', jam);
      html = html.replace('{{tanggal}}', tanggal);
      html = html.replace('{{cara}}', cara);
      html = html.replace('{{paraf}}', paraf);
      html = html.replace('{{renderMessage}}', renderMessage);
      html = html.replace('{{simtime}}', simtime);
      html = html.replace('{{kop}}', renderKop);

      function replaceall(str,replace,with_this){
          var str_hasil ="";
          var temp;

          for(var i=0;i<str.length;i++) {
              if (str[i] == replace){
                  temp = with_this;
              }
              else {
                  temp = str[i];
              }
              str_hasil += temp;
          }
          return str_hasil;
      }

      // var options = {
      //   format: 'A4',
      //   orientation: "portrait",
      //   height: "872px",   
      //   width: "595px", 
      //   header: {
      //     "height": "370px"
      //   },
      //   footer: {
      //     "height": "145px"
      //   }
      // };
      var options = {
        format: 'A4',
        orientation: "portrait",
        height: "842px",   
        width: "595px", 
        header: {
          "height": "320px"
        },
        footer: {
          "height": "145px"
        }
      };

      pdf.create(html, options).toFile('./client/data/' + pdfName, function (err, res) {
        if (err) {
          resCallback(true, err);
        }
        else {
          resCallback(false, pdfName);
        }
      });
    },

    PrintPaper: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
      var file = reqMsg.data.params.file;
      //console.log("default printer " + printer.getDefaultPrinterName()+" platform "+process.platform);
      //get printer name
      var printerName = "Brother_MFC_J430W";
      var defaultPrinter = printer.getDefaultPrinterName();

      var filename = "./client/data/" + file;
      console.log('printing file name ' + filename);

      fs.readFile(filename, function (err, data) {
        if (err) {
          console.error('err:' + err);
          return;
        }
        console.log('data type is: ' + typeof(data) + ', is buffer: ' + Buffer.isBuffer(data));
        printer.printDirect({
          data: data,
          type: 'PDF',
          options: {
            media: 'Letter',
            'fit-to-page': true
          },
          success: function (id) {
            console.log('printed with id ' + id);
          },
          error: function (err) {
            console.error('error on printing: ' + err);
          }
        })
      });
      /*
       printer.printDirect({
       data: '<h1>Test print Radiogram</h1><div>Coba Print</div>',
       printer: defaultPrinter,
       type: 'TEXT',

       options:
       {
       media: 'Letter',
       'fit-to-page': true
       },
       success: function (jobID) {
       console.log('Sent to printer with ID: ' + jobID)
       },
       error: function (err) {
       console.log(err)
       }
       });
       */
    }
  },
  restricted: {

  },
  tokenList:[
    {
      name: 'radiogram-user',
      description: 'Radiogram User',
      token: RADIOGRAM_USER_TOKEN
    }
  ]
}

function getDateTime() {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + month + day + hour + min + sec;
}
