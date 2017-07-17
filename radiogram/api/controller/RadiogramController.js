const RADIOGRAM_MANAGER_TOKEN = 'radigrammanagerasdasidyiasdbbjguytuwqewqlkjjjhsad';
const RADIOGRAM_USER_TOKEN = 'radigramuserajaaspasdiniasdnasjdasdkhasdkasdj';

module.exports = {
    public: {
        GetRIGTime: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
            var title = reqMsg.data.params.title;
            r.table('Radiogram').find({title: title}).exec(function (err, result) {
                if (err) {
                    return res.json({success: false, error: "record not found"});
                    throw err;
                }
                else {
                    result.toArray(function (err, radiogram) {
                        if (err) {
                            return res.json({success: false, error: "record not found"});
                            throw err;
                        }
                        else {
                            //var tes = JSON.stringify(radiogram, null, 2);
                            //console.log("result "+ tes);
                            resCallback(false, radiogram);
                        }
                    });
                }
            })
        },
        SendRIG: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
            //var models = mongoDb.models;
            console.log(reqMsg.data.params.title)
            resCallback(false, {success: true, data: "sadasd"})
        }
    },
    restricted: {
        Draft:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var readStatus = reqMsg.data.params.readStatus;
                var owner = reqMsg.data.params.owner;
                var sender = reqMsg.data.params.sender;
                var senderWasdal = reqMsg.data.params.senderWasdal;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var session = reqMsg.data.params.session;
                var createTime = reqMsg.data.params.createTime;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').insert({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: groups,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        classification: classification,
                        author: author,
                        materi: materi,
                        Number:Number,
                        content: content,
                        readStatus: readStatus,
                        owner: owner,
                        sender: sender,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderWasdal: senderWasdal,
                        receivers: receivers,
                        kreceivers: kreceivers,
                        alsreceivers: alsreceivers,
                        cc: cc,
                        kcc: kcc,
                        alscc: alscc,
                        composeStatus: 'draft',
                        session: session,
                        SendTime: null,
                        simtime: null,
                        createTime: createTime
                    },
                    function (err, result) {
                        if (err) throw err;
                        else {
                            resCallback(false, {success: true, data: result})
                        }
                    });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        SendDraft:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var sendtime = reqMsg.data.params.sendtime;
                var simtime = reqMsg.data.params.simtime;
                var status = reqMsg.data.params.status;

                r.table('Radiogram').update({id: id}, {composeStatus: status, SendTime: sendtime, simtime: simtime}, function (err, results) {
                    if (err) resCallback(true, err);
                    else {
                        if (results.replaced > 0){
                            resCallback(false, {success: true, data: results})
                        }
                    }
                });

            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetListDraft:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var status = reqMsg.data.params.status;
                r.table('Radiogram').find({parentId: id, composeStatus: status}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        SendReceiver:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var readStatus = reqMsg.data.params.readStatus;
                var owner = reqMsg.data.params.owner;
                var sender = reqMsg.data.params.sender;
                var senderWasdal = reqMsg.data.params.senderWasdal;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var session = reqMsg.data.params.session;
                var SendTime = reqMsg.data.params.SendTime;
                var simtime = reqMsg.data.params.simtime;
                var createTime = reqMsg.data.params.createTime;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var parentId = reqMsg.data.params.parentId;
                var composeStatus = reqMsg.data.params.composeStatus;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').insert({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: groups,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        classification: classification,
                        author: author,
                        materi: materi,
                        Number:Number,
                        content: content,
                        readStatus: readStatus,
                        owner: owner,
                        sender: sender,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderWasdal: senderWasdal,
                        receivers: receivers,
                        kreceivers: kreceivers,
                        alsreceivers: alsreceivers,
                        cc: cc,
                        kcc: kcc,
                        alscc: alscc,
                        composeStatus: composeStatus,
                        session: session,
                        SendTime: SendTime,
                        simtime: simtime,
                        createTime: createTime,
                        parentId: parentId
                    },
                    function (err, result) {
                        if (err) throw err;
                        else {
                            resCallback(false, {success: true, data: result})
                        }
                    });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        Sending:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var readStatus = reqMsg.data.params.readStatus;
                var owner = reqMsg.data.params.owner;
                var sender = reqMsg.data.params.sender;
                var senderWasdal = reqMsg.data.params.senderWasdal;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var session = reqMsg.data.params.session;
                var SendTime = reqMsg.data.params.SendTime;
                var simtime = reqMsg.data.params.simtime;
                var createTime = reqMsg.data.params.createTime;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').insert({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: groups,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        classification: classification,
                        author: author,
                        materi: materi,
                        Number:Number,
                        content: content,
                        readStatus: readStatus,
                        owner: owner,
                        sender: sender,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderWasdal: senderWasdal,
                        receivers: receivers,
                        kreceivers: kreceivers,
                        alsreceivers: alsreceivers,
                        cc: cc,
                        kcc: kcc,
                        alscc: alscc,
                        composeStatus: 'sent',
                        session: session,
                        SendTime: SendTime,
                        simtime: simtime,
                        createTime: createTime
                    },
                    function (err, result) {
                        if (err) throw err;
                        else {
                            resCallback(false, {success: true, data: result})
                        }
                    });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        SendWasdal:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var readStatus = reqMsg.data.params.readStatus;
                var owner = reqMsg.data.params.owner;
                var sender = reqMsg.data.params.sender;
                var senderWasdal = reqMsg.data.params.senderWasdal;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var session = reqMsg.data.params.session;
                var SendTime = reqMsg.data.params.SendTime;
                var simtime = reqMsg.data.params.simtime;
                var createTime = reqMsg.data.params.createTime;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').insert({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: groups,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        classification: classification,
                        author: author,
                        materi: materi,
                        Number:Number,
                        content: content,
                        readStatus: readStatus,
                        owner: owner,
                        sender: sender,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderWasdal: senderWasdal,
                        receivers: receivers,
                        kreceivers: kreceivers,
                        alsreceivers: alsreceivers,
                        cc: cc,
                        kcc: kcc,
                        alscc: alscc,
                        composeStatus: 'sent',
                        session: session,
                        SendTime: SendTime,
                        simtime: simtime,
                        createTime: createTime
                    },
                    function (err, result) {
                        if (err) throw err;
                        else {
                            resCallback(false, {success: true, data: result})
                        }
                    });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]

        },
        SendReceiverWasdal:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var readStatus = reqMsg.data.params.readStatus;
                var owner = reqMsg.data.params.owner;
                var sender = reqMsg.data.params.sender;
                var senderWasdal = reqMsg.data.params.senderWasdal;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var session = reqMsg.data.params.session;
                var SendTime = reqMsg.data.params.SendTime;
                var simtime = reqMsg.data.params.simtime;
                var createTime = reqMsg.data.params.createTime;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var parentId = reqMsg.data.params.parentId;
                var composeStatus = reqMsg.data.params.composeStatus;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').insert({
                        panggilan: panggilan,
                        jenis: jenis,
                        nomor: nomor,
                        derajat: derajat,
                        instruksi: instruksi,
                        tandadinas: tandadinas,
                        group: groups,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        classification: classification,
                        author: author,
                        materi: materi,
                        Number:Number,
                        content: content,
                        readStatus: readStatus,
                        owner: owner,
                        sender: sender,
                        senderName: senderName,
                        senderRank: senderRank,
                        senderWasdal: senderWasdal,
                        receivers: receivers,
                        kreceivers: kreceivers,
                        alsreceivers: alsreceivers,
                        cc: cc,
                        kcc: kcc,
                        alscc: alscc,
                        composeStatus: composeStatus,
                        session: session,
                        SendTime: SendTime,
                        simtime: simtime,
                        createTime: createTime,
                        parentId: parentId
                    },
                    function (err, result) {
                        if (err) throw err;
                        else {
                            resCallback(false, {success: true, data: result})
                        }
                    });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]

        },
        UpdateDraft:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var panggilan = reqMsg.data.params.panggilan;
                var jenis = reqMsg.data.params.jenis;
                var nomor = reqMsg.data.params.nomor;
                var derajat = reqMsg.data.params.derajat;
                var instruksi = reqMsg.data.params.instruksi;
                var tandadinas = reqMsg.data.params.tandadinas;
                var groups = reqMsg.data.params.group;
                var classification = reqMsg.data.params.classification;
                var materi = reqMsg.data.params.materi;
                var Number = reqMsg.data.params.Number;
                var cara = reqMsg.data.params.cara;
                var paraf = reqMsg.data.params.paraf;
                var alamataksi = reqMsg.data.params.alamataksi;
                var alamattembusan = reqMsg.data.params.alamattembusan;
                var content = reqMsg.data.params.content;
                var sender = reqMsg.data.params.sender;
                var receivers = reqMsg.data.params.receivers;
                var kreceivers = reqMsg.data.params.kreceivers;
                var alsreceivers = reqMsg.data.params.alsreceivers;
                var cc = reqMsg.data.params.cc;
                var kcc = reqMsg.data.params.kcc;
                var alscc = reqMsg.data.params.alscc;
                var senderName = reqMsg.data.params.senderName;
                var senderRank = reqMsg.data.params.senderRank;
                var author = reqMsg.data.params.author;

                r.table('Radiogram').update({id: id}, {
                    panggilan: panggilan,
                    jenis: jenis,
                    nomor: nomor,
                    derajat: derajat,
                    instruksi: instruksi,
                    tandadinas: tandadinas,
                    group: groups,
                    classification: classification,
                    author: author,
                    materi: materi,
                    Number: Number,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: content,
                    sender: sender,
                    receivers: receivers,
                    kreceivers: kreceivers,
                    alsreceivers: alsreceivers,
                    cc: cc,
                    kcc: kcc,
                    alscc: alscc,
                    senderName: senderName,
                    senderRank: senderRank
                }, function (err, result) {
                    if (err) resCallback(true, err)
                    else resCallback(false, result)
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        setSendTime:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var SendTime = reqMsg.data.params.SendTime;

                r.table('Radiogram').update({id: id}, {SendTime: SendTime}, function (err, result) {
                    if (err) resCallback(true, err)
                    else resCallback(false, result)
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetByParentId:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                r.table('Radiogram').find({parentId: id}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetByRole:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                r.table('Radiogram').find({owner: id}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetInboxBySession:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var folder = reqMsg.data.params.folder;
                var session = reqMsg.data.params.session;
                r.table('Radiogram').find({session: session, composeStatus: folder}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetBySession:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var session = reqMsg.data.params.session;
                r.table('Radiogram').find({session: session}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                })
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetByFolder:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var folder = reqMsg.data.params.folder;
                r.table('Radiogram').find({composeStatus: folder}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                })
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetById:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                r.table('Radiogram').get(reqMsg.data.params.id, function (err, result) {
                    if (err) throw err;
                    resCallback(false, result);
                })
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetByTitle:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var title = reqMsg.data.params.title;
                var owner = reqMsg.data.params.owner;
                r.table('Radiogram').find({title: title, owner: owner}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                //var tes = JSON.stringify(radiogram, null, 2);
                                //console.log("result "+ tes);
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetInboxByRole:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var state = reqMsg.data.params.state;
                var field = reqMsg.data.params.field;
                var sort = reqMsg.data.params.sort;
                
                r.table('Radiogram').findOrder({owner:id, composeStatus:state}, field, sort).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetInboxByRoleGroup:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var state = reqMsg.data.params.state;
                var sender = reqMsg.data.params.sender;
                var field = reqMsg.data.params.field;
                var sort = reqMsg.data.params.sort;

                r.table('Radiogram').findOrder({owner:id, sender: sender, composeStatus:state}, field, sort).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        GetRadiogramByStatus:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var state = reqMsg.data.params.state;
                r.table('Radiogram').find({id: id, composeStatus: state}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken: [RADIOGRAM_USER_TOKEN, RADIOGRAM_MANAGER_TOKEN]
        },
        showAll:{
            method:function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                r.table('Radiogram').find({}).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, error: "record not found"});
                        throw err;
                    }
                    else {
                        result.toArray(function (err, radiogram) {
                            if (err) {
                                return res.json({success: false, error: "record not found"});
                                throw err;
                            }
                            else {
                                resCallback(false, radiogram);
                            }
                        });
                    }
                });
            },
            accessToken:[RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        delete: {
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                r.table('Radiogram').delete({id: reqMsg.data.params.id}, function (err, result) {
                    if (err) resCallback(true, err)
                    else {
                        if (result.deleted > 0)
                            resCallback(false, {success: true});
                        else
                            resCallback(true, {success: false});
                    }
                })
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        Update:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var name = reqMsg.data.params.name;

                r.table('Radiogram').update({id: id}, {name: name}, function (err, result) {
                    if (err) resCallback(true, err);
                    else {
                        if (result.replaced > 0)
                            resCallback(false, {success: true});
                        else
                            resCallback(true, {success: false});
                    }
                });
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        UpdateSender:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var sender = reqMsg.data.params.sender;

                r.table('Radiogram').update({id: id}, {sender: sender}, function (err, result) {
                    if (err) {
                        resCallback(true, err)
                    }
                    else {
                        //resCallback(false, result)
                        r.table('Radiogram').update({id: id}, {owner: sender}, function (err, owner) {
                            if (err) resCallback(true, err)
                            else resCallback(false, owner)
                        })
                    }
                });
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        UpdateReceiver:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;
                var receiver = reqMsg.data.params.receiver;

                r.table('Radiogram').update({id: id}, {receivers: receiver}, function (err, result) {
                    if (err) resCallback(true, err)
                    else resCallback(false, result)
                });
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        UpdateToTrash:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;

                r.table('Radiogram').update({id: id}, {composeStatus: 'trash'}, function (err, result) {
                    if (err) resCallback(true, err);
                    else {
                        if (result.replaced > 0)
                            resCallback(false, {success: true});
                        else
                            resCallback(true, {success: false});
                    }
                });
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        },
        UpdateReadStatus:{
            method: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
                var id = reqMsg.data.params.id;

                r.table('Radiogram').update({id: id}, {readStatus: 'read'}, function (err, result) {
                    if (err) resCallback(true, err);
                    else {
                        if (result.replaced > 0)
                            resCallback(false, {success: true});
                        else
                            resCallback(true, {success: false});
                    }
                });
            },
            accessToken: [RADIOGRAM_MANAGER_TOKEN, RADIOGRAM_USER_TOKEN]
        }
    },
    tokenList: [
        {
            name: 'radiogram-user',
            description: 'Radiogram User',
            token: RADIOGRAM_USER_TOKEN
        },
        {
            name: 'radiogram-wasdal',
            description: 'Radiogram Wasdal',
            token: RADIOGRAM_MANAGER_TOKEN
        }
    ]
};