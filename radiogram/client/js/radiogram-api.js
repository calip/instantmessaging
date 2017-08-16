soyut.radiogram = soyut.radiogram || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogram.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");
var clockService = soyut.Services.getInstance().getService("clockserver");
var policyService = soyut.Services.getInstance().getService("groupPolicyServer");
soyut.radiogram.alert = new PunkAlert();

if (Promise.promisifyAll) {
    Promise.promisifyAll(soyut.radiogram);
}

socket.on('new_radiogram', function (data) {
    if(data.new_val.owner.roleGroup == soyut.Session.role.roleGroup){
        if(data.new_val.readStatus == 'unread'){
            if(data.new_val.composeStatus == 'inbox'){
                console.log("kirim notif");
                soyut.radiogram.SendNotification(data.new_val.Number, 'Radiogram dari ' + data.new_val.senderDetail + ' telah masuk.', data.new_val.id);

                var appid = 'soyut.module.app.radiogram';
                var app = soyut.Platform.AppManager.getInstance().getApplication(appid);

                if(soyut.Platform.AppManager.getInstance().hasInstance(appid)){
                    soyut.radiogram.LoadNewMessages(data.new_val);
                }
            }
        }
    }
});

soyut.radiogram.SendNotification = function(title, content, id) {
    var appid = 'soyut.module.app.radiogram';

    soyut.Event.getInstance().invokeSystemEvent('notification', {
        title: title, content: content, handler: function (d) {
            console.log(id);

            var app = soyut.Platform.AppManager.getInstance().getApplication(appid);
            soyut.Event.getInstance().invokeAppEventOnce(appid, 'launch', app);
        }
    });
};


soyut.radiogram.getListReceiversWasdal = function (callback) {
    soyut.radiogram.renderListReceivers(function(res) {
        soyut.radiogram.renderListRole(function (list) {
            soyut.radiogram.renderListAlias(function (als) {
                var arrAlias = [];
                als.forEach(function (l) {
                    var Obj = {
                        id: l.id,
                        name: l.name,
                        type: 'als'
                    };
                    arrAlias.push(Obj);
                });
                var arrRole = [];
                list.forEach(function (r) {
                    var Obj = {
                        id: r.id,
                        name: r.position,
                        type: 'role'
                    };
                    arrRole.push(Obj);
                });
                var arrVrole = [];
                res.forEach(function (i) {
                    var Obj = {
                        id: i.id,
                        name: i.position,
                        type: 'vrole'
                    };
                    arrVrole.push(Obj);
                });
                var arrData = arrAlias.concat(arrRole, arrVrole);
                callback(arrData);
            })
        });
    });
};

soyut.radiogram.getListSenderWasdal = function (callback) {
    soyut.radiogram.renderListReceivers(function(res){
        var arrVrole = [];
        res.forEach(function (i) {
            var Obj = {
                id: i.id,
                name: i.position
            };
            arrVrole.push(Obj);
        });
        callback(arrVrole);
    });
};

soyut.radiogram.getListReceiverUser = function (callback) {
    soyut.radiogram.renderListReceivers(function(res) {
        soyut.radiogram.renderListRole(function (list) {
            var arrRole = [];
            list.forEach(function (r) {
                var Obj = {
                    id: r.id,
                    name: r.position,
                    type: 'role'
                };
                arrRole.push(Obj);
            });
            var arrVrole = [];
            res.forEach(function (i) {
                var Obj = {
                    id: i.id,
                    name: i.position,
                    type: 'vrole'
                };
                arrVrole.push(Obj);
            });
            var arrData = arrRole.concat(arrVrole);
            callback(arrData);
        });
    });
};

soyut.radiogram.getListSenderUser = function (callback) {
    soyut.radiogram.renderListSender(function(res){
        var arrRole = [];
        res.forEach(function (i) {
            if(i.isAddress) {
                var Obj = {
                    id: i.id,
                    name: i.position
                };
                arrRole.push(Obj);
            }
        });
        callback(arrRole);
    });
};

soyut.radiogram.renderRoleGroup = function (callback) {
    getRoleGroup().then(function(result) {
        callback(result)
    });
}

function getRoleGroup() {
    return new Promise (function(resolve,reject){
        scenarioService.scenario_getRoleGroup({id: soyut.Session.role.roleGroup}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

function getGroupRole(group) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_getRoleByGroup({roleGroup: group}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

soyut.radiogram.renderListReceivers = function (callback) {
    getListReceivers().then(function(result) {
        callback(result)
    });
};

function getListReceivers() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.VRole_list({scenario: scenario}, function (e, data) {
                if(e){
                    reject(e);
                } else {
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });

        });
    });
}

soyut.radiogram.renderSenderWasdalDetail = function (role, callback) {
    getVRole(role).then(function(result) {
        callback(result);
    });
};

function getVRole(role) {
    return new Promise (function(resolve,reject){
        scenarioService.VRole_get({id: role}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
};

soyut.radiogram.renderSenderDetail = function (role, callback) {
    getRole(role).then(function(result) {
        callback(result);
    });
};

function getRole(role) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_find({query: {id: role}}, function (e, data) {
            if(e){
                reject(e);
            }else{
                if(data.data[0] != undefined){
                    scenarioService.scenario_getRoleGroup({id: data.data[0].roleGroup}, function (e, result) {
                        var objData = {
                            callsign: data.data[0].callsign,
                            createdAt: data.data[0].createdAt,
                            id: data.data[0].id,
                            isAddress: data.data[0].isAddress,
                            isAlias: data.data[0].isAlias,
                            isSet: data.data[0].isSet,
                            isWASDAL: data.data[0].isWASDAL,
                            position: data.data[0].position,
                            positionCode: data.data[0].positionCode,
                            rank: data.data[0].rank,
                            roleGroup: data.data[0].roleGroup,
                            scenario: data.data[0].scenario,
                            updatedAt: data.data[0].updatedAt,
                            groupName: result.name
                        };

                        var dataObj = {};
                        dataObj = objData;
                        resolve(dataObj);
                    });
                }
            }
        });
    });
};

soyut.radiogram.renderListNonDirectorRoleGroup = function (callback) {
    getNonDirectorListRoleGroup().then(function (result) {
        callback(result);
    });
};

function getNonDirectorListRoleGroup() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.scenario_listNonDirectorRoleGroups({scenario_id: scenario}, function (e, data) {
                if(e){
                    reject(e);
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });
        });
    });
}

soyut.radiogram.deleteAllRadiogram = function () {
    dropRadiogram().then(function(result) {
        callback(result)
    });
};

function dropRadiogram() {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_deleteAll({}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

soyut.radiogram.renderListSender = function (callback) {
    getListSender().then(function(result) {
        callback(result)
    });
};

function getListSender() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.Role_getRoleListGroup({scenario: scenario, group:soyut.Session.role.roleGroup}, function (e, data) {
                if(e){
                    reject(e);
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });

        });
    });
}

soyut.radiogram.renderListDirectorRoleGroup = function (callback) {
    getDirectorListRoleGroup().then(function (result) {
        callback(result);
    });
};

function getDirectorListRoleGroup() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.scenario_listDirectorRoleGroups({scenario_id: scenario}, function (e, data) {
                if(e){
                    reject(e);
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });
        });
    });
};

