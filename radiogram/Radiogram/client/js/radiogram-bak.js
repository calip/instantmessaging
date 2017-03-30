soyut.radiogram = soyut.radiogram || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogram.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

var soyutSession = soyut.Session;
var roleName = soyut.Session.role;

soyut.radiogram.perfectScrollbarHandler = function () {
    var pScroll = $(".perfect-scrollbar");

    if (!soyut.radiogram.isMobile() && pScroll.length) {
        pScroll.perfectScrollbar({
            suppressScrollX : true
        });
        pScroll.on("mousemove", function() {
            $(this).perfectScrollbar('update');
        });
    }
};

soyut.radiogram.messageHeightHandler = function() {
    var $win = $(window);
    var page = $win;
    if(page.innerHeight() < $win.innerHeight()) {
        page = $(document);
    }
    var pageHeight = page.innerHeight() - $('header').outerHeight();
    $(".wrap-messages").css({
        height: pageHeight
    });

};
// Window Resize Function
soyut.radiogram.resizeHandler = function(func, threshold, execAsap) {
    $(window).resize(function() {
        soyut.radiogram.messageHeightHandler();
    });
};

soyut.radiogram.isMobile = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

socket.on('new_radiogram', function (data) {
    data.new_val.receivers.forEach(function(i){
        if(roleName.id == i){
            if(data.new_val.composeStatus == 'inbox'){
                console.log(data);
                SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
    
                soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
            }
        }  
    });

});

soyut.radiogram.listTembusan = [];
soyut.radiogram.preProcessAuthor = function(dbAuthor, callback) {
    sessionService.RoleKey_get({role: dbAuthor.id, session: soyutSession.id}, function (err, result) {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, result);
        }
    });
};
soyut.radiogram.preProcessAuthorAsync = Promise.promisify(soyut.radiogram.preProcessAuthor);

function SendNotification(title, content, id) {
    var app = getAppInstance();

    soyut.Event.getInstance().invokeSystemEvent('notification', {
        title: title, content: content, handler: function (d) {
            console.log(id);
            app.launchActivity("soyut.module.app.radiogram.wasdal.main", {radiogramId: id});
        }
    });
}

