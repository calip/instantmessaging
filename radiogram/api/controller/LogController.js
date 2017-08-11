module.exports = {
    public: {
        GetAllLog: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
            var scenario = reqMsg.data.params.scenario;
            var field = reqMsg.data.params.field;
            var sort = reqMsg.data.params.sort;

            r.table('Log').findOrder({scenario:scenario}, field, sort).exec(function (err, result) {
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
        GetLogById: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
            r.table('Log').get(reqMsg.data.params.id, function (err, result) {
                if (err) throw err;
                resCallback(false, result);
            });
        },
        CreateLog: function (authServerUrl, remoteSocket, reqMsg, resCallback) {
            var radiogram = reqMsg.data.params.radiogram;
            var actions = reqMsg.data.params.actions;
            var user = reqMsg.data.params.user;
            var time = reqMsg.data.params.time;
            var scenario = reqMsg.data.params.scenario;

            r.table('Log').insert({
                radiogram: radiogram,
                actions: actions,
                user: user,
                time: time,
                scenario: scenario
            }, function (err, result) {
                if (err) throw err;
                else {
                    resCallback(false, result);
                }
            });
        },
        DeleteLog: function(authServerUrl, remoteSocket, reqMsg, resCallback){
            r.table('Log').delete({id: reqMsg.data.params.id}, function (err, result) {
                if (err) resCallback(true, err)
                else {
                    if (result.deleted > 0)
                        resCallback(false, {success: true});
                    else
                        resCallback(true, {success: false});
                }
            });
        }
    },
    restricted: {

    }
};