soyut.radiogram.renderListRole = function (callback) {
    getNonDirectorListRoleGroup().then(function (result) {
        getListRoleAddress(result).then(function(data) {
            var arr = []
            data.forEach(function (i) {
                if(i != undefined){
                    arr.push(i);
                }
            });
            var dataObj = {};
            dataObj = arr;
            callback(dataObj);
        });
    });
};

function getListRoleAddress(role) {
    return new Promise.map(role, function(i) {
        return getAddressRolegroup(i.id).then(function(data) {
            if(data != null) {
                if(data.length > 0) {
                    var objData = {
                        callsign: data[0].callsign,
                        createdAt: data[0].createdAt,
                        id: data[0].id,
                        index: data[0].index,
                        isAddress: data[0].isAddress,
                        isAlias: data[0].isAlias,
                        isSet: data[0].isSet,
                        isWASDAL: data[0].isWASDAL,
                        position: data[0].position,
                        positionCode: data[0].positionCode,
                        rank: data[0].rank,
                        roleGroup: data[0].roleGroup,
                        scenario: data[0].scenario,
                        updatedAt: data[0].updatedAt,
                        groupName: i.name
                    };
                    return objData;
                }
            }
        }).then(function(result) {
            return result;
        });
    });
}

function getAddressRolegroup(group) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_getAddressRoleGroup({rolegroup: group}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

soyut.radiogram.deleteChildRadiogram = function (id, callback) {
    soyut.radiogram.renderRadiogramParent(id, function (res) {
        res.forEach(function (i) {
            soyut.radiogram.renderMessageObj(i.id, function (rdg) {
                if (rdg.composeStatus == 'pending') {
                    soyut.radiogram.Radiogram_delete({id: rdg.id}, function (err, result) {
                        if (!err) {

                        }
                    });
                }
            });
        });
        callback(id);
    });
};

soyut.radiogram.deleteRadiogram = function (id, callback) {
    soyut.radiogram.Radiogram_delete({id: id}, function (err, result) {
        if (!err) {
            callback(result)
        }
    });
};

soyut.radiogram.renderRadiogramParent = function (id, callback) {
    if(id != ""){
        getRadiogramParent(id).then(function (result) {
            callback(result);
        });
    }
    else{
        callback([]);   
    }
};

function getRadiogramParent(id) {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetByParentId({id: id, field:'createTime', sort:'desc'}, function (e, data) {
            if(e){
                reject(e);
            }else{
                resolve(data);
            }
        });
    });
}

function getListPangkogas() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.Role_getAddressList({scenario: scenario, isAddress: true}, function (e, data) {
                if(e){
                    reject(e);
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });
        });
    });
}

soyut.radiogram.renderSenderObj = function (role, wasdal, callback) {
    if(wasdal){
        getVRole(role).then(function(result) {
            var data = {
                callsign: result.data.callsign,
                co: result.data.co,
                id: result.data.id,
                index: result.data.index,
                position: result.data.position,
                positionCodeName: result.data.positionCodeName,
                rank: result.data.rank,
                scenario: result.data.scenario,
                type: 'vrole'
            };
            var dataObj = data;
            callback(dataObj);
        });
    }
    else{
        getRoleKogasGroup(role).then(function(result) {
            var data = {
                callsign: result.callsign,
                createdAt: result.createdAt,
                id: result.id,
                isAddress: result.isAddress,
                isAlias: result.isAlias,
                isSet: result.isSet,
                isWASDAL: result.isWASDAL,
                position: result.position,
                positionCode: result.positionCode,
                rank: result.rank,
                roleGroup: result.roleGroup,
                scenario: result.scenario,
                updatedAt: result.updatedAt,
                groupName: result.groupName,
                type: 'role'
            };
            var dataObj = data;
            callback(dataObj);
        });
    }
};

function getRoleKogasGroup(role) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_find({query: {id: role}}, function (e, data) {
            if(e){
                reject(e);
            }else{
                scenarioService.scenario_getRoleGroup({id: data.data[0].roleGroup}, function (e, result) {
                    var objData = {
                        callsign: data.data[0].callsign,
                        createdAt: data.data[0].createdAt,
                        id: data.data[0].id,
                        isAddress: data.data[0].isAddress,
                        isAlias: data.data[0].isAlias,
                        isSet: data.data[0].isSet,
                        isWASDAL: data.data[0].isWASDAL,
                        position: data.data[0].position,
                        positionCode: data.data[0].positionCode,
                        rank: data.data[0].rank,
                        roleGroup: data.data[0].roleGroup,
                        scenario: data.data[0].scenario,
                        updatedAt: data.data[0].updatedAt,
                        groupName: result.name
                    };

                    var dataObj = {};
                    dataObj = objData;
                    resolve(dataObj);
                });
            }
        });
    });
}

soyut.radiogram.SendRadiogram = function (params, callback) {
    soyut.clock.getCurrentActualTime({}, function (err, reclock) {
        soyut.clock.getSimTime(reclock, function (err, simclock) {
            //sent to all role receivers
            if (params.receivers.length > 0) {
                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiver({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: reclock,
                                simtime: simclock.simTime,
                                createTime: reclock,
                                parentId: null,
                                referenceId: params.referenceId,
                                composeStatus: 'inbox'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                    }
                });
            }
            //cc to all role receivers
            if(params.cc != undefined || params.cc != null) {
                if (params.cc.length > 0) {
                    params.cc.forEach(function (i) {
                        if (i.type == 'role') {
                            soyut.radiogram.renderSenderDetail(i.id, function (m) {
                                soyut.radiogram.Radiogram_SendReceiver({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    materi: params.materi,
                                    approved: params.approved,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: m,
                                    sender: params.sender,
                                    senderDetail: params.senderDetail,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    receivers: params.receivers,
                                    receiverDetail: params.receiverDetail,
                                    cc: params.cc,
                                    ccDetail: params.ccDetail,
                                    session: soyut.Session.id,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    author: params.author,
                                    SendTime: reclock,
                                    simtime: simclock.simTime,
                                    createTime: reclock,
                                    parentId: null,
                                    referenceId: params.referenceId,
                                    composeStatus: 'inbox'
                                }, function (err, res) {
                                    if (!err) {
                                    }
                                });
                            });
                        }
                    });
                }
            }

            //cc to wasdal
            soyut.radiogram.renderListKolatReceiver(function (wasdal) {
                soyut.radiogram.Radiogram_SendReceiver({
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    materi: params.materi,
                    approved: params.approved,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    readStatus: 'unread',
                    owner: wasdal,
                    sender: params.sender,
                    senderDetail: params.senderDetail,
                    senderWasdal: soyut.Session.role.isWASDAL,
                    receivers: params.receivers,
                    receiverDetail: params.receiverDetail,
                    cc: params.cc,
                    ccDetail: params.ccDetail,
                    session: soyut.Session.id,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                    author: params.author,
                    SendTime: reclock,
                    simtime: simclock.simTime,
                    createTime: reclock,
                    parentId: null,
                    referenceId: params.referenceId,
                    composeStatus: 'inbox'
                }, function (err, res) {
                    if (!err) {
                    }
                });
            });

            //get own message
            soyut.radiogram.Radiogram_SendReceiver({
                panggilan: params.panggilan,
                jenis: params.jenis,
                nomor: params.nomor,
                derajat: params.derajat,
                instruksi: params.instruksi,
                tandadinas: params.tandadinas,
                group: params.group,
                classification: params.classification,
                materi: params.materi,
                approved: params.approved,
                Number: params.Number,
                cara: params.cara,
                paraf: params.paraf,
                alamataksi: params.alamataksi,
                alamattembusan: params.alamattembusan,
                content: params.content,
                readStatus: 'unread',
                owner: params.sender,
                sender: params.sender,
                senderDetail: params.senderDetail,
                senderWasdal: soyut.Session.role.isWASDAL,
                receivers: params.receivers,
                receiverDetail: params.receiverDetail,
                cc: params.cc,
                ccDetail: params.ccDetail,
                session: soyut.Session.id,
                senderName: params.senderName,
                senderRank: params.senderRank,
                author: params.author,
                SendTime: reclock,
                simtime: simclock.simTime,
                createTime: reclock,
                parentId: null,
                referenceId: params.referenceId,
                composeStatus: 'sent'
            }, function (err, results) {
                if (!err) {
                    callback(results.data.generated_keys[0]);
                }
            });

        });
    });
};