Vue.filter('truncate', function (value) {
    var length = 50;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

soyut.radiogram.renderInbox = function () {
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("active");
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'inbox');
};

soyut.radiogram.renderSent = function () {
    $(getInstanceID("wdl-nav-sent")).parent().addClass("active");
    $(getInstanceID("wdl-nav-sent")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'sent');
};

soyut.radiogram.renderDraft = function () {
    $(getInstanceID("wdl-nav-draft")).parent().addClass("active");
    $(getInstanceID("wdl-nav-draft")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'draft');
};
soyut.radiogram.renderTrash = function () {
    $(getInstanceID("wdl-nav-trash")).parent().addClass("active");
    $(getInstanceID("wdl-nav-trash")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'trash');
};

soyut.radiogram.renderCompose = function () {
    $(getInstanceID("wdl-email-form")).removeClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    $(getInstanceID('sender-name')).val(soyut.Session.user.name);
    $(getInstanceID('sender-pangkat')).val(soyut.Session.user.rank);
    $(getInstanceID('signature')).val(soyut.Session.user.signature);
    $(getInstanceID('sender-signature')).attr('src', soyut.Session.user.signature);
};

soyut.radiogram.renderContent = function () {

    $(getInstanceID("wdl-nav-inbox")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderInbox();
    });

    $(getInstanceID("wdl-nav-sent")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderSent();
    });

    $(getInstanceID("wdl-nav-draft")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderDraft();
    });

    $(getInstanceID("wdl-nav-trash")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderTrash();
    });

    $(getInstanceID("wdl-nav-compose")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderCompose();
    });

    $(getInstanceID("btnSubmitMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var title = $(getInstanceID("title")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
        var senderSignature = $(getInstanceID("signature")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error = "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error = "";
        }

        if (no == "" || no == null) {
            $('.parent-no').addClass('has-error');
            $('.no-error').removeClass('valid');
            $('.no-error').html('Harus diisi!');
            error = "no Error";
        }
        else {
            $('.parent-no').removeClass('has-error');
            $('.parent-no').addClass('has-success');
            $('.no-error').addClass('valid');
            $('.no-error').html('');
            error = "";
        }

        if(error != ""){
            return false;
        }
        else {
            var listRcp = [];
            if(roleName.isWASDAL){
                listRcp = receiverRole;
            }
            else{
                listRcp.push(receiverRole);
            }
            soyut.radiogram.Radiogram_Send({
                panggilan: panggilan,
                jenis: jenis,
                nomor: nomor,
                derajat: derajat,
                instruksi: instruksi,
                tandadinas: tandadinas,
                group: group,
                classification: klasifikasi,
                title: title,
                Number: no,
                cara: cara,
                paraf: paraf,
                alamataksi: alamataksi,
                alamattembusan: alamattembusan,
                content: message,
                readStatus: 'unread',
                owner: senderRole,
                sender: senderRole,
                senderWasdal: roleName.isWASDAL,
                receivers: listRcp,
                cc: tembusan,
                session: soyutSession.id,
                senderName: senderName,
                senderRank: senderRank,
                senderSignature: senderSignature,
                SendTime: new Date(),
                simtime: new Date(soyut.clock.getCurrentSimTime().simTime)
            }, function (err, result) {
                if (!err) {
                    //console.log(result)
                    soyut.radiogram.clearInput();
                    var resId = result.data.generated_keys[0];

                    $(getInstanceID("wdl-email-content")).addClass('disable');
                    $(getInstanceID("wdl-email-form")).addClass('disable');
                    $(getInstanceID("wdl-email-view")).addClass('disable');
                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                    soyut.radiogram.renderSendingResult('.email-result', resId);
                }
            });
        }
    });
    
    $(getInstanceID("btnSaveMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var title = $(getInstanceID("title")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
        var senderSignature = $(getInstanceID("signature")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error = "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error = "";
        }

        if (no == "" || no == null) {
            $('.parent-no').addClass('has-error');
            $('.no-error').removeClass('valid');
            $('.no-error').html('Harus diisi!');
            error = "no Error";
        }
        else {
            $('.parent-no').removeClass('has-error');
            $('.parent-no').addClass('has-success');
            $('.no-error').addClass('valid');
            $('.no-error').html('');
            error = "";
        }

        if(error != ""){
            return false;
        }
        else {
            var listRcp = [];
            if(roleName.isWASDAL){
                listRcp = receiverRole;
            }
            else{
                listRcp.push(receiverRole);
            }
            soyut.radiogram.Radiogram_Draft({
                panggilan: panggilan,
                jenis: jenis,
                nomor: nomor,
                derajat: derajat,
                instruksi: instruksi,
                tandadinas: tandadinas,
                group: group,
                classification: klasifikasi,
                title: title,
                Number: no,
                cara: cara,
                paraf: paraf,
                alamataksi: alamataksi,
                alamattembusan: alamattembusan,
                content: message,
                readStatus: 'unread',
                owner: senderRole,
                sender: senderRole,
                senderWasdal: roleName.isWASDAL,
                receivers: listRcp,
                cc: tembusan,
                session: soyutSession.id,
                senderName: senderName,
                senderRank: senderRank,
                senderSignature: senderSignature
            }, function (err, result) {
                if (!err) {
                    //console.log(result)
                    soyut.radiogram.clearInput();
                    soyut.radiogram.renderInbox();
                }
            });
        }
    });

    $(getInstanceID("btnPreviewMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderUser = $(getInstanceID("senderid")).val();
        var senderRole = $(getInstanceID("sender")).val();
        var receiverUser = $(getInstanceID("receiversid")).val();
        var receiverRole = $(getInstanceID("receivers")).val();
        var tembusan = $(".optCC").val();
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var title = $(getInstanceID("title")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
        var senderSignature = $(getInstanceID("sender-signature")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();

        var error = "";

        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.parent-receivers').children("ul").addClass("token-error");
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.parent-receivers').children("ul").removeClass('token-error');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error = "";
        }

        if (no == "" || no == null) {
            $('.parent-no').addClass('has-error');
            $('.parent-no').children("ul").addClass("token-error");
            $('.no-error').removeClass('valid');
            $('.no-error').html('Harus diisi!');
            error = "no Error";
        }
        else {
            $('.parent-no').removeClass('has-error');
            $('.parent-no').addClass('has-success');
            $('.parent-no').children("ul").removeClass('token-error');
            $('.no-error').addClass('valid');
            $('.no-error').html('');
            error = "";
        }

        if (error != "") {
            return false;
        }
        else {
            var listCc = [];
            if (tembusan != null) {
                if (tembusan.length > 0) {
                    tembusan.forEach(function (i) {
                        var cc = i.split(',');
                        var datacc = {
                            userId: cc[1],
                            roleId: cc[0]
                        }
                        listCc.push(datacc);
                    })
                }
            }

            var sender = {
                userId: senderUser,
                roleId: senderRole
            };
            var receivers = {
                userId: receiverUser,
                roleId: receiverRole
            };

            var contents = {
                panggilan: panggilan,
                jenis: jenis,
                nomor: nomor,
                derajat: derajat,
                instruksi: instruksi,
                tandadinas: tandadinas,
                group: group,
                classification: klasifikasi,
                title: title,
                Number: no,
                cara: cara,
                paraf: paraf,
                alamataksi: alamataksi,
                alamattembusan: alamattembusan,
                content: message,
                owner: sender,
                sender: sender,
                receivers: receivers,
                cc: listCc
            }

            $(getInstanceID("wdl-email-content")).addClass('disable');
            $(getInstanceID("wdl-email-form")).addClass('disable');
            $(getInstanceID("wdl-email-send")).addClass('disable');
            $(getInstanceID("wdl-email-view")).removeClass('disable');
            soyut.radiogram.renderMessagePreview('.email-preview', contents);

        }
    });

};

