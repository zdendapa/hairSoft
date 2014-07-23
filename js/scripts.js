//document.addEventListener("deviceready", onDeviceReady, false);
//onDeviceReady();
/*


*/

// nastav true jsi-li na lokalu
var lokal = false;


var identifikator;

var backFunction;   // what to do when you click back button
var currentWindow;  // $(el) for quick hide(transform to offsreen)
var ulScrollOffset;

var xmlZakazniciDetail;

var xmlZakaznici = {
    data : null,
    loadWhenNull : function(showInfo, force) {
        if(this.data == null || force)
        {
            if(showInfo)
                showInfow(true,"Načítám...");
            ajaxZakaznici(renderZakazniciSeznam);
        }
    },
    loadForce : function(showInfo) {
        this.loadWhenNull(showInfo,true);
    }
};

function onDeviceReady() {

    $(document).on('click', '.mainContent.zakazniciSeznam li', function() {
        $(this).addClass('highlight');
        var el= this;
        setTimeout(function(){
            $(el).removeClass('highlight');
            renderZakazniciDetail($(el).attr("data-id"));
            showWindow("showZakazniciDetail");
        },100);
    });

    $('.button').on('click', function(e){
        if($(this).hasClass("buttonOpacity"))
            $(this).addClass('highlightOpacity');
        else
            $(this).addClass('highlight');
        var el= this;
        setTimeout(function(){
            var dataClick = $(el).attr("data-click");
            if($(el).hasClass("buttonOpacity"))
                $(el).removeClass('highlightOpacity');
            else
                $(el).removeClass('highlight');
            if(dataClick!= null)
            {
                eval(dataClick);
            }
        },100);
        //menuToggle();
    });


    //showInfow(true,"Načítám...");
    //ajaxZakaznici(renderZakazniciSeznam);
    dataManagerLoad();
}



function backGo()
{
    if(backFunction!=null)
    {
        backFunction();
    }
}

function menuToggle()
{
    if($("div.menu").css("display")=="none")
    {
        $("div.menu").css("display","block");
        $("#nav-toggle2").removeClass("menuRight");
        $("#nav-toggle2").addClass("menuLeft");
    } else
    {
        $("div.menu").css("display","none");
        $("#nav-toggle2").addClass("menuRight");
        $("#nav-toggle2").removeClass("menuLeft");
    }
}

function showInfow(show,msg)
{
    if(show)
    {
        $("div.special.info h1").html(msg);
        $("div.special.info").css("display","block");
    } else
    {
        $("div.special.info").css("display","none");
    }

}



function showWindow(windowName)
{
    window.localStorage.setItem("hairSoft-lastWindow",windowName);

    if(windowName=="showZakazniciDetail") {
        ulScrollOffset = $("div.mainContent.zakazniciSeznam").scrollTop();
    }

    hideAll();


    if(windowName=="showZakazniciSeznam")
    {
        xmlZakaznici.loadWhenNull(true);

        $("div.mainContent.zakazniciSeznam").css("display","block");
        $("div.mainBottom.twoButtons.zakazniciSeznam").css("display","block");
        $(".mainTop h1").html("Zákazníci");
    }
    if(windowName=="showZakazniciDetail")
    {
        $("div.mainContent.zakazniciDetail").css("display","block");
        $("div.mainBottom.zakazniciDetail").css("display","block");
        $(".mainTop h1").html("Zákazník");
        $(".mainTop input").css("display","none");
        $(".mainTop h1").css("display","block");
        $(".mainTop div.zakazniciDetail").css("display","block");
        $("#rowLeft").css("display","block");
        backFunction = function(){
            showWindow("showZakazniciSeznam");
            $("div.mainContent.zakazniciSeznam").scrollTop(ulScrollOffset);
        };
    }
    if(windowName=="showObjednavkySeznam")
    {
        $("div.mainContent.objednavkySeznam").css("display","block");
        $(".mainTop h1").html("Objednávky");
    }
    if(windowName=="showSkladSeznam")
    {
        $("div.mainContent.skladSeznam").css("display","block");
        $(".mainTop h1").html("Sklad");
    }
    if(windowName=="showTrzbySeznam")
    {
        $("div.mainContent.trzbySeznam").css("display","block");
        $(".mainTop h1").html("Trzby");
    }
    if(windowName=="showNastaveni")
    {
        $("div.mainContent.nastaveni").css("display","block");
        $(".mainTop h1").html("Nastavení");
        $("div.mainBottom.twoButtons.nastaveni").css("display","block");
    }
}


