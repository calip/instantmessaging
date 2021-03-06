var soyutSession = soyut.Session;
var roleName = soyut.Session.role;
var fontSize = '24px';

soyut.radiogram.sidebarHandler = function() {
    var $html = $('html'), $win = $(window), wrap = $('.app-aside'), MEDIAQUERY = {}, app = $('.wdl-app');
    var eventObject = isTouch() ? 'click' : 'mouseenter', elem = $('.sidebar'), ul = "", menuTitle, _this, sidebarMobileToggler = $('.sidebar-mobile-toggler'), $winOffsetTop = 0, $winScrollTop = 0, $appWidth;

    elem.on('click', 'a', function(e) {

        _this = $(this);
        if (isSidebarClosed() && !isSmallDevice() && !_this.closest("ul").hasClass("sub-menu"))
            return;

        _this.closest("ul").find(".open").not(".active").children("ul").not(_this.next()).slideUp(200).parent('.open').removeClass("open");
        if (_this.next().is('ul') && _this.parent().toggleClass('open')) {

            _this.next().slideToggle(200, function() {
                $win.trigger("resize");

            });
            e.stopPropagation();
            e.preventDefault();
        } else {
            //_this.parent().addClass("active");

        }
    });
    elem.on(eventObject, 'a', function(e) {
        if (!isSidebarClosed() || isSmallDevice())
            return;
        _this = $(this);

        if (!_this.parent().hasClass('hover') && !_this.closest("ul").hasClass("sub-menu")) {
            wrapLeave();
            _this.parent().addClass('hover');
            menuTitle = _this.find(".item-inner").clone();
            if (_this.parent().hasClass('active')) {
                menuTitle.addClass("active");
            }
            var offset = $(".sidebar").position().top;
            var itemTop = isSidebarFixed() ? _this.parent().position().top + offset : (_this.parent().position().top);
            menuTitle.css({
                position : isSidebarFixed() ? 'fixed' : 'absolute',
                height : _this.outerHeight(),
                top : itemTop
            }).appendTo(wrap);
            if (_this.next().is('ul')) {
                ul = _this.next().clone(true);

                ul.appendTo(wrap).css({
                    top : itemTop + _this.outerHeight(),
                    position : isSidebarFixed() ? 'fixed' : 'absolute',
                });
                if (_this.parent().position().top + _this.outerHeight() + offset + ul.height() > $win.height() && isSidebarFixed()) {
                    ul.css('bottom', 0);
                } else {
                    ul.css('bottom', 'auto');
                }

                wrap.children().first().scroll(function() {
                    if (isSidebarFixed())
                        wrapLeave();
                });

                setTimeout(function() {

                    if (!wrap.is(':empty')) {
                        $(document).on('click tap', wrapLeave);
                    }
                }, 300);

            } else {
                ul = "";
                return;
            }

        }
    });
    wrap.on('mouseleave', function(e) {
        $(document).off('click tap', wrapLeave);
        $('.hover', wrap).removeClass('hover');
        $('> .item-inner', wrap).remove();
        $('> ul', wrap).remove();

    });

    sidebarMobileToggler.on('click', function() {

        $winScrollTop = $winOffsetTop;
        if (!$('.wdl-app').hasClass('app-slide-off') && !$('.wdl-app').hasClass('app-offsidebar-open')) {
            $winOffsetTop = $win.scrollTop();
            $winScrollTop = 0;
            $('footer').hide();
            $appWidth = $('.wdl-app .main-content').innerWidth();
            $('.wdl-app .main-content').css({
                position : 'absolute',
                top : -$winOffsetTop,
                width : $appWidth
            });
        } else {
            resetSidebar();
        }

    });

    $(document).on("mousedown touchstart", function(e) {
        if (elem.has(e.target).length === 0 && !elem.is(e.target) && !sidebarMobileToggler.is(e.target) && ($('.wdl-app').hasClass('app-slide-off') || $('.wdl-app').hasClass('app-offsidebar-open'))) {
            resetSidebar();
        }
    });

    var resetSidebar = function() {
        $winScrollTop = $winOffsetTop;
        $(".wdl-app .app-content").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {

            if (!$('.wdl-app').hasClass('app-slide-off') && !$('.wdl-app').hasClass('app-offsidebar-open')) {
                $('.wdl-app .main-content').css({
                    position : 'relative',
                    top : 'auto',
                    width : 'auto'
                });

                window.scrollTo(0, $winScrollTop);
                $('footer').show();
                $(".wdl-app .app-content").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            }

        });
    };

    function wrapLeave() {
        wrap.trigger('mouseleave');
    }

    function isTouch() {
        return $html.hasClass('touch');
    }

    function isSmallDevice() {
        return $win.width() < MEDIAQUERY.desktop;
    }

    function isLargeDevice() {
        return $win.width() >= MEDIAQUERY.desktop;
    }

    function isSidebarClosed() {
        return $('.app-sidebar-closed').length;
    }

    function isSidebarFixed() {
        return $('.app-sidebar-fixed').length;
    }
};

soyut.radiogram.perfectScrollbarHandler = function () {
    var pScroll = $(".perfect-scrollbar");

    if (!soyut.radiogram.isMobile() && pScroll.length) {
        pScroll.perfectScrollbar({
            suppressScrollX : true
        });
        pScroll.on("mousemove", function() {
            $(this).perfectScrollbar('update');
        });
    }
};

soyut.radiogram.messageHeightHandler = function() {
    var $win = $(window);
    var page = $win;
    if(page.innerHeight() < $win.innerHeight()) {
        page = $(document);
    }
    var pageHeight = page.innerHeight() - $('header').outerHeight();
    $(".wrap-messages").css({
        height: pageHeight
    });

};
// Window Resize Function
soyut.radiogram.resizeHandler = function(func, threshold, execAsap) {
    $(window).resize(function() {
        soyut.radiogram.messageHeightHandler();
    });
};

soyut.radiogram.isMobile = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

var vmlist;