soyut.radiogram.SendWasdalRadiogram = function (params, callback) {
    soyut.clock.getCurrentActualTime({}, function (err, reclock) {
        soyut.clock.getSimTime(reclock, function (err, simclock) {

            if (params.refsender != '') {
                console.log(params.receivers);
            }
            else {
                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: reclock,
                                simtime: simclock.simTime,
                                createTime: reclock,
                                parentId: null,
                                referenceId: params.referenceId,
                                composeStatus: 'inbox'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: soyut.Session.role.isWASDAL,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: soyut.Session.id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: reclock,
                                        simtime: simclock.simTime,
                                        createTime: reclock,
                                        parentId: null,
                                        referenceId: params.referenceId,
                                        composeStatus: 'inbox'
                                    }, function (err, res) {
                                        if (!err) {
                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                params.cc.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: reclock,
                                simtime: simclock.simTime,
                                createTime: reclock,
                                parentId: null,
                                referenceId: params.referenceId,
                                composeStatus: 'inbox'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: soyut.Session.role.isWASDAL,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: soyut.Session.id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: reclock,
                                        simtime: simclock.simTime,
                                        createTime: reclock,
                                        parentId: null,
                                        referenceId: params.referenceId,
                                        composeStatus: 'inbox'
                                    }, function (err, res) {
                                        if (!err) {
                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                //send
                soyut.radiogram.Radiogram_SendWasdal({
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    materi: params.materi,
                    approved: params.approved,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    readStatus: 'unread',
                    owner: params.owner,
                    sender: params.sender,
                    senderDetail: params.senderDetail,
                    receivers: params.receivers,
                    receiverDetail: params.receiverDetail,
                    cc: params.cc,
                    ccDetail: params.ccDetail,
                    senderWasdal: soyut.Session.role.isWASDAL,
                    session: soyut.Session.id,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                    author: params.author,
                    SendTime: reclock,
                    simtime: simclock.simTime,
                    createTime: reclock,
                    referenceId: params.referenceId,
                }, function (err, results) {
                    if (!err) {
                        callback(results.data.generated_keys[0]);
                    }
                });
            }

        });
    });
};

soyut.radiogram.UpdateDraftRadiogram = function(params, callback){
    soyut.radiogram.Radiogram_UpdateDraft({
        id: params.id,
        panggilan: params.panggilan,
        jenis: params.jenis,
        nomor: params.nomor,
        derajat: params.derajat,
        instruksi: params.instruksi,
        tandadinas: params.tandadinas,
        group: params.group,
        classification: params.classification,
        materi: params.materi,
        approved: params.approved,
        Number: params.Number,
        cara: params.cara,
        paraf: params.paraf,
        alamataksi: params.alamataksi,
        alamattembusan: params.alamattembusan,
        content: params.content,
        sender: params.sender,
        senderDetail: params.senderDetail,
        receivers: params.receivers,
        receiverDetail: params.receiverDetail,
        cc: params.cc,
        ccDetail: params.ccDetail,
        senderName: params.senderName,
        senderRank: params.senderRank,
        author: params.author,
        referenceId: params.referenceId
    }, function (err, resdraft) {
        getRadiogramParent(params.id).then(function(result) {
            result.forEach(function(i){
                soyut.radiogram.Radiogram_delete({id: i.id}, function (err, deldata) {
                    console.log(deldata);
                });
            });
        });

        getContentRadiogram(params.id).then(function(res) {
            if (params.receivers.length > 0) {
                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiver({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: res.session,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: res.createTime,
                                parentId: params.id,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                    }
                });
            }

            //cc to all role receivers
            if (params.cc != undefined || params.cc != null) {
                if (params.cc.length > 0) {
                    params.cc.forEach(function (i) {
                        if (i.type == 'role') {
                            soyut.radiogram.renderSenderDetail(i.id, function (m) {
                                soyut.radiogram.Radiogram_SendReceiver({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    materi: params.materi,
                                    approved: params.approved,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: m,
                                    sender: params.sender,
                                    senderDetail: params.senderDetail,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    receivers: params.receivers,
                                    receiverDetail: params.receiverDetail,
                                    cc: params.cc,
                                    ccDetail: params.ccDetail,
                                    session: res.session,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    author: params.author,
                                    SendTime: null,
                                    simtime: null,
                                    createTime: res.createTime,
                                    parentId: params.id,
                                    referenceId: params.referenceId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {
                                    }
                                });
                            });
                        }
                    });
                }
            }

            //cc to wasdal
            soyut.radiogram.renderListKolatReceiver(function (wasdal) {
                soyut.radiogram.Radiogram_SendReceiver({
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    materi: params.materi,
                    approved: params.approved,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    readStatus: 'unread',
                    owner: wasdal,
                    sender: params.sender,
                    senderDetail: params.senderDetail,
                    senderWasdal: soyut.Session.role.isWASDAL,
                    receivers: params.receivers,
                    receiverDetail: params.receiverDetail,
                    cc: params.cc,
                    ccDetail: params.ccDetail,
                    session: res.session,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                    author: params.author,
                    SendTime: null,
                    simtime: null,
                    createTime: res.createTime,
                    parentId: params.id,
                    referenceId: params.referenceId,
                    composeStatus: 'pending'
                }, function (err, res) {
                    if (!err) {
                    }
                });
            });

            callback("success");
        });
    });
};

soyut.radiogram.DraftRadiogram = function (params, callback) {
    soyut.clock.getCurrentActualTime({}, function(err, reclock){

        soyut.radiogram.Radiogram_Draft({
            panggilan: params.panggilan,
            jenis: params.jenis,
            nomor: params.nomor,
            derajat: params.derajat,
            instruksi: params.instruksi,
            tandadinas: params.tandadinas,
            group: params.group,
            classification: params.classification,
            materi: params.materi,
            approved: params.approved,
            Number: params.Number,
            cara: params.cara,
            paraf: params.paraf,
            alamataksi: params.alamataksi,
            alamattembusan: params.alamattembusan,
            content: params.content,
            readStatus: 'unread',
            owner: params.owner,
            sender: params.sender,
            senderDetail: params.senderDetail,
            receivers: params.receivers,
            receiverDetail: params.receiverDetail,
            senderWasdal: soyut.Session.role.isWASDAL,
            cc: params.cc,
            ccDetail: params.ccDetail,
            session: soyut.Session.id,
            senderName: params.senderName,
            senderRank: params.senderRank,
            author: params.author,
            SendTime: null,
            simtime: null,
            createTime: reclock,
            referenceId: params.referenceId
        }, function (err, result) {
            if (!err) {
                var parentId = result.data.generated_keys[0];

                if (params.receivers.length > 0) {
                    params.receivers.forEach(function (i) {
                        if (i.type == 'role') {
                            soyut.radiogram.renderSenderDetail(i.id, function (m) {
                                soyut.radiogram.Radiogram_SendReceiver({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    materi: params.materi,
                                    approved: params.approved,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: m,
                                    sender: params.sender,
                                    senderDetail: params.senderDetail,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    receivers: params.receivers,
                                    receiverDetail: params.receiverDetail,
                                    cc: params.cc,
                                    ccDetail: params.ccDetail,
                                    session: soyut.Session.id,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    author: params.author,
                                    SendTime: null,
                                    simtime: null,
                                    createTime: reclock,
                                    parentId: parentId,
                                    referenceId: params.referenceId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {
                                    }
                                });
                            });
                        }
                    });
                }

                //cc to all role receivers
                if(params.cc != undefined || params.cc != null) {
                    if (params.cc.length > 0) {
                        params.cc.forEach(function (i) {
                            if (i.type == 'role') {
                                soyut.radiogram.renderSenderDetail(i.id, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiver({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: soyut.Session.role.isWASDAL,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: soyut.Session.id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: reclock,
                                        parentId: parentId,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {
                                        }
                                    });
                                });
                            }
                        });
                    }
                }

                //cc to wasdal
                soyut.radiogram.renderListKolatReceiver(function (wasdal) {
                    soyut.radiogram.Radiogram_SendReceiver({
                        panggilan: params.panggilan,
                        jenis: params.jenis,
                        nomor: params.nomor,
                        derajat: params.derajat,
                        instruksi: params.instruksi,
                        tandadinas: params.tandadinas,
                        group: params.group,
                        classification: params.classification,
                        materi: params.materi,
                        approved: params.approved,
                        Number: params.Number,
                        cara: params.cara,
                        paraf: params.paraf,
                        alamataksi: params.alamataksi,
                        alamattembusan: params.alamattembusan,
                        content: params.content,
                        readStatus: 'unread',
                        owner: wasdal,
                        sender: params.sender,
                        senderDetail: params.senderDetail,
                        senderWasdal: soyut.Session.role.isWASDAL,
                        receivers: params.receivers,
                        receiverDetail: params.receiverDetail,
                        cc: params.cc,
                        ccDetail: params.ccDetail,
                        session: soyut.Session.id,
                        senderName: params.senderName,
                        senderRank: params.senderRank,
                        author: params.author,
                        SendTime: null,
                        simtime: null,
                        createTime: reclock,
                        parentId: parentId,
                        referenceId: params.referenceId,
                        composeStatus: 'pending'
                    }, function (err, res) {
                        if (!err) {
                        }
                    });
                });

                callback(parentId);
            }
        });

    });
}

