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

// socket.on('new_radiogram', function (data) {
//     data.new_val.receivers.forEach(function(i){
//         if(roleName.id == i){
//             if(data.new_val.composeStatus == 'inbox'){
//                 SendNotification(data.new_val.title, data.new_val.content, data.new_val.id);
//                 soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.new_val.composeStatus);
//             }
//         }  
//     });
// });

Vue.filter('truncate', function (value) {
    var length = 50;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

Vue.filter('truncsender', function (value) {
    var length = 10;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

soyut.radiogram.SendNotification = function(title, content, id) {
    console.log("load notif");
    var app = getAppInstance();

    soyut.Event.getInstance().invokeSystemEvent('notification', {
        title: title, content: content, handler: function (d) {
            console.log(id);
            //app.launchActivity("soyut.module.app.radiogram.main", {radiogramId: id});
        }
    });
};


soyut.radiogram.renderInbox = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("active");
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'inbox');
};

soyut.radiogram.renderSent = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-sent")).parent().addClass("active");
    $(getInstanceID("wdl-nav-sent")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'sent');
};

soyut.radiogram.renderDraft = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-draft")).parent().addClass("active");
    $(getInstanceID("wdl-nav-draft")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'draft');
};
soyut.radiogram.renderTrash = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-nav-trash")).parent().addClass("active");
    $(getInstanceID("wdl-nav-trash")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'trash');
};

soyut.radiogram.renderCompose = function (referenceId, refSender, refmateri) {
    $('.wdl-main').css({"font-size": fontSize});
    $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontSize});
    $('.btn').css({"font-size": fontSize});

    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-email-form")).removeClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');
    
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
        soyut.radiogram.renderMateri('edit', refmateri);
    }
    else {
        soyut.radiogram.renderMateri('new', null);
    }

    if(roleName.isWASDAL){
        $(getInstanceID("ref_sender")).val(refSender);
        soyut.radiogram.renderMateriWasdal('new', null);
        soyut.radiogram.renderSenderWasdal('new', null);
        soyut.radiogram.renderReceiverWasdal('new', null, null, null);
        soyut.radiogram.renderCCWasdal('new', null, null, null);

    }
    else{
        $(getInstanceID("ref_sender")).val('');
        // soyut.radiogram.renderMateri('new', null);
        soyut.radiogram.renderComposeSender('new', null);
        soyut.radiogram.renderComposeReceivers('new', null, null);
        soyut.radiogram.renderComposeCC('new', null, null);
        $(getInstanceID("list-materi")).css('visibility', 'hidden');
    }
};

soyut.radiogram.renderKop = function () {
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).removeClass('disable');
};

soyut.radiogram.renderSelectedMateri = function () {
    console.log("aaaa")
    $('ul.messages-list > li').each(function(){
        console.log("ok")
    });
};

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
        $('.wdl-main').css({"font-size": fontsize});
        $('textarea, select, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"]').css({"font-size": fontsize});
        $('.btn').css({"font-size": fontsize});
    });

    $(getInstanceID("wdl-nav-inbox")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderInbox();
    });

    $(getInstanceID("wdl-nav-sent")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderSent();
    });

    $(getInstanceID("wdl-nav-draft")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderDraft();
    });

    $(getInstanceID("wdl-nav-trash")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderTrash();
    });

    $(getInstanceID("wdl-nav-compose")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderCompose('','','');
    });

    $(getInstanceID("wdl-nav-kop")).click(function (event) {
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");

        soyut.radiogram.renderKop();
    });

    $(getInstanceID("btnSaveKop")).click(function(event){
        console.log("save kop surat")
    });

    // $('.select-materi').click(function (event) {
    //     var materi = $("input:checkbox[name=select-materi]:checked");
    //     var arrMateri = [];
    //     materi.each(function () {
    //         arrMateri.push($(this).val());
    //     });
    //
    //     var listMateri = '';
    //     arrMateri.forEach(function (i) {
    //         listMateri = listMateri + i + " ";
    //     });
    //
    //     $('ul.messages-list > li').each(function(){
    //         var currentLiText = $(this).attr('data-type');
    //         console.log(currentLiText)
    //         // var showCurrentLi = currentLiText.indexOf(listMateri) !== -1;
    //         //
    //         // $(this).toggle(showCurrentLi);
    //     });
    // });

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
            if(roleName.isWASDAL){
                var lsrcvr = [];
                var klsrcvr = [];
                var alsrcvr = [];
                receiverRole.forEach(function (i) {
                    var mi = i.split(":");
                    if(mi[1] == "vrole"){
                        lsrcvr.push(mi[0]);
                    }
                    else if(mi[1] == 'role') {
                        klsrcvr.push(mi[0]);
                    }
                    else {
                        alsrcvr.push(mi[0]);
                    }
                });

                var lscc = [];
                var klcc = [];
                var alcc = [];
                if(tembusan != undefined || tembusan != null) {
                    if (tembusan.length > 0) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                lscc.push(mi[0]);
                            }
                            else if (mi[1] == 'role') {
                                klcc.push(mi[0]);
                            }
                            else {
                                alcc.push(mi[0]);
                            }
                        });
                    }
                }

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
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    sender: senderRole,
                    receivers: lsrcvr,
                    kreceivers: klsrcvr,
                    alsreceivers: alsrcvr,
                    cc: lscc,
                    kcc: klcc,
                    alscc: alcc,
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
                    $(getInstanceID("wdl-kop-form")).addClass('disable');
                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                    soyut.radiogram.renderSendingResult('.email-result', res);
                });
            }
            else{
                var lsrcvr = [];
                var klsrcvr = [];
                receiverRole.forEach(function (i) {
                    var mi = i.split(":");
                    if(mi[1] == "vrole"){
                        lsrcvr.push(mi[0]);
                    }
                    else {
                        klsrcvr.push(mi[0]);
                    }
                });

                var lscc = [];
                var klcc = [];
                if(tembusan != undefined || tembusan != null) {
                    if (tembusan.length > 0) {
                        tembusan.forEach(function (i) {
                            var mi = i.split(":");
                            if (mi[1] == "vrole") {
                                lscc.push(mi[0]);
                            }
                            else {
                                klcc.push(mi[0]);
                            }
                        });
                    }
                }

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
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    owner: senderRole,
                    sender: senderRole,
                    receivers: lsrcvr,
                    kreceivers: klsrcvr,
                    cc: lscc,
                    kcc: klcc,
                    senderName: senderName,
                    senderRank: senderRank,
                    author: roleName.position
                }, function (res) {
                    soyut.radiogram.clearInput();

                    $(getInstanceID("wdl-email-content")).addClass('disable');
                    $(getInstanceID("wdl-email-form")).addClass('disable');
                    $(getInstanceID("wdl-email-view")).addClass('disable');
                    $(getInstanceID("wdl-kop-form")).addClass('disable');
                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                    soyut.radiogram.renderSendingResult('.email-result', res);
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

            if(editId == null || editId == ""){
                if(roleName.isWASDAL){
                    var lsrcvr = [];
                    var klsrcvr = [];
                    var alsrcvr = [];
                    receiverRole.forEach(function (i) {
                        var mi = i.split(":");
                        if(mi[1] == "vrole"){
                            lsrcvr.push(mi[0]);
                        }
                        else if(mi[1] == 'role') {
                            klsrcvr.push(mi[0]);
                        }
                        else {
                            alsrcvr.push(mi[0]);
                        }
                    });

                    var lscc = [];
                    var klcc = [];
                    var alcc = [];
                    if(tembusan != undefined || tembusan != null) {
                        if (tembusan.length > 0) {
                            tembusan.forEach(function (i) {
                                var mi = i.split(":");
                                if (mi[1] == "vrole") {
                                    lscc.push(mi[0]);
                                }
                                else if (mi[1] == 'role') {
                                    klcc.push(mi[0]);
                                }
                                else {
                                    alcc.push(mi[0]);
                                }
                            });
                        }
                    }

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
                        Number: no,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        content: message,
                        readStatus: 'unread',
                        sender: senderRole,
                        receivers: lsrcvr,
                        kreceivers: klsrcvr,
                        alsreceivers: alsrcvr,
                        cc: lscc,
                        kcc: klcc,
                        alscc: alcc,
                        senderName: senderName,
                        senderRank: senderRank,
                        author: roleName.position
                    },function(res){
                        soyut.radiogram.clearInput();
                        soyut.radiogram.renderDraft();
                    });
                }
                else{
                    var lsrcvr = [];
                    var klsrcvr = [];
                    receiverRole.forEach(function (i) {
                        var mi = i.split(":");
                        if(mi[1] == "vrole"){
                            lsrcvr.push(mi[0]);
                        }
                        else {
                            klsrcvr.push(mi[0]);
                        }
                    });

                    var lscc = [];
                    var klcc = [];
                    if(tembusan != undefined || tembusan != null) {
                        if (tembusan.length > 0) {
                            tembusan.forEach(function (i) {
                                var mi = i.split(":");
                                if (mi[1] == "vrole") {
                                    lscc.push(mi[0]);
                                }
                                else {
                                    klcc.push(mi[0]);
                                }
                            });
                        }
                    }

                    var arAuthor = ''
                    if(roleName.isSet){
                        arAuthor = '';
                    }
                    else {
                        arAuthor = roleName.position;
                    }

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
                        Number: no,
                        cara: cara,
                        paraf: paraf,
                        alamataksi: alamataksi,
                        alamattembusan: alamattembusan,
                        content: message,
                        readStatus: 'unread',
                        sender: senderRole,
                        receivers: lsrcvr,
                        kreceivers: klsrcvr,
                        cc: lscc,
                        kcc: klcc,
                        senderName: senderName,
                        senderRank: senderRank,
                        author: arAuthor
                    },function(res){
                        soyut.radiogram.clearInput();
                        soyut.radiogram.renderInbox();
                    });
                }
            }
            else{
                if(roleName.isWASDAL){
                    var lsrcvr = [];
                    var klsrcvr = [];
                    var alsrcvr = [];
                    receiverRole.forEach(function (i) {
                        var mi = i.split(":");
                        if(mi[1] == "vrole"){
                            lsrcvr.push(mi[0]);
                        }
                        else if(mi[1] == 'role') {
                            klsrcvr.push(mi[0]);
                        }
                        else {
                            alsrcvr.push(mi[0]);
                        }
                    });

                    var lscc = [];
                    var klcc = [];
                    var alcc = [];
                    if(tembusan != undefined || tembusan != null) {
                        if (tembusan.length > 0) {
                            tembusan.forEach(function (i) {
                                var mi = i.split(":");
                                if (mi[1] == "vrole") {
                                    lscc.push(mi[0]);
                                }
                                else if (mi[1] == 'role') {
                                    klcc.push(mi[0]);
                                }
                                else {
                                    alcc.push(mi[0]);
                                }
                            });
                        }
                    }

                    soyut.radiogram.renderRadiogramDetail(editId, function(res){
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
                            Number: no,
                            cara: cara,
                            paraf: paraf,
                            alamataksi: alamataksi,
                            alamattembusan: alamattembusan,
                            content: message,
                            readStatus: 'unread',
                            sender: senderRole,
                            receivers: lsrcvr,
                            kreceivers: klsrcvr,
                            alsreceivers: alsrcvr,
                            cc: lscc,
                            kcc: klcc,
                            alscc: alcc,
                            senderName: senderName,
                            senderRank: senderRank,
                            author: roleName.position
                        },function(res){
                            soyut.radiogram.clearInput();
                            soyut.radiogram.renderDraft();
                        });
                    });
                }
                else{
                    soyut.radiogram.renderRadiogramDetail(editId, function(res){
                        var lsrcvr = [];
                        var klsrcvr = [];
                        receiverRole.forEach(function (i) {
                            var mi = i.split(":");
                            if(mi[1] == "vrole"){
                                lsrcvr.push(mi[0]);
                            }
                            else {
                                klsrcvr.push(mi[0]);
                            }
                        });

                        var lscc = [];
                        var klcc = [];
                        if(tembusan != undefined || tembusan != null) {
                            if (tembusan.length > 0) {
                                tembusan.forEach(function (i) {
                                    var mi = i.split(":");
                                    if (mi[1] == "vrole") {
                                        lscc.push(mi[0]);
                                    }
                                    else {
                                        klcc.push(mi[0]);
                                    }
                                });
                            }
                        }

                        var arAuthor = ''
                        if(roleName.isSet){
                            arAuthor = refauthor;
                        }
                        else {
                            arAuthor = roleName.position;
                        }

                        console.log(arAuthor)
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
                            Number: no,
                            cara: cara,
                            paraf: paraf,
                            alamataksi: alamataksi,
                            alamattembusan: alamattembusan,
                            content: message,
                            readStatus: 'unread',
                            sender: senderRole,
                            receivers: lsrcvr,
                            kreceivers: klsrcvr,
                            cc: lscc,
                            kcc: klcc,
                            senderName: senderName,
                            senderRank: senderRank,
                            author: arAuthor
                        },function(res){
                            soyut.radiogram.clearInput();
                            soyut.radiogram.renderDraft();
                        });
                    });
                }
            }
        }
    });
};