Vue.filter('truncate', function (value) {
    var length = 50;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

Vue.filter('fromfilter', function (receiver, sender, status) {
    var length = 12;
    var value = '';
    if(status == 'inbox'){
        value = sender;
    }
    else {
        value = receiver;
    }

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

Vue.filter('stringtime', function (time) {
    var stringTime = "";
    if (time != null) {
        stringTime = moment(time).format("DD") + '-' + moment(time).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(time).format("YYYY")) + ' ' + moment(time).format("hh") + ':' + moment(time).format("mm");
    }
    else {
        stringTime = "-";
    }
    return stringTime;
});

Vue.filter('wstime', function (sendTime, createTime, status) {
    var stringTime = '';
    if(status == 'draft' || status == 'trash'){
        stringTime = 'dibuat ' + moment(createTime).format("DD-MM-YYYY h:mm");
    }
    else {
        stringTime = 'ws ' + moment(sendTime).format("DD-MM-YYYY h:mm");
    }
    return stringTime;
});

Vue.filter('watime', function (simTime, status) {
    var stringTime = '';
    if(simTime != null) {
        var getRealTime = moment(simTime).format("DD") + '-' + moment(simTime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(simTime).format("YYYY")) + ' ' + moment(simTime).format("hh") + ':' + moment(simTime).format("mm");
        if (status != 'draft' || status != 'trash') {
            stringTime = 'wa ' + getRealTime;
        }
        return stringTime;
    }
});

Vue.filter('stringuppercase', function (value) {
    var stringTime = value.toUpperCase();
    return stringTime;
});

soyut.radiogram.renderContent = function () {
    $('.wdl-main .wdl-sidebar > div nav > ul li > a').css({"font-size": fontSize});
    $('.wdl-sidebar > div nav > div > ul li > a').css({"font-size": fontSize});
    $('.button-o').css({"font-size": fontSize});

    $(".btn-font-size").click(function (event) {
        var id = $(this).attr("data-id");
        var fontsize = '14px';

        if(id == 0){
            fontsize = '14px';
        }
        else if(id == 1){
            fontsize = '18px';
        }
        else if(id == 2){
            fontsize = '24px';
        }
        $('.wdl-main .wdl-sidebar > div nav > ul li > a').css({"font-size": fontsize});
        $('.wdl-sidebar > div nav > div > ul li > a').css({"font-size": fontsize});
        $('.button-o').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-content').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-subject').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-from').css({"font-size": fontsize});
        $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontsize});
        $('.btn').css({"font-size": fontsize});
    });

    $(getInstanceID("wdl-nav-inbox")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
        $(".wdl-folders").children().removeClass("active");
        $(".wdl-folders").children().removeClass("open");

        soyut.radiogram.renderInbox();
    });

    $(getInstanceID("wdl-nav-sent")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
        $(".wdl-folders").children().removeClass("active");
        $(".wdl-folders").children().removeClass("open");

        soyut.radiogram.renderSent();
    });

    $(getInstanceID("wdl-nav-draft")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
        $(".wdl-folders").children().removeClass("active");
        $(".wdl-folders").children().removeClass("open");

        soyut.radiogram.renderDraft();
    });

    $(getInstanceID("wdl-nav-trash")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
        $(".wdl-folders").children().removeClass("active");
        $(".wdl-folders").children().removeClass("open");

        soyut.radiogram.renderTrash();
    });

    $(getInstanceID("wdl-nav-compose")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
        $(".wdl-folders").children().removeClass("active");
        $(".wdl-folders").children().removeClass("open");

        soyut.radiogram.renderCompose('','');

        // $(getInstanceID("primary-column")).removeClass('col-md-12');
        // $(getInstanceID("secondary-column")).removeClass('col-md-12');
        // $(getInstanceID("secondary-column")).removeClass('hide');
        // $(getInstanceID("primary-column")).addClass('col-md-6');
        // $(getInstanceID("secondary-column")).addClass('col-md-6');
    });

    $(getInstanceID("btnSubmitMessage")).click(function (event) {
        var editId = $(getInstanceID("editId")).val();
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        var materi = $("input:checkbox[name=checkbox-materi]:checked");
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();
        var refsender = $(getInstanceID("ref_sender")).val();

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error += "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error += "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error += "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error += "";
        }

        if(error != ""){
            return false;
        }
        else {
            var arrMateri = [];
            materi.each(function(){
                arrMateri.push($(this).val());
            });

            if(roleName.isWASDAL){
                var vroleRcv = [];
                var roleRcv = [];
                var alsRcv = [];

                var vroleCc = [];
                var roleCc = [];
                var alsCc = [];

                if(receiverRole != null) {
                    receiverRole.forEach(function (i) {
                        var mi = i.split(":");
                        if (mi[1] == "vrole") {
                            vroleRcv.push(mi[0]);
                        }
                        else if (mi[1] == 'role') {
                            roleRcv.push(mi[0]);
                        }
                        else {
                            alsRcv.push(mi[0]);
                        }
                    });
                }

                if(tembusan != null) {
                    tembusan.forEach(function (i) {
                        var mi = i.split(":");
                        if (mi[1] == "vrole") {
                            vroleCc.push(mi[0]);
                        }
                        else if (mi[1] == 'role') {
                            roleCc.push(mi[0]);
                        }
                        else {
                            alsCc.push(mi[0]);
                        }
                    });
                }

                var objReceiver = [];
                var objTembusan = [];

                soyut.radiogram.renderSenderObj(senderRole, true, function (sender) {
                    soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                        soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                            soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                    soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                        soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                            soyut.radiogram.renderListKolatReceiver(function (owner) {

                                                objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                var arrAliasRcv = [];
                                                alsreceivers.forEach(function (i) {
                                                    arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                });

                                                var arrVroleRcv = [];
                                                vroleReceivers.forEach(function (i) {
                                                    arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                });

                                                var arrRoleRcv = [];
                                                roleReceivers.forEach(function (i) {
                                                    arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                });

                                                var arrAliasCc = [];
                                                alsTembusan.forEach(function (i) {
                                                    arrAliasCc = arrAliasCc + i.position + ", ";
                                                });

                                                var arrVroleCc = [];
                                                vroleTembusan.forEach(function (i) {
                                                    arrVroleCc = arrVroleCc + i.position + ", ";
                                                });

                                                var arrRoleCc = [];
                                                roleTembusan.forEach(function (i) {
                                                    arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                });

                                                var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                soyut.radiogram.SendWasdalRadiogram({
                                                    panggilan: panggilan,
                                                    jenis: jenis,
                                                    nomor: nomor,
                                                    derajat: derajat,
                                                    instruksi: instruksi,
                                                    tandadinas: tandadinas,
                                                    group: group,
                                                    classification: klasifikasi,
                                                    materi: arrMateri,
                                                    approved: [],
                                                    Number: no,
                                                    cara: cara,
                                                    paraf: paraf,
                                                    alamataksi: alamataksi,
                                                    alamattembusan: alamattembusan,
                                                    content: message,
                                                    readStatus: 'unread',
                                                    sender: sender,
                                                    senderDetail: sender.position,
                                                    receivers: objReceiver,
                                                    receiverDetail: curReceiver,
                                                    cc: objTembusan,
                                                    ccDetail: curCc,
                                                    owner: owner,
                                                    senderName: senderName,
                                                    senderRank: senderRank,
                                                    refsender: refsender,
                                                    author: roleName.position
                                                },function(res){
                                                    soyut.radiogram.clearInput();
                                                    soyut.radiogram.AddRIGRadiogram(res);

                                                    $(getInstanceID("wdl-email-content")).addClass('disable');
                                                    $(getInstanceID("wdl-email-form")).addClass('disable');
                                                    $(getInstanceID("wdl-email-view")).addClass('disable');
                                                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                                                    soyut.radiogram.renderSendingResult('.email-result', res);
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else {
                var vroleRcv = [];
                var roleRcv = [];
                var alsRcv = [];

                var vroleCc = [];
                var roleCc = [];
                var alsCc = [];

                if(receiverRole != null) {
                    receiverRole.forEach(function (i) {
                        var mi = i.split(":");
                        if (mi[1] == "vrole") {
                            vroleRcv.push(mi[0]);
                        }
                        else if (mi[1] == 'role') {
                            roleRcv.push(mi[0]);
                        }
                        else {
                            alsRcv.push(mi[0]);
                        }
                    });
                }

                if(tembusan != null) {
                    tembusan.forEach(function (i) {
                        var mi = i.split(":");
                        if (mi[1] == "vrole") {
                            vroleCc.push(mi[0]);
                        }
                        else if (mi[1] == 'role') {
                            roleCc.push(mi[0]);
                        }
                        else {
                            alsCc.push(mi[0]);
                        }
                    });
                }

                var objReceiver = [];
                var objTembusan = [];

                var arAuthor = ''
                if(roleName.isSet){
                    arAuthor = '';
                }
                else {
                    arAuthor = roleName.position;
                }

                soyut.radiogram.renderSenderObj(senderRole, false, function (sender) {
                    soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                        soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                            soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                    soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                        soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                            soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {

                                                objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                var arrAliasRcv = [];
                                                alsreceivers.forEach(function (i) {
                                                    arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                });

                                                var arrVroleRcv = [];
                                                vroleReceivers.forEach(function (i) {
                                                    arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                });

                                                var arrRoleRcv = [];
                                                roleReceivers.forEach(function (i) {
                                                    arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                });

                                                var arrAliasCc = [];
                                                alsTembusan.forEach(function (i) {
                                                    arrAliasCc = arrAliasCc + i.position + ", ";
                                                });

                                                var arrVroleCc = [];
                                                vroleTembusan.forEach(function (i) {
                                                    arrVroleCc = arrVroleCc + i.position + ", ";
                                                });

                                                var arrRoleCc = [];
                                                roleTembusan.forEach(function (i) {
                                                    arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                });

                                                var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                soyut.radiogram.SendRadiogram({
                                                    panggilan: panggilan,
                                                    jenis: jenis,
                                                    nomor: nomor,
                                                    derajat: derajat,
                                                    instruksi: instruksi,
                                                    tandadinas: tandadinas,
                                                    group: group,
                                                    classification: klasifikasi,
                                                    materi: arrMateri,
                                                    approved: [],
                                                    Number: no,
                                                    cara: cara,
                                                    paraf: paraf,
                                                    alamataksi: alamataksi,
                                                    alamattembusan: alamattembusan,
                                                    content: message,
                                                    readStatus: 'unread',
                                                    sender: sender,
                                                    senderDetail: sender.position +" ("+ sender.groupName +")",
                                                    receivers: objReceiver,
                                                    receiverDetail: curReceiver,
                                                    cc: objTembusan,
                                                    ccDetail: curCc,
                                                    owner: owner,
                                                    senderName: senderName,
                                                    senderRank: senderRank,
                                                    refsender: refsender,
                                                    author: roleName.position
                                                },function(res){
                                                    soyut.radiogram.clearInput();

                                                    $(getInstanceID("wdl-email-content")).addClass('disable');
                                                    $(getInstanceID("wdl-email-form")).addClass('disable');
                                                    $(getInstanceID("wdl-email-view")).addClass('disable');
                                                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                                                    soyut.radiogram.renderSendingResult('.email-result', res);
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        }
    });

    $(getInstanceID("btnSaveMessage")).click(function (event) {
        var editId = $(getInstanceID("editId")).val();
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        var materi = $("input:checkbox[name=checkbox-materi]:checked");
        var approval = $("input:checkbox[name=checkbox-approval]:checked");
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var senderRank = $(getInstanceID("sender-pangkat")).val();
        var senderSignature = $(getInstanceID("signature")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();
        var refauthor = $(getInstanceID("refauthor")).val();

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error += "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error += "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error += "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error += "";
        }

        if(error != ""){
            return false;
        }
        else {
            var arrMateri = [];
            materi.each(function(){
                arrMateri.push($(this).val());
            });
            var arrApproval = [];
            approval.each(function(){
                arrApproval.push($(this).val());
            });

            if(editId == null || editId == "") {
                if (roleName.isWASDAL) {
                    var vroleRcv = [];
                    var roleRcv = [];
                    var alsRcv = [];

                    var vroleCc = [];
                    var roleCc = [];
                    var alsCc = [];

                    if(receiverRole != null) {
                        receiverRole.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleRcv.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleRcv.push(mi[0]);
                            }
                            else {
                                alsRcv.push(mi[0]);
                            }
                        });
                    }

                    if(tembusan != null) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleCc.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleCc.push(mi[0]);
                            }
                            else {
                                alsCc.push(mi[0]);
                            }
                        });
                    }

                    var objReceiver = [];
                    var objTembusan = [];

                    soyut.radiogram.renderSenderObj(senderRole, true, function (sender) {
                        soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                            soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                                soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                    soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                        soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                            soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                                soyut.radiogram.renderListKolatReceiver(function (owner) {

                                                    objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                    objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                    var arrAliasRcv = [];
                                                    alsreceivers.forEach(function (i) {
                                                        arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                    });

                                                    var arrVroleRcv = [];
                                                    vroleReceivers.forEach(function (i) {
                                                        arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                    });

                                                    var arrRoleRcv = [];
                                                    roleReceivers.forEach(function (i) {
                                                        arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                    });

                                                    var arrAliasCc = [];
                                                    alsTembusan.forEach(function (i) {
                                                        arrAliasCc = arrAliasCc + i.position + ", ";
                                                    });

                                                    var arrVroleCc = [];
                                                    vroleTembusan.forEach(function (i) {
                                                        arrVroleCc = arrVroleCc + i.position + ", ";
                                                    });

                                                    var arrRoleCc = [];
                                                    roleTembusan.forEach(function (i) {
                                                        arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                    });

                                                    var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                    var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                    soyut.radiogram.DraftWasdalRadiogram({
                                                        panggilan: panggilan,
                                                        jenis: jenis,
                                                        nomor: nomor,
                                                        derajat: derajat,
                                                        instruksi: instruksi,
                                                        tandadinas: tandadinas,
                                                        group: group,
                                                        classification: klasifikasi,
                                                        materi: arrMateri,
                                                        approved: arrApproval,
                                                        Number: no,
                                                        cara: cara,
                                                        paraf: paraf,
                                                        alamataksi: alamataksi,
                                                        alamattembusan: alamattembusan,
                                                        content: message,
                                                        readStatus: 'unread',
                                                        owner: owner,
                                                        sender: sender,
                                                        senderDetail: sender.position,
                                                        receivers: objReceiver,
                                                        receiverDetail: curReceiver,
                                                        cc: objTembusan,
                                                        ccDetail: curCc,
                                                        senderName: senderName,
                                                        senderRank: senderRank,
                                                        author: roleName.position
                                                    }, function (res) {
                                                        soyut.radiogram.clearInput();
                                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                                        $(".wdl-folders").children().removeClass("active");
                                                        $(".wdl-folders").children().removeClass("open");

                                                        soyut.radiogram.renderDraft();
                                                    });

                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    });
                }
                else {
                    var vroleRcv = [];
                    var roleRcv = [];
                    var alsRcv = [];

                    var vroleCc = [];
                    var roleCc = [];
                    var alsCc = [];

                    if(receiverRole != null) {
                        receiverRole.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleRcv.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleRcv.push(mi[0]);
                            }
                            else {
                                alsRcv.push(mi[0]);
                            }
                        });
                    }

                    if(tembusan != null) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleCc.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleCc.push(mi[0]);
                            }
                            else {
                                alsCc.push(mi[0]);
                            }
                        });
                    }

                    var objReceiver = [];
                    var objTembusan = [];

                    var arAuthor = ''
                    if(roleName.isSet || roleName.isAddress){
                        arAuthor = '';
                    }
                    else {
                        arAuthor = roleName.position;
                    }

                    soyut.radiogram.renderSenderObj(senderRole, false, function (sender) {
                        soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                            soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                                soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                    soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                        soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                            soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {

                                                    objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                    objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                    var arrAliasRcv = [];
                                                    alsreceivers.forEach(function (i) {
                                                        arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                    });

                                                    var arrVroleRcv = [];
                                                    vroleReceivers.forEach(function (i) {
                                                        arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                    });

                                                    var arrRoleRcv = [];
                                                    roleReceivers.forEach(function (i) {
                                                        arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                    });

                                                    var arrAliasCc = [];
                                                    alsTembusan.forEach(function (i) {
                                                        arrAliasCc = arrAliasCc + i.position + ", ";
                                                    });

                                                    var arrVroleCc = [];
                                                    vroleTembusan.forEach(function (i) {
                                                        arrVroleCc = arrVroleCc + i.position + ", ";
                                                    });

                                                    var arrRoleCc = [];
                                                    roleTembusan.forEach(function (i) {
                                                        arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                    });

                                                    var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                    var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                    soyut.radiogram.DraftRadiogram({
                                                        panggilan: panggilan,
                                                        jenis: jenis,
                                                        nomor: nomor,
                                                        derajat: derajat,
                                                        instruksi: instruksi,
                                                        tandadinas: tandadinas,
                                                        group: group,
                                                        classification: klasifikasi,
                                                        materi: arrMateri,
                                                        approved: arrApproval,
                                                        Number: no,
                                                        cara: cara,
                                                        paraf: paraf,
                                                        alamataksi: alamataksi,
                                                        alamattembusan: alamattembusan,
                                                        content: message,
                                                        readStatus: 'unread',
                                                        owner: owner,
                                                        sender: sender,
                                                        senderDetail: sender.position +" ("+ sender.groupName +")",
                                                        receivers: objReceiver,
                                                        receiverDetail: curReceiver,
                                                        cc: objTembusan,
                                                        ccDetail: curCc,
                                                        senderName: senderName,
                                                        senderRank: senderRank,
                                                        author: arAuthor
                                                    }, function (res) {
                                                        soyut.radiogram.clearInput();
                                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

                                                        soyut.radiogram.renderDraft();
                                                    });

                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            }
            else {
                if(roleName.isWASDAL){
                    var vroleRcv = [];
                    var roleRcv = [];
                    var alsRcv = [];

                    var vroleCc = [];
                    var roleCc = [];
                    var alsCc = [];

                    if(receiverRole != null) {
                        receiverRole.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleRcv.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleRcv.push(mi[0]);
                            }
                            else {
                                alsRcv.push(mi[0]);
                            }
                        });
                    }

                    if(tembusan != null) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleCc.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleCc.push(mi[0]);
                            }
                            else {
                                alsCc.push(mi[0]);
                            }
                        });
                    }

                    var objReceiver = [];
                    var objTembusan = [];

                    soyut.radiogram.renderRadiogramDetail(editId, function(res){
                        soyut.radiogram.renderSenderObj(senderRole, true, function (sender) {
                            soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                                soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                                    soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                        soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                            soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                                soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                                    soyut.radiogram.renderListKolatReceiver(function (owner) {

                                                        objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                        objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                        var arrAliasRcv = [];
                                                        alsreceivers.forEach(function (i) {
                                                            arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                        });

                                                        var arrVroleRcv = [];
                                                        vroleReceivers.forEach(function (i) {
                                                            arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                        });

                                                        var arrRoleRcv = [];
                                                        roleReceivers.forEach(function (i) {
                                                            arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                        });

                                                        var arrAliasCc = [];
                                                        alsTembusan.forEach(function (i) {
                                                            arrAliasCc = arrAliasCc + i.position + ", ";
                                                        });

                                                        var arrVroleCc = [];
                                                        vroleTembusan.forEach(function (i) {
                                                            arrVroleCc = arrVroleCc + i.position + ", ";
                                                        });

                                                        var arrRoleCc = [];
                                                        roleTembusan.forEach(function (i) {
                                                            arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                        });

                                                        var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                        var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                        soyut.radiogram.UpdateDraftWasdalRadiogram({
                                                            id: res.id,
                                                            panggilan: panggilan,
                                                            jenis: jenis,
                                                            nomor: nomor,
                                                            derajat: derajat,
                                                            instruksi: instruksi,
                                                            tandadinas: tandadinas,
                                                            group: group,
                                                            classification: klasifikasi,
                                                            materi: arrMateri,
                                                            approved: arrApproval,
                                                            Number: no,
                                                            cara: cara,
                                                            paraf: paraf,
                                                            alamataksi: alamataksi,
                                                            alamattembusan: alamattembusan,
                                                            content: message,
                                                            sender: sender,
                                                            senderDetail: sender.position,
                                                            receivers: objReceiver,
                                                            receiverDetail: curReceiver,
                                                            cc: objTembusan,
                                                            ccDetail: curCc,
                                                            senderName: senderName,
                                                            senderRank: senderRank,
                                                            author: roleName.position
                                                        },function(res){
                                                            soyut.radiogram.clearInput();
                                                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                                            $(".wdl-folders").children().removeClass("active");
                                                            $(".wdl-folders").children().removeClass("open");

                                                            soyut.radiogram.renderDraft();
                                                        });

                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    var vroleRcv = [];
                    var roleRcv = [];
                    var alsRcv = [];

                    var vroleCc = [];
                    var roleCc = [];
                    var alsCc = [];

                    if(receiverRole != null) {
                        receiverRole.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleRcv.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleRcv.push(mi[0]);
                            }
                            else {
                                alsRcv.push(mi[0]);
                            }
                        });
                    }

                    if(tembusan != null) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                vroleCc.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                roleCc.push(mi[0]);
                            }
                            else {
                                alsCc.push(mi[0]);
                            }
                        });
                    }

                    var objReceiver = [];
                    var objTembusan = [];

                    var arAuthor = ''
                    if(roleName.isSet || roleName.isAddress){
                        arAuthor = refauthor;
                    }
                    else {
                        arAuthor = roleName.position;
                    }

                    soyut.radiogram.renderRadiogramDetail(editId, function(res){
                        soyut.radiogram.renderSenderObj(senderRole, false, function (sender) {
                            soyut.radiogram.renderListVRoleDetail(vroleRcv, function (vroleReceivers) {
                                soyut.radiogram.renderListRoleDetail(roleRcv, function (roleReceivers) {
                                    soyut.radiogram.renderListAliasDetail(alsRcv, function (alsreceivers) {
                                        soyut.radiogram.renderListVRoleDetail(vroleCc, function (vroleTembusan) {
                                            soyut.radiogram.renderListRoleDetail(roleCc, function (roleTembusan) {
                                                soyut.radiogram.renderListAliasDetail(alsCc, function (alsTembusan) {
                                                    soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {

                                                        objReceiver = vroleReceivers.concat(roleReceivers, alsreceivers);
                                                        objTembusan = vroleTembusan.concat(roleTembusan, alsTembusan);

                                                        var arrAliasRcv = [];
                                                        alsreceivers.forEach(function (i) {
                                                            arrAliasRcv = arrAliasRcv + i.position + ", ";
                                                        });

                                                        var arrVroleRcv = [];
                                                        vroleReceivers.forEach(function (i) {
                                                            arrVroleRcv = arrVroleRcv + i.position + ", ";
                                                        });

                                                        var arrRoleRcv = [];
                                                        roleReceivers.forEach(function (i) {
                                                            arrRoleRcv = arrRoleRcv + i.position + " (" + i.groupName + "), ";
                                                        });

                                                        var arrAliasCc = [];
                                                        alsTembusan.forEach(function (i) {
                                                            arrAliasCc = arrAliasCc + i.position + ", ";
                                                        });

                                                        var arrVroleCc = [];
                                                        vroleTembusan.forEach(function (i) {
                                                            arrVroleCc = arrVroleCc + i.position + ", ";
                                                        });

                                                        var arrRoleCc = [];
                                                        roleTembusan.forEach(function (i) {
                                                            arrRoleCc = arrRoleCc + i.position + " (" + i.groupName + "), ";
                                                        });

                                                        var curReceiver = arrAliasRcv + arrRoleRcv + arrVroleRcv;
                                                        var curCc = arrAliasCc + arrRoleCc + arrVroleCc;

                                                        soyut.radiogram.UpdateDraftRadiogram({
                                                            id: res.id,
                                                            panggilan: panggilan,
                                                            jenis: jenis,
                                                            nomor: nomor,
                                                            derajat: derajat,
                                                            instruksi: instruksi,
                                                            tandadinas: tandadinas,
                                                            group: group,
                                                            classification: klasifikasi,
                                                            materi: arrMateri,
                                                            approved: arrApproval,
                                                            Number: no,
                                                            cara: cara,
                                                            paraf: paraf,
                                                            alamataksi: alamataksi,
                                                            alamattembusan: alamattembusan,
                                                            content: message,
                                                            sender: sender,
                                                            senderDetail: sender.position +" ("+ sender.groupName +")",
                                                            receivers: objReceiver,
                                                            receiverDetail: curReceiver,
                                                            cc: objTembusan,
                                                            ccDetail: curCc,
                                                            senderName: senderName,
                                                            senderRank: senderRank,
                                                            author: arAuthor
                                                        }, function (res) {
                                                            soyut.radiogram.clearInput();
                                                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                                            soyut.radiogram.renderDraft();
                                                        });

                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    });
                }
            }
        }
    });
};

soyut.radiogram.clearInput = function() {
    $(getInstanceID("editId")).val('');
    $(getInstanceID("panggilan")).val('');
    $(getInstanceID("jenis")).val('');
    $(getInstanceID("nomor")).val('');
    $(getInstanceID("instruksi")).val('');
    $(getInstanceID("senderid")).val('');
    $(getInstanceID("sender")).val('');
    $(getInstanceID("receiversid")).val('');
    $(getInstanceID("receivers")).val('');
    $(".optCC").val('');
    $(getInstanceID("tandadinas")).val('');
    $(getInstanceID("group")).val('');
    $(getInstanceID("title")).val('');
    $(getInstanceID("Number")).val('');
    $(getInstanceID("message-input")).val('');
    $(getInstanceID("sender-name")).val('');
    $(getInstanceID("sender-pangkat")).val('');
    $(getInstanceID("sender-signature")).val('');
    $(getInstanceID("alamataksi")).val('');
    $(getInstanceID("alamattembusan")).val('');
    $(getInstanceID("cara")).val('');
    $(getInstanceID("paraf")).val('');
    $(getInstanceID("jam")).val('');
    $(getInstanceID("tanggal")).val('');
};

soyut.radiogram.renderInbox = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("active");
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'inbox', '');
};

soyut.radiogram.renderSent = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-sent")).parent().addClass("active");
    $(getInstanceID("wdl-nav-sent")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'sent', '');
};

soyut.radiogram.renderDraft = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-draft")).parent().addClass("active");
    $(getInstanceID("wdl-nav-draft")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'draft', '');
};
soyut.radiogram.renderTrash = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-trash")).parent().addClass("active");
    $(getInstanceID("wdl-nav-trash")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'trash', '');
};

Vue.component('wasdal-list', {
    props: ['messages'],
    template: '#wasdal-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        FindRadiogram: function () {
            var filter = $('.txt-filter-list').val();

            $('ul.messages-list > li').each(function(){
                var currentLiText = $(this).text();
                var showCurrentLi = currentLiText.indexOf(filter) !== -1;

                $(this).toggle(showCurrentLi);
            });
        },
        MarkMessage: function(val){
            console.log("mark "+val)
        },
        LoadStatusMessage: function(val, readStatus, composeStatus){
            var selMessage = $('.selected-message').val();
            var html = "messages-item ";
            if(readStatus == "unread" && composeStatus == "inbox"){
                html += "unread text-bold";
            }
            else{
                if(selMessage == val){
                    html += "active";
                }
            }
            return html;
        },
        viewMessageDetail: function (val) {
            this.$root.viewMessageDetail(val);
        }
    }
});

soyut.radiogram.renderListGroupMessage = function (elSelector, elChildren, message, group) {
    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<wasdal-list :messages="messages"></wasdal-list>');

    soyut.radiogram.renderListMessages(group, message,function(res){
        var vm = new Vue({
            el: elSelector,
            data: {
                messages: res
            },
            methods: {
                viewMessageDetail: function (val) {
                    soyut.radiogram.renderKogasDetail('.email-reader', val, message);
                }
            }
        });
    });
};

Vue.component('email-list', {
    props: ['messages'],
    template: '#email-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        FindRadiogram: function () {
            var filter = $('.txt-filter-list').val();

            $('ul.messages-list > li').each(function(){
                var currentLiText = $(this).text();
                var showCurrentLi = currentLiText.indexOf(filter) !== -1;

                $(this).toggle(showCurrentLi);
            });
        },
        MarkMessage: function(val){
            console.log("mark "+val)
        },
        LoadStatusMessage: function(val, readStatus, composeStatus, rolegroup){
            var selMessage = $('.selected-message').val();
            var html = "message-data-"+ val +" inbox-data-"+ rolegroup +" messages-item ";
            if(readStatus == "unread" && composeStatus == "inbox"){
                html += "unread text-bold";
            }
            else{
                if(selMessage == val){
                    html += "active";
                }
            }
            return html;
        },
        viewMessageDetail: function (val) {
            this.$root.viewMessageDetail(val);
        }
    }
});

soyut.radiogram.LoadNewMessages = function (data) {
    vmlist.NewMessages(data);
};

soyut.radiogram.renderListMessage = function (elSelector, elChildren, message, group) {
    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<email-list :messages="messages"></email-list>');

    if(roleName.isWASDAL) {
        soyut.radiogram.renderListWasdalMessages(message, group, function (res) {
            vmlist = new Vue({
                el: elSelector,
                data: {
                    messages: res
                },
                mounted: function () {
                    this.$nextTick(function () {
                        this.LoadMessages();
                    });
                },
                methods: {
                    NewMessages: function (data) {
                        var _this = this;
                        var newEntry = {
                            panggilan: data.panggilan,
                            jenis: data.jenis,
                            nomor: data.nomor,
                            derajat: data.derajat,
                            instruksi: data.instruksi,
                            tandadinas: data.tandadinas,
                            group: data.group,
                            classification: data.classification,
                            materi: data.materi,
                            Number: data.Number,
                            cara: data.cara,
                            paraf: data.paraf,
                            alamataksi: data.alamataksi,
                            alamattembusan: data.alamattembusan,
                            content: data.content,
                            readStatus: data.readStatus,
                            owner: data.owner,
                            sender: data.sender,
                            senderDetail: data.senderDetail,
                            receivers: data.receivers,
                            receiverDetail: data.receiverDetail,
                            senderWasdal: data.senderWasdal,
                            cc: data.cc,
                            ccDetail: data.ccDetail,
                            session: data.session,
                            senderName: data.senderName,
                            senderRank: data.senderRank,
                            author: data.author,
                            SendTime: data.SendTime,
                            simtime: data.simtime,
                            createTime: data.createTime,
                            composeStatus: data.composeStatus,
                            id: data.id,
                            parentId: data.parentId
                        };
                        _this.messages.unshift(newEntry);
                        soyut.radiogram.renderUnreadMessage(message, 1);
                    },
                    LoadMessages: function () {
                        soyut.radiogram.renderKogasAccess();
                        soyut.radiogram.renderUnreadMessage(message, 0);
                        soyut.radiogram.renderSelectedMateri();
                    },
                    viewMessageDetail: function (val) {
                        soyut.radiogram.renderMessageObj(val, function (data) {
                            if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                                soyut.radiogram.UpdateReadStatus(data.id, function (result) {
                                    console.log("Radigram telah di baca!");
                                    soyut.radiogram.renderUnreadMessage(message, 0);
                                    console.log(result);
                                });
                            }
                            soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.composeStatus, group);
                            soyut.radiogram.renderMessageDetail('.email-reader', val, message);

                        });
                    }
                }
            });
        });
    }
    else {
        soyut.radiogram.renderListMessages(roleName.roleGroup, message,function(res){
            vmlist = new Vue({
                el: elSelector,
                data: {
                    messages: res
                },
                mounted: function () {
                    this.$nextTick(function () {
                        this.LoadMessages();
                    });
                },
                methods: {
                    NewMessages: function (data) {
                        var _this = this;
                        var newEntry = {
                            panggilan: data.panggilan,
                            jenis: data.jenis,
                            nomor: data.nomor,
                            derajat: data.derajat,
                            instruksi: data.instruksi,
                            tandadinas: data.tandadinas,
                            group: data.group,
                            classification: data.classification,
                            materi: data.materi,
                            Number: data.Number,
                            cara: data.cara,
                            paraf: data.paraf,
                            alamataksi: data.alamataksi,
                            alamattembusan: data.alamattembusan,
                            content: data.content,
                            readStatus: data.readStatus,
                            owner: data.owner,
                            sender: data.sender,
                            senderDetail: data.senderDetail,
                            receivers: data.receivers,
                            receiverDetail: data.receiverDetail,
                            senderWasdal: data.senderWasdal,
                            cc: data.cc,
                            ccDetail: data.ccDetail,
                            session: data.session,
                            senderName: data.senderName,
                            senderRank: data.senderRank,
                            author: data.author,
                            SendTime: data.SendTime,
                            simtime: data.simtime,
                            createTime: data.createTime,
                            composeStatus: data.composeStatus,
                            id: data.id,
                            parentId: data.parentId
                        };
                        _this.messages.unshift(newEntry);
                        soyut.radiogram.renderUnreadMessage(message, 1);
                    },
                    LoadMessages: function () {
                        soyut.radiogram.renderUnreadMessage(message, 0);
                    },
                    viewMessageDetail: function (val) {
                        soyut.radiogram.renderMessageObj(val, function (data) {
                            if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                                soyut.radiogram.UpdateReadStatus(data.id, function (result) {
                                    console.log("Radiogram telah di baca!");
                                    soyut.radiogram.renderUnreadMessage(message, 0);
                                    console.log(result);
                                });
                            }
                            soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.composeStatus, '');
                            soyut.radiogram.renderMessageDetail('.email-reader', val, message);

                        });
                    }
                }
            });
        });
    }
};

