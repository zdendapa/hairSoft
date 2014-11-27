// ---- menu button
function enableMenuButton()
{
    document.addEventListener("menubutton", menuButton, true);
}
function enableBackButton()
{
    document.addEventListener("backbutton", backKeyDown, true);
    if(typeof navigator.app== "undefined") return;
    if(typeof navigator.app.overrideBackbutton== "undefined") return;
    navigator.app.overrideBackbutton(true);
}

function backKeyDown() {
    var r = confirm("Chcete opustit aplikaci?");
    if (r == true) {
        navigator.app.exitApp();
    } else {
        return;
    }
}



// level: 1=INFO, 2=WARNING, 3=ERROR
// v2
function logging(str, level) {
    if (level == 1 || level == null) console.log("INFO:" + str);
    if (level == 2) console.log("WARN:" + str);
    if (level == 3) alert("ERROR:" + str);

    var elLog = $("#log");
    if(elLog.length>0)
    {
        var elTextarea = $("#log").find("textarea");
        var text= $(elTextarea).val();
        text += str + "\n";
        $(elTextarea).val(text);
        $(elTextarea).scrollTop($(elTextarea)[0].scrollHeight);
    }
};

function alertG(msg,title)
{
    if(typeof navigator.notification!="undefined")
    {
        if(title == undefined) title = "Upozornění!";

        navigator.notification.alert(
            msg,  // message
            null,         // callback
            title,            // title
            'OK'                  // buttonName
        );
    } else
    {
        alert(msg);
    }


}
// vstup 23.2.2014
function stringToDate(str)
{
    d = str.split(".");
    var date = new Date(d[2],Number(d[1])-1,d[0]);
    return date;
}

// vystup 23.2.2014
function dateToString(date)
{
    var mesic = date.getMonth() + 1;//leden je 0
    var denVMesici = date.getDate();
    var rok = date.getFullYear();
    return denVMesici + "." + mesic + "." + rok;

}