soyut.radiogram.clearInput = function(){
    $(getInstanceID("btnSubmitMessage")).css({display:''});

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

soyut.radiogram.getListPangkogas = function (scenario, callback) {
    var getRole = [];
    scenarioService.Role_getAddressList({scenario:scenario, isAddress:true}, function(err, listKogas){
        listKogas.forEach(function(i){
            var roles = {
                'id': i.id,
                'callsign': i.callsign,
                'scenario': i.scenario,
                'position': i.position
            };
            getRole.push(roles);
        });
        callback(false, getRole);
    });
};

Vue.component('role-group-list', {
    props: ['groups'],
    template: '#role-group-list',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ViewInboxGroup: function (val) {
            this.$root.ViewInboxGroup(val);
        },
        ViewSentGroup: function(val){
            this.$root.ViewSentGroup(val);
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

    vm = new Vue({
        el: elSelector,
        data: {
            groups: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadGroups();
            });
        },
        methods: {
            LoadGroups: function () {
                var _this = this;

                soyut.radiogram.renderListRoleGroup(function(res){
                    _this.$set(_this, 'groups', res);
                });
            },
            ViewInboxGroup: function(val){
                soyut.radiogram.renderInbox();
                soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'inbox', val);
            },
            ViewSentGroup: function(val){
                soyut.radiogram.renderInbox();
                soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'sent', val);
            }
        }
    });
};

