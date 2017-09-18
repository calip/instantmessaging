(function ($) {
    var app = getAppInstance();
    var scenarioAlert = new PunkAlert();
    var activitylistener = getActivityInstanceAsync();
    activitylistener.then(function(activity) {

        var scenario = activity.params.selscenario;

        var init = function(){
            $(getInstanceID("pending-scenario")).val(scenario.id);
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

        init();

    })
})(jQuery);
