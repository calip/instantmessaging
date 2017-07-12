soyut.radiogramdraft = soyut.radiogramdraft || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogramdraft.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

var soyutSession = soyut.Session;
var roleName = soyut.Session.role;
var getId = getParam('id');

soyut.radiogramdraft.perfectScrollbarHandler = function () {
    var pScroll = $(".perfect-scrollbar");

    if (!soyut.radiogramdraft.isMobile() && pScroll.length) {
        pScroll.perfectScrollbar({
            suppressScrollX : true
        });
        pScroll.on("mousemove", function() {
            $(this).perfectScrollbar('update');
        });
    }
};

soyut.radiogramdraft.messageHeightHandler = function() {
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
soyut.radiogramdraft.resizeHandler = function(func, threshold, execAsap) {
    $(window).resize(function() {
        soyut.radiogramdraft.messageHeightHandler();
    });
};

soyut.radiogramdraft.isMobile = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

Vue.filter('truncate', function (value) {
    var length = 50;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

Vue.filter('truncsender', function (value) {
    var length = 15;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

soyut.radiogramdraft.renderDraft = function () {
    $(getInstanceID("rig-email-content")).removeClass('disable');
    $(getInstanceID("rig-email-form")).addClass('disable');
    $(getInstanceID("rig-email-view")).addClass('disable');

    soyut.radiogramdraft.renderListMessage('.email-list', '.email-reader', 'draft');
};

soyut.radiogramdraft.renderCompose = function () {
    $(getInstanceID("rig-email-form")).removeClass('disable');
    $(getInstanceID("rig-email-content")).addClass('disable');
    $(getInstanceID("rig-email-view")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
   
    if(!roleName.isAddress && !roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("btnSubmitMessage")).css({display:'none'});
    }

    // soyut.radiogramdraft.renderMateriWasdal('new', null);
    soyut.radiogramdraft.renderSenderWasdal('new', null);
    soyut.radiogramdraft.renderReceiverWasdal('new', null);
    soyut.radiogramdraft.renderCCWasdal('new', null);

    // $(getInstanceID('sender-name')).val(soyut.Session.role.callsign);
    // $(getInstanceID('sender-pangkat')).val(soyut.Session.user.rank);
    // $(getInstanceID('signature')).val(soyut.Session.user.signature);
    // $(getInstanceID('sender-signature')).attr('src', soyut.Session.user.signature);
};

soyut.radiogramdraft.renderContent = function () {
    $(getInstanceID("nav-compose")).click(function (event) {
        soyut.radiogramdraft.renderCompose();
    });

    $(getInstanceID("SaveMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        // var materi = $(".optMateri").val();
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var title = $(getInstanceID("title")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
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

        if(error != ""){
            return false;
        }
        else {
            var lsrcvr = [];
            var klsrcvr = [];
            var alsrcvr = [];
            receiverRole.forEach(function (i) {
                var mi = i.split(":");
                if(mi[1] == "vrole"){
                    lsrcvr.push(mi[0]);
                }
                else if(mi[1] == 'role') {
                    klsrcvr.push(mi[0]);
                }
                else {
                    alsrcvr.push(mi[0]);
                }
            });

            var lscc = [];
            var klcc = [];
            var alcc = [];
            if(tembusan != undefined || tembusan != null) {
                if (tembusan.length > 0) {
                    tembusan.forEach(function (i) {
                        var mi = i.split(":");
                        if (mi[1] == "vrole") {
                            lscc.push(mi[0]);
                        }
                        else if (mi[1] == 'role') {
                            klcc.push(mi[0]);
                        }
                        else {
                            alcc.push(mi[0]);
                        }
                    });
                }
            }

            soyut.radiogram.DraftWasdalRadiogram({
                panggilan: panggilan,
                jenis: jenis,
                nomor: nomor,
                derajat: derajat,
                instruksi: instruksi,
                tandadinas: tandadinas,
                group: group,
                classification: klasifikasi,
                materi: null,
                Number: no,
                cara: cara,
                paraf: paraf,
                alamataksi: alamataksi,
                alamattembusan: alamattembusan,
                content: message,
                readStatus: 'unread',
                sender: senderRole,
                receivers: lsrcvr,
                kreceivers: klsrcvr,
                alsreceivers: alsrcvr,
                cc: lscc,
                kcc: klcc,
                alscc: alcc,
                senderName: senderName,
                senderRank: senderRank
            },function(res){
                soyut.radiogram.clearInput();
                $(getInstanceID("wdl-email-content")).addClass('disable');
                $(getInstanceID("wdl-email-form")).addClass('disable');
                $(getInstanceID("wdl-email-view")).addClass('disable');
                $(getInstanceID("wdl-email-send")).removeClass('disable');
                soyut.radiogramdraft.renderDraft();
            });
        }
    });
    $(getInstanceID("BackMessage")).click(function (event) {
        soyut.radiogramdraft.renderDraft();
    });
};

soyut.radiogramdraft.clearInput = function(){
    soyut.radiogramdraft.listTembusan = [];

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

soyut.radiogramdraft.renderListMessage = function (elSelector, elChildren, message) {
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

                var arrData =[];
                soyut.radiogram.renderListWasdalMessages(message,function(res){
                    res.sort(function(a,b){
                        var c = new Date(a.createTime);
                        var d = new Date(b.createTime);
                        return d-c;
                    });
                    res.forEach(function (vi) {
                        var stringTime = '';
                        if(message == 'draft'){
                            stringTime = '<span class="text">dibuat '+moment(vi.createTime).format("DD-MM-YYYY h:mm")+'</span>';
                        }
                        else{
                            stringTime = '<span class="text">waktu Sebenarnya '+ moment(vi.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                '<span class="text">waktu Asumsi '+ moment(vi.simtime).format("DD-MM-YYYY h:mm") +'</span>';
                        }
                        
                        soyut.radiogram.renderListReceiversDetail(vi.receivers, function (receivers) {
                            soyut.radiogram.renderListKogasDetail(vi.kreceivers, function (kreceivers) {
                                soyut.radiogram.renderListAliasDetail(vi.alsreceivers, function (alsreceivers) {
                                    arrData.push({
                                        id: vi.id,
                                        title: vi.title,
                                        content: vi.content,
                                        SendTime: vi.SendTime,
                                        simtime: vi.simtime,
                                        createTime: vi.createTime,
                                        stringTime: stringTime,
                                        Number: vi.Number,
                                        readStatus: vi.readStatus,
                                        composeStatus: vi.composeStatus,
                                        receiverCallsign: alsreceivers + " " + kreceivers + " " + receivers,
                                        receiverRank: "",
                                        receiverName: "",
                                        receiverPhoto: ""
                                    });
                                    _this.$set(_this, 'messages', arrData);
                                });
                            });
                        });
                    });
                });
            },
            viewMessageDetail: function (val) {
                soyut.radiogramdraft.renderMessageDetail('.email-reader', val, message);
            }
        }
    });
};

Vue.component('email-reader', {
    props: ['contents'],
    template: '#email-reader',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        SelectMessage: function () {
            this.$root.SelectMessage(this.contents);
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
        }
    }
});

soyut.radiogramdraft.renderMessageDetail = function (elSelector, message, state) {
    var vm;

    var $el = $(elSelector);
    $el.html('');

    $el.append('<email-reader :contents="contents"></email-reader>');

    vm = new Vue({
        el: elSelector,
        data: {
            contents: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;
                soyut.radiogram.renderMessageObj(message, function(data){
                    var arrMateri = [];
                    if(data.materi != null ) {
                        data.materi.forEach(function (i) {
                            arrMateri = arrMateri + i + ", ";
                        });
                    }
                    else {
                        arrMateri = '';
                    }

                    soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                        if(data.senderWasdal) {
                            soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                    soyut.radiogram.renderListAliasDetail(data.alsreceivers, function (alsreceivers) {
                                        soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                            soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                soyut.radiogram.renderListAliasDetail(data.alscc, function (alscc) {
                                                    var textArray = data.content.split('\n');
                                                    var renderMessage = "";
                                                    for (var i = 0; i < textArray.length; i++) {
                                                        renderMessage += textArray[i] + "<br />";
                                                    }
                                                    var contents = {
                                                        id: data.id,
                                                        content: data.content,
                                                        tembusan: data.cc,
                                                        renderMessages: renderMessage,
                                                        SendTime: data.SendTime,
                                                        simtime: data.simtime,
                                                        senderRole: data.sender,
                                                        senderCallsign: sender.position,
                                                        senderRank: data.senderRank,
                                                        senderName: data.senderName,
                                                        materi: arrMateri,
                                                        senderPhoto: "",
                                                        senderSignature: "",
                                                        panggilan: data.panggilan,
                                                        jenis: data.jenis,
                                                        nomor: data.nomor,
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
                                                        composeStatus: data.composeStatus,
                                                        receiverDetail: alsreceivers + " " + kreceivers + " " + receivers,
                                                        ccDetail: alscc + " " + cc + " " + kcc
                                                    };

                                                    _this.$set(_this, 'contents', contents);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                    soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                        soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                            //soyut.radiogram.renderUserDetail(data.sender, function (user) {
                                            var textArray = data.content.split('\n');
                                            var renderMessage = "";
                                            for (var i = 0; i < textArray.length; i++) {
                                                renderMessage += textArray[i] + "<br />";
                                            }
                                            var contents = {
                                                id: data.id,
                                                content: data.content,
                                                tembusan: data.cc,
                                                renderMessages: renderMessage,
                                                SendTime: data.SendTime,
                                                simtime: data.simtime,
                                                senderRole: data.sender,
                                                senderCallsign: sender.position + " (" + senderrg.name + ")",
                                                senderRank: data.senderRank,
                                                senderName: data.senderName,
                                                materi: arrMateri,
                                                senderPhoto: "",
                                                senderSignature: "",
                                                panggilan: data.panggilan,
                                                jenis: data.jenis,
                                                nomor: data.nomor,
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
                                                composeStatus: data.composeStatus,
                                                receiverDetail: kreceivers + " " + receivers,
                                                ccDetail: cc
                                            };

                                            _this.$set(_this, 'contents', contents);
                                        });
                                    });
                                });
                            });
                        }
                    });
                })
            },
            MoveMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
                    soyut.radiogramdraft.Radiogram_UpdateToTrash({id: content.id}, function (err, data) {
                        if(!err){
                            soyut.radiogramdraft.renderDraft();       
                        }
                    });
                }
            },
            DeleteMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
                    soyut.radiogramdraft.Radiogram_delete({id: content.id}, function (err, data) {
                        if(!err){
                            soyut.radiogramdraft.renderDraft();      
                        }
                    });
                }
            },
            SelectMessage: function (content) {
                var data = {
                    id: getId,
                    radiogram: content.id,
                    radiogramno: content.no,
                    radiogramcontent: content.content,
                    session: content.session
                };

                var activity = getActivityInstance();
                activity.context.invoke('loadradiogram_selected', data);
                activity.window.close();
            }
        }
    });
};

