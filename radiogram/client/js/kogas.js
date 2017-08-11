var scenarioService = soyut.Services.getInstance().getService("scenarioServer");
var sessionService = soyut.Services.getInstance().getService("sessionServer");

soyut.radiogram.renderKogasContent = function(){
    $(getInstanceID("menu-monitor")).click(function (event) {
        $('.content-kogas').children().removeClass("active");

        $(".menu-kogas").children().removeClass("active");
        $(".menu-monitor").parent().addClass("active");
        
        soyut.radiogram.renderKogasDetailContent(".content-kogas", "monitor");
    });
    $(getInstanceID("menu-log")).click(function (event) {
        $('.content-kogas').children().removeClass("active");

        $(".menu-kogas").children().removeClass("active");
        $(".menu-log").parent().addClass("active");
        
        soyut.radiogram.renderKogasDetailContent(".content-kogas", "log");
    });
}

soyut.radiogram.renderKogasDetailContent = function(elSelector, value){
    if(value == "log"){
        soyut.radiogram.renderKogasLog(elSelector);
    }
}


Vue.component('data-log', {
    name: 'data-log',
    template: '<table class="table-log display table table-striped table-bordered table-hover log-datatable" cellspacing="0" width="100%" id="log-datatable"></table>',
    props: ['logs'],
    data: function () {
        return {data: []};
    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.DataTable.fnClearTable();
                this.DataTable.fnAddData(val);
            },
            deep: true
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.DataTable = $('.table-log').dataTable({
                data: this.logs,
                columns: [
                    {
                        title: 'No',
                        mData: 'no',
                        width: '2%'
                    },
                    {
                        title: 'Nomor Radiogram',
                        mData: 'radiogram',
                        width: '20%'
                    },
                    {
                        title: 'Pelaku',
                        mData: 'user',
                        width: '43%'
                    },
                    {
                        title: 'Aksi',
                        mData: 'action',
                        width: '20%'
                    },
                    {
                        title: 'Waktu',
                        mData: 'time',
                        width: '15%'
                    }
                ]
            });
        })
    }
});

soyut.radiogram.renderKogasLog = function (elSelector) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<data-log :logs="logs"></data-log>');

    soyut.radiogram.Log_GetAllLog({scenario: soyut.Session.scenario.id, field:'time', sort:'desc'}, function (err, data) {
        var arrValue = [];
        var no = 0;
        data.forEach(function (i) {
            no++;
            var labelstatus = '';
            var iconstatus = '';
            var textstatus = '';
            if(i.actions == "create"){
                labelstatus = 'label-primary';
                iconstatus = 'icon-email26';
                textstatus = 'Membuat'
            }
            else if(i.actions == "edit"){
                labelstatus = 'label-warning';
                iconstatus = 'icon-edit';
                textstatus = 'Mengedit'
            }
            else if(i.actions == "view"){
                labelstatus = 'label-info';
                iconstatus = 'icon-eye';
                textstatus = 'Melihat'
            }
            else if(i.actions == "sent"){
                labelstatus = 'label-success';
                iconstatus = 'icon-email147';
                textstatus = 'Mengirim'
            }
            else if(i.actions == "read"){
                labelstatus = 'label-default';
                iconstatus = 'icon-mail45';
                textstatus = 'Membaca'
            }
            else if(i.actions == "delete"){
                labelstatus = 'label-danger';
                iconstatus = 'icon-delete121';
                textstatus = 'Menghapus'
            }
            var dataVal = {
                'no': no,
                'radiogram': i.radiogram,
                'user': i.user,
                'action': '<span class="label '+ labelstatus +'"><i class="'+iconstatus+'"></i> '+textstatus+'</span>',
                'time': moment(i.time).format("DD-MM-YYYY h:mm")
            };
            arrValue.push(dataVal);
        });
        var vm = new Vue({
            el: elSelector,
            data: {
                logs: arrValue
            },
            methods: {}
        });
    });
};

soyut.radiogram.ReloadKogasLog = function () {
    var table = $('.table-log').dataTable();

    soyut.radiogram.Log_GetAllLog({scenario: soyut.Session.scenario.id, field:'time', sort:'desc'}, function (err, data) {
        var arrValue = [];
        var no = 0;
        data.forEach(function (i) {
            no++;
            if(i.actions == "create"){
                labelstatus = 'label-primary';
                iconstatus = 'icon-email26';
                textstatus = 'Membuat'
            }
            else if(i.actions == "edit"){
                labelstatus = 'label-warning';
                iconstatus = 'icon-edit';
                textstatus = 'Mengedit'
            }
            else if(i.actions == "view"){
                labelstatus = 'label-info';
                iconstatus = 'icon-eye';
                textstatus = 'Melihat'
            }
            else if(i.actions == "sent"){
                labelstatus = 'label-success';
                iconstatus = 'icon-email147';
                textstatus = 'Mengirim'
            }
            else if(i.actions == "read"){
                labelstatus = 'label-default';
                iconstatus = 'icon-mail45';
                textstatus = 'Membaca'
            }
            else if(i.actions == "delete"){
                labelstatus = 'label-danger';
                iconstatus = 'icon-delete121';
                textstatus = 'Menghapus'
            }
            var dataVal = {
                'no': no,
                'radiogram': i.radiogram,
                'user': i.user,
                'action': '<span class="label '+ labelstatus +'"><i class="'+iconstatus+'"></i> '+textstatus+'</span>',
                'time': moment(i.time).format("DD-MM-YYYY h:mm")
            };
            arrValue.push(dataVal);
        });
        table.fnClearTable();
        table.fnAddData(arrValue);
        table.fnDraw();
    });
};

soyut.radiogram.initKogas = function(){
    //soyut.radiogramkogas.renderCurrentUser();
    //soyut.radiogram.renderKogasContent();
    soyut.radiogram.renderKogasDetailContent(".content-kogas", "log");
};

soyut.radiogram.initKogas();