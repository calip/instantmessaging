soyut.radiogram = soyut.radiogram || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogram.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");
var clockService = soyut.Services.getInstance().getService("clockserver");

if (Promise.promisifyAll) {
    Promise.promisifyAll(soyut.radiogram);
}

socket.on('new_radiogram', function (data) {
    if(soyut.Session.role.isWASDAL){
        getListVRole(soyut.Session.role.scenario).then(function(result) {
            result.forEach(function(i){
                //if(data.new_val.owner == i.id){
                    console.log(i.position+" notification "+i.id)
                    if(data.new_val.composeStatus == 'inbox'){
                        soyut.radiogram.SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
            
                        soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
                    }
                //}
            });
        });
    }
    else{
        scenarioService.Role_getRoleByGroup({roleGroup: soyut.Session.role.roleGroup}, function(err,res) {
            res.forEach(function(i){
                //if(i.isAddress){
                    if(data.new_val.owner == i.id){
                        console.log(i.position+" notification "+i.id)

                        if(data.new_val.composeStatus == 'inbox'){
                            soyut.radiogram.SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
                
                            soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
                        }
                    }
                //}
            });
        });
    }
});

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
                }else{
                    var dataObj = {};
                    dataObj = data;
                    resolve(dataObj);
                }
            });
            
        });
    });
}

soyut.radiogram.renderListWasdalMessages = function (message,callback) {
    getListReceivers().then(function(result) {
        getListWasdalMessages(result, message).then(function(data) {
            var arr = []
            data.forEach(function (i) {
                i.forEach(function (e) {
                    arr.push(e)
                })
            })
            var dataObj = {};
            dataObj = arr;
            callback(dataObj);
        })  
    })
};