soyut.radiogram.clearInput = function(){
    soyut.radiogram.listTembusan = [];

    $(getInstanceID("panggilan")).val('');
    $(getInstanceID("jenis")).val('');
    $(getInstanceID("nomor")).val('');
    $(getInstanceID("instruksi")).val('');
    $(getInstanceID("senderid")).val('');
    $(getInstanceID("sender")).val('');
    $(getInstanceID("receiversid")).val('');
    $(getInstanceID("receivers")).val('');
    $(".optCC").val('');
    $(getInstanceID("tandadinas")).val('');
    $(getInstanceID("group")).val('');
    $(getInstanceID("title")).val('');
    $(getInstanceID("Number")).val('');
    $(getInstanceID("message-input")).val('');
    $(getInstanceID("sender-name")).val('');
    $(getInstanceID("sender-pangkat")).val('');
    $(getInstanceID("sender-signature")).val('');
    $(getInstanceID("alamataksi")).val('');
    $(getInstanceID("alamattembusan")).val('');
    $(getInstanceID("cara")).val('');
    $(getInstanceID("paraf")).val('');
    $(getInstanceID("jam")).val('');
    $(getInstanceID("tanggal")).val('');
};

Vue.component('email-preview', {
    props: ['contents','rolecc'],
    template: '#email-preview',
    methods: {
        BackToMessage: function () {
            console.log("back");
            this.$root.BackToMessage(this.contents);
        },
        SubmitMessage: function () {
            console.log("submit");
            this.$root.SubmitMessage(this.contents);
        },
        SaveMessage: function () {
            this.$root.SaveMessage(this.contents);
        }
    }
});

soyut.radiogram.renderMessagePreview = function (elSelector, message) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<email-preview :contents="contents" :rolecc="rolecc"></email-preview>');

    var vmpreview = new Vue({
        el: elSelector,
        data: {
            contents: '',
            rolecc: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;

                scenarioService.Role_find({query: {id: message.sender.roleId}}, function (err, sender) {
                    soyut.user.getUserById(message.sender.userId, function (err, suser) {
                        scenarioService.Role_find({query: {id: message.receivers.roleId}}, function (err, receiver) {
                            soyut.user.getUserById(message.receivers.userId, function (err, ruser) {

                                var renderMessage = "";
                                if(message.content != null) {
                                    var textArray = message.content.split('\n');
                                    for (var i = 0; i < textArray.length; i++) {
                                        renderMessage += textArray[i] + "<br />";
                                    }
                                }
                                var roleCc = "";
                    
                                message.cc.forEach(function (m) {
                                    if (m != "") {
                                        if(m.roleId != "" && m.userId != undefined) {
                                            scenarioService.Role_find({query: {id: m.roleId}}, function (err, rcc) {
                                                soyut.user.getUserById(m.userId, function (err, ucc) {
                                                    var ccdetail = rcc.data[0].position;
                                                    roleCc = roleCc + ccdetail + ", ";
                                                    _this.$set(_this, 'rolecc', roleCc);
                                                });
                                            });
                                        }
                                    }
                                });
                                // console.log(message.tembusan, message.no)
                                var contents = {
                                    title: message.title,
                                    content: message.content,
                                    tembusan: message.cc,
                                    renderMessages: renderMessage,
                                    receivers: message.receivers.roleId,
                                    receiversid: message.receivers.userId,
                                    receiverCallsign: receiver.data[0].position,
                                    receiverRank: ruser.rank,
                                    receiverName: ruser.name,
                                    receiverPhoto: ruser.photo,
                                    senderid: message.sender.userId,
                                    sender: message.sender.roleId,
                                    senderCallsign: sender.data[0].position,
                                    senderRank: suser.rank,
                                    senderName: suser.name,
                                    senderPhoto: suser.photo,
                                    senderSignature: suser.signature,
                                    panggilan: message.panggilan,
                                    jenis: message.jenis,
                                    Number: message.Number,
                                    derajat: message.derajat,
                                    instruksi: message.instruksi,
                                    klasifikasi: message.classification,
                                    nomor: message.nomor,
                                    cara: message.cara,
                                    paraf: message.paraf,
                                    tandadinas: message.tandadinas,
                                    group: message.group,
                                    alamataksi: message.alamataksi,
                                    alamattembusan: message.alamattembusan
                                };

                                _this.$set(_this, 'contents', contents);
                            });
                        });
                    });
                });
            },
            BackToMessage: function (contents) {
                soyut.radiogram.renderCompose();
            },
            SubmitMessage: function (contents) {
                var sender = {
                    userId: contents.senderid,
                    roleId: contents.sender
                };
                var receivers = {
                    userId: contents.receiversid,
                    roleId: contents.receivers
                };

                soyut.radiogram.Radiogram_Send({
                    panggilan: contents.panggilan,
                    jenis: contents.jenis,
                    nomor: contents.nomor,
                    derajat: contents.derajat,
                    instruksi: contents.instruksi,
                    tandadinas: contents.tandadinas,
                    group: contents.group,
                    classification: contents.klasifikasi,
                    title: contents.title,
                    Number: contents.Number,
                    cara: contents.cara,
                    paraf: contents.paraf,
                    alamataksi: contents.alamataksi,
                    alamattembusan: contents.alamattembusan,
                    content: contents.content,
                    readStatus: 'unread',
                    owner: sender,
                    sender: sender,
                    receivers: receivers,
                    cc: contents.tembusan,
                    session: soyutSession.id,
                    SendTime: new Date()
                }, function (err, result) {
                    if (!err) {
                        var resId = result.data.generated_keys[0];
                        $(getInstanceID("wdl-email-content")).addClass('disable');
                        $(getInstanceID("wdl-email-form")).addClass('disable');
                        $(getInstanceID("wdl-email-view")).addClass('disable');
                        $(getInstanceID("wdl-email-send")).removeClass('disable');
                        soyut.radiogram.renderSendingResult('.email-result', resId);
                    }
                });
            },
            SaveMessage: function (contents) {
                
                var sender = {
                    userId: contents.senderid,
                    roleId: contents.sender
                };
                var receivers = {
                    userId: contents.receiversid,
                    roleId: contents.receivers
                };

                soyut.radiogram.Radiogram_Draft({
                    panggilan: contents.panggilan,
                    jenis: contents.jenis,
                    nomor: contents.nomor,
                    derajat: contents.derajat,
                    instruksi: contents.instruksi,
                    tandadinas: contents.tandadinas,
                    group: contents.group,
                    classification: contents.klasifikasi,
                    title: contents.title,
                    Number: contents.Number,
                    cara: contents.cara,
                    paraf: contents.paraf,
                    alamataksi: contents.alamataksi,
                    alamattembusan: contents.alamattembusan,
                    content: contents.content,
                    readStatus: 'unread',
                    owner: sender,
                    sender: sender,
                    receivers: receivers,
                    cc: contents.tembusan,
                    session: soyutSession.id
                }, function (err, result) {
                    if (!err) {
                        soyut.radiogram.clearInput();
                        soyut.radiogram.renderInbox();
                    }
                });
            }
        }
    });
};

