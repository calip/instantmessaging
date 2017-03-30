var resizeMonitorPanel = function(el){
    $(el).parent().parent().css({width:'50vw',height:'50vw',left:'25vw', top:'15vw'});  
};

var table = $(getInstanceID('dtk-radiogram')).DataTable( {
    deferRender:    true,
    scrollY:        500,
    scrollX:        true,
    scrollCollapse: true,
    scroller:       true
} );

new $.fn.dataTable.FixedColumns( table );
    
resizeMonitorPanel('.statistic-main');