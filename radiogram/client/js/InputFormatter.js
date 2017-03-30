var firstload = 'yes';

function count_me(){
    if(iamcounted == 'no'){
        //document.getElementsByName('count_me').src = '';
        iamcounted = 'yes';
    }
}
function destce(a) {
    document.body.removeChild(a.target);
}

function cleartext() {
    document.getElementsByName("message-input")[0].value = "";
    document.getElementsByName("cur_pos")[0].value = "0";
    document.getElementsByName("cur_word")[0].value = "0";
    document.getElementsByName("cur_sent")[0].value = "0";
    document.getElementsByName("cur_line")[0].value = "0";
    document.getElementsByName("char_count")[0].value = "0";
    document.getElementsByName("word_count")[0].value = "0";
    document.getElementsByName("group")[0].value = "0";
    document.getElementsByName("sent_count")[0].value = "0";
    document.getElementsByName("line_count")[0].value = "0";
    document.getElementsByName("sel_char_count")[0].value = "0";
    document.getElementsByName("sel_word_count")[0].value = "0";
    document.getElementsByName("sel_sent_count")[0].value = "0";
    document.getElementsByName("sel_line_count")[0].value = "0";
    document.getElementsByName("custom_count_query")[0].value = "";
    document.getElementsByName("custom_count")[0].value = "0";
    totalcount();
}

function SelectAll(a) {
    document.getElementsByName(a)[0].focus();
    document.getElementsByName(a)[0].select();
}

function monofnt() {
    if (true == document.getElementsByName("monospc")[0].checked) document.getElementsByName("message-input")[0].style.fontFamily = "lucida console, courier new, courier, monospace"; else document.getElementsByName("input")[0].style.fontFamily = "arial";
}

function wrdwrpis(a) {
    if ("on" == a) document.getElementsByName("message-input")[0].setAttribute("wrap", "soft"); else document.getElementsByName("message-input")[0].setAttribute("wrap", "off");
}

function sentcnt(a) {
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

function textcount(a) {
    chr_cnt = a.replace(/[\r\n]/g, "").length;
    var b = a.match(/\w+/g);
    if (null != b) wrd_cnt = b.length; else wrd_cnt = "0";
    snt_cnt = sentcnt(a);
    var c = a.match(/\n/g);
    if ("" != a) if (null != c) lne_cnt = c.length + 1; else lne_cnt = "1"; else lne_cnt = "0";
}

function customcount() {
    var a = document.getElementsByName("message-input")[0].value;
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

function totalcount() {
    var a = document.getElementsByName("message-input")[0].value;
    textcount(a);
    document.getElementsByName("char_count")[0].value = chr_cnt;
    document.getElementsByName("word_count")[0].value = wrd_cnt;
    document.getElementsByName("group")[0].value = wrd_cnt;
    document.getElementsByName("sent_count")[0].value = snt_cnt;
    document.getElementsByName("line_count")[0].value = lne_cnt;
    if ("no" == firstload) count_me();
}

function cpcount(a) {
    var b = document.getElementsByName("message-input")[0];
    var c = "";
    if ("blur" != a) c = b.value.substring(0, b.selectionStart);
    cntonsel("stop");
    textcount(c);
    document.getElementsByName("cur_pos")[0].value = chr_cnt;
    document.getElementsByName("cur_word")[0].value = wrd_cnt;
    document.getElementsByName("cur_sent")[0].value = snt_cnt;
    document.getElementsByName("cur_line")[0].value = lne_cnt;
    column_count();
}

function column_count() {
    var a = document.getElementsByName("message-input")[0];
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
    if ("message-input" != document.activeElement.name) f = "";
    document.getElementsByName("colm_count")[0].value = f.length;

}

var mouseblock = "no";

function cntonsel(a) {
    if ("no" == mouseblock) {
        var b = document.getElementsByName("message-input")[0];
        if ("start" == a) b.onmousemove = cntseled;
        if ("stop" == a) b.onmousemove = null;
    } else mouseblock = "no";
}

function cntseled() {
    var a = document.getElementsByName("message-input")[0];
    var b = "";
    b = a.value.substring(a.selectionStart, a.selectionEnd);
    textcount(b);
    document.getElementsByName("sel_char_count")[0].value = chr_cnt;
    document.getElementsByName("sel_word_count")[0].value = wrd_cnt;
    document.getElementsByName("sel_sent_count")[0].value = snt_cnt;
    document.getElementsByName("sel_line_count")[0].value = lne_cnt;
}