Vue.component('email-kogas', {
    props: ['contents', 'messages', 'attributes'],
    template: '#email-kogas',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        PrintPdf: function () {
            this.$root.PrintPdf(this.contents);
        },
        SavePdf: function(){
            this.$root.SavePdf(this.contents);
        },
    }
});

soyut.radiogram.renderKogasDetail = function (elSelector, message, state) {
    var vm;
    var $el = $(elSelector);
    $el.html('');
    $el.append('<email-kogas :contents="contents" :messages="messages" :attributes="attributes"></email-kogas>');

    soyut.radiogram.renderMessageObj(message, function (data) {
        var textArray = data.content.split('\n');
        var renderMessage = "";
        for (var i = 0; i < textArray.length; i++) {
            renderMessage += textArray[i] + "<br />";
        }

        var arrMateri = '';
        if (data.materi != null) {
            data.materi.forEach(function (i) {
                arrMateri = arrMateri + i.toUpperCase() + ", ";
            });
        }
        else {
            arrMateri = '';
        }

        var arrApproved = '';
        if(data.approved != null ) {
            data.approved.forEach(function (i) {
                arrApproved = arrApproved + i.toUpperCase() + ", ";
            });
        }
        else {
            arrApproved = '';
        }

        var attributes = '';
        if (roleName.isWASDAL) {
            attributes +=
                '<div class="col-md-8">' +
                '<div class="form-group"><p class="text-bold">MATERI :</p> ' + arrMateri + ' </div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="form-group pull-right"><p class="text-bold">Author</p> ' + data.author + '</div>' +
                '</div>';
            if(state != 'inbox'){
                attributes +=
                    '<div class="col-md-12">' +
                    '<div class="form-group"><p class="text-bold">DI SETUJUI :</p> ' + arrApproved + ' </div>' +
                    '</div>';
            }
        }
        else {
            if(state == 'inbox') {
                attributes +=
                    '<div class="col-md-12">' +
                    '<div class="form-group"><p class="text-bold">DI SETUJUI :</p> ' + arrApproved + ' </div>' +
                    '</div>';
            }
        }

        vm = new Vue({
            el: elSelector,
            data: {
                contents: data,
                messages: renderMessage,
                attributes: attributes
            },
            methods: {
                PrintPdf: function (content) {
                    soyut.radiogram.PrintPDF(content.id);
                },
                SavePdf: function (content) {
                    soyut.radiogram.SavePdf(content.id);
                },
            }
        });
    });
};


