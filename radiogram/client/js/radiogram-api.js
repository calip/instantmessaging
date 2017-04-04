soyut.radiogram = soyut.radiogram || soyut.Services.getInstance().getService("radiogramServer");
var socket = io.connect('https://'+ soyut.radiogram.origin);
var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

if (Promise.promisifyAll) {
    Promise.promisifyAll(soyut.radiogram);
}

socket.on('new_radiogram', function (data) {
    if(soyut.Session.role.isWASDAL){
        getListVRole(soyut.Session.role.scenario).then(function(result) {
            result.forEach(function(i){
                if(data.new_val.owner == i.id){
                    console.log(i.position+" notification "+i.id)
                    if(data.new_val.composeStatus == 'inbox'){
                        SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
            
                        soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
                    }
                }
            });
        });
    }
    else{
        scenarioService.Role_getRoleByGroup({roleGroup: soyut.Session.role.roleGroup}, function(err,res) {
            res.forEach(function(i){
                if(i.isAddress){
                    if(data.new_val.owner == i.id){
                        console.log(i.position+" notification "+i.id)

                        if(data.new_val.composeStatus == 'inbox'){
                            SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
                
                            soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
                        }
                    }
                }
            });
        });

        // data.new_val.receivers.forEach(function(i){
        //     console.log(i)
        //     if(soyut.Session.role.id == i){
        //         if(data.new_val.composeStatus == 'inbox'){
        //             SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
        
        //             soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
        //         }
        //     }  
        // });
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
            })
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

soyut.radiogram.renderUserDetail = function (id, callback) {
    getKey(id).then(function(result) {
        if (result.hasOwnProperty('user')) {
            soyut.user.getUserByIdAsync(result.user).then(function (user) {
                callback(user)
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
        //var reclock = '2017-04-02T17:39:30.804Z';
        soyut.clock.getCurrentActualTime({}, function(err, reclock){
            params.receivers.forEach(function(i){
                if(i == "0"){
                    result.forEach(function(m){
                        listReceiver.push(m.id);
                    });
                }
            });
            //console.log(listRcp[1])
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
                    SendTime: reclock,
                    simtime: null,
                    createTime: reclock,
                    parentId: null,
                    composeStatus: 'inbox'
                }, function (err, res) {
                    if (!err) {
                    }
                });
            });
            // listRcp.forEach(function(rcp){
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
                        SendTime: reclock,
                        simtime: null,
                        createTime: reclock,
                        parentId: null,
                        composeStatus: 'inbox'
                    }, function (err, res) {
                        if (!err) {
                        }
                    });
                }
            // });
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
                        SendTime: reclock,
                        simtime: null,
                        createTime: reclock,
                        parentId: null,
                        composeStatus: 'inbox'
                    }, function (err, res) {
                        if (!err) {
                        }
                    });
                });
            //     listTembusan.forEach(function(lrcp){
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
                            SendTime: reclock,
                            simtime: null,
                            createTime: reclock,
                            parentId: null,
                            composeStatus: 'inbox'
                        }, function (err, res) {
                            if (!err) {
                            }
                        });
                    }
            //     });
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
                SendTime: reclock,
                simtime: null,
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

soyut.radiogram.SendRadiogram = function (params, callback) {
    var listRcp = [];
    listRcp = params.receivers;
    var listTembusan = [];
    listTembusan = params.cc;
    
    var listReceiver = [];
    var listCC = [];
    //var reclock = '2017-04-02T17:39:30.804Z';
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
                composeStatus: 'inbox',
                SendTime: reclock,
                simtime: null,
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
            SendTime: reclock,
            simtime: null,
            createTime: reclock
        }, function (err, results) {
            if (!err) {
                callback(results.data.generated_keys[0]);
            }
        });
    });
}

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
                SendTime: reclock,
                simtime: null,
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
                            SendTime: reclock,
                            simtime: null,
                            createTime: reclock,
                            parentId: parentId,
                            composeStatus: 'pending'
                        }, function (err, res) {
                            if (!err) {
                            }
                        });
                    });
                    listRcp.forEach(function(rcp){
                        if(rcp != '0'){
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
                                owner: rcp,
                                sender: params.sender,
                                receivers: params.receivers,
                                senderWasdal: soyut.Session.role.isWASDAL,
                                cc: params.cc,
                                session: soyut.Session.id,
                                senderName: params.senderName,
                                SendTime: reclock,
                                simtime: null,
                                createTime: reclock,
                                parentId: parentId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        }
                    });
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
                                SendTime: reclock,
                                simtime: null,
                                createTime: reclock,
                                parentId: parentId,
                                composeStatus: 'pending'
                            }, function (err, res) {
                                if (!err) {
                                }
                            });
                        });
                        listTembusan.forEach(function(lrcp){
                            if(lrcp != "0"){
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
                                    owner: lrcp,
                                    sender: params.sender,
                                    receivers: params.receivers,
                                    senderWasdal: soyut.Session.role.isWASDAL,
                                    cc: params.cc,
                                    session: soyut.Session.id,
                                    senderName: params.senderName,
                                    SendTime: reclock,
                                    simtime: null,
                                    createTime: reclock,
                                    parentId: parentId,
                                    composeStatus: 'pending'
                                }, function (err, res) {
                                    if (!err) {
                                    }
                                });
                            }
                        });
                    }
                    callback("success");
                }
            });
        });
    });
}

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
            SendTime: reclock,
            simtime: null,
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
                    soyut.radiogram.Radiogram_SendDraft({id: i.id, sendtime: reclock, status: 'inbox'}, function(err,res) {
                    });
                });
                soyut.radiogram.Radiogram_SendDraft({id: res.id, sendtime: reclock, status: 'sent'}, function(err,results) {
                    callback("success");
                });
            });
        });
    });
}