soyut.radiogram.renderMateriWasdal = function (state, value) {
    $(getInstanceID("list-materi")).html('');
    if(state == 'new'){
        var html = '<select name="optMateri[]" multiple id="optMateri" class="form-control optMateri">';
        html += '<option value="intelijen">INTELIJEN</option>';
        html += '<option value="operasi">OPERASI</option>';
        html += '<option value="personel">PERSONEL</option>';
        html += '<option value="logistik">LOGISTIK</option>';
        html += '<option value="komlek">KOMLEK</option>';
        html += '</select>';
        $(getInstanceID("list-materi")).append(html);

        $('.optMateri').multiselect({
            columns: 1,
            placeholder: 'Cari...',
            search: true,
            selectAll: true
        });
    }
    else {
        if(value != null){
            var html = '<select name="optMateri[]" multiple id="optMateri" class="form-control optMateri">';

            var listMateri = ["intelijen", "operasi", "personel", "logistik", "komlek"];
            listMateri.forEach(function (m) {
                var selected = "";
                if (value != null) {
                    soyut.radiogram.checkMateriSelected(value, m, function (sel) {
                        if (sel) {
                            selected += "selected";
                        }
                    });
                }
                html += '<option value="' + m + '" ' + selected + '>' + m.toUpperCase() + '</option>';
            });

            html += '</select>';
            $(getInstanceID("list-materi")).append(html);

            $('.optMateri').multiselect({
                columns: 1,
                placeholder: 'Cari...',
                search: true,
                selectAll: true
            });
        }
    }
};

