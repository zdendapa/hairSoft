//document.addEventListener("deviceready", onDeviceReady, false);
//onDeviceReady();
/*


*/




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

function menuToggle(forceShow)
{
    if($("div.menu").css("display")=="none" || forceShow)
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
        //$(".mainTop h1").html("Zákazníci");
        $(".mainTop input").css("display","inline-block");
    }
    if(windowName=="showZakazniciDetail")
    {
        $("div.mainContent.zakazniciDetail").css("display","block");
        $("div.mainBottom.zakazniciDetail").css("display","block");
        $(".mainTop h1").html("Zákazník");
        $(".mainTop h1").css("display","block");
        $(".mainTop div.zakazniciDetail").css("display","block");
        $("#rowLeft").css("display","block");
        $("div.mainContent.zakazniciDetail").addClass("withBottom4buttons");
        backFunction = function(){
            showWindow("showZakazniciSeznam");
            $("div.mainContent.zakazniciSeznam").scrollTop(ulScrollOffset);
        };
    }
    if(windowName=="showObjednavkySeznam")
    {
        $("div.mainContent.objednavkySeznam").css("display","block");
        $(".mainTop h1").html("Objednávky");
        $(".mainTop input").css("display","inline-block");
    }
    if(windowName=="showSkladSeznam")
    {
        $("div.mainContent.skladSeznam").css("display","block");
        $(".mainTop h1").html("Sklad");
        $(".mainTop input").css("display","inline-block");
    }
    if(windowName=="showTrzbySeznam")
    {
        $("div.mainContent.trzbySeznam").css("display","block");
        $(".mainTop h1").html("Trzby");
        $(".mainTop input").css("display","inline-block");
    }
    if(windowName=="showNastaveni")
    {
        $("div.mainContent.nastaveni").css("display","block");
        $(".mainTop h1").html("Nastavení");
        $("div.mainBottom.nastaveni").css("display","block");
    }
    if(windowName=="showWelcome")
    {
        $("div.mainContent.welcome").css("display","block");
        $(".mainTop h1").html("HairSoft");
        menuToggle(true);
    }
}


// improve to hide by 3d transforms current window
function hideAll()
{
    $(".main div.mainContent").css("display","none");
    $(".main div.mainBottom").css("display","none");
    $(".mainTop h1").css("display","none");
    $("#rowLeft").css("display","none");
    $(".mainTop input").css("display","none");

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
        /*
        var jmeno = zakaznik.getElementsByTagName("lidi_jmeno")[0].childNodes[0].nodeValue;
        var prijmeni = zakaznik.getElementsByTagName("lidi_prijmeni")[0].childNodes[0].nodeValue;
        var lidiID = zakaznik.getElementsByTagName("lidi_id")[0].childNodes[0].nodeValue;
        */
        var jmeno = xmlGetEl(zakaznik,"lidi_jmeno");
        var prijmeni = xmlGetEl(zakaznik,"lidi_prijmeni");
        var lidiID = xmlGetEl(zakaznik,"lidi_id");
        li += '<li class="button" data-id="'+lidiID+'"><h2>'+ prijmeni+ ' ' + jmeno +'</h2></li>';

    }
    $(".zakazniciSeznam ul").append(li);

    showInfow(false);
}
// --------------------------------------------- zakazniciDetail

function zakazniciDetailNovy()
{
    zakazniciDetailSetInputs(true);
    showWindow("showZakazniciDetail");
    $("div.mainContent.zakazniciDetail").removeClass("withBottom4buttons");
    $("div.mainBottom.zakazniciDetail").css("display","none");
    zakazniciDetailToEdit(true);
    $(".twoButtons.zakazniciDetail div.right").attr("data-click","zakazniciDetailAjax('insert')");
    $(".twoButtons.zakazniciDetail div.left").attr("data-click","backGo();zakazniciDetailToEdit(false)");

}

function renderZakazniciDetail(lidiIDfind)
{
    logging("renderZakazniciDetail id:"+lidiIDfind,1);

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


    zakazniciDetailSetInputs();


}