Vue.component('email-reader', {
    props: ['contents', 'messages', 'attributes'],
    template: '#email-reader',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ReplyMessage: function () {
            this.$root.ReplyMessage(this.contents);
        },
        SubmitMessage: function(){
            this.$root.SubmitMessage(this.contents);
        },
        EditMessage: function(){
            this.$root.EditMessage(this.contents);
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents);
        },
        PrintPdf: function () {
            this.$root.PrintPdf(this.contents);
        },
        SavePdf: function(){
            this.$root.SavePdf(this.contents);
        },
        loadMoveButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        MoveMessage: function(){
            this.$root.MoveMessage(this.contents);
        },
        loadDeleteButton: function(val){
            if(val != 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        DeleteMessage: function(){
            this.$root.DeleteMessage(this.contents);
        },
        loadPrintButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadPDFButton: function(val){
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadReplyButton: function(val){
            if(val == 'draft' || val == 'sent' || val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
            else{
                if(roleName.isSet){
                    var attr;
                    attr = {
                        'style': 'display:none'
                    };
                    return attr;
                }
            }
        },
        loadChangeButton: function(val){
            if(val == 'sent' || val == 'inbox' || val == 'trash' ){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        },
        loadSentButton: function(val){
            if(val == 'sent' || val == 'inbox' || val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
            else{
                if(!roleName.isSet){
                    var attr;
                    attr = {
                        'style': 'display:none'
                    };
                    return attr;
                }
            }
        }
    }
});

soyut.radiogram.renderMessageDetail = function (elSelector, message, state) {
    var vm;
    var $el = $(elSelector);
    $el.html('');
    $el.append('<email-reader :contents="contents" :messages="messages" :attributes="attributes"></email-reader>');

    soyut.radiogram.renderMessageObj(message, function(data){
        var textArray = data.content.split('\n');
        var renderMessage = "";
        for (var i = 0; i < textArray.length; i++) {
            renderMessage += textArray[i] + "<br />";
        }

        var arrMateri = '';
        if(data.materi != null ) {
            data.materi.forEach(function (i) {
                arrMateri = arrMateri + i.toUpperCase() + ", ";
            });
        }
        else {
            arrMateri = '';
        }

        var arrApproved = '';
        if(data.approved != null ) {
            data.approved.forEach(function (i) {
                arrApproved = arrApproved + i.toUpperCase() + ", ";
            });
        }
        else {
            arrApproved = '';
        }

        var attributes = '';
        if(roleName.isWASDAL) {
            attributes +=
                '<div class="col-md-8">' +
                '<div class="form-group"><p class="text-bold">MATERI :</p> ' + arrMateri + ' </div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="form-group pull-right"><p class="text-bold">Author</p> ' + data.author + '</div>' +
                '</div>';

            if(state == 'inbox'){
                attributes +=
                    '<div class="col-md-12">' +
                    '<div class="form-group"><p class="text-bold">DI SETUJUI :</p> ' + arrApproved + ' </div>' +
                    '</div>';
            }
        }
        else {
            if(state != 'inbox') {
                attributes +=
                    '<div class="col-md-12">' +
                    '<div class="form-group"><p class="text-bold">DI SETUJUI :</p> ' + arrApproved + ' </div>' +
                    '</div>';
            }
        }

        vm = new Vue({
            el: elSelector,
            data: {
                contents: data,
                messages: renderMessage,
                attributes: attributes
            },
            mounted: function () {
                this.$nextTick(function () {
                    this.LoadMessages();
                });
            },
            methods: {
                LoadMessages: function () {
                    if(roleName.isWASDAL) {
                        console.log("defined "+ state);
                        soyut.radiogram.renderKogasAccess();
                        soyut.radiogram.renderUnreadMessage(state, 0);
                        soyut.radiogram.renderSelectedMateri();
                    }
                },
                MoveMessage: function(content){
                    function handleOkButton() {
                        console.log('radiogram Warning, delete radiogram');
                        soyut.radiogram.Radiogram_UpdateToTrash({id: content.id}, function (err, data) {
                            if(!err){
                                switch(state){
                                    case 'inbox':
                                        soyut.radiogram.renderInbox();
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                        $(".wdl-folders").children().removeClass("active");
                                        $(".wdl-folders").children().removeClass("open");

                                        break;
                                    case 'sent':
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                        $(".wdl-folders").children().removeClass("active");
                                        $(".wdl-folders").children().removeClass("open");

                                        soyut.radiogram.renderSent();
                                        break;
                                    case 'draft':
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                                        $(".wdl-folders").children().removeClass("active");
                                        $(".wdl-folders").children().removeClass("open");

                                        soyut.radiogram.renderDraft();
                                        break;
                                }
                            }
                        });
                    }
                    function handleCancelButton() {
                        console.log('radiogram delete cancelled');
                    }

                    function handleCloseButton() {
                        console.log('radiogram box closed');
                    }
                    soyut.radiogram.alert.Alert('Anda yakin untuk menghapus data radiogram ?', true)
                        .OnClose(handleCloseButton)
                        .OnCancelButton(handleCancelButton)
                        .OnOkButton(handleOkButton.bind(this));
                },
                DeleteMessage: function(content){
                    function handleOkButton() {
                        console.log('radiogram Warning, delete radiogram');
                        soyut.radiogram.Radiogram_delete({id: content.id}, function (err, data) {
                            if(!err){
                                soyut.radiogram.renderTrash();
                            }
                        });
                    }
                    function handleCancelButton() {
                        console.log('radiogram delete cancelled');
                    }

                    function handleCloseButton() {
                        console.log('radiogram box closed');
                    }
                    soyut.radiogram.alert.Alert('Anda yakin untuk menghapus data radiogram ?', true)
                        .OnClose(handleCloseButton)
                        .OnCancelButton(handleCancelButton)
                        .OnOkButton(handleOkButton.bind(this));
                },
                EditMessage: function(content){
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

                    soyut.radiogram.EditMessage(content.id);
                },
                ReplyMessage: function (content) {
                    soyut.radiogram.renderCompose(content.id, '', content.materi);
                },
                PrintPdf: function (content) {
                    soyut.radiogram.PrintPDF(content.id);
                },
                SavePdf: function (content) {
                    soyut.radiogram.SavePdf(content.id);
                },
                SubmitMessage: function(content){
                    if(roleName.isWASDAL){
                        soyut.radiogram.SendDraftWasdalRadiogram(content, function (res) {
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                            $(".wdl-folders").children().removeClass("active");
                            $(".wdl-folders").children().removeClass("open");

                            soyut.radiogram.renderDraft();
                            soyut.radiogram.AddRIGRadiogram(content.id);

                        })
                    }
                    else{
                        soyut.radiogram.SendDraftRadiogram(content, function (res) {
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                            soyut.radiogram.renderDraft();
                        });
                    }
                }
            }
        });
    });
};

Vue.component('email-reply', {
    props: ['contents','messages','attributes'],
    template: '#email-reply',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ViewDetail: function () {
            this.$root.ViewDetail();
        }
    }
});

soyut.radiogram.renderReplyMessage = function (elSelector, message) {
    var vm;

    var $el = $(elSelector);
    $el.html('');

    $el.append('<email-reply :contents="contents" :messages="messages" :attributes="attributes"></email-reply>');

    soyut.radiogram.renderMessageObj(message, function(data) {
        var textArray = data.content.split('\n');
        var renderMessage = "";
        for (var i = 0; i < textArray.length; i++) {
            renderMessage += textArray[i] + "<br />";
        }

        var arrMateri = '';
        if (data.materi != null) {
            data.materi.forEach(function (i) {
                arrMateri = arrMateri + i.toUpperCase() + ", ";
            });
        }
        else {
            arrMateri = '';
        }

        var attributes = '';
        if (roleName.isWASDAL) {
            attributes +=
                '<div class="col-md-8">' +
                '<div class="form-group"><p class="text-bold">MATERI :</p> ' + arrMateri + ' </div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="form-group pull-right"><p class="text-bold">Author</p> ' + data.author + '</div>' +
                '</div>';
        }

        vm = new Vue({
            el: elSelector,
            data: {
                contents: data,
                messages: renderMessage,
                attributes: attributes
            },
            methods: {
                ViewDetail: function () {
                    var status = $(".view-reply-status").val();
                    if(status == 0) {
                        $(".intruksi-tr").removeClass('hide');
                        $(".tembusan-tr").removeClass('hide');
                        $(".tandadinas-tr").removeClass('hide');
                        $(".klasifikasi-tr").removeClass('hide');
                        $(".message-tr").removeClass('hide');
                        $(".pengirim-tr").removeClass('hide');
                        $(".nama-tr").removeClass('hide');
                        $(".pangkat-tr").removeClass('hide');
                        $(".signature-tr").removeClass('hide');

                        $(".view-reply-status").val('1');
                    }
                    else {
                        $(".intruksi-tr").addClass('hide');
                        $(".tembusan-tr").addClass('hide');
                        $(".tandadinas-tr").addClass('hide');
                        $(".klasifikasi-tr").addClass('hide');
                        $(".message-tr").addClass('hide');
                        $(".pengirim-tr").addClass('hide');
                        $(".nama-tr").addClass('hide');
                        $(".pangkat-tr").addClass('hide');
                        $(".signature-tr").addClass('hide');

                        $(".view-reply-status").val('0');
                    }
                }
            }
        });
    });
};

soyut.radiogram.SavePdf = function(val){
    soyut.radiogram.RenderPrinterPDF(val, function(res){
        soyut.radiogram.SaveFilePDF(res, function (err, result) {
            soyut.radiogram.deleteFile({file: result.name}, function (err, resfile) {
                soyut.radiogram.Show_PdfViewer(result.url);
            });
        });
    });
};

soyut.radiogram.selectProvider = function (val) {
    console.log("provider selected "+val);
    if(val != undefined){
        soyut.printserver.listProviders(function(res){
            var provider = res.providers[val];
            console.log("pro "+ provider);
            var html = 'Printer: <select id="printer-name" name="printer-name" class="printer-name form-control">';
            provider.printers.forEach(function(i){
                console.log(i);
                html += '<option value="'+ i +'">'+ i +'</option>';
            });
            html += '</select>';
            $(getInstanceID('lp-printer')).html(html);
        });
    }
};

soyut.radiogram.PrintPDF = function(val){
    $(getInstanceID('printerAlertModal')).modal();
    $(getInstanceID('printerAlertModal')).appendTo(".wdl-main");
    $('.modal-backdrop').css("z-index", "-1");

    var html = '<input type="hidden" name="sel-pdfid" class="sel-pdfid" id="sel-pdfid" value="'+val+'">';
    soyut.radiogram.renderProviderPrinter(roleName.roleGroup, function (print) {
        html += 'Provider: <select id="provider-name" name="provider-name" class="provider-name form-control" onchange="soyut.radiogram.selectProvider(this.value)">';
        print.forEach(function (i) {
            html += '<option value="'+ i.name +'">'+ i.name +'</option>';
        });
        html += '</select>';
        $(getInstanceID('lp-provider')).html(html);
        soyut.radiogram.selectProvider($('.provider-name').val());
    });
};

$(getInstanceID("btn-print-radiogram")).click(function (event) {
    var pdfid = $('.sel-pdfid').val();
    soyut.radiogram.RenderPrinterPDF(pdfid, function (res) {
        soyut.radiogram.SaveFilePDF(res, function (err, result) {
            soyut.radiogram.deleteFile({file: result.name}, function (err, resfile) {
                var providerName = $('.provider-name').val();
                var printerName = $('.printer-name').val();
                console.log("print " + providerName + " - " + printerName);
                soyut.printserver.print({
                    docURL: result.url,
                    origin: 'Radiogram',
                    provider: providerName,
                    printer: printerName
                }, function (print) {
                    console.log(print);
                    $(getInstanceID('printerAlertModal')).modal('hide');
                });
            });
        });
    });
});

soyut.radiogram.Show_PdfViewer = function(val) {
    var app = getAppInstance();

    app.launchActivity("soyut.module.app.radiogram.pdfviewer", {file: val});
};

Vue.component('role-group-list', {
    props: ['groups'],
    template: '#role-group-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ViewInboxGroup: function (val) {
            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
            $(".wdl-folders").children().removeClass("active");
            $(".wdl-folders").children().removeClass("open");

            $(".wdl-role-"+ val).parent().addClass("active");
            $(".wdl-role-"+ val).parent().addClass("open");
            this.$root.ViewInboxGroup(val);
        },
        ViewSentGroup: function(val){
            this.$root.ViewSentGroup(val);
        },
        loadDataAttribute: function (val) {
            var attr;
            attr = {
                'data-name' : val,
                'class' : 'wdl-data-'+ val
            };
            return attr;
        },
        loadAttribute: function (val) {
            var attr;
            attr = {
                'class' : 'wdl-role-'+ val
            };
            return attr;
        }
    }
});

soyut.radiogram.renderWasdalRadiogram = function (elSelector) {
    var vm;

    var $el = $(elSelector);
    $el.html('');
    $el.append('<role-group-list :groups="groups"></role-group-list>');

    soyut.radiogram.renderListNonDirectorRoleGroup(function(res) {
        vm = new Vue({
            el: elSelector,
            data: {
                groups: res
            },
            methods: {
                ViewInboxGroup: function (val) {
                    soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'inbox', val);
                },
                ViewSentGroup: function (val) {
                    soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'sent', val);
                }
            }
        });
    });
};

