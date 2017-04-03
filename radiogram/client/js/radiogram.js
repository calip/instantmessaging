var soyutSession = soyut.Session;
var roleName = soyut.Session.role;

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

soyut.radiogram.listTembusan = [];
soyut.radiogram.preProcessAuthor = function(dbAuthor, callback) {
    sessionService.RoleKey_get({role: dbAuthor.id, session: soyutSession.id}, function (err, result) {
        if (err) {
            callback(true, err);
        }
        else {
            callback(false, result);
        }
    });
};
soyut.radiogram.preProcessAuthorAsync = Promise.promisify(soyut.radiogram.preProcessAuthor);

function SendNotification(title, content, id) {
    var app = getAppInstance();

    soyut.Event.getInstance().invokeSystemEvent('notification', {
        title: title, content: content, handler: function (d) {
            console.log(id);
            app.launchActivity("soyut.module.app.radiogram.wasdal.main", {radiogramId: id});
        }
    });
}

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
    var length = 15;

    if (value.length <= length) {
        return value;
    }
    else {
        return value.substring(0, length) + '...';
    }
});

soyut.radiogram.renderInbox = function () {
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("active");
    $(getInstanceID("wdl-nav-inbox")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'inbox');
};

soyut.radiogram.renderSent = function () {
    $(getInstanceID("wdl-nav-sent")).parent().addClass("active");
    $(getInstanceID("wdl-nav-sent")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'sent');
};

soyut.radiogram.renderDraft = function () {
    $(getInstanceID("wdl-nav-draft")).parent().addClass("active");
    $(getInstanceID("wdl-nav-draft")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'draft');
};
soyut.radiogram.renderTrash = function () {
    $(getInstanceID("wdl-nav-trash")).parent().addClass("active");
    $(getInstanceID("wdl-nav-trash")).parent().addClass("open");

    $(getInstanceID("wdl-email-content")).removeClass('disable');
    $(getInstanceID("wdl-email-form")).addClass('disable');
    $(getInstanceID("wdl-email-send")).addClass('disable');
    $(getInstanceID("wdl-email-view")).addClass('disable');

    soyut.radiogram.renderListMessage('.email-list', '.email-reader', 'trash');
};

soyut.radiogram.renderCompose = function () {
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
   
    if(!roleName.isAddress && !roleName.isSet && !roleName.isWASDAL){
        $(getInstanceID("btnSubmitMessage")).css({display:'none'});
    }

    $(getInstanceID('sender-name')).val(soyut.Session.role.callsign);
    $(getInstanceID('sender-pangkat')).val(soyut.Session.user.rank);
    $(getInstanceID('signature')).val(soyut.Session.user.signature);
    $(getInstanceID('sender-signature')).attr('src', soyut.Session.user.signature);
};

