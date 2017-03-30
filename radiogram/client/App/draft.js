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

socket.on('new_radiogram', function (data) {
    if (roleName.id == data.new_val.owner.roleId) {
        console.log(data);
        SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);

        soyut.radiogramdraft.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
    }

});

function SendNotification(title, content, id) {
    var app = getAppInstance();

    soyut.Event.getInstance().invokeSystemEvent('notification', {
        title: title, content: content, handler: function (d) {
            console.log(id);
            app.launchActivity("soyut.module.app.radiogram.main", {radiogramId: id});
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
            listRcp = receiverRole;
            var listTembusan = [];
            listTembusan = tembusan;
            
            var listReceiver = [];
            var listCC = [];
            sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
                soyut.radiogramdraft.getListPangkogas(scenario, function (err, listKogas) {
                    receiverRole.forEach(function(i){
                        if(i == "0"){
                            listKogas.forEach(function(m){
                                listReceiver.push(m.id);
                            });
                        }
                    });
                    listReceiver.forEach(function(rcv){
                        //send receievr
                        soyut.radiogramdraft.Radiogram_SendReceiverWasdal({
                            panggilan: panggilan,
                            jenis: jenis,
                            nomor: nomor,
                            derajat: derajat,
                            instruksi: instruksi,
                            tandadinas: tandadinas,
                            group: group,
                            classification: klasifikasi,
                            Number: no,
                            cara: cara,
                            paraf: paraf,
                            alamataksi: alamataksi,
                            alamattembusan: alamattembusan,
                            content: message,
                            readStatus: 'unread',
                            owner: rcv,
                            sender: senderRole,
                            receivers: listRcp,
                            senderWasdal: roleName.isWASDAL,
                            cc: tembusan,
                            session: soyutSession.id,
                            senderName: senderName,
                            senderRank: senderRank,
                            senderSignature: senderSignature,
                            SendTime: new Date(),
                            simtime: new Date(soyut.clock.getCurrentSimTime().simTime),
                            createTime: new Date()
                        }, function (err, result) {
                            if (!err) {
                            }
                        });
                    });
                    listRcp.forEach(function(rcp){
                        if(rcp != '0'){
                            //send receievr
                            soyut.radiogramdraft.Radiogram_SendReceiverWasdal({
                                panggilan: panggilan,
                                jenis: jenis,
                                nomor: nomor,
                                derajat: derajat,
                                instruksi: instruksi,
                                tandadinas: tandadinas,
                                group: group,
                                classification: klasifikasi,
                                Number: no,
                                cara: cara,
                                paraf: paraf,
                                alamataksi: alamataksi,
                                alamattembusan: alamattembusan,
                                content: message,
                                readStatus: 'unread',
                                owner: rcp,
                                sender: senderRole,
                                receivers: listRcp,
                                senderWasdal: roleName.isWASDAL,
                                cc: tembusan,
                                session: soyutSession.id,
                                senderName: senderName,
                                senderRank: senderRank,
                                senderSignature: senderSignature,
                                SendTime: new Date(),
                                simtime: new Date(soyut.clock.getCurrentSimTime().simTime),
                                createTime: new Date()
                            }, function (err, result) {
                                if (!err) {
                                }
                            });
                        }
                    });
                    if(tembusan != undefined || tembusan != null){
                        tembusan.forEach(function(cc){
                            if(cc == "0"){
                                listKogas.forEach(function(n){
                                    listCC.push(n.id);
                                });
                            }
                        });
                        listCC.forEach(function(lrcv){
                            //send receievr
                            soyut.radiogramdraft.Radiogram_SendReceiverWasdal({
                                panggilan: panggilan,
                                jenis: jenis,
                                nomor: nomor,
                                derajat: derajat,
                                instruksi: instruksi,
                                tandadinas: tandadinas,
                                group: group,
                                classification: klasifikasi,
                                Number: no,
                                cara: cara,
                                paraf: paraf,
                                alamataksi: alamataksi,
                                alamattembusan: alamattembusan,
                                content: message,
                                readStatus: 'unread',
                                owner: lrcv,
                                sender: senderRole,
                                receivers: listRcp,
                                senderWasdal: roleName.isWASDAL,
                                cc: tembusan,
                                session: soyutSession.id,
                                senderName: senderName,
                                senderRank: senderRank,
                                senderSignature: senderSignature,
                                SendTime: new Date(),
                                simtime: new Date(soyut.clock.getCurrentSimTime().simTime),
                                createTime: new Date()
                            }, function (err, result) {
                                if (!err) {
                                }
                            });
                        });
                        listTembusan.forEach(function(lrcp){
                            if(lrcp != "0"){
                                //send receievr
                                soyut.radiogramdraft.Radiogram_SendReceiverWasdal({
                                    panggilan: panggilan,
                                    jenis: jenis,
                                    nomor: nomor,
                                    derajat: derajat,
                                    instruksi: instruksi,
                                    tandadinas: tandadinas,
                                    group: group,
                                    classification: klasifikasi,
                                    Number: no,
                                    cara: cara,
                                    paraf: paraf,
                                    alamataksi: alamataksi,
                                    alamattembusan: alamattembusan,
                                    content: message,
                                    readStatus: 'unread',
                                    owner: lrcp,
                                    sender: senderRole,
                                    receivers: listRcp,
                                    senderWasdal: roleName.isWASDAL,
                                    cc: tembusan,
                                    session: soyutSession.id,
                                    senderName: senderName,
                                    senderRank: senderRank,
                                    senderSignature: senderSignature,
                                    SendTime: new Date(),
                                    simtime: new Date(soyut.clock.getCurrentSimTime().simTime),
                                    createTime: new Date()
                                }, function (err, result) {
                                    if (!err) {
                                    }
                                });
                            }
                        });
                    }
                    
                    //send
                    soyut.radiogramdraft.Radiogram_SendWasdal({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: group,
                        classification: klasifikasi,
                        Number: no,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        content: message,
                        readStatus: 'unread',
                        owner: senderRole,
                        sender: senderRole,
                        receivers: listRcp,
                        senderWasdal: roleName.isWASDAL,
                        cc: tembusan,
                        session: soyutSession.id,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderSignature: senderSignature,
                        SendTime: new Date(),
                        simtime: new Date(soyut.clock.getCurrentSimTime().simTime),
                        createTime: new Date()
                    }, function (err, result) {
                        if (!err) {
                            soyut.radiogramdraft.clearInput();
                            var resId = result.data.generated_keys[0];

                            $(getInstanceID("wdl-email-content")).addClass('disable');
                            $(getInstanceID("wdl-email-form")).addClass('disable');
                            $(getInstanceID("wdl-email-view")).addClass('disable');
                            $(getInstanceID("wdl-email-send")).removeClass('disable');
                            soyut.radiogramdraft.renderSendingResult('.email-result', resId);
                        }
                    });
                    
                });
            });
        }
    });
    $(getInstanceID("BackMessage")).click(function (event) {
        soyut.radiogramdraft.init();
    });
};

