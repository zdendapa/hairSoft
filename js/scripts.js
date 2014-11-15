//document.addEventListener("deviceready", onDeviceReady, false);
//onDeviceReady();
/*


*/




var identifikator;
var prihlaseni;
var objednavamZakaznika = false;

var backFunction;   // what to do when you click back button
var currentWindow;  // $(el) for quick hide(transform to offsreen)
var ulScrollOffset;

var menuVisible = false;
var $navtoggle2;

var xmlZakazniciDetail;
var supportedTran;

var transitionObject = {};
var pageMaxLenght;
var touched = false;
var trLastSelected;



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

var xmlSklad = {
    data : null,
    loadWhenNull : function(showInfo, force) {
        if(this.data == null || force)
        {
            if(showInfo)
                showInfow(true,"Načítám...");
            //ajaxZakaznici(renderSkladSeznam);
        }
    },
    loadForce : function(showInfo) {
        this.loadWhenNull(showInfo,true);
    }
};

var xmlTrzby = {
    data : null,
    loadWhenNull : function(showInfo, force) {
        if(this.data == null || force)
        {
            if(showInfo)
                showInfow(true,"Načítám...");
            //ajaxZakaznici(renderTrzbySeznam);
        }
    },
    loadForce : function(showInfo) {
        this.loadWhenNull(showInfo,true);
    }
};

function onDeviceReady() {

}


function onLoad() {


    // detect if browser support things we need and set support... variable
    supportDetect();

    // by supported aceleration, prepare classes and view
    transitionInit();

    // set clicks function on buttons, touch or click
    clickInit();

    // load variable from localStore and set data it in pages
    dataManagerLoad();

    // unhide ready app :)
    $(".special.cover").css("display","none");

    //showWindow("showObjednavkySeznam")

}


//----------------------------------------------------------- core functions
function clickInit()
{

    //initialize hw back button
    enableBackButton();

    /*
    types:
    - click only with touch (doesn matter if you hold your finger)
        my own solution on touchstart
    - click with click (does matter if you hold your finger = button on scrollbar)
        default click with runing fastClick
        (with fast click its more quick, its detect touch-end, so if you tap quickly is quickly. By default if you tap quickly its waiting 300ms no matter touch end)
     */


    var $buttons;
    // ------------- buttons needs click (scrollable or...)
    $buttons = $('._buttonClick');

    $buttons.on("click", function(e){
        e.stopPropagation();
        if($(this).hasClass("buttonDisable"))
        return;
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
        },150);
    });

    // ------------- buttons with touch consideration
    // get all buttons in memory. Those that touchstart should be consider
    $buttons = $('._buttonTouch');

    // set event on buttons


    // get if touchstart is supported
    var eventType;
    if ('ontouchstart' in document.documentElement) {
        eventType = "touchstart";
        logging("ontouchstart enabled",1);
    } else
    {
        eventType = "click";
    }

    // set event on buttons
    $buttons.on(eventType, function(e){
        e.stopPropagation();
        // get type of higlight effect
        if($(this).hasClass("buttonOpacity"))
            $(this).addClass('highlightOpacity');
        else
            $(this).addClass('highlight');
        var el= this;

        // show effect
        setTimeout(function(){
            if($(el).hasClass("buttonOpacity"))
                $(el).removeClass('highlightOpacity');
            else
                $(el).removeClass('highlight');

            // run function
            var dataClick = $(el).attr("data-click");
            if(dataClick!= null)
            {
                eval(dataClick);
            }
        },150);


    });





    // ------- scrollable list
    $(document).on('click', '.mainContent.zakazniciSeznam li', function() {
        $(this).addClass('highlight');
        var el= this;
        setTimeout(function(){
            $(el).removeClass('highlight');
            renderZakazniciDetail($(el).attr("data-id"));
            showWindow("showZakazniciDetail");
        },100);
    });



    // ------ tables
    $(document).on('click', 'tr', function() {
        if($(this).parent().prop("tagName")!="TBODY")
        {
            return;
        }
        if(trLastSelected!=null)
        {
            $(trLastSelected).removeClass("colorTrSelected");
            console.log("exist");
        } else
        {
            $("tr").removeClass("colorTrSelected");
        }
        $(this).addClass("colorTrSelected");
        trLastSelected = this;
    });

    // validace
    $("input._validaceTelAAA").keydown(function (e) {

        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 187]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }

        if(!(e.keyCode > 47 && e.keyCode<59)) {
            e.preventDefault();
            alertG("Vložte prosím jen čísla","Upozornění!");
        }
    });
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
    //   menu icon
    if(!menuVisible || forceShow)
    {
        $navtoggle2.addClass("menuLeft");
        $navtoggle2.removeClass("menuRight");
    } else
    {
        $navtoggle2.addClass("menuRight");
        $navtoggle2.removeClass("menuLeft");
    }


    //   menu bar
    if(forceShow)
    {
        if(supportedTran==3) $menu.addClass("right3d");
        if(supportedTran==2) $menu.addClass("right");
        if(supportedTran==1) $menu.css("display","block");
        menuVisible = true;
    } else
    {
        if(supportedTran==3) $menu.toggleClass("right3d");
        if(supportedTran==2) $menu.toggleClass("right");
        if(supportedTran==1) $menu.toggle();
        menuVisible = !menuVisible;
    }


}