Vue.component('kogas-list', {
    props: ['groups'],
    template: '#kogas-list',
    methods: {
        loadAttribute: function (val) {
            var attr;
            attr = {
                'class' : 'kogas-data-'+ val,
                'data-name' : val
            };
            return attr;
        },
        ViewInboxGroup: function (val) {
            this.$root.ViewInboxGroup(val);
        }
    }
});

soyut.radiogram.renderKogasRadiogram = function (elSelector) {
    var vm;

    var $el = $(elSelector);
    $el.html('');
    $el.append('<kogas-list :groups="groups"></kogas-list>');

    soyut.radiogram.renderListNonDirectorRoleGroup(function(res){
        vm = new Vue({
            el: elSelector,
            data: {
                groups: res
            },
            mounted: function () {
                this.$nextTick(function () {
                    this.LoadMessages();
                });
            },
            methods: {
                LoadMessages: function () {
                    soyut.radiogram.renderKogasAccess();
                },
                ViewInboxGroup: function(val){
                    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'inbox', val);
                }
            }
        });
    });
};

Vue.component('send-result', {
    props: ['contents'],
    template: '#send-result',
    methods: {
        BackToInbox: function () {
            this.$root.BackToInbox();
        },
        PrintPDF: function () {
            this.$root.PrintPDF(this.contents);
        }
    }
});