function getRadiogram(role, message) {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetInboxByRole({id: role, state: message, field:'SendTime', sort:'desc'}, function (e, data) {
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

function getListWasdalMessages(role, message) {
    return new Promise.map(role, function(i) {
        return getRadiogram(i.id, message).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

soyut.radiogram.renderListMessages = function (message,callback) {
    getListRole().then(function(result) {
        getListMessages(result, message).then(function(data) {
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

function getListRole() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.Role_getRoleByGroup({roleGroup: soyut.Session.role.roleGroup}, function (e, data) {
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

function getListMessages(role, message) {
    return new Promise.map(role, function(i) {
        return getRadiogram(i.id, message).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

soyut.radiogram.renderListReceiversDetail = function (role, callback) {
    if(role != null){
        getListReceiversDetail(role).then(function(result) {
            
            var arr = '';
            result.forEach(function (i) {
                if(i.data == undefined){
                    arr = "PANGKOGAS, ";
                }
                else{
                    arr = arr + i.data.position+", ";
                }
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

soyut.radiogram.renderSenderObjWasdal = function (role, wasdal, callback) {
    getVRole(role).then(function(result) {
        var dataObj = {};
        if(result.data == undefined){
            var data = {
                position: "PANGKOGAS"
            };
            dataObj = data;
        }
        else{
            dataObj = result.data;
        }
        callback(dataObj)
    });
};

soyut.radiogram.renderSenderWasdalDetail = function (role, callback) {
    getVRole(role).then(function(result) {
        callback(result);
    });
};

soyut.radiogram.renderSenderDetail = function (role, callback) {
    getRole(role).then(function(result) {
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

function getListVRole(scenario) {
    return new Promise (function(resolve,reject){
        scenarioService.VRole_list({scenario: scenario}, function (e, data) {
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

soyut.radiogram.renderSenderObj = function (role, wasdal, callback) {
    if(wasdal){
        getVRole(role).then(function(result) {
            var data = result.data;
            var dataObj = {};
            dataObj = data;
            callback(dataObj);
        });
    }
    else{
         getRole(role).then(function(result) {
            var data = result.data[0];
            var dataObj = {};
            dataObj = data;
            callback(dataObj);
        });
    }
};

function getRole(role) {
    return new Promise (function(resolve,reject){
        scenarioService.Role_find({query: {id: role}}, function (e, data) {
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

function getListReceiversDetail(role) {
    return new Promise.map(role, function(i) {
        return getVRole(i).then(function(data) {
            return data;
        }).then(function(result) {
            return result;
        });
    });
}

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

function getRadiogramParent(id) {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetByParentId({id: id}, function (e, data) {
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

soyut.radiogram.renderListRoleGroup = function (callback) {
    getListRoleGroup().then(function(result) {
        callback(result)
    });
}

function getListRoleGroup() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            scenarioService.scenario_listRoleGroups({scenario_id: scenario}, function (e, data) {
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

soyut.radiogram.renderUserDetail = function (id, callback) {
    getKey(id).then(function(result) {
        if (result.hasOwnProperty('user')) {
            soyut.user.getUserByIdAsync(result.user)
            .then(function (user) {
                callback(user)
            })
            .catch(function (err) {
                var dataObj = {};
            callback(dataObj)
            });
        }
        else{
            var dataObj = {};
            callback(dataObj)
        }
    });
};

function getKey(id) {
    return new Promise (function(resolve,reject){
        sessionService.RoleKey_get({
            role: id,
            session: soyut.Session.id
        }, function (e, data) {
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

soyut.radiogram.SendWasdalRadiogram = function (params, callback) {
    getListPangkogas().then(function(result) {
        var listRcp = [];
        listRcp = params.receivers;
        var listTembusan = [];
        listTembusan = params.cc;
        
        var listReceiver = [];
        var listCC = [];
        
        soyut.clock.getCurrentActualTime({}, function(err, reclock){
            params.receivers.forEach(function(i){
                if(i == "0"){
                    result.forEach(function(m){
                        listReceiver.push(m.id);
                    });
                }
            });
            
            listReceiver.forEach(function(rcv){
                //send receievr
                soyut.radiogram.Radiogram_SendReceiverWasdal({
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    readStatus: 'unread',
                    owner: rcv,
                    sender: params.sender,
                    receivers: params.receivers,
                    senderWasdal: soyut.Session.role.isWASDAL,
                    cc: params.cc,
                    session: soyut.Session.id,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                    SendTime: reclock,
                    simtime: reclock,
                    createTime: reclock,
                    parentId: null,
                    composeStatus: 'inbox'
                }, function (err, res) {
                    if (!err) {
                    }
                });
            });
            
            if(listRcp[1] != undefined){
                //send receievr
                soyut.radiogram.Radiogram_SendReceiverWasdal({
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    readStatus: 'unread',
                    owner: listRcp[1],
                    sender: params.sender,
                    receivers: params.receivers,
                    senderWasdal: soyut.Session.role.isWASDAL,
                    cc: params.cc,
                    session: soyut.Session.id,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                    SendTime: reclock,
                    simtime: reclock,
                    createTime: reclock,
                    parentId: null,
                    composeStatus: 'inbox'
                }, function (err, res) {
                    if (!err) {
                    }
                });
            }

            if(params.cc != undefined || params.cc != null){
                params.cc.forEach(function(cc){
                    if(cc == "0"){
                        result.forEach(function(n){
                            listCC.push(n.id);
                        });
                    }
                });
                listCC.forEach(function(lrcv){
                    //send receievr
                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                        panggilan: params.panggilan,
                        jenis: params.jenis,
                        nomor: params.nomor,
                        derajat: params.derajat,
                        instruksi: params.instruksi,
                        tandadinas: params.tandadinas,
                        group: params.group,
                        classification: params.classification,
                        Number: params.Number,
                        cara: params.cara,
                        paraf: params.paraf,
                        alamataksi: params.alamataksi,
                        alamattembusan: params.alamattembusan,
                        content: params.content,
                        readStatus: 'unread',
                        owner: lrcv,
                        sender: params.sender,
                        receivers: params.receivers,
                        senderWasdal: soyut.Session.role.isWASDAL,
                        cc: params.cc,
                        session: soyut.Session.id,
                        senderName: params.senderName,
                        senderRank: params.senderRank,
                        SendTime: reclock,
                        simtime: reclock,
                        createTime: reclock,
                        parentId: null,
                        composeStatus: 'inbox'
                    }, function (err, res) {
                        if (!err) {
                        }
                    });
                });
                
                if(listTembusan[1] != undefined){
                    //send receievr
                    soyut.radiogram.Radiogram_SendReceiverWasdal({
                        panggilan: params.panggilan,
                        jenis: params.jenis,
                        nomor: params.nomor,
                        derajat: params.derajat,
                        instruksi: params.instruksi,
                        tandadinas: params.tandadinas,
                        group: params.group,
                        classification: params.classification,
                        Number: params.Number,
                        cara: params.cara,
                        paraf: params.paraf,
                        alamataksi: params.alamataksi,
                        alamattembusan: params.alamattembusan,
                        content: params.content,
                        readStatus: 'unread',
                        owner: listTembusan[1],
                        sender: params.sender,
                        receivers: params.receivers,
                        senderWasdal: soyut.Session.role.isWASDAL,
                        cc: params.cc,
                        session: soyut.Session.id,
                        senderName: params.senderName,
                        senderRank: params.senderRank,
                        SendTime: reclock,
                        simtime: reclock,
                        createTime: reclock,
                        parentId: null,
                        composeStatus: 'inbox'
                    }, function (err, res) {
                        if (!err) {
                        }
                    });
                }
            }
            
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
                Number: params.Number,
                cara: params.cara,
                paraf: params.paraf,
                alamataksi: params.alamataksi,
                alamattembusan: params.alamattembusan,
                content: params.content,
                readStatus: 'unread',
                owner: params.sender,
                sender: params.sender,
                receivers: params.receivers,
                senderWasdal: soyut.Session.role.isWASDAL,
                cc: params.cc,
                session: soyut.Session.id,
                senderName: params.senderName,
                senderRank: params.senderRank,
                SendTime: reclock,
                simtime: reclock,
                createTime: reclock
            }, function (err, results) {
                if (!err) {
                    callback(results.data.generated_keys[0]);
                }
            });
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

soyut.radiogram.yearNumToSimStr = function(yearNum) {
    var lastNum = yearNum % 10;
    var lastChr = String.fromCharCode(65 + lastNum);
    return yearNum.toString().substring(0,3) + lastChr;
}

soyut.radiogram.SendRadiogram = function (params, callback) {
    var listRcp = [];
    listRcp = params.receivers;
    var listTembusan = [];
    listTembusan = params.cc;
    
    var listReceiver = [];
    var listCC = [];
    
    soyut.clock.getCurrentActualTime({}, function(err, reclock){
        if(listRcp[0] != undefined){
            soyut.radiogram.Radiogram_SendReceiver({
                panggilan: params.panggilan,
                jenis: params.jenis,
                nomor: params.nomor,
                derajat: params.derajat,
                instruksi: params.instruksi,
                tandadinas: params.tandadinas,
                group: params.group,
                classification: params.classification,
                Number: params.Number,
                cara: params.cara,
                paraf: params.paraf,
                alamataksi: params.alamataksi,
                alamattembusan: params.alamattembusan,
                content: params.content,
                readStatus: 'unread',
                owner: listRcp[0],
                sender: params.sender,
                receivers: params.receivers,
                senderWasdal: soyut.Session.role.isWASDAL,
                cc: params.cc,
                session: soyut.Session.id,
                senderName: params.senderName,
                senderRank: params.senderRank,
                composeStatus: 'inbox',
                SendTime: reclock,
                simtime: reclock,
                createTime: reclock,
                parentId: null
                }, function (err, res) {
                if (!err) {
                    //callback(result.data.generated_keys[0])
                }
            });
        }

        //send
        soyut.radiogram.Radiogram_Sending({
            panggilan: params.panggilan,
            jenis: params.jenis,
            nomor: params.nomor,
            derajat: params.derajat,
            instruksi: params.instruksi,
            tandadinas: params.tandadinas,
            group: params.group,
            classification: params.classification,
            Number: params.Number,
            cara: params.cara,
            paraf: params.paraf,
            alamataksi: params.alamataksi,
            alamattembusan: params.alamattembusan,
            content: params.content,
            readStatus: 'unread',
            owner: params.sender,
            sender: params.sender,
            receivers: params.receivers,
            senderWasdal: soyut.Session.role.isWASDAL,
            cc: params.cc,
            session: soyut.Session.id,
            senderName: params.senderName,
            senderRank: params.senderRank,
            SendTime: reclock,
            simtime: reclock,
            createTime: reclock
        }, function (err, results) {
            if (!err) {
                callback(results.data.generated_keys[0]);
            }
        });
    });
}

soyut.radiogram.SendReplyRadiogram = function (params, callback) {
    var listRcp = [];
    listRcp = params.receivers;
    var listTembusan = [];
    listTembusan = params.cc;
    
    var listReceiver = [];
    var listCC = [];

    soyut.clock.getCurrentActualTime({}, function(err, reclock){
        if(listRcp[0] != undefined){
            soyut.radiogram.Radiogram_SendReceiver({
                panggilan: params.panggilan,
                jenis: params.jenis,
                nomor: params.nomor,
                derajat: params.derajat,
                instruksi: params.instruksi,
                tandadinas: params.tandadinas,
                group: params.group,
                classification: params.classification,
                Number: params.Number,
                cara: params.cara,
                paraf: params.paraf,
                alamataksi: params.alamataksi,
                alamattembusan: params.alamattembusan,
                content: params.content,
                readStatus: 'unread',
                owner: listRcp[0],
                sender: params.sender,
                receivers: params.receivers,
                senderWasdal: soyut.Session.role.isWASDAL,
                cc: params.cc,
                session: soyut.Session.id,
                senderName: params.senderName,
                senderRank: params.senderRank,
                composeStatus: 'inbox',
                SendTime: reclock,
                simtime: reclock,
                createTime: reclock,
                parentId: null
                }, function (err, res) {
                if (!err) {
                    callback(res.data.generated_keys[0])
                }
            });
        }
    });
};

soyut.radiogram.DraftWasdalRadiogram = function (params, callback) {
    getListPangkogas().then(function(kogas) {
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
                Number: params.Number,
                cara: params.cara,
                paraf: params.paraf,
                alamataksi: params.alamataksi,
                alamattembusan: params.alamattembusan,
                content: params.content,
                readStatus: 'unread',
                owner: params.sender,
                sender: params.sender,
                receivers: params.receivers,
                senderWasdal: soyut.Session.role.isWASDAL,
                cc: params.cc,
                session: soyut.Session.id,
                senderName: params.senderName,
                senderRank: params.senderRank,
                SendTime: reclock,
                simtime: reclock,
                createTime: reclock
            }, function (err, result) {
                if (!err) {
                    var listRcp = [];
                    listRcp = params.receivers;
                    var listTembusan = [];
                    listTembusan = params.cc;
                    
                    var listReceiver = [];
                    var listCC = [];
                    var parentId = result.data.generated_keys[0];
                    params.receivers.forEach(function(i){
                        if(i == "0"){
                            kogas.forEach(function(m){
                                listReceiver.push(m.id);
                            });
                        }
                    });
                    listReceiver.forEach(function(rcv){
                        //send receievr
                        soyut.radiogram.Radiogram_SendReceiverWasdal({
                            panggilan: params.panggilan,
                            jenis: params.jenis,
                            nomor: params.nomor,
                            derajat: params.derajat,
                            instruksi: params.instruksi,
                            tandadinas: params.tandadinas,
                            group: params.group,
                            classification: params.classification,
                            Number: params.Number,
                            cara: params.cara,
                            paraf: params.paraf,
                            alamataksi: params.alamataksi,
                            alamattembusan: params.alamattembusan,
                            content: params.content,
                            readStatus: 'unread',
                            owner: rcv,
                            sender: params.sender,
                            receivers: params.receivers,
                            senderWasdal: soyut.Session.role.isWASDAL,
                            cc: params.cc,
                            session: soyut.Session.id,
                            senderName: params.senderName,
                            senderRank: params.senderRank,
                            SendTime: reclock,
                            simtime: reclock,
                            createTime: reclock,
                            parentId: parentId,
                            composeStatus: 'pending'
                        }, function (err, res) {
                            if (!err) {
                            }
                        });
                    });
                    if(listRcp[1] != undefined){
                    //listRcp.forEach(function(rcp){
                        //if(rcp != '0'){
                            //send receievr
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: listRcp[1],
                                sender: params.sender,
                                receivers: params.receivers,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                cc: params.cc,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                SendTime: reclock,
                                simtime: reclock,
                                createTime: reclock,
                                parentId: parentId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        //}
                    }
                    if(params.cc != undefined || params.cc != null){
                        params.cc.forEach(function(cc){
                            if(cc == "0"){
                                kogas.forEach(function(n){
                                    listCC.push(n.id);
                                });
                            }
                        });
                        listCC.forEach(function(lrcv){
                            //send receievr
                            soyut.radiogram.Radiogram_SendReceiverWasdal({
                                panggilan: params.panggilan,
                                jenis: params.jenis,
                                nomor: params.nomor,
                                derajat: params.derajat,
                                instruksi: params.instruksi,
                                tandadinas: params.tandadinas,
                                group: params.group,
                                classification: params.classification,
                                Number: params.Number,
                                cara: params.cara,
                                paraf: params.paraf,
                                alamataksi: params.alamataksi,
                                alamattembusan: params.alamattembusan,
                                content: params.content,
                                readStatus: 'unread',
                                owner: lrcv,
                                sender: params.sender,
                                receivers: params.receivers,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                cc: params.cc,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                senderRank: params.senderRank,
                                SendTime: reclock,
                                simtime: reclock,
                                createTime: reclock,
                                parentId: parentId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                        //listTembusan.forEach(function(lrcp){
                            if(listTembusan[1] != undefined){
                            //if(lrcp != "0"){
                                //send receievr
                                soyut.radiogram.Radiogram_SendReceiverWasdal({
                                    panggilan: params.panggilan,
                                    jenis: params.jenis,
                                    nomor: params.nomor,
                                    derajat: params.derajat,
                                    instruksi: params.instruksi,
                                    tandadinas: params.tandadinas,
                                    group: params.group,
                                    classification: params.classification,
                                    Number: params.Number,
                                    cara: params.cara,
                                    paraf: params.paraf,
                                    alamataksi: params.alamataksi,
                                    alamattembusan: params.alamattembusan,
                                    content: params.content,
                                    readStatus: 'unread',
                                    owner: listTembusan[0],
                                    sender: params.sender,
                                    receivers: params.receivers,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    cc: params.cc,
                                    session: soyut.Session.id,
                                    senderName: params.senderName,
                                    senderRank: params.senderRank,
                                    SendTime: reclock,
                                    simtime: reclock,
                                    createTime: reclock,
                                    parentId: parentId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {
                                    }
                                });
                            }
                        //});
                    }
                    callback("success");
                }
            });
        });
    });
}

soyut.radiogram.UpdateDraftWasdalRadiogram = function(params, callback){
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
        Number: params.Number,
        cara: params.cara,
        paraf: params.paraf,
        alamataksi: params.alamataksi,
        alamattembusan: params.alamattembusan,
        content: params.content,
        sender: params.sender,
        receivers: params.receivers,
        cc: params.cc,
        senderName: params.senderName,
        senderRank: params.senderRank,
    }, function (err, res) {
        getRadiogramParent(params.id).then(function(result) {
            result.forEach(function(i){
                soyut.radiogram.Radiogram_UpdateDraft({
                    id: i.id,
                    panggilan: params.panggilan,
                    jenis: params.jenis,
                    nomor: params.nomor,
                    derajat: params.derajat,
                    instruksi: params.instruksi,
                    tandadinas: params.tandadinas,
                    group: params.group,
                    classification: params.classification,
                    Number: params.Number,
                    cara: params.cara,
                    paraf: params.paraf,
                    alamataksi: params.alamataksi,
                    alamattembusan: params.alamattembusan,
                    content: params.content,
                    sender: params.sender,
                    receivers: params.receivers,
                    cc: params.cc,
                    senderName: params.senderName,
                    senderRank: params.senderRank,
                }, function (err, result) {

                });
            });

            callback("success");
        });
    });
}

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
        Number: params.Number,
        cara: params.cara,
        paraf: params.paraf,
        alamataksi: params.alamataksi,
        alamattembusan: params.alamattembusan,
        content: params.content,
        sender: params.sender,
        receivers: params.receivers,
        cc: params.cc,
        senderName: params.senderName,
        senderRank: params.senderRank,
    }, function (err, res) {
        callback("success");
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
            Number: params.Number,
            cara: params.cara,
            paraf: params.paraf,
            alamataksi: params.alamataksi,
            alamattembusan: params.alamattembusan,
            content: params.content,
            readStatus: 'unread',
            owner: params.sender,
            sender: params.sender,
            receivers: params.receivers,
            senderWasdal: soyut.Session.role.isWASDAL,
            cc: params.cc,
            session: soyut.Session.id,
            senderName: params.senderName,
            senderRank: params.senderRank,
            SendTime: reclock,
            simtime: reclock,
            createTime: reclock
        }, function (err, result) {
            if (!err) {
                callback(result);
            }
        });
    });
}

soyut.radiogram.SendDraftWasdalRadiogram = function (params, callback) {
    soyut.radiogram.Radiogram_GetById({id: params.id}, function(err,res) {
        soyut.radiogram.Radiogram_GetListDraft({id: res.id, status: 'pending'}, function(err,result) {
            soyut.clock.getCurrentActualTime({}, function(err, reclock){
                result.forEach(function(i){
                    soyut.radiogram.Radiogram_SendDraft({id: i.id, sendtime: reclock, simtime: reclock, status: 'inbox'}, function(err,res) {
                    });
                });
                soyut.radiogram.Radiogram_SendDraft({id: res.id, sendtime: reclock, simtime: reclock, status: 'sent'}, function(err,results) {
                    callback("success");
                });
            });
        });
    });
}

soyut.radiogram.RenderPrinterPDF = function(id, callback){
    soyut.radiogram.renderRadiogramDetail(id, function(data){

        if (soyut.Session.role.isWASDAL) {
            soyut.radiogram.renderSenderObjWasdal(data.sender, data.senderWasdal, function (sender) {
                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                    soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                        soyut.radiogram.renderUserDetail(data.sender, function (user) {
                            soyut.rig.Rig_GetKop({scenario: soyut.Session.role.scenario}, function (err, kop) {
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }

                                var cSendDate = "";
                                var cHour = "";
                                var cMinute = "";
                                var tSimDate = "";
                                if(data.simtime != null){
                                    var cSendDate = moment(data.simtime).format("DD")+'-'+moment(data.simtime).format("MM")+'-'+ soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY"))+' '+moment(data.simtime).format("hh")+':'+moment(data.simtime).format("mm");
                                    var cHour = moment(data.simtime).format('h');
                                    var cMinute = moment(data.simtime).format('mm');
                                    var tSimDate = moment(data.simtime).format("DD")+""+moment(data.simtime).format("MM")+" "+moment(data.simtime).format("h")+"."+moment(data.simtime).format("mm")+" WA";
                                }

                                soyut.radiogram.Printer_PrintToPDF({
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    nomor: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    datetime: cSendDate,
                                    sender_Name: sender.position,
                                    receiver_Name: receivers,
                                    tembusan_Name: cc,
                                    klasifikasi: data.classification.toUpperCase(),
                                    number: data.Number,
                                    tanda_dinas: data.tandadinas,
                                    group: data.group,
                                    sendername: data.senderName,
                                    senderpangkat: data.senderRank,
                                    tanda_tangan: "",
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    jam: cHour,
                                    tanggal: cMinute,
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
                    });
                });
            });
        }
        else{
            soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                    soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                        soyut.radiogram.renderUserDetail(data.sender, function (user) {
                            
                            soyut.rig.Rig_GetKop({scenario: soyut.Session.role.scenario}, function (err, kop) {
                                
                                var textArray = data.content.split('\n');
                                var renderMessage = "";
                                for (var i = 0; i < textArray.length; i++) {
                                    renderMessage += textArray[i] + "<br />";
                                }

                                var cSendDate = "";
                                var cHour = "";
                                var cMinute = "";
                                var tSimDate = "";
                                if(data.simtime != null){
                                    var cSendDate = moment(data.simtime).format("DD")+'-'+moment(data.simtime).format("MM")+'-'+ soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY"))+' '+moment(data.simtime).format("hh")+':'+moment(data.simtime).format("mm");
                                    var cHour = moment(data.simtime).format('h');
                                    var cMinute = moment(data.simtime).format('mm');
                                    var tSimDate = moment(data.simtime).format("DD")+""+moment(data.simtime).format("MM")+" "+moment(data.simtime).format("h")+"."+moment(data.simtime).format("mm")+" WA";
                                }

                                soyut.radiogram.Printer_PrintToPDF({
                                    panggilan: data.panggilan,
                                    jenis: data.jenis,
                                    nomor: data.nomor,
                                    derajat: data.derajat,
                                    instruksi: data.instruksi,
                                    datetime: cSendDate,
                                    sender_Name: sender.position,
                                    receiver_Name: receivers,
                                    tembusan_Name: cc,
                                    klasifikasi: data.classification.toUpperCase(),
                                    number: data.Number,
                                    tanda_dinas: data.tandadinas,
                                    group: data.group,
                                    sendername: data.senderName,
                                    senderpangkat: data.senderRank,
                                    tanda_tangan: "",
                                    alamataksi: data.alamataksi,
                                    alamattembusan: data.alamattembusan,
                                    jam: cHour,
                                    tanggal: cMinute,
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
                    });
                });
            });
        }
        
    });
}

soyut.radiogram.checkReceivers = function(selected, value, callback){
    selected.forEach(function(m){
        if(value == m){
            callback(true);
        }
    });
}

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