function menuToggle_old(forceShow)
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
        //$("div.special.info").css("display","block");
        containerVisibilitySet("specInfo",true);
    } else
    {
        //$("div.special.info").css("display","none");
        containerVisibilitySet("specInfo",false);
    }

}



function showWindow(windowName)
{
    if(prihlaseni == "no")
    {
        if(windowName=="showTrzbySeznam")
        {
            alertG("Do této sekce nemáte oprávnění");
            return;
        }
    }

    window.localStorage.setItem("hairSoft-lastWindow",windowName);

    if(windowName=="showZakazniciDetail") {
        ulScrollOffset = $("div.mainContent.zakazniciSeznam").scrollTop();
    }

    hideAll();


    if(windowName=="showZakazniciSeznam")
    {
        containerVisibilitySet("zakazniciSeznam",true);
        //$("div.mainContent.zakazniciSeznam").css("display","block");
        //$("div.mainBottom.twoButtons.zakazniciSeznam").css("display","block");
        containerVisibilitySet("ftZakazniciSeznam",true);
        //$(".mainTop h1").html("Zákazníci");
        //$(".mainTop input").css("display","inline-block");
        containerVisibilitySet("topFind",true);

        xmlZakaznici.loadWhenNull(true);


    }
    if(windowName=="showZakazniciDetail")
    {
        //$("div.mainContent.zakazniciDetail").css("display","block");
        containerVisibilitySet("zakazniciDetail",true);
        //$("div.mainBottom.zakazniciDetail").css("display","block");
        containerVisibilitySet("ftZakazniciDetail",true);
        $(".mainTop h1").html("Zákazník");
        //$(".mainTop h1").css("display","block");
        containerVisibilitySet("topH1",true);
        //$(".mainTop div.zakazniciDetail").css("display","block");
        containerVisibilitySet("topZakazniciDetail",true);
        //$("#rowLeft").css("display","block");
        containerVisibilitySet("rowLeft",true);
        $("div.mainContent.zakazniciDetail").addClass("withBottom4buttons");


        backFunction = function(){
            showWindow("showZakazniciSeznam");
            $("div.mainContent.zakazniciSeznam").scrollTop(ulScrollOffset);
        };
    }
    if(windowName=="showObjednavkySeznam")
    {

        containerVisibilitySet("topH1",true);
        containerVisibilitySet("objednavkySeznam",true);
        if(objednavamZakaznika)
        {
            $(".mainContent.objednavkySeznam .objednavka").css("display", "block");
            containerVisibilitySet("ftObjednavky",true);
            $(".mainTop h1").html("Objednávka");
            $(".mainContent.objednavkySeznam .objednavka .zakaznik").html("Zákazník: " + xmlGetEl(xmlZakazniciDetail,"lidi_jmeno") + " " + xmlGetEl(xmlZakazniciDetail,"lidi_prijmeni"));
            objednavamZakaznika = false;
        } else
        {
            $(".mainTop h1").html("Objednávky");
            $(".mainContent.objednavkySeznam .objednavka").css("display", "none");
        }


    }
    if(windowName=="showSkladSeznam")
    {
        containerVisibilitySet("skladSeznam",true);
        //$(".mainTop input").css("display","inline-block");
        containerVisibilitySet("topFind",true);

        //xmlSklad.loadWhenNull(true);


    }
    if(windowName=="showTrzbySeznam")
    {
        containerVisibilitySet("trzbySeznam",true);
        //$("div.mainContent.trzbySeznam").css("display","block");
        //$(".mainTop input").css("display","inline-block");
        containerVisibilitySet("topFind",true);
        containerVisibilitySet("ftTrzbySeznam",true);

        // on start both sluzby and prodej are display none. Show first one
        if($(".trzbySeznam div.content.sluzby").css("display") == "none" && $(".trzbySeznam div.content.prodej").css("display")=="none")
        {

            $(".trzbySeznam div.content.sluzby").css("display","block");
        }

        $(".mainBottom.trzbySeznam div.left").addClass("trzbyTypColor");
        $(".mainBottom.trzbySeznam div.right").removeClass("trzbyTypColor");
    }
    if(windowName=="showNastaveni")
    {
        containerVisibilitySet("nastaveni",true);
        $(".mainTop h1").html("Nastavení");
        //$("div.mainBottom.nastaveni").css("display","block");
        containerVisibilitySet("ftNastaveni",true);

    }
    if(windowName=="showWelcome")
    {
        /*
        $("div.mainContent.welcome").css("display","block");
        $(".mainTop h1").html("HairSoft");
        menuToggle(true);
        */

        containerVisibilitySet("welcome",true);
        $(".mainTop h1").html("HairSoft");
        //$(".mainTop h1").css("display","block");
        containerVisibilitySet("topH1",true);
        menuToggle(true);
    }
}