soyut.radiogram.renderSendingResult = function (elSelector, message) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<send-result :contents="contents"></send-result>');

    soyut.radiogram.renderMessageObj(message, function(data) {
        var vmres = new Vue({
            el: elSelector,
            data: {
                contents: data
            },
            methods: {
                PrintPDF: function (content) {
                    console.log("pdf "+content.id)
                    soyut.radiogram.PrintPDF(content.id);
                },
                BackToInbox: function () {
                    soyut.radiogram.clearInput();
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                    $(".wdl-folders").children().removeClass("active");
                    $(".wdl-folders").children().removeClass("open");

                    soyut.radiogram.renderInbox();
                }
            }
        });
    });
};

soyut.radiogram.EditMessage = function(val){
    $('.reply-message').html('');
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-email-form")).removeClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    $(getInstanceID("btnSubmitMessage")).css({display:'none'});

    if(!roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("Number")).attr('readonly', 'readonly');
    }

    soyut.radiogram.renderRadiogramDetail(val, function(res) {
        if (roleName.isWASDAL) {
            soyut.radiogram.renderMateriWasdal('edit', res.materi);
            soyut.radiogram.renderSenderWasdal('edit', res.sender);
            soyut.radiogram.renderReceiverWasdal('edit', res.receivers);
            soyut.radiogram.renderCCWasdal('edit', res.cc);
            soyut.radiogram.renderApproval('edit', res.approved);
            $(getInstanceID("list-approval")).css('visibility', 'hidden');
            $(getInstanceID("list-approval")).css('height', '5px');
        }
        else {
            soyut.radiogram.renderMateri('edit', res.materi);
            soyut.radiogram.renderComposeSender('edit', res.sender);
            soyut.radiogram.renderComposeReceivers('edit', res.receivers);
            soyut.radiogram.renderComposeCC('edit', res.cc);
            $(getInstanceID("list-materi")).css('visibility', 'hidden');
            $(getInstanceID("list-materi")).css('height', '5px');
            soyut.radiogram.renderApproval('edit', res.approved);
            if(!roleName.isAddress){
                $(getInstanceID("list-approval")).css('visibility', 'hidden');
                $(getInstanceID("list-approval")).css('height', '5px');
            }
        }

        $(getInstanceID("editId")).val(res.id);
        $(getInstanceID("refauthor")).val(res.author);
        $(getInstanceID("panggilan")).val(res.panggilan);
        $(getInstanceID("jenis")).val(res.jenis);
        $(getInstanceID("nomor")).val(res.nomor);
        $(getInstanceID("derajat")).val(res.derajat);
        $(getInstanceID("instruksi")).val(res.instruksi);
        $(getInstanceID("tandadinas")).val(res.tandadinas);
        $(getInstanceID("group")).val(res.group);
        $(getInstanceID("klasifikasi")).val(res.classification);
        $(getInstanceID("Number")).val(res.Number);
        $(getInstanceID("message-input")).val(res.content);
        $(getInstanceID('sender-name')).val(res.senderName);
        $(getInstanceID('sender-pangkat')).val(res.senderRank);
        $(getInstanceID("alamataksi")).val(res.alamataksi);
        $(getInstanceID("alamattembusan")).val(res.alamattembusan);
        $(getInstanceID("cara")).val(res.cara);
        $(getInstanceID("paraf")).val(res.paraf);
        $(getInstanceID("jam")).val();
        $(getInstanceID("tanggal")).val();
    });
};