// improve to hide by 3d transforms current window
function hideAll()
{
    $(".main div.mainContent").css("display","none");
    $(".main div.mainBottom").css("display","none");
    $(".mainTop h1").css("display","none");
    $("#rowLeft").css("display","none");
    $(".mainTop input").css("display","inline-block");

    $(".mainTop div.zakazniciDetail").css("display","none");
}



function ajaxZakaznici(onSuccess,onFail)
{

    logging("ajaxZakaznici",1);

    var url;
    if(local)
        url = "data/test.xml";
    else
        url = "http://admin.hairsoft.cz/mobile/index1.php?akce=128&tabulka=mob_lidi&id_id=8D47BE64559F";
    $.ajax({
        type: "POST",
        //url: "data/test.xml",
        url: url,
        //url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo.json',
        dataType: "xml",
        success: function(data) {
            xmlZakaznici.data = data;
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
    var lidi = $(xmlZakaznici.data).find('lidi_osoba');
    var li = "";
    for(var i=0;i<lidi.length;i++)
    {
        var zakaznik = lidi[i];
    //$(xmlZakaznici).find('lidi_osoba').each(function(){
        var jmeno = zakaznik.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue;
        var prijmeni = zakaznik.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue;
        var lidiID = zakaznik.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        li += '<li class="button" data-id="'+lidiID+'"><h2>'+ prijmeni+ ' ' + jmeno +'</h2></li>';

    }
    $(".zakazniciSeznam ul").append(li);

    showInfow(false);
}
// --------------------------------------------- zakazniciDetail
function renderZakazniciDetail(lidiIDfind)
{
    logging("renderZakazniciDetail",1);

    //console.log(xmlZakaznici.getElementsByTagName("lidi_osoba").length);

    for(var i=0;i<xmlZakaznici.data.getElementsByTagName("lidi_osoba").length;i++)
    {
        xmlZakazniciDetail = xmlZakaznici.data.getElementsByTagName("lidi_osoba")[i];
        var lidiID = xmlZakazniciDetail.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        if(lidiID == lidiIDfind)
        {
            // end the for cycle
             i = xmlZakaznici.data.getElementsByTagName("lidi_osoba").length;
        }
    }

    zakazniciDetailSetInputs(xmlZakazniciDetail);


}

function zakazniciDetailSetInputs()
{
    var pohlavi = xmlZakazniciDetail.getElementsByTagName("lidi_pohlavi")[0].childNodes[0].nodeValue;

    if(pohlavi=="M")
        $("#zakaznikSexM").prop("checked","true");
    else
        $("#zakaznikSexZ").prop("checked","true");

    $(".zakazniciDetail h1").html(xmlGetEl(xmlZakazniciDetail,"lidi_jmeno") + " " + xmlGetEl(xmlZakazniciDetail,"lidi_prijmeni"));
    $(".zakazniciDetail input[name=jmeno]").val(xmlGetEl(xmlZakazniciDetail,"lidi_jmeno"));
    $(".zakazniciDetail input[name=prijmeni]").val(xmlGetEl(xmlZakazniciDetail,"lidi_prijmeni"));
    $(".zakazniciDetail input[name=pohlavi]").val(xmlGetEl(xmlZakazniciDetail,"lidi_pohlavi"));
    //$(".zakazniciDetail input[name=adresa]").val(("lidi_adresa"));
    $(".zakazniciDetail input[name=adresa]").val(xmlGetEl(xmlZakazniciDetail,"lidi_adresa"));
    $(".zakazniciDetail input[name=mesto]").val(xmlGetEl(xmlZakazniciDetail,"lidi_mesto"));
    //$(".zakazniciDetail input[name=psc]").val(xmlGetEl("lidi_psc"));
    $(".zakazniciDetail input[name=psc]").val(xmlGetEl(xmlZakazniciDetail,"lidi_psc"));
}


function zakazniciDetailChangeToEdit()
{

    //$(".mainBottom.zakazniciDetail").css("display","none");
    zakazniciDetailToEdit(true);
}

function zakazniciDetailToEdit(editable)
{
    if(editable)
    {
        $(".twoButtons.zakazniciDetail .left div.labelDiv").html("ZRUŠIT");
        $(".twoButtons.zakazniciDetail .right div.labelDiv").html("ULOŽIT");
        $(".twoButtons.zakazniciDetail div.left").attr("data-click","zakazniciDetailChangeCancel()");
        $(".twoButtons.zakazniciDetail div.right").attr("data-click","zakazniciDetailChangeSave()");
        $(".mainContent.zakazniciDetail input").css("background","rgb(223, 223, 223)");

        $(".mainContent.zakazniciDetail input").attr("readonly", false);
        $(".mainContent.zakazniciDetail input.css-checkbox").prop("disabled", false);

        $(".mainBottom.zakazniciDetail input").prop("disabled", true);

        $("#nav-toggle2").css("display","none");
        $("#rowLeft").css("display","none");
    }
    else
    {
        $(".twoButtons.zakazniciDetail .left div.labelDiv").html("SMAZAT");
        $(".twoButtons.zakazniciDetail .right div.labelDiv").html("UPRAVIT");
        $(".twoButtons.zakazniciDetail div.left").attr("data-click","zakazniciDetailDelete()");
        $(".twoButtons.zakazniciDetail div.right").attr("data-click","zakazniciDetailChangeToEdit()");
        $(".mainContent.zakazniciDetail input").css("background","rgb(255, 255, 255)");

        $(".mainContent.zakazniciDetail input").attr("readonly", true);
        $(".mainContent.zakazniciDetail input.css-checkbox").prop("disabled", true);

        $(".mainBottom.zakazniciDetail input").prop("disabled", false);

        $("#nav-toggle2").css("display","inline-block");
        $("#rowLeft").css("display","block");
    }
}

function zakazniciDetailChangeCancel()
{
    zakazniciDetailSetInputs();
    zakazniciDetailToEdit(false);
}


function zakazniciDetailChangeSave(onSuccess,onFail)
{

    logging("zakazniciDetailChangeSave",1);

    var url;



    if(local)
        url = "data/test.xml";
    else
        url = "http://admin.hairsoft.cz/mobile/index1.php?akce=32&tabulka=mob_lidi&id_id=" + identifikator;

    url += "&lidi_jmeno=" + $(".zakazniciDetail input[name=jmeno]").val();
    url += "&lidi_prijmeni=" + $(".zakazniciDetail input[name=prijmeni]").val();
    if($("#zakaznikSexM").is(':checked'))
    {
        url += "&lidi_pohlavi=M";
    } else
    {
        url += "&lidi_pohlavi=Z";
    }
    //url += "&lidi_pohlavi="
    url += "&lidi_adresa=" + $(".zakazniciDetail input[name=adresa]").val();
    url += "&lidi_mesto=" + $(".zakazniciDetail input[name=mesto]").val();
    url += "&lidi_psc=" + $(".zakazniciDetail input[name=psc]").val();
    url += "&lidi_id=" + xmlZakazniciDetail.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;


    $.ajax({
        type: "POST",
        //url: "data/test.xml",
        url: decodeURI(url),
        //url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo.json',
        dataType: "xml",
        success: function(data) {
            console.log(data);
            xmlZakaznici.data = data;
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

var zakaznik = {
    smsSend : function (){
        window.location = "sms:+3490322111?body=messagebody";
    },
    telDial : function (){
        window.location.href='tel:800-123-4567';
    },
    mailSend : function (){
        window.location.href='mailto:email@email.com?cc=email2@email.com&bcc=email3@email.com&subject=The subject of the email&body=The body of the email';
    },
    objednat : function (){

    }
};

function xmlGetEl(data,elName)
{
    if(data==null) return "";
    if(data.getElementsByTagName(elName)[0].childNodes[0]==null) return "";
    return data.getElementsByTagName(elName)[0].childNodes[0].nodeValue;
}


function identifikatorSave()
{
    var val = $(".mainContent.nastaveni input").val();
    if(val!="")
    {
        identifikator = val;
        window.localStorage.setItem("hairSoft-identifikator",identifikator);
        alert("Identifikátor změněn");
    } else
    {
        alert("Vložte prosím identofokátor");
    }
}

function dataManagerLoad()
{
    identifikator = window.localStorage.getItem("hairSoft-identifikator");

    identifikator = "8D47BE64559F";

    if(identifikator!=null)
    {
        $(".mainContent.nastaveni input").val(identifikator);
    }

    var lastWindow = window.localStorage.getItem("hairSoft-lastWindow");
    if(lastWindow==null && identifikator==null)
    {
        showWindow("showNastaveni");
    }
    else if(lastWindow==null) {
        showWindow("showObjednavkySeznam");
    }
    else if(lastWindow!=null)
    {
        if(lastWindow="showZakazniciDetail")
            lastWindow = "showZakazniciSeznam";
        showWindow(lastWindow);
        return;
    }
    showInfow(false);



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