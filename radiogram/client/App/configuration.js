(function ($) {
    var app = getAppInstance();
    var scenarioAlert = new PunkAlert();
    var activitylistener = getActivityInstanceAsync();
    activitylistener.then(function(activity) {

        var scenario = activity.params.selscenario;

        var init = function(){
            $(getInstanceID("pending-scenario")).val(scenario.id);
            $(getInstanceID("active-scenario")).val(scenario.id);
            soyut.radiogram.Radiogram_GetPending({scenario: scenario.id, field: null, sort: null, skip: null, limit: null}, function (err, value) {
                if(value.length != 0){
                    $(getInstanceID("pending-id")).val(value[0].id);
                    $(getInstanceID("pending-status")).find("option").each(function () {
                        if ($(this).val() == value[0].pending.toString()) {                    
                            $(this).prop("selected", "selected");
                        }
                    });
                }
                else{
                    $(getInstanceID("pending-id")).val('');
                }
            });
            
            soyut.radiogram.Radiogram_GetTeam({scenario: scenario.id, field: null, sort: null, skip: null, limit: null}, function (err, value) {
                if(value.length != 0){
                    $(getInstanceID("team-id")).val(value[0].id);
                }
                else{
                    $(getInstanceID("team-id")).val('');
                }
            });
        }

        $(getInstanceID('pending-save')).click(function (e) {
            console.log("Save clicked!");

            var created = $(getInstanceID('pending-id')).val();
            var scenario = $(getInstanceID('pending-scenario')).val();
            var status = $(getInstanceID('pending-status')).val();
            var curstatus = (status === "true");

            if(created != ''){
                soyut.radiogram.Radiogram_UpdatePending({
                    id: created,
                    pending: curstatus,
                }, function (err, msg) {
                    console.log(msg);
                    if (!err) {
                        activity.window.close();
                    }
                });
            }
            else{
                soyut.radiogram.Radiogram_CreatePending({
                    pending: curstatus,
                    scenario: scenario
                }, function (err, msg) {
                    console.log(msg);
                    if (!err) {
                        activity.window.close();
                    }
                });
            }
            
        });
        
        $(getInstanceID('team-save')).click(function (e) {
            console.log("Save clicked!");

            var team_id = $(getInstanceID('team-id')).val();
            var team_color = $(getInstanceID('team-color')).val();
            var team_name = $(getInstanceID('team-name')).val();
            var scenario = $(getInstanceID('pending-scenario')).val();
            
            
            if(team_id != ''){
                soyut.radiogram.Radiogram_UpdateTeam({
                    id: team_id,
                    name: team_name,
                    color: team_color
                }, function (err, msg) {
                    console.log(msg);
                    if (!err) {
                        activity.window.close();
                    }
                });
            }
            else{
                soyut.radiogram.Radiogram_CreateTeam({
                    name: team_name,
                    color: team_color,
                    scenario: scenario
                }, function (err, msg) {
                    console.log(msg);
                    if (!err) {
                        activity.window.close();
                    }
                });
            }
            
        });
        
        $(getInstanceID('clear-save')).click(function (e) {
            console.log("Clear clicked!");
            
            var session = soyut.Session.id;
            var status = $(getInstanceID('scenario-status')).val();
            
            function handleOkButton() {
                console.log('Data Warning, delete semua Rig dan Radiogram');
                   soyut.radiogram.Radiogram_ClearRadiogram({session: session}, function (err, value) {
                    if(value.length != 0){
                        value.forEach(function(i){
                            if(i.composeStatus !== 'pending' && i.composeStatus !== 'group'){
                                soyut.radiogram.Radiogram_delete({id: i.id}, function (err, deldata) {
                                    if (!err) {
                                        soyut.rig.Rig_DeleteRadiogramList({id: i.parentId}, function (e, data) {
                                            if(!e){
                                                activity.window.close();        
                                            }
                                            else {
                                                activity.window.close();
                                            }
                                        });
                                        
                                    }
                                });
                                
                            }
                        })
                    }
                });
            }
            function handleCancelButton() {
                console.log('Rig dan radiogram delete cancelled');
            }
        
            function handleCloseButton() {
                console.log('Rig dan radiogram box closed');
            }
            scenarioAlert.Alert('Anda yakin untuk menghapus semua data RIG dan radiogram ?', true)
                .OnClose(handleCloseButton)
                .OnCancelButton(handleCancelButton)
                .OnOkButton(handleOkButton.bind(this));
        
            
            
        });
        
        init();

    })
})(jQuery);