function zakazniciDetailSetInputs(clear)
{
    if(clear) xmlZakazniciDetail = null;

    //var pohlavi = xmlZakazniciDetail.getElementsByTagName("lidi_pohlavi")[0].childNodes[0].nodeValue;
    var pohlavi = xmlGetEl(xmlZakazniciDetail,"lidi_pohlav");

    if(pohlavi=="M")
        $("#zakaznikSexM").prop("checked","true");
    else
        $("#zakaznikSexZ").prop("checked","true");

    $(".zakazniciDetail h1").html(xmlGetEl(xmlZakazniciDetail,"lidi_jmeno") + " " + xmlGetEl(xmlZakazniciDetail,"lidi_prijmeni"));
    $(".zakazniciDetail input[name=jmeno]").val(xmlGetEl(xmlZakazniciDetail,"lidi_jmeno"));
    $(".zakazniciDetail input[name=prijmeni]").val(xmlGetEl(xmlZakazniciDetail,"lidi_prijmeni"));
    $(".zakazniciDetail input[name=pohlavi]").val(xmlGetEl(xmlZakazniciDetail,"lidi_pohlavi"));
    //$(".zakazniciDetail input[name=adresa]").val(("lidi_adresa"));
    $(".zakazniciDetail input[name=email]").val(xmlGetEl(xmlZakazniciDetail,"lidi_email"));
    $(".zakazniciDetail input[name=telefon]").val(xmlGetEl(xmlZakazniciDetail,"lidi_tel1"));
    $(".zakazniciDetail input[name=telefon2]").val(xmlGetEl(xmlZakazniciDetail,"lidi_tel2"));
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
        $(".twoButtons.zakazniciDetail div.right").attr("data-click","zakazniciDetailAjax('update')");
        $(".mainContent.zakazniciDetail input").css("background","rgb(223, 223, 223)");

        $(".mainContent.zakazniciDetail input").attr("readonly", false);
        $(".mainContent.zakazniciDetail input.css-checkbox").prop("disabled", false);

        $(".mainBottom.zakazniciDetail input").prop("disabled", true);

        $("#nav-toggle2").css("display","none");
        $("#rowLeft").css("display","none");

        $("div.mainContent.zakazniciDetail").removeClass("withBottom4buttons");
        $("div.mainBottom.zakazniciDetail").css("display","none");
    }
    else
    {
        $(".twoButtons.zakazniciDetail .left div.labelDiv").html("SMAZAT");
        $(".twoButtons.zakazniciDetail .right div.labelDiv").html("UPRAVIT");
        $(".twoButtons.zakazniciDetail div.left").attr("data-click","zakazniciDetailAjax('delete')");
        $(".twoButtons.zakazniciDetail div.right").attr("data-click","zakazniciDetailChangeToEdit()");
        $(".mainContent.zakazniciDetail input").css("background","rgb(255, 255, 255)");

        $(".mainContent.zakazniciDetail input").attr("readonly", true);
        $(".mainContent.zakazniciDetail input.css-checkbox").prop("disabled", true);

        $(".mainBottom.zakazniciDetail input").prop("disabled", false);

        $("#nav-toggle2").css("display","inline-block");
        $("#rowLeft").css("display","block");

        $("div.mainContent.zakazniciDetail").addClass("withBottom4buttons");
        $("div.mainBottom.zakazniciDetail").css("display","block");

        $(".zakazniciDetail h1").html($(".zakazniciDetail input[name=jmeno]").val() + " " + $(".zakazniciDetail input[name=prijmeni]").val());
    }
}

function zakazniciDetailChangeCancel()
{
    zakazniciDetailSetInputs();
    zakazniciDetailToEdit(false);
}


 // type = update, insert, delete