// improve to hide by 3d transforms current window
function hideAll()
{
    /*
    $(".main div.mainContent").css("display","none");
    $(".main div.mainBottom").css("display","none");
    $(".mainTop h1").css("display","none");
    $("#rowLeft").css("display","none");
    $(".mainTop input").css("display","none");

    $(".mainTop div.zakazniciDetail").css("display","none");
    */
    //$(".mainTop h1").css("display","none");
    //$(".mainTop input").css("display","none");
    containerHideAll();
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

// --------------------------------------------- sklad
function renderSkladSeznam()
{
    //var htmlData = '<table data-role="table" data-mode="columntoggle" class="ui-responsive" id="myTable">  <thead>  <tr>  <th data-priority="6">CustomerID</th>  <th>CustomerName</th>  <th data-priority="1">ContactName</th>  <th data-priority="2">Address</th>  <th data-priority="3">City</th>  <th data-priority="4">PostalCode</th>  <th data-priority="5">Country</th>  </tr>  </thead>  <tbody>  <tr>  <td>1</td>  <td>Alfreds Futterkiste</td>  <td>Maria Anders</td>  <td>Obere Str. 57</td>  <td>Berlin</td>  <td>12209</td>  <td>Germany</td>  </tr>  <tr>  <td>2</td>  <td>Antonio Moreno Taquería</td>  <td>Antonio Moreno</td>  <td>Mataderos 2312</td>  <td>México D.F.</td>  <td>05023</td>  <td>Mexico</td>  </tr>  <tr>  <td>3</td>  <td>Around the Horn</td>  <td>Thomas Hardy</td>  <td>120 Hanover Sq.</td>  <td>London</td>  <td>WA1 1DP</td>  <td>UK</td>  </tr>  <tr>  <td>4</td>  <td>Berglunds snabbköp</td>  <td>Christina Berglund</td>  <td>Berguvsvägen 8</td>  <td>Luleĺ</td>  <td>S-958 22</td>  <td>Sweden</td>  </tr>  </tbody>  </table>';
    //$(".skladSeznam div.table").html(htmlData);


    showInfow(false);
}

// --------------------------------------------- trzby


function trzbyDisplay(typ)
{
    if(typ=="sluzby")
    {
        $(".trzbySeznam div.content.sluzby").css("display","block");
        $(".trzbySeznam div.content.prodej").css("display","none");
        $(".mainBottom.trzbySeznam div.left").addClass("trzbyTypColor");
        $(".mainBottom.trzbySeznam div.right").removeClass("trzbyTypColor");
    } else
    {
        $(".trzbySeznam div.content.sluzby").css("display","none");
        $(".trzbySeznam div.content.prodej").css("display","block");
        $(".mainBottom.trzbySeznam div.right").addClass("trzbyTypColor");
        $(".mainBottom.trzbySeznam div.left").removeClass("trzbyTypColor");
    }



}
// --------------------------------------------- zakazniciDetail

function zakazniciDetailNovy()
{
    if(prihlaseni == "no")
    {
        alertG("Pro tuto funkci nemáte oprávnění");
        return;
    }
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
    //var tel1 = xmlGetEl(xmlZakazniciDetail,"lidi_tel1");
    $(".zakazniciDetail input[name=telefon]").val(xmlGetEl(xmlZakazniciDetail,"lidi_tel1"));
    //var tel2 = xmlGetEl(xmlZakazniciDetail,"lidi_tel2");
    $(".zakazniciDetail input[name=telefon2]").val(xmlGetEl(xmlZakazniciDetail,"lidi_tel2"));
    $(".zakazniciDetail input[name=adresa]").val(xmlGetEl(xmlZakazniciDetail,"lidi_adresa"));
    $(".zakazniciDetail input[name=mesto]").val(xmlGetEl(xmlZakazniciDetail,"lidi_mesto"));
    //$(".zakazniciDetail input[name=psc]").val(xmlGetEl("lidi_psc"));
    $(".zakazniciDetail input[name=psc]").val(xmlGetEl(xmlZakazniciDetail,"lidi_psc"));

    // disable unused buttons



/*
    if(tel1=="" &&  tel2=="") {

        $("div.zdButtonVolat").addClass("buttonDisable").removeClass("_buttonClick");
    }
    if(tel2=="")
    {
        $("div.zdButtonSms").addClass("buttonDisable").removeClass("_buttonClick");
    }
    if(xmlGetEl(xmlZakazniciDetail,"lidi_email")=="")
    {
        $("div.zdButtonEmail").addClass("buttonDisable").removeClass("_buttonClick");
    }
    */
    zakazniciDetailButtonsVisibility();
}

function zakazniciDetailButtonsVisibility()
{
    var tel1 = $(".zakazniciDetail input[name=telefon]").val();
    var tel2 = $(".zakazniciDetail input[name=telefon2]").val();
    var mail = $(".zakazniciDetail input[name=email]").val();

    $(".zakazniciDetail .button").removeClass("buttonDisable");

    if(tel1=="" &&  tel2=="") {

        $("div.zdButtonVolat").addClass("buttonDisable").removeClass("_buttonClick");
    }
    if(tel2=="")
    {
        $("div.zdButtonSms").addClass("buttonDisable").removeClass("_buttonClick");
    }
    if(mail=="")
    {
        $("div.zdButtonEmail").addClass("buttonDisable").removeClass("_buttonClick");
    }

}

function zakazniciDetailChangeToEdit()
{
    if(prihlaseni == "no")
    {
        alertG("Pro tuto funkci nemáte oprávnění");
        return;
    }
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

function validaceDetail()
{
    // validace telefonu a emailu
    var mail = $(".zakazniciDetail input[name=email]").val();
    var tel =   $(".zakazniciDetail input[name=telefon]").val();
    var mobil = $(".zakazniciDetail input[name=telefon2]").val();

    if(!validaceTelefonu(tel))
    {
        alertG("Telefoní číslo musí obsahovat pouze čísla","Upozornění!");
        return false
    }
    if(!validaceTelefonu(mobil))
    {
        alertG("Mobilní číslo musí obsahovat pouze čísla","Upozornění!");
        return false
    }
    if(!validaceMailu(mail))
    {
        alertG("Zadejte prosím platný e-mail","Upozornění!");
        return false
    }






    return true;


}

function validaceTelefonu(num)
{
    if(num==undefined) return true;
    if(num.length==0) return true;
    num = num.replace(/ /g,"");
    num = num.replace("+","");
    return !isNaN(num);
}

function validaceMailu(mail)
{
    if(mail== undefined) return true;
    if(mail == "") return true;

    var isEmail_re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if(String(mail).search (isEmail_re) != -1)
    {
        console.log("email true");
        return true;
    }
    else
    {
        console.log("email false");
        return false;
    }
}

 // type = update, insert, delete
function zakazniciDetailAjax(type)
{
    if(ajaxReadOnly) return;
    if(prihlaseni == "no")
    {
        alertG("Pro tuto funkci nemáte oprávnění");
        return;
    }

    logging("zakazniciDetailAjax",1);

    if(type == "insert")
        var akce = 16;
    if(type == "update")
    {
        if(validaceDetail())
        {
            var akce = 32;
        } else
        return;
    }
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

    showInfow(true);
    $.ajax({
        type: "POST",
        //url: "data/test.xml",
        url: decodeURI(url),
        //url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo.json',
        dataType: "xml",
        success: function(data) {
            showInfow(false);
            var odpoved = xmlGetEl(data,"zprava");
            if(odpoved=="UPRAVEN" || odpoved=="ZALOŽEN")
            {
                alertG("Záznam uložen","Potvrzení");
                zakazniciDetailToEdit(false);
                zakazniciDetailButtonsVisibility();
                xmlZakaznici.data = null;
            } else if(odpoved=="SMAZAN")
            {
                alertG("Záznam byl smazán","Potvrzení");
                xmlZakaznici.data = null;
                showWindow("showZakazniciSeznam")
            }
            else
            {
                alertG(odpoved);

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
        var tel= xmlGetEl(xmlZakazniciDetail,"lidi_tel2");
        if(tel.length<9)
        {
            tel= xmlGetEl(xmlZakazniciDetail,"lidi_tel1");
        }
        window.location.href='tel:'+tel;
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
    var val = $("#identifikator").val();
    if(val!="")
    {
        identifikator = val;
        window.localStorage.setItem("hairSoft-identifikator",identifikator);
        alertG("Identifikátor změněn","Potvrzení");
    } else
    {
        alertG("Vložte prosím identofokátor");
    }
}

function dataManagerLoad()
{
    identifikator = window.localStorage.getItem("hairSoft-identifikator");
    prihlaseni = window.localStorage.getItem("hairSoft-prihlaseni");


    if(identifikator!=null)
    {
        $("#identifikator").val(identifikator);
        showWindow("showWelcome");
    } else
    {
        // hack
        identifikator = "8D47BE64559F";
        $("#identifikator").val(identifikator);
        // --- end hack
        showWindow("showNastaveni");
    }

    if(prihlaseni==null)
    {
        prihlaseni = "no";
    }

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

function transitionObjectInit()
{
    // get all containers
    $("[data-cont]").each(function() {
        var key = $(this).attr("data-cont");
        transitionObject[key] = {
            el: $(this),
            visibility: true
        };
    });
    logging("transitionObject found: " + Object.keys(transitionObject).length);
}

function containerHideAll(expectShowInfo)
{
    for(var o in transitionObject){
        if(o=="specInfo" && expectShowInfo)
        {
        } else
        containerVisibilitySet(o,false,true);
    }
}

function containerVisibilitySet(contID,visibility,forced,ccsStyle)
{

    // if already visibility is do nothing
    if(transitionObject[contID].visibility == visibility && forced != true)
    {
        return;
    }


    if(supportedTran == 3)
    {
        if(visibility)
        {
            transitionObject[contID].el.css("-webkit-transform","translate3d(0, 0, 0)");
            transitionObject[contID].el.css("transform","translate3d(0, 0, 0)");
        } else
        {
            transitionObject[contID].el.css("-webkit-transform","translate3d(-"+pageMaxLenght+"px, 0, 0)");
            transitionObject[contID].el.css("transform","translate3d(-"+pageMaxLenght+"px, 0, 0)");
        }
    } else
    {
        if(visibility)
        {
            if(ccsStyle!=null)
                transitionObject[contID].el.css("display",ccsStyle);
            else
                transitionObject[contID].el.css("display","block");
        } else
        {
            transitionObject[contID].el.css("display","none");
        }
    }

    transitionObject[contID].visibility = visibility;
}


function transitionInit()
{

    pageMaxLenght = $(document).width()>$(document).height()?$(document).width():$(document).height();

    //$("body").css("min-height",pageMaxLenght + "px");

    // --- menu bar
    if(supportedTran == 3)
    {
        $("div.menu").css("-webkit-transform","translate3d(-100%, 0, 0)");
        $("div.menu").css("transform","translate3d(-100%, 0, 0)");
    } else if(supportedTran == 2)
    {
        $("div.menu").css("left","-100%");
    } else
    {
        $("div.menu").css("display","none");
    }
    menuVisible = false;

    $navtoggle2 = $("#nav-toggle2");
    $menu = $("div.menu");

    transitionObjectInit();
    containerHideAll(true);

    // sent pinchable element
    var elementToZoom = document.getElementsByClassName("mainContent skladSeznam")[0].getElementsByTagName("table")[0];
    var elementPinch = document.getElementsByClassName("mainContent skladSeznam")[0];
    var pinch1 = new PinchEl(elementToZoom, elementPinch, 100);


    elementToZoom = document.getElementsByClassName("mainContent trzbySeznam")[0].getElementsByTagName("table")[0];
    elementPinch = document.getElementsByClassName("mainContent trzbySeznam")[0].getElementsByTagName("table")[0];
    var pinch2 = new PinchEl(elementToZoom, elementPinch, 100);

    elementToZoom = document.getElementsByClassName("mainContent trzbySeznam")[0].getElementsByTagName("table")[1];
    elementPinch = document.getElementsByClassName("mainContent trzbySeznam")[0].getElementsByTagName("table")[1];
    var pinch3 = new PinchEl(elementToZoom, elementPinch, 100);


}

function supportDetect()
{
    supportedTran = 1;

    if(supportsTransitions())
    {
        supportedTran = 2;
        logging("support transition",1);
    }
    if(supportsTransitions3d())
    {
        supportedTran = 3;
        logging("support transition3d",1);
    }
}

//-------------------------------------------------------------------

function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            /*
            alertG("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
                */
            $("#identifikator").val(result.text);
        },
        function (error) {
            alertG("Scanning failed: " + error);
        }
    );
}

function ajaxErrorHandler(data) {
    console.log(data);
    showInfow(false);

    if(!local)
    {
        if(typeof navigator.connection!="undefined")
        {
            showInfow(false);
            var networkState = navigator.connection.type;
            if(networkState == Connection.UNKNOWN || networkState== Connection.NONE)
            {
                alertG("Nelze se připojit k internetu","Chyba!");
                return;false
            }
        }

    }

    var msg = "";
    if(typeof data.msg != "undefined")
    {
        msg = data.msg;
    }

    if(typeof data.responseText != "undefined")
    {
        msg = data.responseText;
    }

    if(msg=="")
    {
        alertG("Chyba s komunikací se serverem","Chyba!");
    } else
    {
        alertG("chyba:" +data.msg,"Chyba!");
    }
}


function supportsTransitions3d() {
    var el = document.createElement('p'),
        has3d,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        };

    // Add it to the body to get the computed style.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
}
function supportsTransitions() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if (typeof s[p] == 'string') { return true; }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i=0; i<v.length; i++) {
        if (typeof s[v[i] + p] == 'string') { return true; }
    }

    return false;
}

function PinchEl(elementToZoom, elementPinch, startFontSizePercentage)
{
    /*
     elementToZoom - element that will be zoomed
     elementPinch - element where is pinch proceed. Probably elementToZoom
     startFontSizePercentage - size of font, for example 100. (Must be se because I cant get it by $(el).css("font-size")! Because result is not in percentage but in px
     */
    this.elementToZoom = elementToZoom;
    this.elementPinch = elementPinch;
    this.scaling = false;
    this.scaleFontPercentage = startFontSizePercentage;
    this.windowWidth;
    this.scaleWidthStart;

    this.elementPinch.addEventListener('touchstart', function(e) {
        if (e.touches.length ==2) {
            this.windowWidth = $(window).width();
            this.scaling = true;
            this.scaleWidthStart = Math.sqrt((e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) + (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));

        }

    }.bind(this), false);

    /* universal workarround code for addEventListener
    this.elementPinch.addEventListener('touchmove', this, false);
    this.handleEvent = function(event) {
        switch(event.type) {
            case 'touchmove':
                alertG(this.testValue);
                break;
            case 'dblclick':
                // some code here...
                break;
        }
    };
    */

    this.elementPinch.addEventListener('touchmove', function(e) {
        if(this.scaling)
        {
            // pythagoras for distance
            var distPinch = Math.sqrt((e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) + (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));
            var distPinchChange = distPinch - this.scaleWidthStart;
            var distPinchChangePercentage = 100/this.windowWidth*distPinchChange;
            //var distPinchChangePercentage = 100/$(this.elementPinch).width()*distPinchChange/2;
            this.scaleFontPercentage += distPinchChangePercentage;
            if(this.scaleFontPercentage > 20 && this.scaleFontPercentage<400)
                $(this.elementToZoom).css("font-size",this.scaleFontPercentage+ "%");

        }
    }.bind(this), false);

    this.elementPinch.addEventListener('touchend', function(e) {
        if(this.scaling) {
            this.scaling = false;
        }
    }.bind(this), false);
}


function callShow()
{
    //window.location.href='CALSHOW://';
    //window.location.href='content://com.android.calendar';
}

function hesloVlozit()
{
    if($("#password").val()=="heslo")
    {
        alertG("Plná oprávnění","Info");
        prihlaseni = "yes";
        window.localStorage.setItem("hairSoft-prihlaseni","yes");
    } else
    {
        alertG("Špatné heslo","Info");
    }
}