soyut.radiogramdraft.renderReceiverWasdal = function (state, value) {
    $(getInstanceID("list-receiver")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function(als) {
                    var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                    als.forEach(function (l) {
                        html += '<option value="' + l.id + ':als' + '">' + l.name + '</option>';
                    });

                    list.forEach(function (r) {
                        html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                    });

                    res.forEach(function (i) {
                        html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                    });

                    html += '</select>';
                    html += '<span class="receivers-error help-block valid"></span>';
                    $(getInstanceID("list-receiver")).append(html);

                    $('.optReceiver').multiselect({
                        columns: 1,
                        placeholder: 'Cari...',
                        search: true,
                        selectAll: true
                    });
                });
            });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                soyut.radiogram.renderListRole(function(list) {
                    soyut.radiogram.renderListAlias(function(als) {

                        var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                        als.forEach(function (l) {

                            var selected = "";
                            if (kvalue != null) {
                                soyut.radiogram.checkReceivers(kvalue, l.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                        });
                        
                        list.forEach(function (m) {
                            var selected = "";
                            if (kvalue != null) {
                                soyut.radiogram.checkReceivers(kvalue, m.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + m.id + ':role' + '" ' + selected + '>' + m.position + ' (' + m.groupName + ')</option>';
                        });

                        res.forEach(function (i) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, i.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + i.id + ':vrole' + '" ' + selected + '>' + i.position + '</option>';
                        });

                        html += '</select>';
                        html += '<span class="receivers-error help-block valid"></span>';
                        $(getInstanceID("list-receiver")).append(html);

                        $('.optReceiver').multiselect({
                            columns: 1,
                            placeholder: 'Cari...',
                            search: true,
                            selectAll: true
                        });
                    });
                });
            });
        }
    }
};

