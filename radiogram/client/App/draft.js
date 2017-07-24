var roleName = soyut.Session.role;
var fontSize = '24px';
var getId = getParam('id');

soyut.radiogram.rigSidebarHandler = function() {
    var $html = $('html'), $win = $(window), wrap = $('.app-aside'), MEDIAQUERY = {}, app = $('.rdgdraft-app');
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
        if (!$('.rdgdraft-app').hasClass('app-slide-off') && !$('.rdgdraft-app').hasClass('app-offsidebar-open')) {
            $winOffsetTop = $win.scrollTop();
            $winScrollTop = 0;
            $('footer').hide();
            $appWidth = $('.rdgdraft-app .main-content').innerWidth();
            $('.rdgdraft-app .main-content').css({
                position : 'absolute',
                top : -$winOffsetTop,
                width : $appWidth
            });
        } else {
            resetSidebar();
        }

    });

    $(document).on("mousedown touchstart", function(e) {
        if (elem.has(e.target).length === 0 && !elem.is(e.target) && !sidebarMobileToggler.is(e.target) && ($('.rdgdraft-app').hasClass('app-slide-off') || $('.rdgdraft-app').hasClass('app-offsidebar-open'))) {
            resetSidebar();
        }
    });

    var resetSidebar = function() {
        $winScrollTop = $winOffsetTop;
        $(".rdgdraft-app .app-content").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {

            if (!$('.rdgdraft-app').hasClass('app-slide-off') && !$('.rdgdraft-app').hasClass('app-offsidebar-open')) {
                $('.rdgdraft-app .main-content').css({
                    position : 'relative',
                    top : 'auto',
                    width : 'auto'
                });

                window.scrollTo(0, $winScrollTop);
                $('footer').show();
                $(".rdgdraft-app .app-content").off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
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

soyut.radiogram.rigtPerfectScrollbarHandler = function () {
    var pScroll = $(".perfect-scrollbar");

    if (!soyut.radiogram.rigIsMobile() && pScroll.length) {
        pScroll.perfectScrollbar({
            suppressScrollX : true
        });
        pScroll.on("mousemove", function() {
            $(this).perfectScrollbar('update');
        });
    }
};

soyut.radiogram.rigMessageHeightHandler = function() {
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
soyut.radiogram.rigResizeHandler = function(func, threshold, execAsap) {
    $(window).resize(function() {
        soyut.radiogram.draftMessageHeightHandler();
    });
};

soyut.radiogram.rigIsMobile = function() {
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

Vue.filter('fromfilter', function (value) {
    var length = 12;

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

soyut.radiogram.rigClearInput = function() {
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

soyut.radiogram.rigRenderContent = function () {
    $('.rdgdraft-main .rdgdraft-sidebar > div nav > ul li > a').css({"font-size": fontSize});
    $('.rdgdraft-sidebar > div nav > div > ul li > a').css({"font-size": fontSize});
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
        $('.rdgdraft-main .rdgdraft-sidebar > div nav > ul li > a').css({"font-size": fontsize});
        $('.rdgdraft-sidebar > div nav > div > ul li > a').css({"font-size": fontsize});
        $('.button-o').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-content').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-subject').css({"font-size": fontsize});
        $('.messages-list .messages-item .messages-item-from').css({"font-size": fontsize});
        $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontsize});
        $('.btn').css({"font-size": fontsize});
    });

    $(getInstanceID("rdgdraft-nav-draft")).click(function (event) {
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

        soyut.radiogram.rigRenderDraft();
    });

    $(getInstanceID("rdgdraft-nav-trash")).click(function (event) {
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

        soyut.radiogram.rigRenderTrash();
    });

    $(getInstanceID("rdgdraft-nav-compose")).click(function (event) {
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

        soyut.radiogram.rigRenderCompose('','');
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
                                                    soyut.radiogram.rigClearInput();
                                                    $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
                                                    $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

                                                    soyut.radiogram.rigRenderDraft();
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
                                                        soyut.radiogram.rigClearInput();
                                                        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
                                                        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

                                                        soyut.radiogram.rigRenderDraft();
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
    });
};

soyut.radiogram.rigRenderDraft = function () {
    soyut.radiogram.rigClearInput();
    $(getInstanceID("rdgdraft-nav-draft")).parent().addClass("active");
    $(getInstanceID("rdgdraft-nav-draft")).parent().addClass("open");

    $(getInstanceID("rdgdraft-email-content")).removeClass('disable');
    $(getInstanceID("rdgdraft-email-form")).addClass('disable');

    soyut.radiogram.rigRenderListMessage('.email-list', '.email-reader', 'draft', '');
};

soyut.radiogram.rigRenderTrash = function () {
    soyut.radiogram.rigClearInput();
    $(getInstanceID("rdgdraft-nav-trash")).parent().addClass("active");
    $(getInstanceID("rdgdraft-nav-trash")).parent().addClass("open");

    $(getInstanceID("rdgdraft-email-content")).removeClass('disable');
    $(getInstanceID("rdgdraft-email-form")).addClass('disable');

    soyut.radiogram.rigRenderListMessage('.email-list', '.email-reader', 'trash', '');
};

soyut.radiogram.rigRenderCompose = function (referenceId, refSender, refMateri) {
    soyut.radiogram.rigClearInput();

    $('.rdgdraft-main').css({"font-size": fontSize});
    $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontSize});
    $('.btn').css({"font-size": fontSize});

    $(getInstanceID("rdgdraft-email-form")).removeClass('disable');
    $(getInstanceID("rdgdraft-email-content")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    soyut.radiogram.rigRenderSenderWasdal('new', null);
    soyut.radiogram.rigRenderReceiverWasdal('new', null);
    soyut.radiogram.rigRenderCCWasdal('new', null);
    soyut.radiogram.rigRenderMateriWasdal('new', null);
};


soyut.radiogram.rigEditMessage = function(val){
    soyut.radiogram.rigClearInput();
    $(getInstanceID("rdgdraft-email-form")).removeClass('disable');
    $(getInstanceID("rdgdraft-email-content")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    soyut.radiogram.renderRadiogramDetail(val, function(res) {
        soyut.radiogram.rigRenderMateriWasdal('edit', res.materi);
        soyut.radiogram.rigRenderSenderWasdal('edit', res.sender);
        soyut.radiogram.rigRenderReceiverWasdal('edit', res.receivers);
        soyut.radiogram.rigRenderCCWasdal('edit', res.cc);
        soyut.radiogram.rigRenderApproval('edit', res.approved);
        $(getInstanceID("list-approval")).css('visibility', 'hidden');
        $(getInstanceID("list-approval")).css('height', '5px');

        $(getInstanceID("editId")).val(res.id);
        $(getInstanceID("refauthor")).val(res.author);
        $(getInstanceID("panggilan")).val(res.panggilan);
        $(getInstanceID("jenis")).val(res.jenis);
        $(getInstanceID("nomor")).val(res.nomor);
        $(getInstanceID("derajat")).val(res.derajat);
        $(getInstanceID("instruksi")).val(res.instruksi);
        $(getInstanceID("tandadinas")).val(res.tandadinas);
        $(getInstanceID("group")).val(res.group);
        $(getInstanceID("klasifikasi")).val();
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

Vue.component('email-reader', {
    props: ['contents', 'messages', 'attributes'],
    template: '#email-reader',
    methods: {
        moment: function (date) {
            return moment(date);
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
            if(val == 'trash'){
                var attr;
                attr = {
                    'style': 'display:none'
                };
                return attr;
            }
        }
    }
});

soyut.radiogram.rigRenderMessageDetail = function (elSelector, message, state) {
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
        attributes +=
            '<div class="col-md-8">' +
            '<div class="form-group"><p class="text-bold">MATERI :</p> ' + arrMateri + ' </div>' +
            '</div>' +
            '<div class="col-md-4">' +
            '<div class="form-group pull-right"><p class="text-bold">Author</p> ' + data.author + '</div>' +
            '</div>';

        vm = new Vue({
            el: elSelector,
            data: {
                contents: data,
                messages: renderMessage,
                attributes: attributes
            },
            methods: {
                MoveMessage: function(content){
                    var r = confirm("Anda Yakin?");
                    if (r == true) {
                        console.log('radiogram Warning, delete radiogram');
                        soyut.radiogram.Radiogram_UpdateToTrash({id: content.id}, function (err, data) {
                            if(!err){
                                switch(state){
                                    case 'draft':
                                        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
                                        $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");
                                        soyut.radiogram.rigRenderDraft();
                                        break;
                                }
                            }
                        });
                    }
                },
                DeleteMessage: function(content){
                    var r = confirm("Anda Yakin?");
                    if (r == true) {
                        console.log('radiogram Warning, delete radiogram');
                        soyut.radiogram.renderRadiogramParent(content.id, function (res) {
                            res.forEach(function (i) {
                                soyut.radiogram.Radiogram_delete({id: res.id}, function (err, result) {
                                    if(!err){

                                    }
                                });
                            });
                            soyut.radiogram.Radiogram_delete({id: content.id}, function (err, data) {
                                if(!err){
                                    soyut.radiogram.rigRenderTrash();
                                }
                            });
                        });
                    }
                },
                EditMessage: function(content){
                    $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("active");
                    $(getInstanceID("rdgdraft-navigation-menu")).children().removeClass("open");

                    soyut.radiogram.rigEditMessage(content.id);
                },
                PrintPdf: function (content) {
                    soyut.radiogram.rigPrintPDF(content.id);
                },
                SavePdf: function (content) {
                    soyut.radiogram.rigSavePdf(content.id);
                },
                SubmitMessage: function(content){
                    var data = {
                        id: getId,
                        radiogram: content.id,
                        radiogramno: content.no,
                        radiogramcontent: content.content,
                        session: content.session
                    };

                    var activity = getActivityInstance();
                    activity.context.invoke('loadradiogram_selected', data);
                    activity.window.close();
                }
            }
        });
    });
};

soyut.radiogram.rigSavePdf = function(val){
    soyut.radiogram.RenderPrinterPDF(val, function(res){
        soyut.radiogram.rigSaveFilePDF(res, function (err, result) {
            soyut.radiogram.rigShow_PdfViewer(result);
        });
    });
};

soyut.radiogram.rigSaveFilePDF = function(val, rescallback) {
    var dataurl = "https://"+soyut.radiogram.origin+"/data/"+val;
    var curUrl = soyut.radiogram.origin.split(':');
    var storageServer = 'storage.soyut';

    function getFile(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                // get binary data as a response
                callback(false, this.response);
            }
        };
        xhr.onerror = function (e) {
            callback(true, e);
        };
        xhr.send();
    }

    function saveFileToSystem(targetFolder){
        soyut.storage.getStorageKeyAsync({userId: fileSystem.userid}).then(function(storageKey) {
            var storagePath = targetFolder + "/" +val;
            var fileUrl = 'https://'+ storageServer +':5454/storage/' + storageKey + storagePath;

            function getPosition(str, m, i) { return str.split(m, i).join(m).length; }

            var safeUrl = dataurl.substring(0, 8) + curUrl[0] + dataurl.substring(getPosition(dataurl, ':', 2));

            // debugger;
            getFile(safeUrl, function(err, dataBuffer) {
                if (err) return;
                soyut.storage.putAsync({
                    storageKey: storageKey,
                    path: storagePath,
                    dataBuffer: dataBuffer
                }).then(function() {
                    console.log("File PDF telah berhasil di simpan ke file browser!");
                    rescallback(false, fileUrl);
                });
            });
        });
    }

    soyut.clock.getCurrentActualTime({}, function(err, reclock){
        var strFolder = "RDG-" + moment(reclock).format('DD-MM-YYYY');
        var tgtDir = "/" + strFolder;

        fileSystem.ls(tgtDir, function (err, files) {
            if(files.length == 0){
                fileSystem.mkdir(tgtDir, function(err, res) {
                    saveFileToSystem(tgtDir);
                });
            }
            else{
                saveFileToSystem(tgtDir);
            }
        });
    });
};

soyut.radiogram.rigselectProvider = function (val) {
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

soyut.radiogram.rigPrintPDF = function(val){
    $(getInstanceID('printerAlertModal')).modal();
    $(getInstanceID('printerAlertModal')).appendTo(".wdl-main");
    $('.modal-backdrop').css("z-index", "-1");

    soyut.radiogram.renderProviderPrinter(roleName.roleGroup, function (print) {
        var html = 'Provider: <select id="provider-name" name="provider-name" class="provider-name form-control" onchange="soyut.radiogram.selectProvider(this.value)">';
        print.forEach(function (i) {
            html += '<option value="'+ i.name +'">'+ i.name +'</option>';
        });
        html += '</select>';
        $(getInstanceID('lp-provider')).html(html);
        soyut.radiogram.rigselectProvider($('.provider-name').val());
    });

    $(getInstanceID("btn-print-radiogram")).click(function (event) {
        soyut.radiogram.RenderPrinterPDF(val, function (res) {
            soyut.radiogram.rigSaveFilePDF(res, function (err, result) {
                var providerName = $('.provider-name').val();
                var printerName = $('.printer-name').val();
                console.log("print "+providerName+" - "+ printerName);
                soyut.printserver.print({
                    docURL : result,
                    origin : 'Radiogram',
                    provider : providerName,
                    printer : printerName
                }, function(print){
                    console.log(print);
                    $(getInstanceID('printerAlertModal')).modal('hide');
                })
            });
        });
    });
};

soyut.radiogram.rigShow_PdfViewer = function(val) {
    var app = getAppInstance();

    app.launchActivity("soyut.module.app.radiogram.pdfviewer", {file: val});
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

soyut.radiogram.rigRenderListMessage = function (elSelector, elChildren, message, group) {
    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<email-list :messages="messages"></email-list>');

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
                LoadMessages: function () {
                    soyut.radiogram.rigRenderSelectedMateri();
                },
                viewMessageDetail: function (val) {
                    soyut.radiogram.renderMessageObj(val, function (data) {
                        soyut.radiogram.rigRenderListMessage('.email-list', '.email-reader', data.composeStatus, '');
                        soyut.radiogram.rigRenderMessageDetail('.email-reader', val, message);

                    });
                }
            }
        });
    });
};