Vue.component('wasdal-list', {
    props: ['messages'],
    template: '#wasdal-list',
    methods: {
        moment: function (date) {
            return moment(date);
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
    var vm;

    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<wasdal-list :messages="messages"></wasdal-list>');

    vm = new Vue({
        el: elSelector,
        data: {
            messages: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;

                var selmateri = $("input:checkbox[name=select-materi]:checked");
                var getMateri = [];
                selmateri.each(function () {
                    getMateri.push($(this).val());
                });

                function containAll(arr1, arr2) {
                    for(var i=0, len = arr1.length; i < len; i++) {
                        if (arr2.indexOf(arr1[i]) == -1){
                            return false;
                        }
                        return true;
                    }
                }

                var getInboxRadiogram = function (owner, callback) {
                    soyut.radiogram.Radiogram_GetInboxByRole({id: owner, state: 'inbox', field:'SendTime', sort:'desc'}, function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                if (data != null) {
                                    callback(false, data);
                                }
                            }
                        }
                    });
                };
                var getOutboxRadiogram = function (owner, callback) {
                    soyut.radiogram.Radiogram_GetInboxByRole({id: owner, state: 'sent', field:'SendTime', sort:'desc'}, function (err, data) {
                        if (!err) {
                            if (data.length > 0) {
                                if (data != null) {
                                    callback(false, data);
                                }
                            }
                        }
                    });
                };

                if(message == "inbox") {
                    var arrData =[];
                    scenarioService.Role_getRoleByGroup({roleGroup: group}, function (err, rolegroup) {
                        console.log(rolegroup)
                        rolegroup.forEach(function (rg) {
                            getInboxRadiogram(rg.id, function (err, res) {
                                res.sort(function (a, b) {
                                    var dateA = new Date(a.SendTime),
                                        dateB = new Date(b.SendTime);
                                    return dateB - dateA;
                                });
                                res.forEach(function (i) {
                                    if(getMateri.length > 0 ) {
                                        if (containAll(i.materi, getMateri)) {
                                            var getRealTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                            var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                '<span class="text">wa ' + getRealTime + '</span>';

                                            arrData.push({
                                                id: i.id,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: stringTime,
                                                Number: i.Number,
                                                readStatus: i.readStatus,
                                                composeStatus: i.composeStatus,
                                                receiverCallsign: "PANGKOGAS"
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        }
                                    }
                                    else {
                                        var getRealTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                        var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                            '<span class="text">wa ' + getRealTime + '</span>';

                                        arrData.push({
                                            id: i.id,
                                            content: i.content,
                                            SendTime: i.SendTime,
                                            simtime: stringTime,
                                            Number: i.Number,
                                            readStatus: i.readStatus,
                                            composeStatus: i.composeStatus,
                                            receiverCallsign: "PANGKOGAS"
                                        });
                                        _this.$set(_this, 'messages', arrData);
                                    }
                                });
                            });
                        });
                    });
                }
                else{
                    var arrData =[];
                    scenarioService.Role_getRoleByGroup({roleGroup: group}, function (err, rolegroup) {
                        rolegroup.forEach(function (rg) {
                            getOutboxRadiogram(rg.id, function (err, res) {
                                if(containAll(res.materi, getMateri)) {
                                    res.sort(function (a, b) {
                                        var c = new Date(a.SendTime);
                                        var d = new Date(b.SendTime);
                                        return d - c;
                                    });
                                    res.forEach(function (i) {
                                        if(getMateri.length > 0 ) {
                                            if (containAll(i.materi, getMateri)) {
                                                var getRealTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                                var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                    '<span class="text">wa ' + getRealTime + '</span>';

                                                arrData.push({
                                                    id: i.id,
                                                    content: i.content,
                                                    SendTime: i.SendTime,
                                                    simtime: stringTime,
                                                    Number: i.Number,
                                                    readStatus: i.readStatus,
                                                    composeStatus: 'sent',
                                                    receiverCallsign: "PANGKOGAS"
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            }
                                        }
                                        else {
                                            var getRealTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                            var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                '<span class="text">wa ' + getRealTime + '</span>';

                                            arrData.push({
                                                id: i.id,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: stringTime,
                                                Number: i.Number,
                                                readStatus: i.readStatus,
                                                composeStatus: 'sent',
                                                receiverCallsign: "PANGKOGAS"
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        }
                                    });
                                }
                            });
                        });
                    });
                }
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.Radiogram_GetById({id: val}, function (err, data) {
                    if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                        if(!roleName.isWASDAL){
                            soyut.radiogram.Radiogram_UpdateReadStatus({id: data.id}, function (err, res) {
                                console.log("radigram telah di baca");
                            });
                        }
                    }
                    //soyut.radiogram.renderListGroupMessage('.email-list', '.email-reader', 'inbox', val);
                    soyut.radiogram.renderMessageDetail('.email-reader', val, 'inbox');

                });

            }
        }
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

soyut.radiogram.renderListMessage = function (elSelector, elChildren, message) {
    var vm;

    var $el = $(elSelector);
    var $child = $(elChildren);
    $el.html('');
    $child.html('');
    $el.append('<email-list :messages="messages"></email-list>');

    vm = new Vue({
        el: elSelector,
        data: {
            messages: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;

                var selmateri = $("input:checkbox[name=select-materi]:checked");
                var getMateri = [];
                selmateri.each(function () {
                    getMateri.push($(this).val());
                });

                if(roleName.isWASDAL){
                    var arrData =[];
                    soyut.radiogram.renderListWasdalMessages(message,function(res){
                        if(message == "draft"){
                            res.sort(function(a,b){
                                var c = new Date(a.createTime);
                                var d = new Date(b.createTime);
                                return d-c;
                            });
                        }
                        else{
                            res.sort(function(a,b){
                                var c = new Date(a.SendTime);
                                var d = new Date(b.SendTime);
                                return d-c;
                            });
                        }
                        var countArr = 0;

                        function containAll(arr1, arr2) {
                            for(var i=0, len = arr1.length; i < len; i++) {
                                if (arr2.indexOf(arr1[i]) == -1){
                                    return false;
                                }
                                return true;
                            }
                        }

                        res.forEach(function (vi) {
                            if(getMateri.length > 0 ) {
                                if (containAll(vi.materi, getMateri)) {

                                    countArr++;
                                    var arrMateri = '';
                                    if (vi.materi != null) {
                                        vi.materi.forEach(function (i) {
                                            arrMateri = arrMateri + i + " ";
                                        });
                                    }
                                    else {
                                        arrMateri = '';
                                    }

                                    if (message == "inbox") {
                                        var getRealTime = moment(vi.simtime).format("DD") + '-' + moment(vi.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(vi.simtime).format("YYYY")) + ' ' + moment(vi.simtime).format("hh") + ':' + moment(vi.simtime).format("mm");
                                        var stringTime = '<span class="text">ws ' + moment(vi.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                            '<span class="text">wa ' + getRealTime + '</span>';


                                        soyut.radiogram.renderSenderObj(vi.sender, vi.senderWasdal, function (sender) {
                                            if (vi.senderWasdal) {
                                                arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    createTime: vi.createTime,
                                                    stringTime: stringTime,
                                                    materi: arrMateri,
                                                    Number: vi.Number,
                                                    readStatus: vi.readStatus,
                                                    composeStatus: vi.composeStatus,
                                                    receiverCallsign: sender.position,
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            }
                                            else {
                                                soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                                    arrData.push({
                                                        id: vi.id,
                                                        title: vi.title,
                                                        content: vi.content,
                                                        SendTime: vi.SendTime,
                                                        simtime: vi.simtime,
                                                        createTime: vi.createTime,
                                                        stringTime: stringTime,
                                                        materi: arrMateri,
                                                        Number: vi.Number,
                                                        readStatus: vi.readStatus,
                                                        composeStatus: vi.composeStatus,
                                                        receiverCallsign: sender.position + " (" + senderrg.name + ")",
                                                        receiverRank: "",
                                                        receiverName: "",
                                                        receiverPhoto: ""
                                                    });
                                                    _this.$set(_this, 'messages', arrData);
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        var stringTime = '';
                                        if (message == 'draft') {
                                            stringTime = '<span class="text">dibuat ' + moment(vi.createTime).format("DD-MM-YYYY h:mm") + '</span>';
                                            soyut.radiogram.renderListReceiversDetail(vi.receivers, function (receivers) {
                                                soyut.radiogram.renderListKogasDetail(vi.kreceivers, function (kreceivers) {
                                                    soyut.radiogram.renderListAliasDetail(vi.alsreceivers, function (alsreceivers) {
                                                        arrData.push({
                                                            id: vi.id,
                                                            title: vi.title,
                                                            content: vi.content,
                                                            SendTime: vi.createTime,
                                                            simtime: vi.createTime,
                                                            createTime: vi.createTime,
                                                            stringTime: stringTime,
                                                            materi: arrMateri,
                                                            Number: vi.Number,
                                                            readStatus: vi.readStatus,
                                                            composeStatus: vi.composeStatus,
                                                            receiverCallsign: alsreceivers + " " + kreceivers + " " + receivers,
                                                            receiverRank: "",
                                                            receiverName: "",
                                                            receiverPhoto: ""
                                                        });
                                                        _this.$set(_this, 'messages', arrData);
                                                    });
                                                });
                                            });
                                        }
                                        else {
                                            if (vi.SendTime != null) {
                                                var getSimTime = moment(vi.simtime).format("DD") + '-' + moment(vi.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(vi.simtime).format("YYYY")) + ' ' + moment(vi.simtime).format("hh") + ':' + moment(vi.simtime).format("mm");
                                                stringTime = '<span class="text">ws ' + moment(vi.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                    '<span class="text">wa ' + getSimTime + '</span>';
                                            }
                                            else {
                                                stringTime = '<span class="text">dibuat ' + moment(vi.createTime).format("DD-MM-YYYY h:mm") + '</span>';
                                            }

                                            soyut.radiogram.renderListReceiversDetail(vi.receivers, function (receivers) {
                                                soyut.radiogram.renderListKogasDetail(vi.kreceivers, function (kreceivers) {
                                                    soyut.radiogram.renderListAliasDetail(vi.alsreceivers, function (alsreceivers) {
                                                        arrData.push({
                                                            id: vi.id,
                                                            title: vi.title,
                                                            content: vi.content,
                                                            SendTime: vi.SendTime,
                                                            simtime: vi.simtime,
                                                            createTime: vi.createTime,
                                                            stringTime: stringTime,
                                                            materi: arrMateri,
                                                            Number: vi.Number,
                                                            readStatus: vi.readStatus,
                                                            composeStatus: vi.composeStatus,
                                                            receiverCallsign: alsreceivers + " " + kreceivers + " " + receivers,
                                                            receiverRank: "",
                                                            receiverName: "",
                                                            receiverPhoto: ""
                                                        });
                                                        _this.$set(_this, 'messages', arrData);
                                                    });
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                            else {
                                countArr++;
                                var arrMateri = '';
                                if (vi.materi != null) {
                                    vi.materi.forEach(function (i) {
                                        arrMateri = arrMateri + i + " ";
                                    });
                                }
                                else {
                                    arrMateri = '';
                                }

                                if (message == "inbox") {
                                    var getRealTime = moment(vi.simtime).format("DD") + '-' + moment(vi.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(vi.simtime).format("YYYY")) + ' ' + moment(vi.simtime).format("hh") + ':' + moment(vi.simtime).format("mm");
                                    var stringTime = '<span class="text">ws ' + moment(vi.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                        '<span class="text">wa ' + getRealTime + '</span>';


                                    soyut.radiogram.renderSenderObj(vi.sender, vi.senderWasdal, function (sender) {
                                        if (vi.senderWasdal) {
                                            arrData.push({
                                                id: vi.id,
                                                title: vi.title,
                                                content: vi.content,
                                                SendTime: vi.SendTime,
                                                simtime: vi.simtime,
                                                createTime: vi.createTime,
                                                stringTime: stringTime,
                                                materi: arrMateri,
                                                Number: vi.Number,
                                                readStatus: vi.readStatus,
                                                composeStatus: vi.composeStatus,
                                                receiverCallsign: sender.position,
                                                receiverRank: "",
                                                receiverName: "",
                                                receiverPhoto: ""
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        }
                                        else {
                                            soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                                arrData.push({
                                                    id: vi.id,
                                                    title: vi.title,
                                                    content: vi.content,
                                                    SendTime: vi.SendTime,
                                                    simtime: vi.simtime,
                                                    createTime: vi.createTime,
                                                    stringTime: stringTime,
                                                    materi: arrMateri,
                                                    Number: vi.Number,
                                                    readStatus: vi.readStatus,
                                                    composeStatus: vi.composeStatus,
                                                    receiverCallsign: sender.position + " (" + senderrg.name + ")",
                                                    receiverRank: "",
                                                    receiverName: "",
                                                    receiverPhoto: ""
                                                });
                                                _this.$set(_this, 'messages', arrData);
                                            });
                                        }
                                    })
                                }
                                else {
                                    var stringTime = '';
                                    if (message == 'draft') {
                                        stringTime = '<span class="text">dibuat ' + moment(vi.createTime).format("DD-MM-YYYY h:mm") + '</span>';
                                        soyut.radiogram.renderListReceiversDetail(vi.receivers, function (receivers) {
                                            soyut.radiogram.renderListKogasDetail(vi.kreceivers, function (kreceivers) {
                                                soyut.radiogram.renderListAliasDetail(vi.alsreceivers, function (alsreceivers) {
                                                    arrData.push({
                                                        id: vi.id,
                                                        title: vi.title,
                                                        content: vi.content,
                                                        SendTime: vi.createTime,
                                                        simtime: vi.createTime,
                                                        createTime: vi.createTime,
                                                        stringTime: stringTime,
                                                        materi: arrMateri,
                                                        Number: vi.Number,
                                                        readStatus: vi.readStatus,
                                                        composeStatus: vi.composeStatus,
                                                        receiverCallsign: alsreceivers + " " + kreceivers + " " + receivers,
                                                        receiverRank: "",
                                                        receiverName: "",
                                                        receiverPhoto: ""
                                                    });
                                                    _this.$set(_this, 'messages', arrData);
                                                });
                                            });
                                        });
                                    }
                                    else {
                                        if (vi.SendTime != null) {
                                            var getSimTime = moment(vi.simtime).format("DD") + '-' + moment(vi.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(vi.simtime).format("YYYY")) + ' ' + moment(vi.simtime).format("hh") + ':' + moment(vi.simtime).format("mm");
                                            stringTime = '<span class="text">ws ' + moment(vi.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                '<span class="text">wa ' + getSimTime + '</span>';
                                        }
                                        else {
                                            stringTime = '<span class="text">dibuat ' + moment(vi.createTime).format("DD-MM-YYYY h:mm") + '</span>';
                                        }

                                        soyut.radiogram.renderListReceiversDetail(vi.receivers, function (receivers) {
                                            soyut.radiogram.renderListKogasDetail(vi.kreceivers, function (kreceivers) {
                                                soyut.radiogram.renderListAliasDetail(vi.alsreceivers, function (alsreceivers) {
                                                    arrData.push({
                                                        id: vi.id,
                                                        title: vi.title,
                                                        content: vi.content,
                                                        SendTime: vi.SendTime,
                                                        simtime: vi.simtime,
                                                        createTime: vi.createTime,
                                                        stringTime: stringTime,
                                                        materi: arrMateri,
                                                        Number: vi.Number,
                                                        readStatus: vi.readStatus,
                                                        composeStatus: vi.composeStatus,
                                                        receiverCallsign: alsreceivers + " " + kreceivers + " " + receivers,
                                                        receiverRank: "",
                                                        receiverName: "",
                                                        receiverPhoto: ""
                                                    });
                                                    _this.$set(_this, 'messages', arrData);
                                                });
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
                else{
                    var arrData =[];
                    soyut.radiogram.renderListMessages(message,function(res){
                        if(message == "draft"){
                            res.sort(function(a,b){
                                var c = new Date(a.createTime);
                                var d = new Date(b.createTime);
                                return d-c;
                            });
                        }
                        else{
                            res.sort(function(a,b){
                                var c = new Date(a.SendTime);
                                var d = new Date(b.SendTime);
                                return d-c;
                            });
                        }
                        res.forEach(function (i) {
                            if(message == "inbox") {
                                soyut.radiogram.renderSenderObj(i.sender, i.senderWasdal, function (sender) {
                                    if(i.senderWasdal) {
                                        var getSimTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                        var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                            '<span class="text">wa ' + getSimTime + '</span>';

                                        arrData.push({
                                            id: i.id,
                                            title: i.title,
                                            content: i.content,
                                            SendTime: i.SendTime,
                                            simtime: i.simtime,
                                            createTime: i.createTime,
                                            stringTime: stringTime,
                                            Number: i.Number,
                                            readStatus: i.readStatus,
                                            composeStatus: i.composeStatus,
                                            receiverCallsign: sender.position
                                        });
                                        _this.$set(_this, 'messages', arrData);
                                    }
                                    else {
                                        soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                            var getSimTime = moment(i.simtime).format("DD") + '-' + moment(i.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY")) + ' ' + moment(i.simtime).format("hh") + ':' + moment(i.simtime).format("mm");
                                            var stringTime = '<span class="text">ws ' + moment(i.SendTime).format("DD-MM-YYYY h:mm") + '</span>' +
                                                '<span class="text">wa ' + getSimTime + '</span>';

                                            arrData.push({
                                                id: i.id,
                                                title: i.title,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: i.simtime,
                                                createTime: i.createTime,
                                                stringTime: stringTime,
                                                Number: i.Number,
                                                readStatus: i.readStatus,
                                                composeStatus: i.composeStatus,
                                                receiverCallsign: sender.position +" ("+ senderrg.name +")"
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    }
                                });
                            }
                            else{
                                var stringTime = '';
                                if(message == 'draft'){
                                    stringTime = '<span class="text">dibuat '+moment(i.createTime).format("DD-MM-YYYY h:mm")+'</span>';

                                    soyut.radiogram.renderListReceiversDetail(i.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(i.kreceivers, function (kreceivers) {
                                            arrData.push({
                                                id: i.id,
                                                title: i.title,
                                                content: i.content,
                                                SendTime: i.createTime,
                                                simtime: i.createTime,
                                                createTime: i.createTime,
                                                stringTime: stringTime,
                                                Number: i.Number,
                                                readStatus: i.readStatus,
                                                composeStatus: i.composeStatus,
                                                receiverCallsign: kreceivers + " " + receivers,
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    });
                                }
                                else{
                                    var getSimTime = moment(i.simtime).format("DD")+'-'+moment(i.simtime).format("MM")+'-'+ soyut.radiogram.yearNumToSimStr(moment(i.simtime).format("YYYY"))+' '+moment(i.simtime).format("hh")+':'+moment(i.simtime).format("mm");
                                    stringTime = '<span class="text">ws '+ moment(i.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                        '<span class="text">wa '+ getSimTime +'</span>';

                                    soyut.radiogram.renderListReceiversDetail(i.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(i.kreceivers, function (kreceivers) {
                                            arrData.push({
                                                id: i.id,
                                                title: i.title,
                                                content: i.content,
                                                SendTime: i.SendTime,
                                                simtime: i.simtime,
                                                createTime: i.createTime,
                                                stringTime: stringTime,
                                                Number: i.Number,
                                                readStatus: i.readStatus,
                                                composeStatus: i.composeStatus,
                                                receiverCallsign: kreceivers + " " + receivers,
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        });
                                    });
                                }

                            }
                        });
                    });

                }
            },
            LoadList: function () {
                var materi = $("input:checkbox[name=select-materi]:checked");
                var arrMateri = [];
                materi.each(function () {
                    arrMateri.push($(this).val());
                });

                var listMateri = '';
                arrMateri.forEach(function (i) {
                    listMateri = listMateri + i + " ";
                });

                console.log(arrMateri, listMateri)
                console.log("asdasd")
                // $('ul.messages-list > li').each(function(){
                //     console.log("cccc")
                //     var currentLiText = $(this).attr('data-type');
                //     console.log(currentLiText);
                //     console.log(listMateri)
                //     // var showCurrentLi = currentLiText.indexOf(listMateri) !== -1;
                //     //
                //     // $(this).toggle(showCurrentLi);
                // });
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.Radiogram_GetById({id: val}, function (err, data) {
                    if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                        if(!roleName.isWASDAL){
                            soyut.radiogram.Radiogram_UpdateReadStatus({id: data.id}, function (err, res) {
                                console.log("radigram telah di baca");
                            });
                        }
                    }
                    soyut.radiogram.renderListMessage('.email-list', '.email-reader', data.composeStatus);
                    soyut.radiogram.renderMessageDetail('.email-reader', val, message);

                });
            }
        }
    });
};

Vue.component('email-reader', {
    props: ['contents'],
    template: '#email-reader',
    methods: {
        moment: function (date) {
            return moment(date);
        },
        ReplyMessage: function () {
            this.$root.ReplyMessage(this.contents);
        },
        ReplyCurrrentMessage: function () {
            this.$root.ReplyCurrrentMessage(this.contents);
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
        loadReplyCurrentButton: function (val) {
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
                if(!roleName.isWASDAL) {
                    var attr;
                    attr = {
                        'style': 'display:none'
                    };
                    return attr;
                }
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
            if(val == 'sent' || val == 'inbox' ){
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

    $el.append('<email-reader :contents="contents"></email-reader>');

    vm = new Vue({
        el: elSelector,
        data: {
            contents: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;

                soyut.radiogram.renderMessageObj(message, function(data){
                    var arrMateri = '';
                    if(data.materi != null ) {
                        data.materi.forEach(function (i) {
                            arrMateri = arrMateri + i.toUpperCase() + ", ";
                        });
                    }
                    else {
                        arrMateri = '';
                    }

                    var attributes = '';
                    if(roleName.isWASDAL) {
                        attributes +=
                            '<div class="col-md-8">' +
                            '<div class="form-group"><p class="text-bold">MATERI :</p> ' + arrMateri + ' </div>' +
                            '</div>' +
                            '<div class="col-md-4 pull-right">' +
                            '<div class="form-group pull-right"><p class="text-bold">Author</p> ' + data.author + '</div>' +
                            '</div>';
                    }

                    if (roleName.isWASDAL) {
                        soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                            if(data.senderWasdal) {
                                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                    soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                        soyut.radiogram.renderListAliasDetail(data.alsreceivers, function (alsreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    soyut.radiogram.renderListAliasDetail(data.alscc, function (alscc) {
                                                        var getSimTime = "";
                                                        if (data.simtime != null) {
                                                            getSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                        }
                                                        else {
                                                            getSimTime = "-";
                                                        }

                                                        var textArray = data.content.split('\n');
                                                        var renderMessage = "";
                                                        for (var i = 0; i < textArray.length; i++) {
                                                            renderMessage += textArray[i] + "<br />";
                                                        }
                                                        var contents = {
                                                            id: data.id,
                                                            content: data.content,
                                                            tembusan: data.cc,
                                                            renderMessages: renderMessage,
                                                            SendTime: data.SendTime,
                                                            simtime: getSimTime,
                                                            senderRole: data.sender,
                                                            senderCallsign: sender.position,
                                                            senderRank: data.senderRank,
                                                            senderName: data.senderName,
                                                            materi: data.materi,
                                                            attributes: attributes,
                                                            senderPhoto: "",
                                                            senderSignature: "",
                                                            panggilan: data.panggilan,
                                                            jenis: data.jenis,
                                                            nomor: data.nomor,
                                                            derajat: data.derajat,
                                                            instruksi: data.instruksi,
                                                            klasifikasi: data.classification.toUpperCase(),
                                                            no: data.Number,
                                                            cara: data.cara,
                                                            paraf: data.paraf,
                                                            tandadinas: data.tandadinas,
                                                            group: data.group,
                                                            alamataksi: data.alamataksi,
                                                            alamattembusan: data.alamattembusan,
                                                            composeStatus: data.composeStatus,
                                                            receiverDetail: alsreceivers + " " + kreceivers + " " + receivers,
                                                            ccDetail: alscc + " " + cc + " " + kcc
                                                        };

                                                        _this.$set(_this, 'contents', contents);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                    soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    var getSimTime = "";
                                                    if (data.simtime != null) {
                                                        getSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                    }
                                                    else {
                                                        getSimTime = "-";
                                                    }

                                                    var textArray = data.content.split('\n');
                                                    var renderMessage = "";
                                                    for (var i = 0; i < textArray.length; i++) {
                                                        renderMessage += textArray[i] + "<br />";
                                                    }
                                                    var contents = {
                                                        id: data.id,
                                                        content: data.content,
                                                        tembusan: data.cc,
                                                        renderMessages: renderMessage,
                                                        SendTime: data.SendTime,
                                                        simtime: getSimTime,
                                                        senderRole: data.sender,
                                                        senderCallsign: sender.position +" ("+ senderrg.name +")",
                                                        senderRank: data.senderRank,
                                                        senderName: data.senderName,
                                                        materi: data.materi,
                                                        attributes: attributes,
                                                        senderPhoto: "",
                                                        senderSignature: "",
                                                        panggilan: data.panggilan,
                                                        jenis: data.jenis,
                                                        nomor: data.nomor,
                                                        derajat: data.derajat,
                                                        instruksi: data.instruksi,
                                                        klasifikasi: data.classification.toUpperCase(),
                                                        no: data.Number,
                                                        cara: data.cara,
                                                        paraf: data.paraf,
                                                        tandadinas: data.tandadinas,
                                                        group: data.group,
                                                        alamataksi: data.alamataksi,
                                                        alamattembusan: data.alamattembusan,
                                                        composeStatus: data.composeStatus,
                                                        receiverDetail: kreceivers + " " + receivers,
                                                        ccDetail: cc + " " + kcc
                                                    };

                                                    _this.$set(_this, 'contents', contents);
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    else{
                        soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                            if(data.senderWasdal) {
                                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                    soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                        soyut.radiogram.renderListAliasDetail(data.alsreceivers, function (alsreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    soyut.radiogram.renderListAliasDetail(data.alscc, function (alscc) {

                                                        var textArray = data.content.split('\n');
                                                        var renderMessage = "";
                                                        for (var i = 0; i < textArray.length; i++) {
                                                            renderMessage += textArray[i] + "<br />";
                                                        }

                                                        var curSimTime = "-"
                                                        if (data.simtime != null) {
                                                            var curSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                        }
                                                        var curSendTime = "-"
                                                        if (data.SendTime != null) {
                                                            curSendTime = moment(data.SendTime).format('DD-MM-YYYY h:mm');
                                                        }
                                                        var curCreateTime = "-"
                                                        if (data.createTime != null) {
                                                            curCreateTime = moment(data.createTime).format('DD-MM-YYYY h:mm');
                                                        }

                                                        var contents = {
                                                            id: data.id,
                                                            content: data.content,
                                                            tembusan: data.cc,
                                                            renderMessages: renderMessage,
                                                            SendTime: curSendTime,
                                                            simtime: curSimTime,
                                                            createTime: curCreateTime,
                                                            senderRole: data.sender,
                                                            senderCallsign: sender.position,
                                                            senderRank: data.senderRank,
                                                            senderName: data.senderName,
                                                            materi: data.materi,
                                                            attributes: '',
                                                            senderPhoto: "",
                                                            senderSignature: "",
                                                            panggilan: data.panggilan,
                                                            jenis: data.jenis,
                                                            nomor: data.nomor,
                                                            derajat: data.derajat,
                                                            instruksi: data.instruksi,
                                                            klasifikasi: data.classification.toUpperCase(),
                                                            no: data.Number,
                                                            cara: data.cara,
                                                            paraf: data.paraf,
                                                            tandadinas: data.tandadinas,
                                                            group: data.group,
                                                            alamataksi: data.alamataksi,
                                                            alamattembusan: data.alamattembusan,
                                                            composeStatus: data.composeStatus,
                                                            receiverDetail: alsreceivers + " " + kreceivers + " " + receivers,
                                                            ccDetail: alscc + " " + cc + " " + kcc
                                                        };

                                                        _this.$set(_this, 'contents', contents);
                                                        // });
                                                    });
                                                });
                                            });
                                        });
                                    });
                            });
                            }
                            else {
                                soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                    soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    // soyut.radiogram.renderUserDetail(data.sender, function (user) {

                                                    var textArray = data.content.split('\n');
                                                    var renderMessage = "";
                                                    for (var i = 0; i < textArray.length; i++) {
                                                        renderMessage += textArray[i] + "<br />";
                                                    }

                                                    var curSimTime = "-"
                                                    if (data.simtime != null) {
                                                        var curSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                    }
                                                    var curSendTime = "-"
                                                    if (data.SendTime != null) {
                                                        curSendTime = moment(data.SendTime).format('DD-MM-YYYY h:mm');
                                                    }
                                                    var curCreateTime = "-"
                                                    if (data.createTime != null) {
                                                        curCreateTime = moment(data.createTime).format('DD-MM-YYYY h:mm');
                                                    }

                                                    var contents = {
                                                        id: data.id,
                                                        content: data.content,
                                                        tembusan: data.cc,
                                                        renderMessages: renderMessage,
                                                        SendTime: curSendTime,
                                                        simtime: curSimTime,
                                                        createTime: curCreateTime,
                                                        senderRole: data.sender,
                                                        senderCallsign: sender.position + " (" + senderrg.name + ")",
                                                        senderRank: data.senderRank,
                                                        senderName: data.senderName,
                                                        materi: data.materi,
                                                        attributes: '',
                                                        senderPhoto: "",
                                                        senderSignature: "",
                                                        panggilan: data.panggilan,
                                                        jenis: data.jenis,
                                                        nomor: data.nomor,
                                                        derajat: data.derajat,
                                                        instruksi: data.instruksi,
                                                        klasifikasi: data.classification.toUpperCase(),
                                                        no: data.Number,
                                                        cara: data.cara,
                                                        paraf: data.paraf,
                                                        tandadinas: data.tandadinas,
                                                        group: data.group,
                                                        alamataksi: data.alamataksi,
                                                        alamattembusan: data.alamattembusan,
                                                        composeStatus: data.composeStatus,
                                                        receiverDetail: kreceivers + " " + receivers,
                                                        ccDetail: kcc + " " + cc
                                                    };

                                                    _this.$set(_this, 'contents', contents);
                                                    // });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            },
            PrintPdf: function (content) {
                soyut.radiogram.PrintPDF(content.id);
            },
            SavePdf: function (content) {
                soyut.radiogram.SavePdf(content.id);
            },
            PrintPaper: function (content, rolecc) {
                soyut.System.socket.get('localSocket').emit('printRadiogram', {
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    datetime: content.datetime,
                    sender_Name: content.senderCallsign,
                    receiver_Name: content.receiverCallsign,
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi.toUpperCase(),
                    title: content.title,
                    number: content.no,
                    instruksi: content.instruksi,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.sendername,
                    senderpangkat: content.senderpangkat,
                    tanda_tangan: content.tanda_tangan,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        console.log('call function print');
                    }
                });
            },
            SubmitMessage: function(content){
                if(roleName.isWASDAL){
                    soyut.radiogram.SendDraftWasdalRadiogram(content, function (res) {
                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                        $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                        soyut.radiogram.renderDraft();

                        soyut.radiogram.AddRIGRadiogram(content.id);
                    })
                }
                else{
                    soyut.radiogram.Radiogram_GetById({id: content.id}, function(err,res) {
                        soyut.radiogram.SendReplyRadiogram({
                            panggilan: res.panggilan,
                            jenis: res.jenis,
                            nomor: res.nomor,
                            derajat: res.derajat,
                            instruksi: res.instruksi,
                            tandadinas: res.tandadinas,
                            group: res.group,
                            classification: res.classification,
                            materi: res.materi,
                            Number: res.Number,
                            cara: res.cara,
                            paraf: res.paraf,
                            alamataksi: res.alamataksi,
                            alamattembusan: res.alamattembusan,
                            content: res.content,
                            author: res.author,
                            readStatus: 'unread',
                            owner: res.sender,
                            sender: res.sender,
                            receivers: res.receivers,
                            kreceivers: res.kreceivers,
                            alsreceivers: res.alsreceivers,
                            cc: res.cc,
                            kcc: res.kcc,
                            alscc: res.alscc,
                            senderName: res.senderName,
                            senderRank: res.senderRank
                        }, function (results) {
                            soyut.clock.getCurrentActualTime({}, function(err, reclock){
                                soyut.clock.getSimTime(reclock, function(err, simclock){
                                    soyut.radiogram.Radiogram_SendDraft({id: content.id, sendtime: reclock, simtime: simclock.simTime, status: 'sent'}, function(err,r) {
                                    });
                                });
                            });
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                            $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                            soyut.radiogram.renderDraft();

                        });
                    });
                }
            },
            EditMessage: function(content){
                soyut.radiogram.EditMessage(content.id);
            },
            ReplyMessage: function (content) {
                soyut.radiogram.renderCompose(content.id, '', content.materi);
            },
            ReplyCurrrentMessage: function (content) {
                soyut.radiogram.renderCompose(content.id, content.senderRole, content.materi);
            },
            MoveMessage: function(content){
                function handleOkButton() {
                    console.log('radiogram Warning, delete radiogram');
                    soyut.radiogram.Radiogram_UpdateToTrash({id: content.id}, function (err, data) {
                        if(!err){
                            switch(state){
                                case 'inbox':
                                    soyut.radiogram.renderInbox();
                                    break;
                                case 'sent':
                                    soyut.radiogram.renderSent();
                                    break;
                                case 'draft':
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
            }
        }
    });

};

Vue.component('email-reply', {
    props: ['contents'],
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

    $el.append('<email-reply :contents="contents"></email-reply>');

    vm = new Vue({
        el: elSelector,
        data: {
            contents: ''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods:{
            LoadMessages: function () {
                var _this = this;

                soyut.radiogram.renderMessageObj(message, function(data) {
                    var arrMateri = [];
                    if (data.materi != null) {
                        data.materi.forEach(function (i) {
                            arrMateri = arrMateri + i + ", ";
                        });
                    }
                    else {
                        arrMateri = '';
                    }

                    if (roleName.isWASDAL) {
                        soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                            if(data.senderWasdal) {
                                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                    soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                        soyut.radiogram.renderListAliasDetail(data.alsreceivers, function (alsreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    soyut.radiogram.renderListAliasDetail(data.alscc, function (alscc) {
                                                        var getSimTime = "";
                                                        if (data.simtime != null) {
                                                            getSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                        }
                                                        else {
                                                            getSimTime = "-";
                                                        }

                                                        var textArray = data.content.split('\n');
                                                        var renderMessage = "";
                                                        for (var i = 0; i < textArray.length; i++) {
                                                            renderMessage += textArray[i] + "<br />";
                                                        }
                                                        var contents = {
                                                            id: data.id,
                                                            content: data.content,
                                                            tembusan: data.cc,
                                                            renderMessages: renderMessage,
                                                            SendTime: data.SendTime,
                                                            simtime: getSimTime,
                                                            senderRole: data.sender,
                                                            senderCallsign: sender.position,
                                                            senderRank: data.senderRank,
                                                            senderName: data.senderName,
                                                            materi: arrMateri,
                                                            senderPhoto: "",
                                                            senderSignature: "",
                                                            panggilan: data.panggilan,
                                                            jenis: data.jenis,
                                                            nomor: data.nomor,
                                                            derajat: data.derajat,
                                                            instruksi: data.instruksi,
                                                            klasifikasi: data.classification.toUpperCase(),
                                                            no: data.Number,
                                                            cara: data.cara,
                                                            paraf: data.paraf,
                                                            tandadinas: data.tandadinas,
                                                            group: data.group,
                                                            alamataksi: data.alamataksi,
                                                            alamattembusan: data.alamattembusan,
                                                            composeStatus: data.composeStatus,
                                                            receiverDetail: alsreceivers + " " + kreceivers + " " + receivers,
                                                            ccDetail: alscc + " " + cc + " " + kcc
                                                        };

                                                        _this.$set(_this, 'contents', contents);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                    soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    var getSimTime = "";
                                                    if (data.simtime != null) {
                                                        getSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                    }
                                                    else {
                                                        getSimTime = "-";
                                                    }

                                                    var textArray = data.content.split('\n');
                                                    var renderMessage = "";
                                                    for (var i = 0; i < textArray.length; i++) {
                                                        renderMessage += textArray[i] + "<br />";
                                                    }
                                                    var contents = {
                                                        id: data.id,
                                                        content: data.content,
                                                        tembusan: data.cc,
                                                        renderMessages: renderMessage,
                                                        SendTime: data.SendTime,
                                                        simtime: getSimTime,
                                                        senderRole: data.sender,
                                                        senderCallsign: sender.position +" ("+ senderrg.name +")",
                                                        senderRank: data.senderRank,
                                                        senderName: data.senderName,
                                                        materi: arrMateri,
                                                        senderPhoto: "",
                                                        senderSignature: "",
                                                        panggilan: data.panggilan,
                                                        jenis: data.jenis,
                                                        nomor: data.nomor,
                                                        derajat: data.derajat,
                                                        instruksi: data.instruksi,
                                                        klasifikasi: data.classification.toUpperCase(),
                                                        no: data.Number,
                                                        cara: data.cara,
                                                        paraf: data.paraf,
                                                        tandadinas: data.tandadinas,
                                                        group: data.group,
                                                        alamataksi: data.alamataksi,
                                                        alamattembusan: data.alamattembusan,
                                                        composeStatus: data.composeStatus,
                                                        receiverDetail: kreceivers + " " + receivers,
                                                        ccDetail: cc + " " + kcc
                                                    };

                                                    _this.$set(_this, 'contents', contents);
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                    else{
                        soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                            if(data.senderWasdal) {
                                soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                    soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                        soyut.radiogram.renderListAliasDetail(data.alsreceivers, function (alsreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    soyut.radiogram.renderListAliasDetail(data.alscc, function (alscc) {

                                                        var textArray = data.content.split('\n');
                                                        var renderMessage = "";
                                                        for (var i = 0; i < textArray.length; i++) {
                                                            renderMessage += textArray[i] + "<br />";
                                                        }

                                                        var curSimTime = "-"
                                                        if (data.simtime != null) {
                                                            var curSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                        }
                                                        var curSendTime = "-"
                                                        if (data.SendTime != null) {
                                                            curSendTime = moment(data.SendTime).format('DD-MM-YYYY h:mm');
                                                        }
                                                        var curCreateTime = "-"
                                                        if (data.createTime != null) {
                                                            curCreateTime = moment(data.createTime).format('DD-MM-YYYY h:mm');
                                                        }

                                                        var contents = {
                                                            id: data.id,
                                                            content: data.content,
                                                            tembusan: data.cc,
                                                            renderMessages: renderMessage,
                                                            SendTime: curSendTime,
                                                            simtime: curSimTime,
                                                            createTime: curCreateTime,
                                                            senderRole: data.sender,
                                                            senderCallsign: sender.position,
                                                            senderRank: data.senderRank,
                                                            senderName: data.senderName,
                                                            materi: arrMateri,
                                                            senderPhoto: "",
                                                            senderSignature: "",
                                                            panggilan: data.panggilan,
                                                            jenis: data.jenis,
                                                            nomor: data.nomor,
                                                            derajat: data.derajat,
                                                            instruksi: data.instruksi,
                                                            klasifikasi: data.classification.toUpperCase(),
                                                            no: data.Number,
                                                            cara: data.cara,
                                                            paraf: data.paraf,
                                                            tandadinas: data.tandadinas,
                                                            group: data.group,
                                                            alamataksi: data.alamataksi,
                                                            alamattembusan: data.alamattembusan,
                                                            composeStatus: data.composeStatus,
                                                            receiverDetail: alsreceivers + " " + kreceivers + " " + receivers,
                                                            ccDetail: alscc + " " + cc + " " + kcc
                                                        };

                                                        _this.$set(_this, 'contents', contents);
                                                        // });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                soyut.radiogram.renderSenderGroup(sender.roleGroup, function (senderrg) {
                                    soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                        soyut.radiogram.renderListKogasDetail(data.kreceivers, function (kreceivers) {
                                            soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                                soyut.radiogram.renderListKogasDetail(data.kcc, function (kcc) {
                                                    // soyut.radiogram.renderUserDetail(data.sender, function (user) {

                                                    var textArray = data.content.split('\n');
                                                    var renderMessage = "";
                                                    for (var i = 0; i < textArray.length; i++) {
                                                        renderMessage += textArray[i] + "<br />";
                                                    }

                                                    var curSimTime = "-"
                                                    if (data.simtime != null) {
                                                        var curSimTime = moment(data.simtime).format("DD") + '-' + moment(data.simtime).format("MM") + '-' + soyut.radiogram.yearNumToSimStr(moment(data.simtime).format("YYYY")) + ' ' + moment(data.simtime).format("hh") + ':' + moment(data.simtime).format("mm");
                                                    }
                                                    var curSendTime = "-"
                                                    if (data.SendTime != null) {
                                                        curSendTime = moment(data.SendTime).format('DD-MM-YYYY h:mm');
                                                    }
                                                    var curCreateTime = "-"
                                                    if (data.createTime != null) {
                                                        curCreateTime = moment(data.createTime).format('DD-MM-YYYY h:mm');
                                                    }

                                                    var contents = {
                                                        id: data.id,
                                                        content: data.content,
                                                        tembusan: data.cc,
                                                        renderMessages: renderMessage,
                                                        SendTime: curSendTime,
                                                        simtime: curSimTime,
                                                        createTime: curCreateTime,
                                                        senderRole: data.sender,
                                                        senderCallsign: sender.position + " (" + senderrg.name + ")",
                                                        senderRank: data.senderRank,
                                                        senderName: data.senderName,
                                                        materi: arrMateri,
                                                        senderPhoto: "",
                                                        senderSignature: "",
                                                        panggilan: data.panggilan,
                                                        jenis: data.jenis,
                                                        nomor: data.nomor,
                                                        derajat: data.derajat,
                                                        instruksi: data.instruksi,
                                                        klasifikasi: data.classification.toUpperCase(),
                                                        no: data.Number,
                                                        cara: data.cara,
                                                        paraf: data.paraf,
                                                        tandadinas: data.tandadinas,
                                                        group: data.group,
                                                        alamataksi: data.alamataksi,
                                                        alamattembusan: data.alamattembusan,
                                                        composeStatus: data.composeStatus,
                                                        receiverDetail: kreceivers + " " + receivers,
                                                        ccDetail: kcc + " " + cc
                                                    };

                                                    _this.$set(_this, 'contents', contents);
                                                    // });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            },
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
};

soyut.radiogram.SavePdf = function(val){
    soyut.radiogram.RenderPrinterPDF(val, function(res){
        soyut.radiogram.SaveFilePDF(res, function (err, result) {
            soyut.radiogram.Show_PdfViewer(result);
        });
    });
}

soyut.radiogram.SaveFilePDF = function(val, rescallback) {
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

    soyut.radiogram.renderProviderPrinter(roleName.roleGroup, function (print) {
        var html = 'Provider: <select id="provider-name" name="provider-name" class="provider-name form-control" onchange="soyut.radiogram.selectProvider(this.value)">';
        print.forEach(function (i) {
            html += '<option value="'+ i.name +'">'+ i.name +'</option>';
        });
        html += '</select>';
        $(getInstanceID('lp-provider')).html(html);
        soyut.radiogram.selectProvider($('.provider-name').val());
    });

    $(getInstanceID("btn-print-radiogram")).click(function (event) {
        soyut.radiogram.RenderPrinterPDF(val, function (res) {
            soyut.radiogram.SaveFilePDF(res, function (err, result) {
                var providerName = $('.provider-name').val();
                var printerName = $('.printer-name').val();
                console.log("print "+providerName+" - "+ printerName);
                soyut.printserver.print({
                    docURL : result,
                    origin : 'Radiogram',
                    provider : providerName,
                    printer : printerName
                }, function(print){
                    console.log(print)
                })
            });
        });
    });
};

soyut.radiogram.EditMessage = function(val){
    soyut.radiogram.clearInput();
    $(getInstanceID("wdl-email-form")).removeClass('disable');
    $(getInstanceID("wdl-email-content")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');
    $(getInstanceID("wdl-kop-form")).addClass('disable');

    $(getInstanceID('nomor')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });
    $(getInstanceID('tandadinas')).keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
    });

    //if(!roleName.isAddress && !roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("btnSubmitMessage")).css({display:'none'});
    //}
    if(!roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("Number")).attr('readonly', 'readonly');
    }



    soyut.radiogram.renderRadiogramDetail(val, function(res){
        if(roleName.isWASDAL){
            soyut.radiogram.renderMateriWasdal('edit', res.materi);
            soyut.radiogram.renderSenderWasdal('edit', res.sender);
            soyut.radiogram.renderReceiverWasdal('edit', res.receivers, res.kreceivers, res.alsreceivers);
            soyut.radiogram.renderCCWasdal('edit', res.cc, res.kcc, res.alscc);
        }
        else{
            soyut.radiogram.renderMateri('edit', res.materi);
            soyut.radiogram.renderComposeSender('edit', res.sender);
            soyut.radiogram.renderComposeReceivers('edit', res.receivers, res.kreceivers);
            soyut.radiogram.renderComposeCC('edit', res.cc, res.kcc);
            $(getInstanceID("list-materi")).css('visibility', 'hidden');
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
        $(getInstanceID("klasifikasi")).val();
        $(getInstanceID("Number")).val(res.Number);
        $(getInstanceID("message-input")).val(res.content);
        $(getInstanceID('sender-name')).val(res.senderName);
        $(getInstanceID('sender-pangkat')).val(res.senderRank);

        //$(getInstanceID('signature')).val(soyut.Session.user.signature);
        //$(getInstanceID('sender-signature')).attr('src', soyut.Session.user.signature);
        $(getInstanceID("alamataksi")).val(res.alamataksi);
        $(getInstanceID("alamattembusan")).val(res.alamattembusan);
        $(getInstanceID("cara")).val(res.cara);
        $(getInstanceID("paraf")).val(res.paraf);
        $(getInstanceID("jam")).val();
        $(getInstanceID("tanggal")).val();

        //console.log(res.Number)
    });
};

Vue.component('send-result', {
    props: ['contents'],
    template: '#send-result',
    methods: {
        BackToInbox: function () {
            this.$root.BackToInbox();
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents);
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

    var vmres = new Vue({
        el: elSelector,
        data: {
            contents: '',
            rolecc:''
        },
        mounted: function () {
            this.$nextTick(function () {
                this.LoadMessages();
            });
        },
        methods: {
            LoadMessages: function () {
                var _this = this;
                soyut.radiogram.Radiogram_GetById({id: message}, function (err, data) {

                    var arrData = {
                        id: data.id
                    };

                    _this.$set(_this, 'contents', arrData);
                });
            },
            BackToInbox: function () {
                soyut.radiogram.clearInput();
                soyut.radiogram.renderInbox();
            },
            PrintPaper: function (content) {
                soyut.System.socket.get('localSocket').emit('printRadiogram', {
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    datetime: content.datetime,
                    sender_Name: content.senderCallsign +" ("+ content.senderRank +" "+ content.senderName+")",
                    receiver_Name: content.receiverCallsign +" ("+ content.receiverRank +" "+ content.receiverName+")",
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    instruksi: content.instruksi,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.sendername,
                    senderpangkat: content.senderpangkat,
                    tanda_tangan: content.tanda_tangan,
                    alamataksi: content.alamataksi,
                    alamattembusan: content.alamattembusan,
                    jam: content.jam,
                    tanggal: content.tanggal,
                    cara: content.cara,
                    paraf: content.paraf,
                    message: content.renderMessages
                }, function (err, msg) {
                    console.log(msg)
                    if (!err) {
                        console.log('call function print');
                    }
                });
            },
            PrintPDF: function (content) {
                console.log("pdf "+content.id)
                soyut.radiogram.PrintPDF(content.id);
            }
        }
    });
};

soyut.radiogram.SetSenderDetail = function(val){
    if(val != ""){
        if(soyut.Session.role.isWASDAL){
            soyut.radiogram.renderSenderWasdalDetail(val, function(res){
                $(getInstanceID('sender-name')).val(res.data.callsign);
                $(getInstanceID('sender-pangkat')).val(res.data.rank);
            });
        }
        else{
            soyut.radiogram.renderSenderDetail(val, function(res){
                //soyut.radiogram.renderUserDetail(val, function (user) {
                    $(getInstanceID('sender-name')).val(res.data[0].callsign);
                    $(getInstanceID('sender-pangkat')).val(res.data[0].rank);
                //});
            });
        }
    }
}

/*sender and receiver WASDAL */
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

soyut.radiogram.renderReceiverWasdal = function (state, value, kvalue, alvalue) {
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
                        selectAll: true
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
                            if (alvalue != null) {
                                soyut.radiogram.checkReceivers(alvalue, l.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                        });

                        list.forEach(function (m) {
                            var selected = "";
                            if (kvalue != null) {
                                soyut.radiogram.checkReceivers(kvalue, m.id, function (sel) {
                                    if (sel) {
                                        selected += "selected";
                                    }
                                });
                            }
                            html += '<option value="' + m.id + ':role' + '" ' + selected + '>' + m.position + ' (' + m.groupName + ')</option>';
                        });

                        res.forEach(function (i) {
                            var selected = "";
                            if (value != null) {
                                soyut.radiogram.checkReceivers(value, i.id, function (sel) {
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
                            selectAll: true
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
                        if(value == i.id){
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


soyut.radiogram.renderCCWasdal = function (state, value, kvalue, alvalue) {
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
                        selectAll: true
                    });
                });
            });
        });
    }
    else{
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderListAlias(function(als) {

                    var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                    als.forEach(function (l) {
                        var selected = "";
                        if (alvalue != null) {
                            soyut.radiogram.checkReceivers(alvalue, l.id, function (sel) {
                                if (sel) {
                                    selected += "selected";
                                }
                            });
                        }
                        html += '<option value="' + l.id + ':als' + '" ' + selected + '>' + l.name + '</option>';
                    });

                    list.forEach(function (m) {
                        var selected = "";
                        if (kvalue != null) {
                            soyut.radiogram.checkReceivers(kvalue, m.id, function (sel) {
                                if (sel) {
                                    selected += "selected";
                                }
                            });
                        }
                        html += '<option value="' + m.id + ':role' + '" ' + selected + '>' + m.position + ' (' + m.groupName + ')</option>';
                    });

                    res.forEach(function (i) {
                        var selected = "";
                        if (value != null) {
                            soyut.radiogram.checkReceivers(value, i.id, function (sel) {
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
                        selectAll: true
                    });
                });
            });
        });
    }
};

/*sender and receiver user */
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
        soyut.radiogram.renderListSender(function(res){
            var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none" onchange="soyut.radiogram.SetSenderDetail(this.value)">';
            html += '<option value="">Cari..</option>';
            res.forEach(function (i) {
                if(i.isAddress){
                    var selected = "";
                    if(value != null){
                        if(value == i.id){
                            selected = "selected";
                        }
                    }
                    html += '<option value="'+ i.id +'" '+selected+'>'+ i.position + ' (' + roleName.roleGroupName + ')</option>';
                }
            });
            html +='</select>';
            html +='<span class="sender-error help-block valid"></span>';
            $(getInstanceID("list-sender")).append(html);

            $(".optSender").select2({ width: '100%' });
        });
    }
};

soyut.radiogram.renderComposeReceivers = function (state, value, kvalue) {
    $(getInstanceID("list-receiver")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (gprole) {

                    var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                    list.forEach(function (r) {
                        if (r.id != gprole[0].id) {
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
                        selectAll: true
                    });

                });
            });
        });
    }
    else{
        soyut.radiogram.renderListReceivers(function(res){

            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (gprole) {

                    var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';

                    list.forEach(function (m) {
                        var selected = "";
                        if (kvalue != null) {
                            soyut.radiogram.checkReceivers(kvalue, m.id, function (sel) {
                                if (sel) {
                                    selected += "selected";
                                }
                            });
                        }
                        if (m.id != gprole[0].id) {
                            html += '<option value="' + m.id + ':role' + '" ' + selected + '>' + m.position + ' (' + m.groupName + ')</option>';
                        }
                    });

                    res.forEach(function (i) {
                        var selected = "";
                        if (value != null) {
                            soyut.radiogram.checkReceivers(value, i.id, function (sel) {
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
                        selectAll: true
                    });

                });
            });

        });
    }
};

soyut.radiogram.renderComposeCC = function (state, value, kvalue) {
    $(getInstanceID("list-tembusan")).html('');
    if(state == 'new'){
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (gprole) {
                    var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                    list.forEach(function (r) {
                        if (r.id != gprole[0].id) {
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
                        selectAll: true
                    });
                });
            });
        });
    }
    else{
        soyut.radiogram.renderListReceivers(function(res){
            soyut.radiogram.renderListRole(function(list) {
                soyut.radiogram.renderGroupAddress(roleName.roleGroup, function (gprole) {

                    var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';

                    list.forEach(function (m) {
                        var selected = "";
                        if (kvalue != null) {
                            soyut.radiogram.checkReceivers(kvalue, m.id, function (sel) {
                                if (sel) {
                                    selected += "selected";
                                }
                            });
                        }
                        if (m.id != gprole[0].id) {
                            html += '<option value="' + m.id + ':role' + '" ' + selected + '>' + m.position + ' (' + m.groupName + ')</option>';
                        }
                    });

                    res.forEach(function (i) {
                        var selected = "";
                        if (value != null) {
                            soyut.radiogram.checkReceivers(value, i.id, function (sel) {
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
                        selectAll: true
                    });
                });
            });
        });
    }
};

soyut.radiogram.renderCurrentUser = function () {
    if(soyut.Session.role.roleGroup != null) {
        soyut.radiogram.renderRoleGroup(function(res){
            var html = '<h4>' + roleName.position + ' </h4><h4 class="text-small">Kogas: '+ res.name +'</h4>';
            $(getInstanceID("detail-user")).html(html);
        });
    }
    else {
        alert("Role group belum di assign!");
    }
};

soyut.radiogram.renderCurrentWasdal = function () {
    if(soyut.Session.role.roleGroup != null) {
        var html = '<h4>' + roleName.position + ' </h4><h4 class="text-small">Wasdal: '+ roleName.roleGroupName +'</h4>';
        $(getInstanceID("detail-user")).html(html);
    }
    else {
        alert("Role group belum di assign!");
    }
};

soyut.radiogram.Show_PdfViewer = function(val) {
    var app = getAppInstance();

    app.launchActivity("soyut.module.app.radiogram.pdfviewer", {file: val});
};

soyut.radiogram.init = function () {
    soyut.radiogram.perfectScrollbarHandler();
    soyut.radiogram.messageHeightHandler();
    // soyut.radiogram.resizeHandler();
    soyut.radiogram.sidebarHandler();
    soyut.radiogram.renderInbox();
    soyut.radiogram.renderContent();
    
    $(".derajat").select2({ width: '100%' });

    if(roleName.isWASDAL){
        soyut.radiogram.renderCurrentWasdal();
        // soyut.radiogram.renderSenderWasdal();
        // soyut.radiogram.renderReceiverWasdal();
        // soyut.radiogram.renderCCWasdal();
        soyut.radiogram.renderWasdalRadiogram('.role-group-list');
    }
    else{
        soyut.radiogram.renderCurrentUser();
        // soyut.radiogram.renderComposeSender();
        // soyut.radiogram.renderComposeReceivers();
        // soyut.radiogram.renderComposeCC();
        $(getInstanceID('kop-menu')).css('display','none');
        $(getInstanceID('role-group-name')).css('display','none');
        $(getInstanceID('materi-content')).css('display','none');
        $(getInstanceID('materi-list')).css('display','none');
    }
};

soyut.radiogram.init();

//console.log(soyut.radiogram.yearNumToSimStr('2017'));