soyut.radiogram.renderContent = function () {

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

        soyut.radiogram.renderCompose();
    });

    $(getInstanceID("btnSubmitMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
        var tandadinas = $(getInstanceID("tandadinas")).val();
        var group = $(getInstanceID("group")).val();
        var klasifikasi = $(getInstanceID("klasifikasi")).val();
        var no = $(getInstanceID("Number")).val();
        var message = $(getInstanceID("message-input")).val();
        var senderName = $(getInstanceID("sender-name")).val();
        var alamataksi = $(getInstanceID("alamataksi")).val();
        var alamattembusan = $(getInstanceID("alamattembusan")).val();
        var cara = $(getInstanceID("cara")).val();
        var paraf = $(getInstanceID("paraf")).val();
        var jam = $(getInstanceID("jam")).val();
        var tanggal = $(getInstanceID("tanggal")).val();

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error = "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error = "";
        }

        if (no == "" || no == null) {
            $('.parent-no').addClass('has-error');
            $('.no-error').removeClass('valid');
            $('.no-error').html('Harus diisi!');
            error = "no Error";
        }
        else {
            $('.parent-no').removeClass('has-error');
            $('.parent-no').addClass('has-success');
            $('.no-error').addClass('valid');
            $('.no-error').html('');
            error = "";
        }

        if(error != ""){
            return false;
        }
        else {
            if(roleName.isWASDAL){
                soyut.radiogram.SendWasdalRadiogram({
                    panggilan: panggilan,
                    jenis: jenis,
                    nomor: nomor,
                    derajat: derajat,
                    instruksi: instruksi,
                    tandadinas: tandadinas,
                    group: group,
                    classification: klasifikasi,
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    sender: senderRole,
                    receivers: receiverRole,
                    cc: tembusan,
                    senderName: senderName,
                },function(res){
                    soyut.radiogram.clearInput();
                    
                    $(getInstanceID("wdl-email-content")).addClass('disable');
                    $(getInstanceID("wdl-email-form")).addClass('disable');
                    $(getInstanceID("wdl-email-view")).addClass('disable');
                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                    soyut.radiogram.renderSendingResult('.email-result', res);
                });
            }
            else{
                var listRcp = [];
                listRcp = receiverRole;
                 soyut.radiogram.SendRadiogram({
                    panggilan: panggilan,
                    jenis: jenis,
                    nomor: nomor,
                    derajat: derajat,
                    instruksi: instruksi,
                    tandadinas: tandadinas,
                    group: group,
                    classification: klasifikasi,
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    owner: senderRole,
                    sender: senderRole,
                    receivers: receiverRole,
                    cc: tembusan,
                    senderName: senderName,
                    SendTime: new Date(),
                    simtime: null,
                    createTime: new Date()
                }, function (res) {
                    soyut.radiogram.clearInput();

                    $(getInstanceID("wdl-email-content")).addClass('disable');
                    $(getInstanceID("wdl-email-form")).addClass('disable');
                    $(getInstanceID("wdl-email-view")).addClass('disable');
                    $(getInstanceID("wdl-email-send")).removeClass('disable');
                    soyut.radiogram.renderSendingResult('.email-result', res);
                });
            }   
        }
    });
    
    $(getInstanceID("btnSaveMessage")).click(function (event) {
        var panggilan = $(getInstanceID("panggilan")).val();
        var jenis = $(getInstanceID("jenis")).val();
        var nomor = $(getInstanceID("nomor")).val();
        var derajat = $(getInstanceID("derajat")).val();
        var instruksi = $(getInstanceID("instruksi")).val();
        var senderRole = $(".optSender").val();
        var receiverRole = $(".optReceiver").val();
        var tembusan = $(".optCC").val();
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

        var error = "";

        if (senderRole == "" || senderRole == null) {
            $('.parent-sender').addClass('has-error');
            $('.sender-error').removeClass('valid');
            $('.sender-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-sender').removeClass('has-error');
            $('.parent-sender').addClass('has-success');
            $('.sender-error').addClass('valid');
            $('.sender-error').html('');
            error = "";
        }
        if (receiverRole == "" || receiverRole == null) {
            $('.parent-receivers').addClass('has-error');
            $('.receivers-error').removeClass('valid');
            $('.receivers-error').html('Harus diisi!');
            error = "receivers Error";
        }
        else {
            $('.parent-receivers').removeClass('has-error');
            $('.parent-receivers').addClass('has-success');
            $('.receivers-error').addClass('valid');
            $('.receivers-error').html('');
            error = "";
        }

        if (no == "" || no == null) {
            $('.parent-no').addClass('has-error');
            $('.no-error').removeClass('valid');
            $('.no-error').html('Harus diisi!');
            error = "no Error";
        }
        else {
            $('.parent-no').removeClass('has-error');
            $('.parent-no').addClass('has-success');
            $('.no-error').addClass('valid');
            $('.no-error').html('');
            error = "";
        }

        if(error != ""){
            return false;
        }
        else {
            if(roleName.isWASDAL){
                soyut.radiogram.DraftWasdalRadiogram({
                    panggilan: panggilan,
                    jenis: jenis,
                    nomor: nomor,
                    derajat: derajat,
                    instruksi: instruksi,
                    tandadinas: tandadinas,
                    group: group,
                    classification: klasifikasi,
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    sender: senderRole,
                    receivers: receiverRole,
                    cc: tembusan,
                    senderName: senderName,
                },function(res){
                    soyut.radiogram.clearInput();
                    soyut.radiogram.renderInbox();
                });
            }
            else{
                soyut.radiogram.DraftRadiogram({
                    panggilan: panggilan,
                    jenis: jenis,
                    nomor: nomor,
                    derajat: derajat,
                    instruksi: instruksi,
                    tandadinas: tandadinas,
                    group: group,
                    classification: klasifikasi,
                    Number: no,
                    cara: cara,
                    paraf: paraf,
                    alamataksi: alamataksi,
                    alamattembusan: alamattembusan,
                    content: message,
                    readStatus: 'unread',
                    sender: senderRole,
                    receivers: receiverRole,
                    cc: tembusan,
                    senderName: senderName,
                },function(res){
                    soyut.radiogram.clearInput();
                    soyut.radiogram.renderInbox();
                });
            }
        }
    });
};

