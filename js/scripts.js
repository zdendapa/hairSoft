//document.addEventListener("deviceready", onDeviceReady, false);
//onDeviceReady();
/*


*/

// nastav true jsi-li na lokalu
var lokal = false;



var xmlZakaznici;
var backFunction;

function onDeviceReady() {

    ajaxZakaznici(renderZakazniciSeznam);

    $(document).on('click', '.mainContent.zakazniciSeznam li', function() {
        renderZakazniciDetail($(this).attr("data-id"));
        showZakazniciDetail();
    });

    showZakazniciSeznam();

}

function backGo()
{
    if(backFunction!=null)
    {
        backFunction();
    }
}

function showZakazniciSeznam()
{
    hideAll();
    $("div.mainContent.zakazniciSeznam").css("display","block");
    $("div.mainBottom.general").css("display","block");
    $(".mainTop h1").html("Zákazníci");
}

function showZakazniciDetail()
{
    hideAll();
    $("div.mainContent.zakazniciDetail").css("display","block");
    $("div.mainBottom.zakazniciDetail").css("display","block");
    $(".mainTop h1").html("Zákazník");
    backFunction = showZakazniciSeznam;
}

function hideAll()
{
    $(".main div.mainContent").css("display","none");
    $(".main div.mainBottom").css("display","none");
}

function ajaxZakaznici(onSuccess,onFail)
{

    logging("ajaxZakaznici",1);
    $.ajax({
        type: "POST",
        //url: "data/test.xml",
        url: "http://admin.hairsoft.cz/mobile/index1.php?  akce=128&tabulka=mob_lidi&id_id=8D47BE64559F",
        //url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo.json',
        dataType: "xml",
        success: function(data) {
            xmlZakaznici = data;
            var pocet = 0;
            var ulicePredchozi = "";

            /*
            $(xmlLidi).find('lidi_osoba').each(function(){
                //var id = $(this).attr('id');
                //var title = $(this).find('title').text();
                var jmeno = this.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue;
                var prijmeni = this.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue;
                var pohlavi = this.getElementsByTagName("lidi_pohlavi")[0].childNodes[0].nodeValue;
                var adresa = this.getElementsByTagName("lidi_adresa")[0].childNodes[0].nodeValue;
                var mesto = this.getElementsByTagName("lidi_mesto")[0].childNodes[0].nodeValue;
                var psc = this.getElementsByTagName("lidi_psc")[0].childNodes[0].nodeValue;
            });
            */
            onSuccess();
        },
        error: ajaxErrorHandler
    });
    return false;

}

function renderZakazniciSeznam()
{
    logging("renderZakazniciSeznam",1);

    $(".zakazniciSeznam ul").empty();
    $(xmlZakaznici).find('lidi_osoba').each(function(){
        var jmeno = this.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue;
        var prijmeni = this.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue;
        var lidiID = this.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        var li = '<li data-id="'+lidiID+'"><h2>'+ prijmeni+ ' ' + jmeno +'</h2></li>';
        $(".zakazniciSeznam ul").append(li);
    });
}

function renderZakazniciDetail(lidiIDfind)
{
    logging("renderZakazniciDetail",1);

    //console.log(xmlZakaznici.getElementsByTagName("lidi_osoba").length);

    for(var i=0;i<xmlZakaznici.getElementsByTagName("lidi_osoba").length;i++)
    {
        var xmlDetail = xmlZakaznici.getElementsByTagName("lidi_osoba")[i];
        var lidiID = xmlDetail.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        if(lidiID == lidiIDfind)
        {
             i = xmlZakaznici.getElementsByTagName("lidi_osoba").length;
        }
    }

    var pohlavi = xmlDetail.getElementsByTagName("lidi_pohlavi")[0].childNodes[0].nodeValue;

    if(pohlavi=="M")
        $("#zakaznikSexM").prop("checked","true");
    else
        $("#zakaznikSexZ").prop("checked","true");

    $(".zakazniciDetail h1").html(xmlDetail.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue + " " + xmlDetail.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=jmeno]").val(xmlDetail.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=prijmeni]").val(xmlDetail.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=pohlavi]").val(xmlDetail.getElementsByTagName("lidi_pohlavi")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=adresa]").val(xmlDetail.getElementsByTagName("lidi_adresa")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=mesto]").val(xmlDetail.getElementsByTagName("lidi_mesto")[0].childNodes[0].nodeValue);
    $(".zakazniciDetail input[name=psc]").val(xmlDetail.getElementsByTagName("lidi_psc")[0].childNodes[0].nodeValue);





        //console.log(xmlDetail)

        //var jmeno = xmlDetail.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue;
        //var prijmeni = xmlDetail.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue;
        //var lidiID = xmlDetail.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        //console.log(jmeno);

}

function ajaxErrorHandler(data) {
    console.log(data);
    if(data.msg==undefined)
    {
        alert("Chyba s komunikací se serverem");
    } else
    {
        alert("chyba:" +data.msg);
    }
}


//-------------------------------------------------------------------
// level: 1=INFO, 2=WARNING, 3=ERROR
function logging(str, level) {
    if (level == 1) console.log("INFO:" + str);
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