function zakazniciDetailAjax(type)
{

    logging("zakazniciDetailAjax",1);

    if(type == "insert")
        var akce = 16;
    if(type == "update")
        var akce = 32;
    if(type == "delete")
    {

        var r = confirm("Opravdu chcete záznam smazat?");
        if (r == true) {
            var akce = 64;
        } else {
            return;
        }
    }


    var url = "http://admin.hairsoft.cz/mobile/index1.php?akce="+akce+"&tabulka=mob_lidi&id_id=" + identifikator;

    if(type != "delete")
    {
        url += "&lidi_jmeno=" + $(".zakazniciDetail input[name=jmeno]").val();
        url += "&lidi_prijmeni=" + $(".zakazniciDetail input[name=prijmeni]").val();
        if($("#zakaznikSexM").is(':checked'))
        {
            url += "&lidi_pohlavi=M";
        } else
        {
            url += "&lidi_pohlavi=Ž";
        }
        //url += "&lidi_pohlavi="
        url += "&lidi_email=" + $(".zakazniciDetail input[name=email]").val();
        url += "&lidi_tel1=" + $(".zakazniciDetail input[name=telefon]").val();
        url += "&lidi_tel2=" + $(".zakazniciDetail input[name=telefon2]").val();
        url += "&lidi_adresa=" + $(".zakazniciDetail input[name=adresa]").val();
        url += "&lidi_mesto=" + $(".zakazniciDetail input[name=mesto]").val();
        url += "&lidi_psc=" + $(".zakazniciDetail input[name=psc]").val();
    }

    if(type == "update" || type == "delete")
    {
        url += "&lidi_id=" + xmlGetEl(xmlZakazniciDetail,"lidi_id");
    }


    $.ajax({
        type: "POST",
        //url: "data/test.xml",
        url: decodeURI(url),
        //url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo.json',
        dataType: "xml",
        success: function(data) {

            var odpoved = xmlGetEl(data,"zprava");
            if(odpoved=="UPRAVEN" || odpoved=="ZALOŽEN")
            {
                alert("Záznam uložen");
                zakazniciDetailToEdit(false);
                xmlZakaznici.data = null;
            } else if(odpoved=="SMAZAN")
            {
                alert("Záznam byl smazán");
                xmlZakaznici.data = null;
                showWindow("showZakazniciSeznam")
            }
            else
            {
                alert(odpoved);

            }


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

        },
        error: ajaxErrorHandler
    });
    return false;

}



var zakaznik = {
    smsSend : function (){
        window.location = "sms:"+xmlGetEl(xmlZakazniciDetail,"lidi_tel1")+"?body=HairSoft sms tempate";
    },
    telDial : function (){
        window.location.href='tel:'+xmlGetEl(xmlZakazniciDetail,"lidi_tel1");
    },
    mailSend : function (){
        //window.location.href='mailto:email@email.com?cc=email2@email.com&bcc=email3@email.com&subject=The subject of the email&body=The body of the email';
        window.location.href='mailto:'+xmlGetEl(xmlZakazniciDetail,"lidi_email")+'?email.com&subject=HairSoft předmět&body=Zpráva';
    },
    objednat : function (){

    }
};

function xmlGetEl(data,elName)
{
    if(data==null) return "";

    if(data.getElementsByTagName(elName)[0]==null) return "";
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


    if(identifikator!=null)
    {
        $(".mainContent.nastaveni input").val(identifikator);
        showWindow("showWelcome");
    } else
    {
        // hack
        identifikator = "8D47BE64559F";
        $(".mainContent.nastaveni input").val(identifikator);
        // --- end hack
        showWindow("showNastaveni");
    }

    showInfow(false);

    /*
    var lastWindow = window.localStorage.getItem("hairSoft-lastWindow");
    if(lastWindow==null && identifikator==null)
    {
        showWindow("showNastaveni");
    }
    else if(lastWindow==null) {
        showWindow("showNastaveni");
    }
    else if(lastWindow!=null)
    {
        if(lastWindow="showZakazniciDetail")
            lastWindow = "showZakazniciSeznam";
        showWindow(lastWindow);
        return;
    }
    showInfow(false);
*/


}

//-------------------------------------------------------------------

function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            /*
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
                */
            $(".mainContent.nastaveni input").val(result.text);
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

function ajaxErrorHandler(data) {
    console.log(data);

    /*
    if(data != null)
    {
        if(data.responseText!=null)
        {
            data = data.responseText.substring(data.responseText.indexOf("<odpoved>"));
            if(data.length>0)
            {
                var xmlDoc = jQuery.parseXML(data);
                if (xmlDoc)
                {
                    var odpoved = xmlGetEl(data,"zprava");
                    if(odpoved!="")
                    {
                        alert(odpoved);
                        return;
                    }
                }
            }
        }
    }
*/

    if(!local)
    {
        showInfow(false);
        var networkState = navigator.connection.type;
        if(networkState == Connection.UNKNOWN || networkState== Connection.NONE)
        {
            alert("Nelze se připojit k internetu");
            return;false
        }
    }


    if(data.msg==undefined)
    {
        alert("Chyba s komunikací se serverem");
    } else
    {
        alert("chyba:" +data.msg);
    }
}


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