soyut.radiogram.clearInput = function(){
    soyut.radiogram.listTembusan = [];

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
                var getInboxRadiogram = function (owner, sender, callback) {
                    soyut.radiogram.Radiogram_GetInboxByRoleGroup({id: owner, sender: sender, state: message}, function (err, data) {
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
                
                if(message == "inbox") {
                    scenarioService.VRole_list({scenario: roleName.scenario}, function (err, role) {
                        var arrData =[];
                        role.forEach(function (m) {
                            scenarioService.Role_getRoleByGroup({roleGroup: group}, function (err, rolegroup) {
                                rolegroup.forEach(function (rg) {
                                    getInboxRadiogram(m.id, rg.id, function (err, res) {
                                        //res.forEach(function (i) {
                                            arrData.push({
                                                id: res[0].id,
                                                content: res[0].content,
                                                SendTime: res[0].SendTime,
                                                simtime: res[0].simtime,
                                                Number: res[0].Number,
                                                readStatus: res[0].readStatus,
                                                composeStatus: res[0].composeStatus,
                                                receiverCallsign: "PANGKOGAS"
                                            });
                                            _this.$set(_this, 'messages', arrData);
                                        //});
                                    });
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
                                res.forEach(function (i) {
                                    arrData.push({
                                        id: res[0].id,
                                        content: res[0].content,
                                        SendTime: res[0].SendTime,
                                        simtime: res[0].simtime,
                                        Number: res[0].Number,
                                        readStatus: res[0].readStatus,
                                        composeStatus: 'sent',
                                        receiverCallsign: "PANGKOGAS"
                                    });
                                    _this.$set(_this, 'messages', arrData);
                                });
                            });
                        });
                    });
                }
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.Radiogram_GetById({id: val}, function (err, data) {
                    if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                        soyut.radiogram.Radiogram_UpdateReadStatus({id: data.id}, function (err, res) {
                            console.log("radigram telah di baca");
                        });
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

                if(roleName.isWASDAL){
                    var arrData =[];
                    soyut.radiogram.renderListWasdalMessages(message,function(res){
                        //console.log(res[0].Number)
                        //res.forEach(function (vi) {
                        if(message == "inbox") {
                            var stringTime = '<span class="text">waktu Sebenarnya '+ moment(res[0].SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                '<span class="text">waktu Asumsi '+ moment(res[0].simtime).format("DD-MM-YYYY h:mm") +'</span>';    
                            soyut.radiogram.renderSenderObjWasdal(res[0].sender, res[0].senderWasdal, function (sender) {
                                arrData.push({
                                    id: res[0].id,
                                    title: res[0].title,
                                    content: res[0].content,
                                    SendTime: res[0].SendTime,
                                    simtime: res[0].simtime,
                                    createTime: res[0].createTime,
                                    stringTime: stringTime,
                                    Number: res[0].Number,
                                    readStatus: res[0].readStatus,
                                    composeStatus: res[0].composeStatus,
                                    receiverCallsign: sender.position,
                                    receiverRank: "",
                                    receiverName: "",
                                    receiverPhoto: ""
                                });
                                _this.$set(_this, 'messages', arrData);                               
                            })
                        }
                        else{
                            var stringTime = '';
                            if(message == 'draft'){
                                stringTime = '<span class="text">dibuat '+moment(res[0].createTime).format("DD-MM-YYYY h:mm")+'</span>';
                            }
                            else{
                                stringTime = '<span class="text">waktu Sebenarnya '+ moment(res[0].SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                    '<span class="text">waktu Asumsi '+ moment(res[0].simtime).format("DD-MM-YYYY h:mm") +'</span>';
                            }
                            
                            soyut.radiogram.renderListReceiversDetail(res[0].receivers, function (receivers) {
                                arrData.push({
                                    id: res[0].id,
                                    title: res[0].title,
                                    content: res[0].content,
                                    SendTime: res[0].SendTime,
                                    simtime: res[0].simtime,
                                    createTime: res[0].createTime,
                                    stringTime: stringTime,
                                    Number: res[0].Number,
                                    readStatus: res[0].readStatus,
                                    composeStatus: res[0].composeStatus,
                                    receiverCallsign: receivers,
                                    receiverRank: "",
                                    receiverName: "",
                                    receiverPhoto: ""
                                });
                                _this.$set(_this, 'messages', arrData);    
                            });
                        }
                        //});
                    });
                }
                else{
                    var arrData =[];
                    soyut.radiogram.renderListMessages(message,function(res){
                        res.forEach(function (i) {
                            if(message == "inbox") {
                                soyut.radiogram.renderSenderObjWasdal(i.sender, i.senderWasdal, function (sender) {
                                    var stringTime = '<span class="text">waktu Sebenarnya '+ moment(i.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                        '<span class="text">waktu Asumsi '+ moment(i.simtime).format("DD-MM-YYYY h:mm") +'</span>';
                                                        
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
                                });
                            }
                            else{
                                var stringTime = '';
                                if(message == 'draft'){
                                    stringTime = '<span class="text">dibuat '+moment(i.createTime).format("DD-MM-YYYY h:mm")+'</span>';
                                }
                                else{
                                    stringTime = '<span class="text">waktu Sebenarnya '+ moment(i.SendTime).format("DD-MM-YYYY h:mm") +'</span>'+
                                                        '<span class="text">waktu Asumsi '+ moment(i.simtime).format("DD-MM-YYYY h:mm") +'</span>';
                                }
                                
                                soyut.radiogram.renderListReceiversDetail(i.receivers, function (receivers) {
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
                                        receiverCallsign: receivers
                                    });
                                    _this.$set(_this, 'messages', arrData);
                                });
                            }
                        });
                    }); 
                }
            },
            viewMessageDetail: function (val) {
                soyut.radiogram.Radiogram_GetById({id: val}, function (err, data) {
                    if(data.readStatus == 'unread' && data.composeStatus == 'inbox'){
                        soyut.radiogram.Radiogram_UpdateReadStatus({id: data.id}, function (err, res) {
                            console.log("radigram telah di baca");
                        });
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
        SubmitMessage: function(){
            this.$root.SubmitMessage(this.contents);
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents, this.rolecc, this.rolereceiver);
        },
        PrintPdf: function () {
            this.$root.PrintPdf(this.contents, this.rolecc, this.rolereceiver);
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
                if(!roleName.isWASDAL && !roleName.isSet && !roleName.isAddress){
                    var attr;
                    attr = {
                        'style': 'display:none'
                    };
                    return attr;
                }
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
                if(!roleName.isWASDAL && !roleName.isSet && !roleName.isAddress){
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
                    if(data.composeStatus == 'draft'){
                        $('.btn-replyMessage').addClass('disable');
                    }
                    if (roleName.isWASDAL) {
                        soyut.radiogram.renderSenderObjWasdal(data.sender, data.senderWasdal, function (sender) {
                            soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                    soyut.radiogram.renderUserDetail(data.sender, function (user) {
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
                                            simtime: data.simtime,
                                            senderRole: data.sender,
                                            senderCallsign: sender.position,
                                            senderRank: user.rank,
                                            senderName: data.senderName,
                                            senderPhoto: "",
                                            senderSignature: user.signature,
                                            panggilan: data.panggilan,
                                            jenis: data.jenis,
                                            nomor: data.nomor,
                                            derajat: data.derajat,
                                            instruksi: data.instruksi,
                                            klasifikasi: data.classification,
                                            no: data.Number,
                                            cara: data.cara,
                                            paraf: data.paraf,
                                            tandadinas: data.tandadinas,
                                            group: data.group,
                                            alamataksi: data.alamataksi,
                                            alamattembusan: data.alamattembusan,
                                            composeStatus: data.composeStatus,
                                            receiverDetail: receivers,
                                            ccDetail: cc
                                        };

                                        _this.$set(_this, 'contents', contents);
                                    });
                                });
                            });
                        });
                    }
                    else{
                        soyut.radiogram.renderSenderObj(data.sender, data.senderWasdal, function (sender) {
                            soyut.radiogram.renderListReceiversDetail(data.receivers, function (receivers) {
                                soyut.radiogram.renderListReceiversDetail(data.cc, function (cc) {
                                    soyut.radiogram.renderUserDetail(data.sender, function (user) {
                                        var textArray = data.content.split('\n');
                                        var renderMessage = "";
                                        for (var i = 0; i < textArray.length; i++) {
                                            renderMessage += textArray[i] + "<br />";
                                        }
                                        
                                        var curSimTime = "-"
                                        if(data.simtime != undefined || data.simtime != null){
                                            curSimTime = moment(data.simtime).format('DD-MM-YYYY h:mm');
                                        }
                                        var curSendTime = "-"
                                        if(data.SendTime != undefined || data.SendTime != null){
                                            curSendTime = moment(data.SendTime).format('DD-MM-YYYY h:mm');
                                        }
                                        var curCreateTime = "-"
                                        if(data.createTime != undefined || data.createTime != null){
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
                                            senderRank: user.rank,
                                            senderName: data.senderName,
                                            senderPhoto: "",
                                            senderSignature: user.signature,
                                            panggilan: data.panggilan,
                                            jenis: data.jenis,
                                            nomor: data.nomor,
                                            derajat: data.derajat,
                                            instruksi: data.instruksi,
                                            klasifikasi: data.classification,
                                            no: data.Number,
                                            cara: data.cara,
                                            paraf: data.paraf,
                                            tandadinas: data.tandadinas,
                                            group: data.group,
                                            alamataksi: data.alamataksi,
                                            alamattembusan: data.alamattembusan,
                                            composeStatus: data.composeStatus,
                                            receiverDetail: receivers,
                                            ccDetail: cc
                                        };

                                        _this.$set(_this, 'contents', contents);
                                    });
                                });
                            });
                        });
                    }
                });
            },
            PrintPdf: function (content, rolecc, rolereceiver) {
                soyut.radiogram.Printer_PrintToPDF({
                    panggilan: content.panggilan,
                    jenis: content.jenis,
                    nomor: content.nomor,
                    derajat: content.derajat,
                    instruksi: content.instruksi,
                    datetime: content.simtime,
                    sender_Name: content.senderCallsign,
                    receiver_Name: rolereceiver,
                    tembusan_Name: rolecc,
                    klasifikasi: content.klasifikasi,
                    title: content.title,
                    number: content.no,
                    tanda_dinas: content.tandadinas,
                    group: content.group,
                    sendername: content.senderName,
                    senderpangkat: content.senderRank,
                    tanda_tangan: content.senderSignature,
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
                        soyut.radiogram.Show_PdfViewer(msg);
                    }
                });
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
            SubmitMessage: function(content){
                soyut.radiogram.SendDraftWasdalRadiogram(content, function (res) {
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("active");
                    $(getInstanceID("wdl-navigation-menu")).children().removeClass("open");
                    soyut.radiogram.renderDraft();
                })
            },
            ReplyMessage: function (content) {
                soyut.radiogram.renderCompose();
            },
            MoveMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
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
            },
            DeleteMessage: function(content){
                var r = confirm("Anda Yakin?");
                if (r == true) {
                    soyut.radiogram.Radiogram_delete({id: content.id}, function (err, data) {
                        if(!err){
                            soyut.radiogram.renderTrash();       
                        }
                    });
                }
            }
        }
    });
    
};

