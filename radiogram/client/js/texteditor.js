var firstload = 'yes';

function fwdcount_me(){
    if(iamcounted == 'no'){
        //document.getElementsByName('count_me').src = '';
        iamcounted = 'yes';
    }
}
function destce(a) {
    document.body.removeChild(a.target);
}

function fwdcleartext() {
    document.getElementsByName("fwd-message-input")[0].value = "";
    document.getElementsByName("cur_posfwd")[0].value = "0";
    document.getElementsByName("cur_wordfwd")[0].value = "0";
    document.getElementsByName("cur_sentfwd")[0].value = "0";
    document.getElementsByName("cur_linefwd")[0].value = "0";
    document.getElementsByName("char_countfwd")[0].value = "0";
    document.getElementsByName("word_countfwd")[0].value = "0";
    document.getElementsByName("fwd-group")[0].value = "0";
    document.getElementsByName("sent_countfwd")[0].value = "0";
    document.getElementsByName("line_countfwd")[0].value = "0";
    document.getElementsByName("sel_char_countfwd")[0].value = "0";
    document.getElementsByName("sel_word_countfwd")[0].value = "0";
    document.getElementsByName("sel_sent_countfwd")[0].value = "0";
    document.getElementsByName("sel_line_countfwd")[0].value = "0";
    document.getElementsByName("custom_count_query")[0].value = "";
    document.getElementsByName("custom_count")[0].value = "0";
    fwdtotalcount();
}

function fwdSelectAll(a) {
    document.getElementsByName(a)[0].focus();
    document.getElementsByName(a)[0].select();
}

function fwdmonofnt() {
    if (true == document.getElementsByName("monospc")[0].checked) document.getElementsByName("fwd-message-input")[0].style.fontFamily = "lucida console, courier new, courier, monospace"; else document.getElementsByName("input")[0].style.fontFamily = "arial";
}

function fwdwrdwrpis(a) {
    if ("on" == a) document.getElementsByName("fwd-message-input")[0].setAttribute("wrap", "soft"); else document.getElementsByName("fwd-message-input")[0].setAttribute("wrap", "off");
}

function fwdsentcnt(a) {
    var b = a.replace(/\r/g, "").replace(/ \n/g, "\n") + "\n";
    var c = b.split(". ").length - 1;
    var d = b.split(".\n").length - 1;
    var e = b.split("! ").length - 1;
    var f = b.split("!\n").length - 1;
    var g = b.split("? ").length - 1;
    var h = b.split("?\n").length - 1;
    var i = c + d + e + f + g + h;
    return i;
}

function fwdtextcount(a) {
    chr_cnt = a.replace(/[\r\n]/g, "").length;
    var b = a.match(/\w+/g);
    if (null != b) wrd_cnt = b.length; else wrd_cnt = "0";
    snt_cnt = fwdsentcnt(a);
    var c = a.match(/\n/g);
    if ("" != a) if (null != c) lne_cnt = c.length + 1; else lne_cnt = "1"; else lne_cnt = "0";
}

function customcount() {
    var a = document.getElementsByName("fwd-message-input")[0].value;
    if (true == document.getElementsByName("skip_html")[0].checked) a = a.replace(/<\S[^><]*>/gi, "");
    var b = 0;
    var c = "gi";
    if (true == document.getElementsByName("case_sen")[0].checked) c = "g";
    var d = document.getElementsByName("custom_count_query")[0].value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    if ("" != d) {
        var e = new RegExp(d, c);
        var f = a.replace(/\r/g, "").match(e);
        if (null != f) b = f.length; else b = "0";
    } else b = "0";
    document.getElementsByName("custom_count")[0].value = b;
}

function fwdtotalcount() {
    var a = document.getElementsByName("fwd-message-input")[0].value;
    fwdtextcount(a);
    document.getElementsByName("char_countfwd")[0].value = chr_cnt;
    document.getElementsByName("word_countfwd")[0].value = wrd_cnt;
    document.getElementsByName("fwd-group")[0].value = wrd_cnt;
    document.getElementsByName("sent_countfwd")[0].value = snt_cnt;
    document.getElementsByName("line_countfwd")[0].value = lne_cnt;
    if ("no" == firstload) fwdcount_me();
}

function fwdcpcount(a) {
    var b = document.getElementsByName("fwd-message-input")[0];
    var c = "";
    if ("blur" != a) c = b.value.substring(0, b.selectionStart);
    fwdcntonsel("stop");
    fwdtextcount(c);
    document.getElementsByName("cur_posfwd")[0].value = chr_cnt;
    document.getElementsByName("cur_wordfwd")[0].value = wrd_cnt;
    document.getElementsByName("cur_sentfwd")[0].value = snt_cnt;
    document.getElementsByName("cur_linefwd")[0].value = lne_cnt;
    fwdcolumn_count();
}

function fwdcolumn_count() {
    var a = document.getElementsByName("fwd-message-input")[0];
    var b = a.value.length;
    var c = a.value.split("\n");
    var d = c.length;
    var d = c.length;
    var e = a.selectionEnd;
    var f = a.value.substring(0, e);
    var g = f.split("\n");
    g.pop();
    var h = g.join("\n").length;
    if (g.length > 0) h += 1;
    f = a.value.substring(h, e);
    if ("fwd-message-input" != document.activeElement.name) f = "";
    document.getElementsByName("colm_countfwd")[0].value = f.length;

}

var mouseblock = "no";

function fwdcntonsel(a) {
    if ("no" == mouseblock) {
        var b = document.getElementsByName("fwd-message-input")[0];
        if ("start" == a) b.onmousemove = fwdcntseled;
        if ("stop" == a) b.onmousemove = null;
    } else mouseblock = "no";
}

function fwdcntseled() {
    var a = document.getElementsByName("fwd-message-input")[0];
    var b = "";
    b = a.value.substring(a.selectionStart, a.selectionEnd);
    fwdtextcount(b);
    document.getElementsByName("sel_char_countfwd")[0].value = chr_cnt;
    document.getElementsByName("sel_word_countfwd")[0].value = wrd_cnt;
    document.getElementsByName("sel_sent_countfwd")[0].value = snt_cnt;
    document.getElementsByName("sel_line_countfwd")[0].value = lne_cnt;
}