soyut.radiogram.renderCompose = function (referenceId, refSender, refMateri) {
    $('.reply-message').html('');
    soyut.radiogram.clearInput();

    $('.wdl-main').css({"font-size": fontSize});
    $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontSize});
    $('.btn').css({"font-size": fontSize});

    $(getInstanceID("wdl-email-form")).removeClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    if(!roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("btnSubmitMessage")).css({display:'none'});
    }

    if(!roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("Number")).attr('readonly', 'readonly');
    }

    if(referenceId != '') {
        $(getInstanceID("referenceid")).val(referenceId);
        soyut.radiogram.renderReplyMessage('.reply-message', referenceId);
        soyut.radiogram.renderMateri('edit', refMateri);
    }
    else {
        soyut.radiogram.renderMateri('new', null);
    }

    if(roleName.isWASDAL) {
        $(getInstanceID("ref_sender")).val(refSender);
        soyut.radiogram.renderSenderWasdal('new', null);
        soyut.radiogram.renderReceiverWasdal('new', null);
        soyut.radiogram.renderCCWasdal('new', null);
        soyut.radiogram.renderMateriWasdal('new', null);
    }
    else {
        $(getInstanceID("ref_sender")).val('');
        soyut.radiogram.renderComposeSender('new', null);
        soyut.radiogram.renderComposeReceivers('new', null, null);
        soyut.radiogram.renderComposeCC('new', null, null);
        $(getInstanceID("list-materi")).css('visibility', 'hidden');
        $(getInstanceID("list-materi")).css('height', '5px');
    }
};

soyut.radiogram.renderMateriWasdal = function (state, value) {
    $(getInstanceID("list-materi")).html('');
    if(state == 'new'){
        var html = '<h3>MATERI :</h3>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="intelijen">INTELIJEN</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="operasi">OPERASI</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="personel">PERSONEL</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="logistik">LOGISTIK</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="komlek">KOMLEK</label>';

        $(getInstanceID("list-materi")).append(html);
    }
    else {
        var checked1 = '';
        var checked2 = '';
        var checked3 = '';
        var checked4 = '';
        var checked5 = '';
        value.forEach(function (i) {
            if(i == 'intelijen'){
                checked1 = 'checked';
            }
            else if(i == 'operasi'){
                checked2 = 'checked';
            }
            else if(i == 'personel'){
                checked3 = 'checked';
            }
            else if(i == 'logistik'){
                checked4 = 'checked';
            }
            else if(i == 'komlek'){
                checked5 = 'checked';
            }
        });
        var html = '<h3>MATERI :</h3>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="intelijen" '+ checked1 +'>INTELIJEN</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="operasi" '+ checked2 +'>OPERASI</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="personel" '+ checked3 +'>PERSONEL</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="logistik" '+ checked4 +'>LOGISTIK</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="komlek" '+ checked5 +'>KOMLEK</label>';

        $(getInstanceID("list-materi")).append(html);
    }
};

/*sender and receiver WASDAL */
soyut.radiogram.renderReceiverWasdal = function (state, value) {
    $(getInstanceID("list-receiver")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function(als) {

                    var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                    als.forEach(function (l) {
                        html += '<option value="' + l.id + ':als' + '">' + l.name + '</option>';
                    });

                    list.forEach(function (r) {
                        html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                    });

                    res.forEach(function (i) {
                        html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                    });

                    html += '</select>';
                    html += '<span class="receivers-error help-block valid"></span>';
                    $(getInstanceID("list-receiver")).append(html);

                    $('.optReceiver').multiselect({
                        columns: 1,
                        placeholder: 'Cari...',
                        search: true,
                        selectAll: false
                    });

                });
            });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                soyut.radiogram.renderListRole(function(list) {
                    soyut.radiogram.renderListAlias(function(als) {
                        var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                        als.forEach(function (l) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'als', l.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                        });

                        list.forEach(function (r) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'role', r.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + r.id + ':role' + '" ' + selected + '>' + r.position + ' (' + r.groupName + ')</option>';
                        });

                        res.forEach(function (i) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'vrole', i.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + i.id + ':vrole' + '" ' + selected + '>' + i.position + '</option>';
                        });

                        html += '</select>';
                        html += '<span class="receivers-error help-block valid"></span>';
                        $(getInstanceID("list-receiver")).append(html);

                        $('.optReceiver').multiselect({
                            columns: 1,
                            placeholder: 'Cari...',
                            search: true,
                            selectAll: false
                        });
                    });
                });
            });
        }
    }
};

soyut.radiogram.renderSenderWasdal = function (state, value) {
    $(getInstanceID("list-sender")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.SetSenderDetail(this.value)">';
            html += '<option value="">Cari..</option>';
            res.forEach(function (i) {
                html += '<option value="'+ i.id +'">'+ i.position +'</option>';
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.SetSenderDetail(this.value)">';
                html += '<option value="">Cari..</option>';
                res.forEach(function (i) {
                    var selected = "";
                    if(value != null){
                        if(value.id == i.id){
                            selected = "selected";
                        }
                    }
                    html += '<option value="'+ i.id +'" '+selected+'>'+ i.position +'</option>';
                });
                html +='</select>';
                html +='<span class="sender-error help-block valid"></span>';
                $(getInstanceID("list-sender")).append(html);

                $(".optSender").select2({ width: '100%' });
            });
        }
    }
};

soyut.radiogram.renderCCWasdal = function (state, value) {
    $(getInstanceID("list-tembusan")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function(als) {

                    var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                    als.forEach(function (l) {
                        html += '<option value="' + l.id + ':als' + '">' + l.name + '</option>';
                    });

                    list.forEach(function (r) {
                        html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                    });

                    res.forEach(function (i) {
                        html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                    });

                    html += '</select>';
                    $(getInstanceID("list-tembusan")).append(html);

                    $('.optCC').multiselect({
                        columns: 1,
                        placeholder: 'Cari...',
                        search: true,
                        selectAll: false
                    });

                });
            });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                soyut.radiogram.renderListRole(function(list) {
                    soyut.radiogram.renderListAlias(function(als) {
                        var html = '<select name="optCC[]" multiple id="optCC" class="form-control optCC">';

                        als.forEach(function (l) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'als', l.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                        });

                        list.forEach(function (r) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'role', r.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + r.id + ':role' + '" ' + selected + '>' + r.position + ' (' + r.groupName + ')</option>';
                        });

                        res.forEach(function (i) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'vrole', i.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + i.id + ':vrole' + '" ' + selected + '>' + i.position + '</option>';
                        });

                        html += '</select>';
                        $(getInstanceID("list-tembusan")).append(html);

                        $('.optCC').multiselect({
                            columns: 1,
                            placeholder: 'Cari...',
                            search: true,
                            selectAll: false
                        });
                    });
                });
            });
        }
    }
};

/*sender and receiver user */
soyut.radiogram.renderApproval = function (state, value) {
    $(getInstanceID("list-approval")).html('');
    var checked1 = '';
    var checked2 = '';
    value.forEach(function (i) {
        if(i == 'panglima'){
            checked1 = 'checked';
        }
        else {
            checked2 = 'checked';
        }
    });
    var html = '<h3>Di Setujui :</h3>';
    html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-approval" value="panglima" '+ checked1 +'>PANGLIMA</label>';
    //html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-approval" value="kastaf" '+ checked2 +'>KASTAF</label>';

    $(getInstanceID("list-approval")).append(html);
};

soyut.radiogram.renderMateri = function (state, value) {
    $(getInstanceID("list-materi")).html('');
    if(state == 'new'){
        var html = '<h3>MATERI :</h3>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="intelijen">INTELIJEN</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="operasi">OPERASI</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="personel">PERSONEL</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="logistik">LOGISTIK</label>' +
            '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="komlek">KOMLEK</label>';

        $(getInstanceID("list-materi")).append(html);
    }
    else {
        var checked1 = '';
        var checked2 = '';
        var checked3 = '';
        var checked4 = '';
        var checked5 = '';
        value.forEach(function (i) {
            if(i == 'intelijen'){
                checked1 = 'checked';
            }
            else if(i == 'operasi'){
                checked2 = 'checked';
            }
            else if(i == 'personel'){
                checked3 = 'checked';
            }
            else if(i == 'logistik'){
                checked4 = 'checked';
            }
            else if(i == 'komlek'){
                checked5 = 'checked';
            }
        });
        var html = '<h3>MATERI :</h3>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="intelijen" '+ checked1 +'>INTELIJEN</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="operasi" '+ checked2 +'>OPERASI</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="personel" '+ checked3 +'>PERSONEL</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="logistik" '+ checked4 +'>LOGISTIK</label>';
        html += '<label class="checkbox-inline"><input type="checkbox" name="checkbox-materi" value="komlek" '+ checked5 +'>KOMLEK</label>';

        $(getInstanceID("list-materi")).append(html);
    }
};