Vue.component('send-result', {
    props: ['contents','rolecc'],
    template: '#send-result',
    methods: {
        BackToInbox: function () {
            this.$root.BackToInbox();
        },
        PrintPaper: function () {
            this.$root.PrintPaper(this.contents, this.rolecc);
        },
        PrintPDF: function () {
            this.$root.PrintPDF(this.contents, this.rolecc);
        }
    }
});

soyut.radiogram.renderSendingResult = function (elSelector, message) {
    var $el = $(elSelector);
    $el.html('');
    $el.append('<send-result :contents="contents" :rolecc="rolecc"></send-result>');

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
                    scenarioService.Role_find({query: {id: data.sender.roleId}}, function (err, sender) {
                        soyut.user.getUserById(data.sender.userId, function (err, suser) {
                            scenarioService.Role_find({query: {id: data.receivers.roleId}}, function (err, receiver) {
                                soyut.user.getUserById(data.receivers.userId, function (err, ruser) {
                                    var textArray = data.content.split('\n');
                                    var renderMessage = "";
                                    for (var i = 0; i < textArray.length; i++) {
                                        renderMessage += textArray[i] + "<br />";
                                    }
                                    var roleCc = "";
                                    data.cc.forEach(function (m) {
                                        if (m != "") {
                                            if(m.roleId != "" && m.userId != undefined) {
                                                scenarioService.Role_find({query: {id: m.roleId}}, function (err, rcc) {
                                                    soyut.user.getUserById(m.userId, function (err, ucc) {
                                                        var ccdetail = rcc.data[0].position + ' (' + ucc.rank + ' ' + ucc.name + ')';
                                                        roleCc = roleCc + ccdetail + ", ";
                                                        _this.$set(_this, 'rolecc', roleCc);
                                                    });
                                                });
                                            }

                                        }
                                    });

                                    var arrData = {
                                        id: data.id,
                                        title: data.title,
                                        content: data.content,
                                        tembusan: data.cc,
                                        renderMessages: renderMessage,
                                        SendTime: data.SendTime,
                                        receiverRole: data.receivers.roleId,
                                        receiverUser: data.receivers.userId,
                                        receiverCallsign: receiver.data[0].position,
                                        receiverRank: ruser.rank,
                                        receiverName: ruser.name,
                                        receiverPhoto: ruser.photo,
                                        senderRole: data.sender.roleId,
                                        senderUser: data.sender.userId,
                                        senderCallsign: sender.data[0].position,
                                        senderRank: suser.rank,
                                        senderName: suser.name,
                                        senderPhoto: suser.photo,
                                        senderSignature: suser.signature,
                                        panggilan: data.panggilan,
                                        jenis: data.jenis,
                                        no: data.nomor,
                                        derajat: data.derajat,
                                        instruksi: data.instruksi,
                                        klasifikasi: data.classification,
                                        no: data.Number,
                                        cara: data.cara,
                                        paraf: data.paraf,
                                        tandadinas: data.tandadinas,
                                        group: data.group,
                                        alamataksi: data.alamataksi,
                                        alamattembusan: data.alamattembusan
                                    };

                                    _this.$set(_this, 'contents', arrData);
                                });
                            });
                        });
                    });
                });
            },
            BackToInbox: function () {
                soyut.radiogram.clearInput();
                soyut.radiogram.renderInbox();
            },
            PrintPaper: function (content, rolecc) {
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
            PrintPDF: function (content, rolecc) {
                soyut.radiogram.Printer_PrintToPDF({
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
                        soyut.radiogram.Show_PdfViewer(msg);
                    }
                });

            }
        }
    });
};