Vue.component('wasdal-list', {
    props: ['messages'],
    template: '#wasdal-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        viewMessageDetail: function (val) {
            this.$root.viewMessageDetail(val);
        }
    }
});

soyut.radiogram.renderListGroupMessage = function (elSelector, elChildren, message, group) {
    var vm;

    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<wasdal-list :messages="messages"></wasdal-list>');

    vm = new Vue({
        el: elSelector,
        data: {
            messages: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;
                var getRadiogram = function (owner, sender, callback) {
                    soyut.radiogram.Radiogram_GetInboxByRoleGroup({id: owner, sender: sender, state: message}, function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                if (data != null) {
                                    callback(false, data);
                                }
                            }
                        }
                    });
                };
                scenarioService.VRole_list({scenario: roleName.scenario}, function (err, role) {
                    var arrData =[];
                    role.forEach(function (m) {

                        scenarioService.Role_getRoleByGroup({roleGroup: group}, function (err, rolegroup) {
                            rolegroup.forEach(function (rg) {
                                getRadiogram(m.id, rg.id, function (err, res) {
                                    res.forEach(function (i) {
                                        if(message == "inbox") {
                                            scenarioService.Role_find({query: {id: i.sender}}, function (err, sender) {
                                                arrData.push({
                                                    id: i.id,
                                                    title: i.title,
                                                    content: i.content,
                                                    SendTime: i.SendTime,
                                                    simtime: i.simtime,
                                                    Number: i.Number,
                                                    receiverCallsign: sender.data[0].callsign
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            });
                                        }
                                    });
                                });
                            });
                        });

                    });

                });
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.renderMessageDetail('.email-reader', val, 'inbox');
            }
        }
    });
};


Vue.component('email-list', {
    props: ['messages'],
    template: '#email-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        viewMessageDetail: function (val) {
            this.$root.viewMessageDetail(val);
        }
    }
});