soyut.radiogram.DraftWasdalRadiogram = function (params, callback) {
    soyut.clock.getCurrentActualTime({}, function (err, reclock) {
        soyut.radiogram.Radiogram_Draft({
            panggilan: params.panggilan,
            jenis: params.jenis,
            nomor: params.nomor,
            derajat: params.derajat,
            instruksi: params.instruksi,
            tandadinas: params.tandadinas,
            group: params.group,
            classification: params.classification,
            materi: params.materi,
            approved: params.approved,
            Number: params.Number,
            cara: params.cara,
            paraf: params.paraf,
            alamataksi: params.alamataksi,
            alamattembusan: params.alamattembusan,
            content: params.content,
            readStatus: 'unread',
            owner: params.owner,
            sender: params.sender,
            senderDetail: params.senderDetail,
            receivers: params.receivers,
            receiverDetail: params.receiverDetail,
            senderWasdal: soyut.Session.role.isWASDAL,
            cc: params.cc,
            ccDetail: params.ccDetail,
            session: soyut.Session.id,
            senderName: params.senderName,
            senderRank: params.senderRank,
            author: params.author,
            SendTime: null,
            simtime: null,
            createTime: reclock,
            referenceId: params.referenceId
        }, function (err, result) {
            if (!err) {
                var parentId = result.data.generated_keys[0];

                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: reclock,
                                parentId: parentId,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: soyut.Session.role.isWASDAL,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: soyut.Session.id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: reclock,
                                        parentId: parentId,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                params.cc.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: reclock,
                                parentId: parentId,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: soyut.Session.role.isWASDAL,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: soyut.Session.id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: reclock,
                                        parentId: parentId,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                callback(parentId);
            }
        });
    });
};

soyut.radiogram.DraftRIG = function (params, callback) {
    sessionService.Session_find({scenario: params.scenario}, function(err, rescenario){
        soyut.radiogram.Radiogram_DraftRIG({
            panggilan: params.panggilan,
            jenis: params.jenis,
            nomor: params.nomor,
            derajat: params.derajat,
            instruksi: params.instruksi,
            tandadinas: params.tandadinas,
            group: params.group,
            classification: params.classification,
            materi: params.materi,
            approved: params.approved,
            Number: params.Number,
            cara: params.cara,
            paraf: params.paraf,
            alamataksi: params.alamataksi,
            alamattembusan: params.alamattembusan,
            content: params.content,
            readStatus: 'unread',
            owner: params.owner,
            sender: params.sender,
            senderDetail: params.senderDetail,
            receivers: params.receivers,
            receiverDetail: params.receiverDetail,
            senderWasdal: true,
            cc: params.cc,
            ccDetail: params.ccDetail,
            session: rescenario[0].id,
            senderName: params.senderName,
            senderRank: params.senderRank,
            author: params.author,
            SendTime: null,
            simtime: null,
            createTime: params.createTime,
            referenceId: params.referenceId
        }, function (err, result) {
            if (!err) {
                var parentId = result.data.generated_keys[0];

                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: true,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: rescenario[0].id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: params.createTime,
                                parentId: parentId,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: true,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: rescenario[0].id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: params.createTime,
                                        parentId: parentId,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                params.cc.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: true,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: rescenario[0].id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: params.createTime,
                                parentId: parentId,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: true,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: rescenario[0].id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: params.createTime,
                                        parentId: parentId,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                callback(parentId);
            }
        });
    });
};

