var sessionService = soyut.Services.getInstance().getService("sessionServer");
var rigService = soyut.Services.getInstance().getService("rigServer");

soyut.radiogram.renderDataRadiogram = function (rig, callback) {
    getDataRadiogram(rig).then(function (result) {
        callback(result);
    });    
};

function getDataRadiogram(rig){
    return new Promise.map(rig, function(i) {
        if(i.radiogram != '' || i.radiogram != null) {
            return getContentRadiogram(i).then(function (data) {
                return data;
            }).then(function (result) {
                return result;
            });
        }
    });
}

function getContentRadiogram(rig) {
    return new Promise (function(resolve,reject){
        soyut.radiogram.Radiogram_GetById({id: rig.radiogram}, function (e, data) {
            if (e) {
                reject(e);
            } else {
                var objData = {
                    SendTime: rig.SendTime,
                    action: rig.action,
                    description: rig.description,
                    id: rig.id,
                    message: rig.message,
                    radiogram: data,
                    rig: rig.rig,
                    scenario: rig.scenario,
                    simtime: rig.simtime,
                    status: rig.status,
                    title: rig.title,
                    type: rig.type
                };
                var dataObj = objData;
                resolve(dataObj);
            }
        });
    });
};

soyut.radiogram.renderRIG = function (callback) {
    getRIG().then(function(result) {
        var arr = []
        result.forEach(function (i) {
            if(i.radiogram != '') {
                arr.push(i);
            }
        });
        callback(arr);
    });
};

function getRIG() {
    return new Promise (function(resolve,reject){
        sessionService.Session_getScenario({id: soyut.Session.id},function(err,scenario){
            rigService.Rig_GetListByScenario({scenario: scenario}, function (e, data) {
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

var rgMap = new Map();
scenarioService.Role_getAddressList({scenario: soyut.Session.scenario.id}, function (e, data) {
    if(e){
        reject(e);
    }else{
        data.forEach(function(rg){
            rgMap.set(rg.roleGroup,rg.id);
        });
    }
});

var statRadiogram = [];
soyut.radiogram.Radiogram_GetBySession({session: soyut.Session.id}, function (e, data) {
    if(e){
        reject(e);
    }else{
        data.forEach(function(radiogram){
            statRadiogram.push(radiogram);
        });
    }
});

Vue.component('stat-list', {
    props: ['contents', 'groups'],
    template: '#stat-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        getRadiogram: function (id, radiogramid) {
            var roleId = rgMap.get(id);
            var kogas = "";
            statRadiogram.forEach(function (i) {
                if(i.parentId == radiogramid){
                    if(i.owner.id == roleId){
                        kogas += '<i class="icon-checked"></i> Terkirim : <strong>'+ moment(i.SendTime).format("DD-MM-YYYY h:mm")+'</strong><br />';//i.Number + " - " + i.owner.position;
                        kogas += '<i class="icon-envelope48"></i> Dibaca : <strong>'+ moment(i.SendTime).format("DD-MM-YYYY h:mm")+'</strong><br />';
                        kogas += '<i class="icon-reply"></i> Dibalas : <strong>'+ moment(i.SendTime).format("DD-MM-YYYY h:mm")+'</strong>';
                    }
                }
            });
            return kogas;
        }
    }
});

soyut.radiogram.renderStatKolat = function (elSelector) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<stat-list :contents="contents" :groups="groups"></stat-list>');

    soyut.radiogram.renderRIG(function (result) {
        soyut.radiogram.renderListNonDirectorRoleGroup(function(rg) {
            soyut.radiogram.renderDataRadiogram(result, function (res) {
                var vmlist = new Vue({
                    el: elSelector,
                    data: {
                        contents: res,
                        groups: rg
                    },
                    mounted: function () {
                        this.$nextTick(function () {
                            this.LoadData();
                        });
                    },
                    methods: {
                        LoadData: function () {
                            soyut.radiogram.renderTableData('.dtk-radiogram');
                        }
                    }
                });
            });
        });
    });

};

soyut.radiogram.renderTableData = function () {
    var table = $('.dtk-radiogram').DataTable({
        deferRender:    true,
        scrollY:        500,
        scrollX:        true,
        scrollCollapse: true,
        scroller:       true
    });

    new $.fn.dataTable.FixedColumns(table);
};

soyut.radiogram.resizeMonitorPanel = function(el){
    $(el).parent().parent().css({width:'50vw',height:'50vw',left:'25vw', top:'15vw'});
};

soyut.radiogram.initStatKolat = function () {
    soyut.radiogram.resizeMonitorPanel('.statistic-main');
    soyut.radiogram.renderStatKolat('.stat-list');
};

soyut.radiogram.initStatKolat();