soyut.radiogram.renderListMessage = function (elSelector, elChildren, message) {
    var vm;

    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<email-list :messages="messages"></email-list>');

    vm = new Vue({
        el: elSelector,
        data: {
            messages: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;

                var getRadiogram = function (role, callback) {
                    soyut.radiogram.Radiogram_GetInboxByRole({id: role, state: message}, function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                if (data != null) {
                                    callback(false, data);
                                }
                            }
                        }
                    });
                };

                if (roleName.isWASDAL) {
                    var arrData =[];
                    scenarioService.VRole_list({scenario: roleName.scenario}, function (err, vrole) {
                        vrole.forEach(function (v) {
                            getRadiogram(v.id, function (err, vres) {
                                vres.forEach(function (vi) {
                                    if(message == "inbox") {
                                        if(vi.senderWasdal){
                                            scenarioService.VRole_get({id:vi.sender}, function (err, vsender) {
                                                arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    Number: vi.Number,
                                                    receiverCallsign: vsender.data.callsign,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            });
                                        }
                                        else{
                                            scenarioService.Role_find({query: {id: vi.sender}}, function (err, vsender) {
                                                 arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    Number: vi.Number,
                                                    receiverCallsign: vsender.data[0].callsign,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            })
                                        }
                                    }
                                    else{
                                        if(vi.senderWasdal){
                                            scenarioService.Role_find({query: {id: vi.receivers}}, function (err, vrec) {
                                                 arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    Number: vi.Number,
                                                    receiverCallsign: vrec.data[0].callsign,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            })
                                            
                                        }
                                        else{
                                            scenarioService.VRole_get({id:vi.receivers}, function (err, vrec) {
                                                arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    Number: vi.Number,
                                                    receiverCallsign: vrec.data.callsign,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            });
                                        }
                                    }
                                });
                            })
                        })
                    });
                }
                else{
                    var arrData =[];
                    scenarioService.Role_getRoleByGroup({roleGroup: roleName.roleGroup}, function(err, listRole){
                        listRole.forEach(function (m) {
                            getRadiogram(m.id, function (err, res) {
                                res.forEach(function (i) {
                                    if(message == "inbox") {
                                        scenarioService.VRole_get({id:i.sender}, function (err, sender) {
                                            arrData.push({
                                                id: i.id,
                                                title: i.title,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: i.simtime,
                                                Number: i.Number,
                                                receiverCallsign: sender.data.callsign
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    }
                                    else{
                                        scenarioService.VRole_get({id:i.receivers}, function (err, rec) {
                                            arrData.push({
                                                id: i.id,
                                                title: i.title,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: i.simtime,
                                                Number: i.Number,
                                                receiverCallsign: rec.data.callsign
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.renderMessageDetail('.email-reader', val, message);
            }
        }
    });
};

Vue.component('email-reader', {
    props: ['contents','rolecc','rolereceiver'],
    template: '#email-reader',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ReplyMessage: function () {
            this.$root.ReplyMessage(this.contents);
        },
        SubmitMessage: function(){
            this.$root.SubmitMessage(this.contents);
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents, this.rolecc, this.rolereceiver);
        },
        PrintPdf: function () {
            this.$root.PrintPdf(this.contents, this.rolecc, this.rolereceiver);
        },
        loadMoveButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        MoveMessage: function(){
            this.$root.MoveMessage(this.contents);
        },
        loadDeleteButton: function(val){
            if(val != 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        DeleteMessage: function(){
            this.$root.DeleteMessage(this.contents);
        },
        loadPrintButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadPDFButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadReplyButton: function(val){
            if(val == 'draft'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadSentButton: function(val){
            if(val == 'sent' || val == 'inbox'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        }
    }
});

soyut.radiogram.renderMessageDetail = function (elSelector, message, state) {
    var vm;

    var $el = $(elSelector);
    $el.html('');

    $el.append('<email-reader :contents="contents" :rolecc="rolecc" :rolereceiver="rolereceiver"></email-reader>');

    vm = new Vue({
        el: elSelector,
        data: {
            contents: '',
            rolereceiver: '',
            rolecc: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;
                soyut.radiogram.Radiogram_GetById({id: message}, function (err, data) {
                    if(data.composeStatus == 'draft'){
                        $('.btn-replyMessage').addClass('disable');
                    }
                    if (roleName.isWASDAL) {
                        if(data.senderWasdal){
                            scenarioService.VRole_get({id:data.sender}, function (err, sender) {
                            
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }
                                var roleCc = "";
                                if(data.cc != null || data.cc != undefined){
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            scenarioService.VRole_get({id: m}, function (err, rcc) {
                                                roleCc = roleCc + rcc.data.callsign + ", ";
                                                _this.$set(_this, 'rolecc', roleCc);
                                            });
                                        }
                                    });
                                }
                                var roleReceiver = "";
                                if(data.receivers != null || data.receivers != undefined){
                                    data.receivers.forEach(function (n) {
                                        if (n != "") {
                                            scenarioService.Role_find({query: {id: n}}, function (err, rpt) {
                                                roleReceiver = roleReceiver + rpt.data[0].callsign + ", ";
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }

                                var contents = {
                                    id: data.id,
                                    title: data.title,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data.callsign,
                                    senderRank: data.senderName,
                                    senderName: data.senderRank,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    no: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    klasifikasi: data.classification,
                                    no: data.Number,
                                    cara: data.cara,
                                    paraf: data.paraf,
                                    tandadinas: data.tandadinas,
                                    group: data.group,
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    composeStatus: data.composeStatus
                                };

                                _this.$set(_this, 'contents', contents);

                            });
                        }
                        else{
                            scenarioService.Role_find({query: {id: data.sender}}, function (err, sender) {
                            
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }
                                var roleCc = "";
                                if(data.cc != null || data.cc != undefined){
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            scenarioService.VRole_get({id: m}, function (err, rcc) {
                                                console.log(rcc)
                                                roleCc = roleCc + rcc.data.callsign + ", ";
                                                _this.$set(_this, 'rolecc', roleCc);
                                            });
                                        }
                                    });
                                }
                                var roleReceiver = "";
                                if(data.receivers != null || data.receivers != undefined){
                                    data.receivers.forEach(function (n) {
                                        if (n != "") {
                                            scenarioService.VRole_get({id: n}, function (err, rpt) {
                                                roleReceiver = roleReceiver + rpt.data.callsign + ", ";
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }

                                var contents = {
                                    id: data.id,
                                    title: data.title,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data[0].callsign,
                                    senderRank: data.senderName,
                                    senderName: data.senderRank,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    no: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    klasifikasi: data.classification,
                                    no: data.Number,
                                    cara: data.cara,
                                    paraf: data.paraf,
                                    tandadinas: data.tandadinas,
                                    group: data.group,
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    composeStatus: data.composeStatus
                                };

                                _this.$set(_this, 'contents', contents);

                            });
                        }
                    }
                    else{
                        if(data.senderWasdal){
                            scenarioService.VRole_get({id:data.sender}, function (err, sender) {
                            
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }
                                var roleCc = "";
                                if(data.cc != null || data.cc != undefined){
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            scenarioService.VRole_get({id: m}, function (err, rcc) {
                                                roleCc = roleCc + rcc.data.callsign + ", ";
                                                _this.$set(_this, 'rolecc', roleCc);
                                            });
                                        }
                                    });
                                }
                                var roleReceiver = "";
                                if(data.receivers != null || data.receivers != undefined){
                                    data.receivers.forEach(function (n) {
                                        if (n != "") {
                                            scenarioService.Role_find({query: {id: n}}, function (err, rpt) {
                                                roleReceiver = roleReceiver + rpt.data[0].callsign + ", ";
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }

                                var contents = {
                                    id: data.id,
                                    title: data.title,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data.callsign,
                                    senderRank: data.senderName,
                                    senderName: data.senderRank,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    no: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    klasifikasi: data.classification,
                                    no: data.Number,
                                    cara: data.cara,
                                    paraf: data.paraf,
                                    tandadinas: data.tandadinas,
                                    group: data.group,
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    composeStatus: data.composeStatus
                                };

                                _this.$set(_this, 'contents', contents);

                            });
                        }
                        else{
                            scenarioService.Role_find({query: {id: data.sender}}, function (err, sender) {
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }
                                var roleCc = "";
                                if(data.cc != null || data.cc != undefined){
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            scenarioService.VRole_get({id: m}, function (err, rcc) {
                                                console.log(rcc)
                                                roleCc = roleCc + rcc.data.callsign + ", ";
                                                _this.$set(_this, 'rolecc', roleCc);
                                            });
                                        }
                                    });
                                }
                                var roleReceiver = "";
                                if(data.receivers != null || data.receivers != undefined){
                                    data.receivers.forEach(function (n) {
                                        if (n != "") {
                                            scenarioService.VRole_get({id: n}, function (err, rpt) {
                                                roleReceiver = roleReceiver + rpt.data.callsign + ", ";
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }

                                var contents = {
                                    id: data.id,
                                    title: data.title,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data[0].callsign,
                                    senderRank: data.senderName,
                                    senderName: data.senderRank,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    no: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    klasifikasi: data.classification,
                                    no: data.Number,
                                    cara: data.cara,
                                    paraf: data.paraf,
                                    tandadinas: data.tandadinas,
                                    group: data.group,
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    composeStatus: data.composeStatus
                                };

                                _this.$set(_this, 'contents', contents);
                            });
                        }
                    }
                });
            },
            PrintPdf: function (content, rolecc, rolereceiver) {
                soyut.radiogram.Printer_PrintToPDF({
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    instruksi: content.instruksi,
                    datetime: content.simtime,
                    sender_Name: content.senderCallsign,
                    receiver_Name: rolereceiver,
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.senderName,
                    senderpangkat: content.senderRank,
                    tanda_tangan: content.senderSignature,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        soyut.radiogram.Show_PdfViewer(msg);
                    }
                });
            },
            PrintPaper: function (content, rolecc) {
                soyut.System.socket.get('localSocket').emit('printRadiogram', {
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    datetime: content.datetime,
                    sender_Name: content.senderCallsign,
                    receiver_Name: content.receiverCallsign,
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    instruksi: content.instruksi,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.sendername,
                    senderpangkat: content.senderpangkat,
                    tanda_tangan: content.tanda_tangan,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        console.log('call function print');
                    }
                });
            },
            SubmitMessage: function(content){
                radiogramService.Radiogram_GetById({id: content.id}, function(err,res) {
                    if (!err) {
                        var curSimTime = new Date(soyut.clock.getCurrentSimTime().simTime);
                        radiogramService.Radiogram_SendDraft({id:res.id, sendtime: curSimTime}, function(err, msg) {
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                            soyut.radiogram.renderInbox();
                            
                        })
                    }
                });
            },
            ReplyMessage: function (content) {
                soyut.radiogram.renderCompose();
            },
            MoveMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
                    soyut.radiogram.Radiogram_UpdateToTrash({id: content.id}, function (err, data) {
                        if(!err){
                            switch(state){
                                case 'inbox':
                                    soyut.radiogram.renderInbox();       
                                    break;
                                case 'sent':
                                    soyut.radiogram.renderSent();       
                                    break;
                                case 'draft':
                                    soyut.radiogram.renderDraft();       
                                    break;
                            }
                        }
                    });
                }
            },
            DeleteMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
                    soyut.radiogram.Radiogram_delete({id: content.id}, function (err, data) {
                        if(!err){
                            soyut.radiogram.renderTrash();       
                        }
                    });
                }
            }
        }
    });
};

soyut.radiogram.Show_PdfViewer = function(val) {
    var app = getAppInstance();

    app.launchActivity("soyut.module.app.radiogram.wasdal.pdfviewer", {file: val});
};

Vue.component('send-result', {
    props: ['contents','rolecc'],
    template: '#send-result',
    methods: {
        BackToInbox: function () {
            this.$root.BackToInbox();
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents, this.rolecc);
        },
        PrintPDF: function () {
            this.$root.PrintPDF(this.contents, this.rolecc);
        }
    }
});

soyut.radiogram.renderSendingResult = function (elSelector, message) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<send-result :contents="contents" :rolecc="rolecc"></send-result>');

    var vmres = new Vue({
        el: elSelector,
        data: {
            contents: '',
            rolecc:''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;
                soyut.radiogram.Radiogram_GetById({id: message}, function (err, data) {
                    scenarioService.Role_find({query: {id: data.sender.roleId}}, function (err, sender) {
                        soyut.user.getUserById(data.sender.userId, function (err, suser) {
                            scenarioService.Role_find({query: {id: data.receivers.roleId}}, function (err, receiver) {
                                soyut.user.getUserById(data.receivers.userId, function (err, ruser) {
                                    var textArray = data.content.split('\n');
                                    var renderMessage = "";
                                    for (var i = 0; i < textArray.length; i++) {
                                        renderMessage += textArray[i] + "<br />";
                                    }
                                    var roleCc = "";
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            if(m.roleId != "" && m.userId != undefined) {
                                                scenarioService.Role_find({query: {id: m.roleId}}, function (err, rcc) {
                                                    soyut.user.getUserById(m.userId, function (err, ucc) {
                                                        var ccdetail = rcc.data[0].position + ' (' + ucc.rank + ' ' + ucc.name + ')';
                                                        roleCc = roleCc + ccdetail + ", ";
                                                        _this.$set(_this, 'rolecc', roleCc);
                                                    });
                                                });
                                            }

                                        }
                                    });

                                    var arrData = {
                                        id: data.id,
                                        title: data.title,
                                        content: data.content,
                                        tembusan: data.cc,
                                        renderMessages: renderMessage,
                                        SendTime: data.SendTime,
                                        receiverRole: data.receivers.roleId,
                                        receiverUser: data.receivers.userId,
                                        receiverCallsign: receiver.data[0].position,
                                        receiverRank: ruser.rank,
                                        receiverName: ruser.name,
                                        receiverPhoto: ruser.photo,
                                        senderRole: data.sender.roleId,
                                        senderUser: data.sender.userId,
                                        senderCallsign: sender.data[0].position,
                                        senderRank: suser.rank,
                                        senderName: suser.name,
                                        senderPhoto: suser.photo,
                                        senderSignature: suser.signature,
                                        panggilan: data.panggilan,
                                        jenis: data.jenis,
                                        no: data.nomor,
                                        derajat: data.derajat,
                                        instruksi: data.instruksi,
                                        klasifikasi: data.classification,
                                        no: data.Number,
                                        cara: data.cara,
                                        paraf: data.paraf,
                                        tandadinas: data.tandadinas,
                                        group: data.group,
                                        alamataksi: data.alamataksi,
                                        alamattembusan: data.alamattembusan
                                    };

                                    _this.$set(_this, 'contents', arrData);
                                });
                            });
                        });
                    });
                });
            },
            BackToInbox: function () {
                soyut.radiogram.clearInput();
                soyut.radiogram.renderInbox();
            },
            PrintPaper: function (content, rolecc) {
                soyut.System.socket.get('localSocket').emit('printRadiogram', {
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    datetime: content.datetime,
                    sender_Name: content.senderCallsign +" ("+ content.senderRank +" "+ content.senderName+")",
                    receiver_Name: content.receiverCallsign +" ("+ content.receiverRank +" "+ content.receiverName+")",
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    instruksi: content.instruksi,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.sendername,
                    senderpangkat: content.senderpangkat,
                    tanda_tangan: content.tanda_tangan,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        console.log('call function print');
                    }
                });
            },
            PrintPDF: function (content, rolecc) {
                soyut.radiogram.Printer_PrintToPDF({
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    datetime: content.datetime,
                    sender_Name: content.senderCallsign +" ("+ content.senderRank +" "+ content.senderName+")",
                    receiver_Name: content.receiverCallsign +" ("+ content.receiverRank +" "+ content.receiverName+")",
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    instruksi: content.instruksi,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.sendername,
                    senderpangkat: content.senderpangkat,
                    tanda_tangan: content.tanda_tangan,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        soyut.radiogram.Show_PdfViewer(msg);
                    }
                });

            }
        }
    });
};

Vue.component('role-group-list', {
    props: ['groups'],
    template: '#role-group-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ViewInboxGroup: function (val) {
            this.$root.ViewInboxGroup(val);
        },
        loadAttribute: function (val) {
            var attr;
            attr = {
                'class' : 'wdl-role-'+ val
            };
            return attr;
        }
    }
});

soyut.radiogram.renderWasdalRadiogram = function (elSelector) {
    var vm;

    var $el = $(elSelector);
    $el.html('');
    $el.append('<role-group-list :groups="groups"></role-group-list>');

    vm = new Vue({
        el: elSelector,
        data: {
            groups: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadGroups();
            });
        },
        methods: {
            LoadGroups: function () {
                var _this = this;

                sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
                    scenarioService.scenario_listRoleGroups({scenario_id: scenario}, function(err, listRole){
                        _this.$set(_this, 'groups', listRole);
                    });
                });
            },
            ViewInboxGroup: function(val){
                soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'inbox', val);
            }
        }
    });
};