soyut.radiogram.SendDraftWasdalRadiogram = function (params, callback) {
    soyut.radiogram.Radiogram_GetById({id: params.id}, function(err,res) {
        soyut.radiogram.Radiogram_GetListDraft({id: res.id, status: 'pending'}, function(err,result) {
            soyut.clock.getCurrentActualTime({}, function(err, reclock){

                soyut.clock.getSimTime(reclock, function(err, simclock){
                    result.forEach(function(i){
                        soyut.radiogram.Radiogram_SendDraft({id: i.id, sendtime: reclock, simtime: simclock.simTime, status: 'inbox'}, function(err,res) {
                        });
                    });
                    soyut.radiogram.Radiogram_SendDraft({id: res.id, sendtime: reclock, simtime: simclock.simTime, status: 'sent'}, function(err,results) {
                        callback("success");
                    });
                });

            });
        });
    });
};

soyut.radiogram.SendDraftRadiogram = function (params, callback) {
    soyut.radiogram.Radiogram_GetById({id: params.id}, function(err,res) {
        soyut.radiogram.Radiogram_GetListDraft({id: res.id, status: 'pending'}, function(err,result) {
            soyut.clock.getCurrentActualTime({}, function(err, reclock){

                soyut.clock.getSimTime(reclock, function(err, simclock){
                    result.forEach(function(i){
                        soyut.radiogram.Radiogram_SendDraft({id: i.id, sendtime: reclock, simtime: simclock.simTime, status: 'inbox'}, function(err,res) {
                        });
                    });
                    soyut.radiogram.Radiogram_SendDraft({id: res.id, sendtime: reclock, simtime: simclock.simTime, status: 'sent'}, function(err,results) {
                        callback("success");
                    });
                });

            });
        });
    });
};

soyut.radiogram.UpdateDraftWasdalRadiogram = function(params, callback) {
    soyut.radiogram.Radiogram_UpdateDraft({
        id: params.id,
        panggilan: params.panggilan,
        jenis: params.jenis,
        nomor: params.nomor,
        derajat: params.derajat,
        instruksi: params.instruksi,
        tandadinas: params.tandadinas,
        group: params.group,
        classification: params.classification,
        materi: params.materi,
        approved: params.approved,
        Number: params.Number,
        cara: params.cara,
        paraf: params.paraf,
        alamataksi: params.alamataksi,
        alamattembusan: params.alamattembusan,
        content: params.content,
        sender: params.sender,
        senderDetail: params.senderDetail,
        receivers: params.receivers,
        receiverDetail: params.receiverDetail,
        cc: params.cc,
        ccDetail: params.ccDetail,
        senderName: params.senderName,
        senderRank: params.senderRank,
        author: params.author,
        referenceId: params.referenceId
    }, function (err, resupdate) {
        getRadiogramParent(params.id).then(function(result) {
            console.log("get parent Id ", result);
            result.forEach(function(i){
                soyut.radiogram.Radiogram_delete({id: i.id}, function (err, deldata) {
                    console.log(deldata);
                });
            });
        });

        getContentRadiogram(params.id).then(function(res) {
            params.receivers.forEach(function (i) {
                if (i.type == 'role') {
                    soyut.radiogram.renderSenderDetail(i.id, function (m) {
                        soyut.radiogram.Radiogram_SendReceiverWasdal({
                            panggilan: params.panggilan,
                            jenis: params.jenis,
                            nomor: params.nomor,
                            derajat: params.derajat,
                            instruksi: params.instruksi,
                            tandadinas: params.tandadinas,
                            group: params.group,
                            classification: params.classification,
                            materi: params.materi,
                            approved: params.approved,
                            Number: params.Number,
                            cara: params.cara,
                            paraf: params.paraf,
                            alamataksi: params.alamataksi,
                            alamattembusan: params.alamattembusan,
                            content: params.content,
                            readStatus: 'unread',
                            owner: m,
                            sender: params.sender,
                            senderDetail: params.senderDetail,
                            senderWasdal: soyut.Session.role.isWASDAL,
                            receivers: params.receivers,
                            receiverDetail: params.receiverDetail,
                            cc: params.cc,
                            ccDetail: params.ccDetail,
                            session: res.session,
                            senderName: params.senderName,
                            senderRank: params.senderRank,
                            author: params.author,
                            SendTime: null,
                            simtime: null,
                            createTime: res.createTime,
                            parentId: params.id,
                            referenceId: params.referenceId,
                            composeStatus: 'pending'
                        }, function (err, res) {
                            if (!err) {

                            }
                        });
                    });
                }
                else if (i.type == 'als') {
                    soyut.radiogram.renderAliasDetail(i.id, function (als) {
                        als.roles.forEach(function (role) {
                            soyut.radiogram.renderSenderDetail(role, function (m) {
                                soyut.radiogram.Radiogram_SendReceiverWasdal({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    materi: params.materi,
                                    approved: params.approved,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: m,
                                    sender: params.sender,
                                    senderDetail: params.senderDetail,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    receivers: params.receivers,
                                    receiverDetail: params.receiverDetail,
                                    cc: params.cc,
                                    ccDetail: params.ccDetail,
                                    session: res.session,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    author: params.author,
                                    SendTime: null,
                                    simtime: null,
                                    createTime: res.createTime,
                                    parentId: params.id,
                                    referenceId: params.referenceId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {

                                    }
                                });
                            });
                        });
                    });
                }
                else {
                    console.log("sending radiogram wasdal");
                }
            });

            params.cc.forEach(function (i) {
                if (i.type == 'role') {
                    soyut.radiogram.renderSenderDetail(i.id, function (m) {
                        soyut.radiogram.Radiogram_SendReceiverWasdal({
                            panggilan: params.panggilan,
                            jenis: params.jenis,
                            nomor: params.nomor,
                            derajat: params.derajat,
                            instruksi: params.instruksi,
                            tandadinas: params.tandadinas,
                            group: params.group,
                            classification: params.classification,
                            materi: params.materi,
                            approved: params.approved,
                            Number: params.Number,
                            cara: params.cara,
                            paraf: params.paraf,
                            alamataksi: params.alamataksi,
                            alamattembusan: params.alamattembusan,
                            content: params.content,
                            readStatus: 'unread',
                            owner: m,
                            sender: params.sender,
                            senderDetail: params.senderDetail,
                            senderWasdal: soyut.Session.role.isWASDAL,
                            receivers: params.receivers,
                            receiverDetail: params.receiverDetail,
                            cc: params.cc,
                            ccDetail: params.ccDetail,
                            session: res.session,
                            senderName: params.senderName,
                            senderRank: params.senderRank,
                            author: params.author,
                            SendTime: null,
                            simtime: null,
                            createTime: res.createTime,
                            parentId: params.id,
                            referenceId: params.referenceId,
                            composeStatus: 'pending'
                        }, function (err, res) {
                            if (!err) {

                            }
                        });
                    });
                }
                else if (i.type == 'als') {
                    soyut.radiogram.renderAliasDetail(i.id, function (als) {
                        als.roles.forEach(function (role) {
                            soyut.radiogram.renderSenderDetail(role, function (m) {
                                soyut.radiogram.Radiogram_SendReceiverWasdal({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    materi: params.materi,
                                    approved: params.approved,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: m,
                                    sender: params.sender,
                                    senderDetail: params.senderDetail,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    receivers: params.receivers,
                                    receiverDetail: params.receiverDetail,
                                    cc: params.cc,
                                    ccDetail: params.ccDetail,
                                    session: res.session,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    author: params.author,
                                    SendTime: null,
                                    simtime: null,
                                    createTime: res.createTime,
                                    parentId: params.id,
                                    referenceId: params.referenceId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {

                                    }
                                });
                            });
                        });
                    });
                }
                else {
                    console.log("sending radiogram wasdal");
                }
            });

            callback("success");
        });
    });
};