soyut.radiogramdraft.getListPangkogas = function (scenario, callback) {
    var getRole = [];
    scenarioService.Role_getAddressList({scenario:scenario, isAddress:true}, function(err, listKogas){
        listKogas.forEach(function(i){
            var roles = {
                'id': i.id,
                'callsign': i.callsign,
                'scenario': i.scenario,
                'position': i.position
            };
            getRole.push(roles);
        });
        callback(false, getRole);
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

                var getRadiogram = function (role, callback) {
                    soyut.radiogramdraft.Radiogram_GetInboxByRole({id: role, state: message, field:'SendTime', sort:'desc'}, function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                if (data != null) {
                                    callback(false, data);
                                }
                            }
                        }
                    });
                };

                var arrData =[];
                scenarioService.VRole_list({scenario: roleName.scenario}, function (err, vrole) {
                        vrole.forEach(function (v) {
                            getRadiogram(v.id, function (err, vres) {
                                vres.forEach(function (vi) {
                                    if(message == "inbox") {
                                        var stringTime = '<span class="text">waktu Sebenarnya '+ moment(vi.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                         '<span class="text">waktu Asumsi '+ moment(vi.simtime).format("DD-MM-YYYY h:mm") +'</span>';
                                    
                                        var senderRole = "";
                                        scenarioService.VRole_get({id:vi.sender}, function (err, vsender) {
                                            if(vsender.data == undefined){
                                                if(!vi.senderWasdal){
                                                    senderRole = "PANGKOGAS";
                                                }
                                            }
                                            else{
                                                senderRole = vsender.data.position;
                                            }
                                            
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
                                                receiverCallsign: senderRole,
                                                receiverRank: "",
                                                receiverName: "",
                                                receiverPhoto: ""
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    }
                                    else{
                                        var stringTime = '';
                                        if(message == 'draft'){
                                            stringTime = '<span class="text">dibuat '+moment(vi.createTime).format("DD-MM-YYYY h:mm")+'</span>';
                                        }
                                        else{
                                            stringTime = '<span class="text">waktu Sebenarnya '+ moment(vi.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                                '<span class="text">waktu Asumsi '+ moment(vi.simtime).format("DD-MM-YYYY h:mm") +'</span>';
                                        }
                                        
                                        var senderCallsign = '';
                                        if(vi.receivers[0] == "0"){
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
                                                receiverCallsign: "PANGKOGAS",
                                                receiverRank: "",
                                                receiverName: "",
                                                receiverPhoto: ""
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        }
                                        else{
                                            scenarioService.VRole_get({id:vi.receivers[0]}, function (err, vrec) {
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
                                                    receiverCallsign: vrec.data.position,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            })
                                        }
                                    }             
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
    props: ['contents','rolecc','rolereceiver'],
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
                soyut.radiogramdraft.Radiogram_GetById({id: message}, function (err, data) {
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
                                                if(rcc.data == undefined){
                                                    if(m == '0'){
                                                        roleCc = roleCc + "PANGKOGAS, ";
                                                    }
                                                }
                                                else{
                                                    roleCc = roleCc + rcc.data.position + ", ";
                                                }
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
                                                if(rpt.data == undefined){
                                                    if(n == '0'){
                                                        roleReceiver = roleReceiver + "PANGKOGAS, ";
                                                    }
                                                }
                                                else{
                                                    roleReceiver = roleReceiver + rpt.data.position + ", ";
                                                }
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }
                                var contents = {
                                    id: data.id,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data.position,
                                    senderRank: data.senderRank,
                                    senderName: data.senderName,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
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
                                                if(rcc.data == undefined){
                                                    if(m == '0'){
                                                        roleCc = roleCc + "PANGKOGAS, ";
                                                    }
                                                }
                                                else{
                                                    roleCc = roleCc + rcc.data.position + ", ";
                                                }
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
                                                if(rpt.data == undefined){
                                                    if(n == '0'){
                                                        roleReceiver = roleReceiver + "PANGKOGAS, ";
                                                    }
                                                }
                                                else{
                                                    roleReceiver = roleReceiver + rpt.data.position + ", ";
                                                }
                                                _this.$set(_this, 'rolereceiver', roleReceiver);
                                            });
                                        }
                                    });
                                }

                                var contents = {
                                    id: data.id,
                                    content: data.content,
                                    tembusan: data.cc,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data[0].position,
                                    senderRank: data.senderRank,
                                    senderName: data.senderName,
                                    senderPhoto: "",
                                    senderSignature: data.senderSignature,
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
                                    session: data.session,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data.callsign,
                                    senderRank: data.senderRank,
                                    senderName: data.senderName,
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
                                    session: data.session,
                                    renderMessages: renderMessage,
                                    SendTime: data.SendTime,
                                    simtime: data.simtime,
                                    senderRole: data.sender,
                                    senderCallsign: sender.data[0].callsign,
                                    senderRank: data.senderRank,
                                    senderName: data.senderName,
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
                    session: content.session
                };

                var activity = getActivityInstance();
                activity.context.invoke('loadradiogram_selected', data);
                activity.window.close();
            }
        }
    });
};

soyut.radiogramdraft.getListVRole = function (scenario, callback) {
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

soyut.radiogramdraft.listReceivers = [];
soyut.radiogramdraft.preProcessReceiverWasdal = function(group, callback) {
    scenarioService.Role_getRoleByGroup({roleGroup: group.id}, function (err, result) {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, result);
        }
    });
};
soyut.radiogramdraft.preProcessReceiverWasdalAsync = Promise.promisify(soyut.radiogramdraft.preProcessReceiverWasdal);

soyut.radiogramdraft.getListReceiverWasdal = function (scenario, callback) {
    scenarioService.scenario_listRoleGroups({scenario_id: scenario}, function(err, result){
        Promise.each(result, function(post) {
                return soyut.radiogramdraft.preProcessReceiverWasdalAsync(post).then(function (role) {
                    var data = {
                            'id': post.id,
                            'name': post.name,
                            'scenario': post.scenario,
                            'role': role
                        };
                    soyut.radiogramdraft.listReceivers.push(data);
                });
            }).then(function() {
            if (callback) {
                callback(err, result);
            }
        });
    });
};

soyut.radiogramdraft.renderReceiverWasdal = function () {
    soyut.radiogramdraft.listReceivers = [];
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogramdraft.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';
            html += '<option value="0">PANGKOGAS</option>'; 
            listRole.forEach(function(m){
                html += '<option value="'+m.id+'">'+m.position+'</option>';
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

soyut.radiogramdraft.renderSenderWasdal = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogramdraft.getListVRole(scenario, function (err, listRole) {
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

soyut.radiogramdraft.renderCCWasdal = function () {
    sessionService.Session_getScenario({id: soyutSession.id}, function(err, scenario){
        soyut.radiogramdraft.getListVRole(scenario, function (err, listRole) {
            var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';
            html += '<option value="0">PANGKOGAS</option>'; 
            listRole.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.position +'</option>';
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


soyut.radiogramdraft.init = function () {
    soyut.radiogramdraft.perfectScrollbarHandler();
    soyut.radiogramdraft.messageHeightHandler();
    soyut.radiogramdraft.resizeHandler();
    soyut.radiogramdraft.renderDraft();
    soyut.radiogramdraft.renderContent();

    $(".derajat").select2({ width: '100%' });
    soyut.radiogramdraft.renderSenderWasdal();
    soyut.radiogramdraft.renderReceiverWasdal();
    soyut.radiogramdraft.renderCCWasdal();

};


soyut.radiogramdraft.init();