/*sender and receiver WASDAL */
soyut.radiogram.renderReceiverWasdal = function () {
    soyut.radiogram.renderListReceivers(function(res){
        var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';
        html += '<option value="0">PANGKOGAS</option>'; 
        res.forEach(function(i){
            html += '<option value="'+i.id+'">'+i.position+'</option>'; 
        });
        html +='</select>';
        html +='<span class="receivers-error help-block valid"></span>';
        $(getInstanceID("list-receiver")).append(html);

        $('.optReceiver').multiselect({
            columns: 1,
            placeholder: 'Cari...',
            search: true,
            selectAll: true
        });
    });
};

soyut.radiogram.renderSenderWasdal = function () {
    soyut.radiogram.renderListReceivers(function(res){
        var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none">';
        html += '<option value="">Cari..</option>';
        res.forEach(function (i) {
            html += '<option value="'+ i.id +'">'+ i.position +'</option>';
        });
        html +='</select>';
        html +='<span class="sender-error help-block valid"></span>';
        $(getInstanceID("list-sender")).append(html);

        $(".optSender").select2({ width: '100%' });
    });
};

soyut.radiogram.renderCCWasdal = function () {
    soyut.radiogram.renderListReceivers(function(res){
        var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';
        html += '<option value="0">PANGKOGAS</option>'; 
        res.forEach(function (i) {
            html += '<option value="'+ i.id +'">'+ i.position +'</option>';
        });
        html +='</select>';
        $(getInstanceID("list-tembusan")).append(html);

        $('.optCC').multiselect({
            columns: 1,
            placeholder: 'Cari...',
            search: true,
            selectAll: true
        });
    });
};