soyut.radiogram.UpdateDraftRIG = function(params, callback) {
    soyut.radiogram.Radiogram_UpdateDraft({
        id: params.id,
        panggilan: params.panggilan,
        jenis: params.jenis,
        nomor: params.nomor,
        derajat: params.derajat,
        instruksi: params.instruksi,
        tandadinas: params.tandadinas,
        group: params.group,
        classification: params.classification,
        materi: params.materi,
        approved: params.approved,
        Number: params.Number,
        cara: params.cara,
        paraf: params.paraf,
        alamataksi: params.alamataksi,
        alamattembusan: params.alamattembusan,
        content: params.content,
        sender: params.sender,
        senderDetail: params.senderDetail,
        receivers: params.receivers,
        receiverDetail: params.receiverDetail,
        cc: params.cc,
        ccDetail: params.ccDetail,
        senderName: params.senderName,
        senderRank: params.senderRank,
        author: params.author,
        referenceId: params.referenceId
    }, function (err, res) {
        sessionService.Session_find({scenario: params.scenario}, function(err, rescenario){
            getRadiogramParent(params.id).then(function(result) {
                result.forEach(function(i){
                    soyut.radiogram.Radiogram_delete({id: i.id}, function (err, deldata) {
                        console.log(deldata);
                    });
                });
            });

            getContentRadiogram(params.id).then(function(res) {
                params.receivers.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: true,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: rescenario[0].id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: res.createTime,
                                parentId: params.id,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: true,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: rescenario[0].id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: res.createTime,
                                        parentId: params.id,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                params.cc.forEach(function (i) {
                    if (i.type == 'role') {
                        soyut.radiogram.renderSenderDetail(i.id, function (m) {
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                materi: params.materi,
                                approved: params.approved,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: m,
                                sender: params.sender,
                                senderDetail: params.senderDetail,
                                senderWasdal: true,
                                receivers: params.receivers,
                                receiverDetail: params.receiverDetail,
                                cc: params.cc,
                                ccDetail: params.ccDetail,
                                session: rescenario[0].id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                author: params.author,
                                SendTime: null,
                                simtime: null,
                                createTime: res.createTime,
                                parentId: params.id,
                                referenceId: params.referenceId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {

                                }
                            });
                        });
                    }
                    else if (i.type == 'als') {
                        soyut.radiogram.renderAliasDetail(i.id, function (als) {
                            als.roles.forEach(function (role) {
                                soyut.radiogram.renderSenderDetail(role, function (m) {
                                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                                        panggilan: params.panggilan,
                                        jenis: params.jenis,
                                        nomor: params.nomor,
                                        derajat: params.derajat,
                                        instruksi: params.instruksi,
                                        tandadinas: params.tandadinas,
                                        group: params.group,
                                        classification: params.classification,
                                        materi: params.materi,
                                        approved: params.approved,
                                        Number: params.Number,
                                        cara: params.cara,
                                        paraf: params.paraf,
                                        alamataksi: params.alamataksi,
                                        alamattembusan: params.alamattembusan,
                                        content: params.content,
                                        readStatus: 'unread',
                                        owner: m,
                                        sender: params.sender,
                                        senderDetail: params.senderDetail,
                                        senderWasdal: true,
                                        receivers: params.receivers,
                                        receiverDetail: params.receiverDetail,
                                        cc: params.cc,
                                        ccDetail: params.ccDetail,
                                        session: rescenario[0].id,
                                        senderName: params.senderName,
                                        senderRank: params.senderRank,
                                        author: params.author,
                                        SendTime: null,
                                        simtime: null,
                                        createTime: res.createTime,
                                        parentId: params.id,
                                        referenceId: params.referenceId,
                                        composeStatus: 'pending'
                                    }, function (err, res) {
                                        if (!err) {

                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        console.log("sending radiogram wasdal");
                    }
                });

                callback("success");
            });
        });
    });
};

function getListReceiversDetail(role) {
    return new Promise.map(role, function(i) {
        return getVRole(i).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

soyut.radiogram.renderListVRoleDetail = function (role, callback) {
    if(role != null){
        getListReceiversDetail(role).then(function(result) {
            var arr = [];
            result.forEach(function (i) {
                var retData = {
                    callsign: i.data.callsign,
                    co: i.data.co,
                    id: i.data.id,
                    index: i.data.index,
                    position: i.data.position,
                    positionCodeName: i.data.positionCodeName,
                    rank: i.data.rank,
                    scenario: i.data.scenario,
                    type: 'vrole'
                };
                arr.push(retData);
            });
            var dataObj = {};
            dataObj = arr;
            callback(dataObj)
        });
    }
    else{
        var arr = '';
        var dataObj = {};
        dataObj = arr;
        callback(dataObj)
    }
};

soyut.radiogram.renderListRoleDetail = function (role, callback) {
    if(role != null){
        getListRoleDetail(role).then(function(result) {
            var arr = [];
            result.forEach(function (i) {
                arr.push(i);
            });
            var dataObj = {};
            dataObj = arr;
            callback(dataObj)
        });
    }
    else{
        var arr = '';
        var dataObj = {};
        dataObj = arr;
        callback(dataObj)
    }
};

function getListRoleDetail(role) {
    return new Promise.map(role, function(i) {
        return getRoleDetail(i).then(function(data) {
            return data;
        })
    });
}

soyut.radiogram.renderListAliasDetail = function(alias, callback){
    getListAliasDetail(alias).then(function(result) {
        var arr = [];
        result.forEach(function (i) {
            var objData = {
                id: i.id,
                index: i.index,
                position: i.name,
                scenario: i.scenario,
                type: 'als'
            };
            arr.push(objData);
        });
        var dataObj = {};
        dataObj = arr;
        callback(dataObj);
    });
};

function getListAliasDetail(alias) {
    return new Promise.map(alias, function(i) {
        return getAliasDetail(i).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

soyut.radiogram.renderAliasDetail = function (alias, callback) {
    getAliasDetail(alias).then(function(result){
        callback(result)
    });
}

function getAliasDetail(alias) {
    return new Promise (function(resolve,reject){
        scenarioService.scenario_getAliasDetails({id: alias}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

soyut.radiogram.renderListAlias = function (callback) {
    getListAlias().then(function (result) {
        callback(result);
    });
};

function getListAlias() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.scenario_getAliasContent({scenario: scenario}, function (e, data) {
                if(e){
                    reject(e);
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });

        });
    });
}

function getRoleDetail(group) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_find({query: {id: group}}, function (e, data) {
            if(e){
                reject(e);
            }else{
                scenarioService.scenario_getRoleGroup({id: data.data[0].roleGroup}, function (e, result) {
                    var objData = {
                        callsign: data.data[0].callsign,
                        createdAt: data.data[0].createdAt,
                        id: data.data[0].id,
                        isAddress: data.data[0].isAddress,
                        isAlias: data.data[0].isAlias,
                        isSet: data.data[0].isSet,
                        isWASDAL: data.data[0].isWASDAL,
                        position: data.data[0].position,
                        positionCode: data.data[0].positionCode,
                        rank: data.data[0].rank,
                        roleGroup: data.data[0].roleGroup,
                        scenario: data.data[0].scenario,
                        updatedAt: data.data[0].updatedAt,
                        groupName: result.name,
                        type: 'role'
                    };

                    var dataObj = objData;
                    resolve(dataObj);
                });
            }
        });
    });
}

soyut.radiogram.renderListMessages = function (rolegroup, message,callback) {
    getAddressRolegroup(rolegroup).then(function(result){
        getListMessages(result, message).then(function(data) {
            var arr = [];
            data.forEach(function (i) {
                i.forEach(function (e) {
                    arr.push(e)
                })
            });
            var dataObj = {};
            dataObj = arr;
            callback(dataObj);
        });
    });
};

function getListMessages(role, message) {
    return new Promise.map(role, function(i) {
        return getRadiogram(i.id, message).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

soyut.radiogram.renderGroupAddress = function (rolegroup, callback) {
    getRoleGroup(rolegroup).then(function(rg) {
        getAddressRolegroup(rolegroup).then(function (result) {
            var data = {
                callsign: result[0].callsign,
                createdAt: result[0].createdAt,
                id: result[0].id,
                isAddress: result[0].isAddress,
                isAlias: result[0].isAlias,
                isSet: result[0].isSet,
                isWASDAL: result[0].isWASDAL,
                position: result[0].position,
                positionCode: result[0].positionCode,
                rank: result[0].rank,
                roleGroup: result[0].roleGroup,
                scenario: result[0].scenario,
                updatedAt: result[0].updatedAt,
                groupName: rg.name,
                type: 'role'
            };
            var objData = data;
            callback(objData);
        });
    });
};

soyut.radiogram.renderListWasdalMessages = function (message, group, callback) {
    getKolatIsaddress().then(function(result) {
        if(group != ''){
            soyut.radiogram.renderGroupAddress(group, function (owner) {
                getListWasdalMessages(result, message).then(function(data) {
                    var arr = [];
                    data.forEach(function (i) {
                        i.forEach(function (e) {
                            if(owner.id == e.sender.id) {
                                arr.push(e);
                            }
                        })
                    });
                    var dataObj = {};
                    dataObj = arr;
                    callback(dataObj);
                });
            });
        }
        else {
            getListWasdalMessages(result, message).then(function(data) {
                var arr = [];
                data.forEach(function (i) {
                    i.forEach(function (e) {
                        arr.push(e);
                    })
                });
                var dataObj = {};
                dataObj = arr;
                callback(dataObj);
            });
        }
    });
};

soyut.radiogram.renderListKolatReceiver = function (callback) {
    getKolatIsaddress().then(function(result) {
        var data = {
            callsign: result[0].callsign,
            createdAt: result[0].createdAt,
            id: result[0].id,
            isAddress: result[0].isAddress,
            isAlias: result[0].isAlias,
            isSet: result[0].isSet,
            isWASDAL: result[0].isWASDAL,
            position: result[0].position,
            positionCode: result[0].positionCode,
            rank: result[0].rank,
            roleGroup: result[0].roleGroup,
            scenario: result[0].scenario,
            updatedAt: result[0].updatedAt,
            type: 'role'
        };
        var objData = data;
        callback(objData);
    });
};

function getKolatIsaddress() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.Role_getKolatIsaddress({scenario:scenario},function(e,data){
                if(e){
                    reject(e);
                } else {
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });

        });
    });
}

function getListWasdalMessages(role, message) {
    return new Promise.map(role, function(i) {
        return getRadiogram(i.id, message).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

function getRadiogram(role, message) {
    var field = 'SendTime';
    if(message == 'draft'){
        field = 'createTime';
    }
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetInboxByRole({id: role, state: message, field:field, sort:'desc'}, function (e, data) {
            if(e){
                reject(e);
            }else{
                resolve(data);
            }
        });
    });
};

soyut.radiogram.checkReceivers = function(selected, type, value, callback){
    selected.forEach(function(m){
        if(type == m.type){
            if(value == m.id) {
                callback(true);
            }
        }
    });
};

soyut.radiogram.yearNumToSimStr = function(yearNum) {
    var lastNum = yearNum % 10;
    var lastChr = String.fromCharCode(65 + lastNum);
    return yearNum.toString().substring(0,3) + lastChr;
};

soyut.radiogram.UpdateReadStatus = function (id, callback) {
    readStatusUpdated(id).then(function(result){
        callback(result);
    });
};

function readStatusUpdated(id) {
    return new Promise (function(resolve,reject) {
        soyut.radiogram.Radiogram_UpdateReadStatus({id: id}, function (e, data) {
            if (e) {
                reject(e);
            } else {
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
};

soyut.radiogram.renderMessageObj = function (id, callback) {
    getContentRadiogram(id).then(function(result) {
        callback(result)
    });
};

function getContentRadiogram(id) {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetById({id: id}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
};

soyut.radiogram.renderRadiogramDetail = function (id, callback) {
    getContentRadiogram(id).then(function(result) {
        callback(result)
    });
};


soyut.radiogram.renderProviderPrinter = function (rolegroup, callback) {
    getPrinterProvider(rolegroup).then(function(result) {
        getDetailPrinter(result).then(function(data) {
            var arr = []
            data.forEach(function (i) {
                i.forEach(function (e) {
                    arr.push(e)
                })
            })
            var dataObj = {};
            dataObj = arr;
            callback(dataObj);
        });
    });
};

function getDetailPrinter(provider) {
    return new Promise.map(provider, function(i) {
        return getPrinter(i).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

function getPrinter(print) {
    return new Promise (function(resolve,reject){
        scenarioService.scenario_getPrinterDetails({id: print}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
};

function getPrinterProvider(rolegroup) {
    return new Promise (function(resolve,reject){
        scenarioService.scenario_getRoleGroupPrinters({id: rolegroup}, function (e, data) {
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}


soyut.radiogram.SaveFilePDF = function(val, rescallback) {
    var dataurl = "https://"+soyut.radiogram.origin+"/data/"+val;
    var curUrl = soyut.radiogram.origin.split(':');
    var storageServer = 'storage.soyut';

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

    function saveFileToSystem(targetFolder){
        soyut.storage.getStorageKeyAsync({userId: fileSystem.userid}).then(function(storageKey) {
            var storagePath = targetFolder + "/" +val;
            var fileUrl = 'https://'+ storageServer +':5454/storage/' + storageKey + storagePath;

            function getPosition(str, m, i) { return str.split(m, i).join(m).length; }

            var safeUrl = dataurl.substring(0, 8) + curUrl[0] + dataurl.substring(getPosition(dataurl, ':', 2));

            // debugger;
            getFile(safeUrl, function(err, dataBuffer) {
                if (err) return;
                soyut.storage.putAsync({
                    storageKey: storageKey,
                    path: storagePath,
                    dataBuffer: dataBuffer
                }).then(function() {
                    console.log("File PDF telah berhasil di simpan ke file browser!");
                    var dataObj = {
                        url: fileUrl,
                        name: val
                    };
                    rescallback(false, dataObj);
                });
            });
        });
    }

    soyut.clock.getCurrentActualTime({}, function(err, reclock){
        var strFolder = "RDG-" + moment(reclock).format('DD-MM-YYYY');
        var tgtDir = "/" + strFolder;

        fileSystem.ls(tgtDir, function (err, files) {
            if(files.length == 0){
                fileSystem.mkdir(tgtDir, function(err, res) {
                    saveFileToSystem(tgtDir);
                });
            }
            else{
                saveFileToSystem(tgtDir);
            }
        });
    });
};

soyut.radiogram.RenderPrinterPDF = function(id, callback) {
    soyut.radiogram.renderRadiogramDetail(id, function (data) {
        soyut.rig.Rig_GetKop({scenario: soyut.Session.role.scenario}, function (err, kop) {

            var cSendDate = "";
            var cHour = "";
            var cMinute = "";
            var tSimDate = "";
            var mDate = "";
            if (data.simtime != null) {
                cSendDate = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                cHour = moment(data.simtime).format('h');
                cMinute = moment(data.simtime).format('mm');
                tSimDate = moment(data.simtime).format("DD") + "" + moment(data.simtime).format("MM") + " " + moment(data.simtime).format("h") + "." + moment(data.simtime).format("mm") + " WA";
                mDate = moment(data.simtime).format("DD");
            }

            soyut.radiogram.Printer_PrintToPDF({
                panggilan: data.panggilan,
                jenis: data.jenis,
                nomor: data.nomor,
                derajat: data.derajat,
                instruksi: data.instruksi,
                datetime: cSendDate,
                sender_Name: data.senderDetail,
                receiver_Name: data.receiverDetail,
                tembusan_Name: data.ccDetail,
                klasifikasi: data.classification.toUpperCase(),
                number: data.Number,
                tanda_dinas: data.tandadinas,
                group: data.group,
                sendername: data.senderName,
                senderpangkat: data.senderRank,
                tanda_tangan: "",
                alamataksi: data.alamataksi,
                alamattembusan: data.alamattembusan,
                jam: cHour + ":" + cMinute,
                tanggal: mDate,
                cara: data.cara,
                paraf: data.paraf,
                message: data.content,
                simtime: tSimDate,
                kop: kop[0].title
            }, function (err, res) {
                callback(res);
            });

        });
    });
};


soyut.radiogram.AddRIGRadiogram = function(val){
    console.log("add RIG")
    var timeFrame = null;
    function momentifyTimeFrame(timeFrameObj) {
        timeFrameObj.actualStart = moment(timeFrameObj.actualStart);
        timeFrameObj.actualEnd   = moment(timeFrameObj.actualEnd);
        timeFrameObj.simStart    = moment(timeFrameObj.simStart);
        timeFrameObj.simEnd      = moment(timeFrameObj.simEnd);
        for (var syncPointId in timeFrameObj.syncPoints) {
            if (timeFrameObj.syncPoints.hasOwnProperty(syncPointId)) {
                var sp = timeFrameObj.syncPoints[syncPointId];
                sp.actual = moment(sp.actual);
                sp.sim    = moment(sp.sim);
            }
        }
    };

    function setCurrentTimeFrame(timeFrameObj) {
        momentifyTimeFrame(timeFrameObj);
        timeFrame = timeFrameObj;
        timeFrame.syncPointsSorted = [];
        for (var syncPointId in timeFrame.syncPoints) {
            if (timeFrame.syncPoints.hasOwnProperty(syncPointId)) {
                var sp = timeFrame.syncPoints[syncPointId];
                timeFrame.syncPointsSorted.push(sp);
            }
        }
        timeFrame.syncPointsSorted.sort(function(a, b) {
            return moment(a.actual) - moment(b.actual);
        });
    };

    function getSimTime(actualTime, callback) {
        var error  = true;
        var retObj = "invalid";
        var now = moment(actualTime);
        var syncPoints = timeFrame ? timeFrame.syncPointsSorted : null;
        var syncPointCount = syncPoints ? syncPoints.length : 0;
        if (syncPoints && syncPointCount > 0) {
            var leftSp = null, rightSp = null;
            if (syncPoints[0].actual > now) {
                rightSp = syncPoints[0];
            }
            else if (syncPoints[syncPointCount-1].actual < now) {
                leftSp = syncPoints[syncPointCount-1];
            }
            else {
                var i = 0;
                while (!leftSp && !rightSp && i < syncPointCount - 1) {
                    var lTest = syncPoints[i].actual;
                    var rTest = syncPoints[i+1].actual;
                    if (lTest <= now && now <= rTest) {
                        leftSp = syncPoints[i];
                        rightSp = syncPoints[i + 1];
                        break;
                    }
                    i++;
                }
            }

            if (leftSp && rightSp) {
                var actualSegmentLength = rightSp.actual - leftSp.actual;
                var simSegmentLength = rightSp.sim - leftSp.sim;
                var compression = simSegmentLength / actualSegmentLength;
                var simTime = moment(leftSp.sim).add((now - leftSp.actual) * compression, 'ms');
                error = false;
                retObj = {
                    simTime: simTime,
                    compression: compression
                }
            }
            else if (leftSp) {
                error  = false;
                retObj = { simTime: leftSp.sim, compression: 0 };
            }
            else if (rightSp) {
                error  = false;
                retObj = { simTime: rightSp.sim, compression: 0 };
            }
        }
        callback(error, retObj);
    };

    function getCurrentActualTime(){
        return moment();
    };

    scenarioService.scenario_listRoleGroups({scenario_id: soyut.Session.role.scenario}, function (err, res) {
        //sementara pake ini dulu
        var curtime = new Date(getCurrentActualTime());

        clockService.timeFrame_getTimeFrame({id: res[0].timeframe}, function(err, result){
            setCurrentTimeFrame(result);
        });
        getSimTime(curtime.toISOString(),function(err, reclock){
            var curSimTime = new Date(reclock.simTime);
            soyut.rig.Rig_AddRIGList({
                rig: res[0].RIG,
                scenario: soyut.Session.role.scenario,
                title: '',
                action: '',
                description: '',
                SendTime: curtime,
                simtime: curSimTime,
                radiogram: val
            }, function(err, riglist){
                console.log("save RIG list")
            });

        });
    });
}

soyut.radiogram.CreateLogs = function(params, callback){
    soyut.clock.getCurrentActualTime({}, function(err, reclock){
        
        soyut.radiogram.Log_CreateLog({
            radiogram: params.radiogram,
            actions: params.actions,
            user: params.user,
            time: reclock,
            scenario: params.scenario
        }, function (err, result) {
            if (!err) {
                callback(result)
            }
        });
    });
}

soyut.radiogram.renderKastaf = function(params, callback){
    getGroupAssignee(params).then(function(result){
        getPolicies(result[0].group[0]).then(function(res){
            callback(res.kastaf);
        });
    });
};

function getGroupAssignee(id){
    return new Promise (function(resolve,reject){
        policyService.groupAsignee_getGroup(id,function(e,data){
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}

function getPolicies(id){
    return new Promise (function(resolve,reject){
        policyService.group_get(id,function(e,data){
            if(e){
                reject(e);
            }else{
                var dataObj = {};
                dataObj = data;
                resolve(dataObj);
            }
        });
    });
}