soyut.radiogram.getListVRole = function (scenario, callback) {
    var getRole = [];
    scenarioService.VRole_list({scenario: scenario}, function(err, listRole){
        listRole.forEach(function(i){
            var roles = {
                'id': i.id,
                'callsign': i.callsign,
                'scenario': i.scenario,
                'position': i.position,
                'positionCodeName': i.positionCodeName
            };
            getRole.push(roles);
        });
        callback(false, getRole);
    });
};

soyut.radiogram.listReceivers = [];
soyut.radiogram.preProcessReceiverWasdal = function(group, callback) {
    scenarioService.Role_getRoleByGroup({roleGroup: group.id}, function (err, result) {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, result);
        }
    });
};
soyut.radiogram.preProcessReceiverWasdalAsync = Promise.promisify(soyut.radiogram.preProcessReceiverWasdal);

soyut.radiogram.getListReceiverWasdal = function (scenario, callback) {
    scenarioService.scenario_listRoleGroups({scenario_id: scenario}, function(err, result){
        Promise.each(result, function(post) {
                return soyut.radiogram.preProcessReceiverWasdalAsync(post).then(function (role) {
                    var data = {
                        'id': post.id,
                        'name': post.name,
                        'scenario': post.scenario,
                        'role': role
                    };
                    soyut.radiogram.listReceivers.push(data);
                });
            }).then(function() {
            if (callback) {
                callback(err, result);
            }
        });
    });
};