soyut.radiogram.renderComposeSender = function (state, value) {
    $(getInstanceID("list-sender")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListSender(function(res){
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.SetSenderDetail(this.value)">';
            html += '<option value="">Cari..</option>';
            res.forEach(function (i) {
                if(i.isAddress){
                    html += '<option value="'+ i.id +'">'+ i.position + ' (' + roleName.roleGroupName + ')</option>';
                }
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    }
    else{
        if(value != null) {
            soyut.radiogram.renderListSender(function (res) {
                var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.SetSenderDetail(this.value)">';
                html += '<option value="">Cari..</option>';
                res.forEach(function (i) {
                    if (i.isAddress) {
                        var selected = "";
                        if (value != null) {
                            if (value.id == i.id) {
                                selected = "selected";
                            }
                        }
                        html += '<option value="' + i.id + '" ' + selected + '>' + i.position + ' (' + roleName.roleGroupName + ')</option>';
                    }
                });
                html += '</select>';
                html += '<span class="sender-error help-block valid"></span>';
                $(getInstanceID("list-sender")).append(html);

                $(".optSender").select2({width: '100%'});
            });
        }
    }
};

soyut.radiogram.renderComposeReceivers = function (state, value) {
    $(getInstanceID("list-receiver")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {

                    var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                    list.forEach(function (r) {
                        if(r.id != owner.id) {
                            html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                        }
                    });

                    res.forEach(function (i) {
                        html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                    });

                    html += '</select>';
                    html += '<span class="receivers-error help-block valid"></span>';
                    $(getInstanceID("list-receiver")).append(html);

                    $('.optReceiver').multiselect({
                        columns: 1,
                        placeholder: 'Cari...',
                        search: true,
                        selectAll: false
                    });
                });
            });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                soyut.radiogram.renderListRole(function(list) {
                    soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {
                        var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                        list.forEach(function (r) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'role', r.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            if(r.id != owner.id) {
                                html += '<option value="' + r.id + ':role' + '" ' + selected + '>' + r.position + ' (' + r.groupName + ')</option>';
                            }
                        });

                        res.forEach(function (i) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, 'vrole', i.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + i.id + ':vrole' + '" ' + selected + '>' + i.position + '</option>';
                        });

                        html += '</select>';
                        html += '<span class="receivers-error help-block valid"></span>';
                        $(getInstanceID("list-receiver")).append(html);

                        $('.optReceiver').multiselect({
                            columns: 1,
                            placeholder: 'Cari...',
                            search: true,
                            selectAll: false
                        });
                    });
                });
            });
        }
    }
};

soyut.radiogram.renderComposeCC = function (state, value) {
    $(getInstanceID("list-tembusan")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function(als) {
                    soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {

                        var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                        als.forEach(function (l) {
                            html += '<option value="' + l.id + ':als' + '">' + l.name + '</option>';
                        });

                        list.forEach(function (r) {
                            if(r.id != owner.id) {
                                html += '<option value="' + r.id + ':role' + '">' + r.position + ' (' + r.groupName + ')</option>';
                            }
                        });

                        res.forEach(function (i) {
                            html += '<option value="' + i.id + ':vrole' + '">' + i.position + '</option>';
                        });

                        html += '</select>';
                        $(getInstanceID("list-tembusan")).append(html);

                        $('.optCC').multiselect({
                            columns: 1,
                            placeholder: 'Cari...',
                            search: true,
                            selectAll: false
                        });
                    });

                });
            });
        });
    }
    else{
        if(value != null){
            soyut.radiogram.renderListReceivers(function(res){
                soyut.radiogram.renderListRole(function(list) {
                    soyut.radiogram.renderListAlias(function(als) {
                        soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (owner) {
                            var html = '<select name="optCC[]" multiple id="optCC" class="form-control optCC">';

                            als.forEach(function (l) {
                                var selected = "";
                                if (value != null) {
                                    soyut.radiogram.checkReceivers(value, 'als', l.id, function (sel) {
                                        if (sel) {
                                            selected += "selected";
                                        }
                                    });
                                }
                                html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                            });

                            list.forEach(function (r) {
                                var selected = "";
                                if (value != null) {
                                    soyut.radiogram.checkReceivers(value, 'role', r.id, function (sel) {
                                        if (sel) {
                                            selected += "selected";
                                        }
                                    });
                                }
                                if(r.id != owner.id) {
                                    html += '<option value="' + r.id + ':role' + '" ' + selected + '>' + r.position + ' (' + r.groupName + ')</option>';
                                }
                            });

                            res.forEach(function (i) {
                                var selected = "";
                                if (value != null) {
                                    soyut.radiogram.checkReceivers(value, 'vrole', i.id, function (sel) {
                                        if (sel) {
                                            selected += "selected";
                                        }
                                    });
                                }
                                html += '<option value="' + i.id + ':vrole' + '" ' + selected + '>' + i.position + '</option>';
                            });

                            html += '</select>';
                            $(getInstanceID("list-tembusan")).append(html);

                            $('.optCC').multiselect({
                                columns: 1,
                                placeholder: 'Cari...',
                                search: true,
                                selectAll: false
                            });
                        });
                    });
                });
            });
        }
    }
};

soyut.radiogram.SetSenderDetail = function(val){
    if(val != ""){
        if(roleName.isWASDAL) {
            soyut.radiogram.renderSenderWasdalDetail(val, function (res) {
                $(getInstanceID('sender-name')).val(res.data.callsign);
                $(getInstanceID('sender-pangkat')).val(res.data.rank);
            });
        }
        else {
            soyut.radiogram.renderSenderDetail(val, function(res){
                $(getInstanceID('sender-name')).val(res.callsign);
                $(getInstanceID('sender-pangkat')).val(res.rank);
            });
        }
    }
};

soyut.radiogram.renderCurrentWasdal = function () {
    if(soyut.Session.role.roleGroup != null) {
        var htmlKogas = '<h3>WASDAL: '+ roleName.roleGroupName.toUpperCase() +'</h3>';
        var htmlUser = '<h1 class="mainTitle">' + roleName.position + '</h1>';
        $(getInstanceID("detail-kogas")).html(htmlKogas);
        $(getInstanceID("detail-user")).html(htmlUser);
    }
    else {
        alert("Role group belum di assign!");
    }
};

soyut.radiogram.renderCurrentUser = function () {
    if(soyut.Session.role.roleGroup != null) {
        soyut.radiogram.renderRoleGroup(function(res){
            var htmlKogas = '<h3>KOGAS: '+ res.name.toUpperCase() +'</h3>';
            var htmlUser = '<h1 class="mainTitle">' + roleName.position + '</h1>';
            $(getInstanceID("detail-kogas")).html(htmlKogas);
            $(getInstanceID("detail-user")).html(htmlUser);
        });
    }
    else {
        alert("Role group belum di assign!");
    }
};

soyut.radiogram.renderUnreadMessage = function (message, mcount) {
    var count = mcount;
    var total = '';
    if(message == 'inbox') {
        $('ul.messages-list > li').each(function () {
            if (roleName.isWASDAL) {
                if ($(this).css("display") != 'none') {
                    var datastatus = $(this).attr('data-status');

                    if (datastatus == 'unread') {
                        count++;
                    }
                    if (count > 0) {
                        total = count;
                    }
                }
            }
            else {
                var datastatus = $(this).attr('data-status');

                if (datastatus == 'unread') {
                    count++;
                }
                if (count > 0) {
                    total = count;
                }
            }
            $(getInstanceID('wdl-sum-inbox')).html(total);
        });
    }
};

soyut.radiogram.renderSelectedMateri = function () {
    var selmateri = $("input:checkbox[name=select-materi]:checked");
    var getMateri = [];
    selmateri.each(function () {
        getMateri.push($(this).val());
    });

    function containAll(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) == -1) {
                return false;
            }
            return true;
        }
    }

    if(getMateri.length > 0 ) {
        $('ul.messages-list > li').each(function () {
            var mid = $(this).attr('data-id');
            if ($(this).css("display") != 'none') {
                var materi = $(this).attr('data-materi');
                if (materi != '') {
                    var tempArray = [];
                    var myarray = materi.split(',');

                    for (var i = 0; i < myarray.length; i++) {
                        tempArray.push(myarray[i]);
                    }

                    if (containAll(getMateri, tempArray)) {
                        console.log('Do not hidden this array!')
                    }
                    else {
                        $('.message-data-' + mid).css('display', 'none');
                    }
                }
                else {
                    $('.message-data-' + mid).css('display', 'none');
                }
            }
            else {
                $('.message-data-' + mid).css('display', 'none');
            }
        });
    }
};

soyut.radiogram.renderKogasAccess = function () {
    function checkCurrentAccess(arr1, arr2, callback) {
        var arrResult = [];
        for (var i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) == -1) {
                arrResult.push(arr1[i]);
            }
        }
        callback(arrResult);
    };



    if(roleName.rga.length > 0) {
        var arrKogas = [];
        $('ul.wdl-kogas-list > div > li').each(function () {
            var dataname = $(this).attr('data-name');
            arrKogas.push(dataname);
        });

        checkCurrentAccess(arrKogas, roleName.rga, function (res) {
            res.forEach(function (i) {
                $('.kogas-data-' + i).css('display', 'none');
            });
        });

        var arrWasdal = [];
        $('ul.wdl-folders > li').each(function () {
            var dataname = $(this).attr('data-name');
            arrWasdal.push(dataname);
        });

        checkCurrentAccess(arrWasdal, roleName.rga, function (res) {
            res.forEach(function (i) {
                $('.wdl-data-' + i).css('display', 'none');
            });
        });

        var arrInbox = [];
        $('ul.messages-list > li').each(function () {
            var dataname = $(this).attr('data-group');
            arrInbox.push(dataname);
        });

        checkCurrentAccess(arrInbox, roleName.rga, function (res) {
            res.forEach(function (i) {
                if(i != undefined){
                    $('.inbox-data-' + i).css('display', 'none');
                }
            });
        });
    }
};

soyut.radiogram.init = function () {
    soyut.radiogram.perfectScrollbarHandler();
    soyut.radiogram.messageHeightHandler();
    soyut.radiogram.sidebarHandler();
    soyut.radiogram.renderInbox();
    soyut.radiogram.renderContent();

    $(".derajat").select2({ width: '100%' });

    if(roleName.isWASDAL) {
        soyut.radiogram.renderCurrentWasdal();
        soyut.radiogram.renderWasdalRadiogram('.role-group-list');
        soyut.radiogram.renderKogasRadiogram('.wdl-kogas-list');

    }
    else {
        soyut.radiogram.renderCurrentUser();
        $(getInstanceID('role-group-name')).css('display','none');
        $(getInstanceID('materi-name')).css('display','none');
        $(getInstanceID('materi-list')).css('display','none');
    }

    soyut.radiogram.getListSender(function (res) {
        console.log(res)
    })
};

soyut.radiogram.init();