soyut.radiogram.rigRenderSelectedMateri = function () {
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

soyut.radiogram.rigRenderCurrentWasdal = function () {
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

soyut.radiogram.rigSetSenderDetail = function(val){
    if(val != ""){
        soyut.radiogram.renderSenderWasdalDetail(val, function (res) {
            $(getInstanceID('sender-name')).val(res.data.callsign);
            $(getInstanceID('sender-pangkat')).val(res.data.rank);
        });
    };
};

soyut.radiogram.rigRenderApproval = function (state, value) {
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

    $(getInstanceID("list-approval")).append(html);
};

soyut.radiogram.rigRenderMateriWasdal = function (state, value) {
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
soyut.radiogram.rigRenderReceiverWasdal = function (state, value) {
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

soyut.radiogram.rigRenderSenderWasdal = function (state, value) {
    $(getInstanceID("list-sender")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.rigSetSenderDetail(this.value)">';
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
                var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.rigSetSenderDetail(this.value)">';
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

soyut.radiogram.rigRenderCCWasdal = function (state, value) {
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

soyut.radiogram.rigInit = function () {
    soyut.radiogram.rigtPerfectScrollbarHandler();
    soyut.radiogram.rigMessageHeightHandler();
    soyut.radiogram.rigSidebarHandler();
    soyut.radiogram.rigRenderDraft();
    soyut.radiogram.rigRenderContent();

    $(".derajat").select2({ width: '100%' });

    soyut.radiogram.rigRenderCurrentWasdal();
};

soyut.radiogram.rigInit();