soyut.radiogram.renderReceiverWasdal = function () {
    soyut.radiogram.listReceivers = [];
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogram.getListReceiverWasdal(scenario, function (err, listGroup) {
            var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';
            soyut.radiogram.listReceivers.forEach(function (i) {
                html += '<optgroup label="'+i.name+'">';
                i.role.forEach(function(m){
                    html += '<option value="'+m.id+'">'+m.callsign+'</option>'; 
                });
                html += '</optgroup>';
            });
            html +='</select>';
            html +='<span class="receivers-error help-block valid"></span>';
            $(getInstanceID("list-receiver")).append(html);

            $('.optReceiver').multiselect({
                columns: 1,
                placeholder: 'Cari...',
                search: true,
                selectAll: true
            });
        });
    });
};

soyut.radiogram.renderSenderWasdal = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogram.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none">';
            html += '<option value="">Cari..</option>';
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.position +'</option>';
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    });
};

soyut.radiogram.renderCCWasdal = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogram.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.callsign +'</option>';
            });
            html +='</select>';
            $(getInstanceID("list-tembusan")).append(html);

            $('.optCC').multiselect({
                columns: 1,
                placeholder: 'Cari...',
                search: true,
                selectAll: true
            });
        });
    });
};

soyut.radiogram.renderComposeSender = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        scenarioService.Role_getRoleListGroup({scenario: scenario, group:roleName.roleGroup}, function (err, listRole) {
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none">';
            html += '<option value="">Cari..</option>';
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.callsign +'</option>';
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    });
};