/*sender and receiver user */
soyut.radiogram.renderComposeSender = function () {
    soyut.radiogram.renderListSender(function(res){
        var html = '<select name="optSender" id="optSender" class="form-control optSender" style="display:none">';
        html += '<option value="">Cari..</option>';
        res.forEach(function (i) {      
            if(i.isAddress){
                html += '<option value="'+ i.id +'">'+ i.position +'</option>';
            }
        });
        html +='</select>';
        html +='<span class="sender-error help-block valid"></span>';
        $(getInstanceID("list-sender")).append(html);

        $(".optSender").select2({ width: '100%' });
    });
};

soyut.radiogram.renderComposeReceivers = function () {
    soyut.radiogram.renderListReceivers(function(res){
        var html = '<select name="optReceiver[]" multiple id="optReceiver" class="form-control optReceiver">';
        res.forEach(function (i) {
            html += '<option value="'+i.id+'">'+i.position+'</option>'; 
        });
        html +='</select>';
        html +='<span class="receivers-error help-block valid"></span>';
        $(getInstanceID("list-receiver")).append(html);

        $('.optReceiver').multiselect({
            columns: 1,
            placeholder: 'Cari...',
            search: true,
            selectAll: true
        });
    });
};

soyut.radiogram.renderComposeCC = function () {
    soyut.radiogram.renderListReceivers(function(res){
        var html = '<select name="optCC[]" multiple id="optCC" class="optCC">';
        res.forEach(function (i) {
            html += '<option value="'+ i.id +'">'+ i.position +'</option>';
        });
        html +='</select>';
        $(getInstanceID("list-tembusan")).append(html);

        $('.optCC').multiselect({
            columns: 1,
            placeholder: 'Cari...',
            search: true,
            selectAll: true
        });
    });
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
        soyut.radiogram.renderRoleGroup(function(res){
            var html = '<h4>' + roleName.position + ' </h4><h4 class="text-small">Wasdal: '+ res.name +'</h4>';
            $(getInstanceID("detail-user")).html(html);
        });
    }
    else {
        alert("Role group belum di assign!");
    }
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
        soyut.radiogram.renderSenderWasdal();
        soyut.radiogram.renderReceiverWasdal();
        soyut.radiogram.renderCCWasdal();
        soyut.radiogram.renderWasdalRadiogram('.role-group-list');
    }
    else{
        soyut.radiogram.renderCurrentUser();
        soyut.radiogram.renderComposeSender();
        soyut.radiogram.renderComposeReceivers();
        soyut.radiogram.renderComposeCC();

        $(getInstanceID('role-group-name')).css('display','none');
    }
};

soyut.radiogram.init();