soyut.radiogramdraft.renderSenderWasdal = function (state, value) {
    $(getInstanceID("list-sender")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogramdraft.SetSenderDetail(this.value)">';
            html += '<option value="">Cari..</option>';
            res.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.position +'</option>';
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogramdraft.SetSenderDetail(this.value)">';
                html += '<option value="">Cari..</option>';
                res.forEach(function (i) {
                    var selected = "";
                    if(value != null){
                        if(value == i.id){
                            selected = "selected";
                        }
                    }
                    html += '<option value="'+ i.id +'" '+selected+'>'+ i.position +'</option>';
                });
                html +='</select>';
                html +='<span class="sender-error help-block valid"></span>';
                $(getInstanceID("list-sender")).append(html);

                $(".optSender").select2({ width: '100%' });
            });
        }
    }
};


soyut.radiogramdraft.renderCCWasdal = function (state, value) {
    $(getInstanceID("list-tembusan")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function (als) {
                    var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                    als.forEach(function (l) {
                        html += '<option value="' + l.id + ':als' + '">' + l.name + '</option>';
                    });

                    list.forEach(function (r) {
                        html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                    });

                    res.forEach(function (i) {
                        html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                    });

                    html += '</select>';
                    $(getInstanceID("list-tembusan")).append(html);

                    $('.optCC').multiselect({
                        columns: 1,
                        placeholder: 'Cari...',
                        search: true,
                        selectAll: true
                    });
                });
            });
        });
    }
    else{

    }
};

soyut.radiogramdraft.SetSenderDetail = function(val){
    if(val != ""){
        soyut.radiogram.renderSenderWasdalDetail(val, function(res){
            $(getInstanceID('sender-name')).val(res.data.callsign);
            $(getInstanceID('sender-pangkat')).val(res.data.rank);
        });
    }
}

soyut.radiogramdraft.init = function () {
    soyut.radiogramdraft.perfectScrollbarHandler();
    soyut.radiogramdraft.messageHeightHandler();
    //soyut.radiogramdraft.resizeHandler();
    soyut.radiogramdraft.renderDraft();
    soyut.radiogramdraft.renderContent();

    $(".derajat").select2({ width: '100%' });

};


soyut.radiogramdraft.init();