soyut.radiogram.renderComposeReceivers = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogram.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optReceiver" id="optReceiver" class="form-control optReceiver" style="display:none">';
            html += '<option value="">Cari..</option>';
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.callsign +'</option>';
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-receiver")).append(html);

            $(".optReceiver").select2({ width: '100%' });
        });
    });
};

soyut.radiogram.renderComposeCC = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogram.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.callsign +'</option>';
            });
            html +='</select>';
            $(getInstanceID("list-tembusan")).append(html);

            $('.optCC').multiselect({
                columns: 1,
                placeholder: 'Cari...',
                search: true,
                selectAll: true
            });
        });
    });
};


soyut.radiogram.init = function () {
    soyut.radiogram.perfectScrollbarHandler();
    soyut.radiogram.messageHeightHandler();
    soyut.radiogram.resizeHandler();
    soyut.radiogram.renderInbox();
    soyut.radiogram.renderContent();

    $(".derajat").select2({ width: '100%' });

    if(roleName.isWASDAL){
        soyut.radiogram.renderSenderWasdal();
        soyut.radiogram.renderReceiverWasdal();
        soyut.radiogram.renderCCWasdal();
        soyut.radiogram.renderWasdalRadiogram('.role-group-list');
    }
    else{
        soyut.radiogram.renderComposeSender();
        soyut.radiogram.renderComposeReceivers();
        soyut.radiogram.renderComposeCC();

        $(getInstanceID('role-group-name')).css('display','none');
    }
};

soyut.radiogram.init();
