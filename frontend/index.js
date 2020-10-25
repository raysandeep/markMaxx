BASE_URL = 'http://127.0.0.1:8000/api'

let campaignscount = 0

let previous = null;
let next = 'null';
let totalcounter = 0;
let pageCounter = 0;

// AOS Animations
AOS.init();
var productIDDropzone = '';
// View Password
$(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

// Loader
$(function () {
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
});

// Toggle Navbar
$("#wrapper").hide();
$(".fa-toggle-off").click(function (e) {
    $(this).toggleClass("fa-toggle-off fa-toggle-on");
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



function dashboard(){
    $.get(BASE_URL+"/dashboard/", function(data, status){
        console.log(data);
        console.log(status);
        // total-campaigns
        document.getElementById("total-campaigns").innerHTML = data.campaigns
        document.getElementById("total-subscribers").innerHTML = data.subscribed
        document.getElementById("total-unsubscribers").innerHTML = data.unsubcribed
      });
}



function campaigns(){
    $.get(BASE_URL+"/create/campaign/", function(data, status){
        console.log(data);
        console.log(status);
        for(var i=0;i<data.length;i++){
            stri = `<tr>
                <th scope="row">${i+1}</th>
                <td>${data[i].campaign_name}</td>
                <td>${data[i].campaign_description}</td>
                <td><a class="btn btn-primary" href="/subcampaign.html?id=${data[i].id}" role="button">View Campaign</a></td>
            </tr>`
            $("#campaign-table").append(stri)
        }
        campaignscount = data.length;
        
        // total-campaigns
        
      });
}

function createNewCampaign(){
    param = {
        "campaign_name":document.getElementById("campaignName").value,
        "campaign_description":document.getElementById("campaignDescription").value
    };
    $.ajax({
        url:BASE_URL+ "/create/campaign/",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify(param),
        success: function (data) {
            console.log(data);
            stri = `<tr>
                <th scope="row">${campaignscount+1}</th>
                <td>${data.campaign_name}</td>
                <td>${data.campaign_description}</td>
                <td><a class="btn btn-primary" href="/subcampaign.html?id=${data.id}" role="button">View Campaign</a></td>
            </tr>`
            $("#campaign-table").append(stri)
            campaignscount=campaignscount+1
        },
        error:function (jqXHR, textStatus, errorThrown) { 
            console.log(textStatus,errorThrown)
        }
    });
}



function sendTestEmail(){
    console.log(document.getElementById("campaignTemplate").innerHTML);
    param = {
        // "request_name":document.getElementById("requestName").value,
        "template":document.getElementById("campaignTemplate").innerHTML,
        "subject":document.getElementById("subject").value,
        "email":document.getElementById("email").value,
        "user":document.getElementById("user").value,
        // "tags":document.getElementById("tags").trim().split(','),
        "users":document.getElementById("testEmails").value.trim().split(',')
    }

    $.ajax({
        url:BASE_URL+ "/send/sample/",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify(param),
        success: function (data) {
            console.log("Done");
            var toastHTML = '<span>Test Emails Sent!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
        },
        error:function (jqXHR, textStatus, errorThrown) { 
            var toastHTML = '<span>Test Emails Failed!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
            console.log("Error")
        }
    });
}


function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}



function createRequest(){
    console.log(document.getElementById("campaignTemplate").innerHTML);
    param = {
        "request_name":document.getElementById("requestName").value,
        "template":document.getElementById("campaignTemplate").innerHTML,
        "subject":document.getElementById("subject").value,
        "email":document.getElementById("email").value,
        "email_user":document.getElementById("user").value,
        "tag":document.getElementById("tags").value.trim().split(','),
        "campaign":gup('id',window.location.href)
    }

    $.ajax({
        url:BASE_URL+ "/create/subcampaign/",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify(param),
        success: function (data) {
            console.log("Done");
            var toastHTML = '<span>Test Emails Sent!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
        },
        error:function (jqXHR, textStatus, errorThrown) { 
            var toastHTML = '<span>Test Emails Failed!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
            console.log("Error :",jqXHR.responseText)
        }
    });
}


function subcampaigns(){
    param = {
        'id':gup('id',window.location.href)
    }
    $.ajax({
        url:BASE_URL+"/list/subcampaign/",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify(param),
        success: function (data) {
            console.log("Done");
            console.log(data);
            

            for(var i=0;i<data.length;i++){
                if(data[i].mails_send){
                    var action = `<td><a class="btn btn-primary" href="/details.html?id=${data[i].id}" role="button">View Campaign</a></td>`
                }else{
                    var action = `Sending Emails!`
                }
                
                stri = `<tr>
                    <th scope="row">${i+1}</th>
                    <td>${data[i].request_name}</td>
                    <td>${data[i].subject}</td>
                    <td>< ${data[i].email_user}  < ${data[i].email} > ></td>
                    <td>${action}</td>
                </tr>`
                $("#subcampaign-table").append(stri)
            }
        },
        error:function (jqXHR, textStatus, errorThrown) { 
            var toastHTML = '<span>Test Emails Failed!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
            console.log("Error :",jqXHR.responseText)
        }
    });
        
}   



function subcampaignsdashboard(){
    param = {
        'id':gup('id',window.location.href)
    }
    $.ajax({
        url:BASE_URL+"/campaigns/dashboard/",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        type: "POST",
        data: JSON.stringify(param),
        success: function (data) {
            console.log("Done");
            console.log(data);
            

            stri = `<tr>
                    <td>${data.delivered}</td>
                    <td>${data.opened_once}</td>
                    <td>${data.opened_more_than_once}</td>
                </tr>`
                $("#subcampaign-stats").append(stri)
        },
        error:function (jqXHR, textStatus, errorThrown) { 
            var toastHTML = '<span>Test Emails Failed!</span><button class="btn-flat toast-action">Undo</button>';
            // M.toast({html: toastHTML});
            console.log("Error :",jqXHR.responseText)
        }
    });
        
}   


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function validateEmails(listi){
    for(i=0;i<listi.length;i++){
        if(validateEmail(listi[i])==false){
            // print(validateEmail(users[i]))
            alert("Validation Failed! Email : ",listi[i]);
            return false
        }
    }
    return true
}


function users(page){
    console.log("Page :",page)
    if(page==undefined){
        page = BASE_URL+"/list/users/"
    }
    
    $.get(page, function(data, status){
        console.log(data);
        console.log(status);
        document.getElementById("users-table").innerHTML = ''
        for(var i=0;i<data.results.length;i++){
            stri2 = ''
            data.results[i].tag.forEach(function(entry) {
                stri2+=entry+","
            });
            if(data.results[i].is_subscribed)
                stri = `<tr>
                <th scope="row">${i+1}</th>
                <td>${data.results[i].user_email}</td>
                <td>${stri2}</td>
                <td>Unsubscribed!</td>
            </tr>`
            else
                stri = `<tr>
            <th scope="row">${i+1}</th>
            <td>${data.results[i].user_email}</td>
            <td>${stri2}</td>
            <td>Subscribed!</td>
        </tr>`
            $("#users-table").append(stri);
        }
        campaignscount = data.results.length;
        var finalStr=''
        finalStr += `<li class="page-item"><a class="page-link" href="javascript:users('${data.previous}');" >Previous</a></li>`
        finalStr += `<li class="page-item"><a class="page-link" href="javascript:users('${data.next}');" >Next</a></li>`
        
        document.getElementById("paginationUl").innerHTML = finalStr
        
        // total-campaigns
        
      });
}

function importUsers(){
    var tags = document.getElementById("tags").value.trim().split(',');
    var users = document.getElementById("users").value.split(/\r?\n/);
    
    if(validateEmails(users)==true){
        param = {
            'emails':users,
            'tags':tags
        }
        $.ajax({
            url:BASE_URL+"/users/add/",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify(param),
            success: function (data) {
                console.log("Done");
                console.log(data);
                alert("Imported : "+data.success+" emails! Failed : "+data.fails_count)
                window.location.reload()
            },
            error:function (jqXHR, textStatus, errorThrown) { 
                var toastHTML = '<span>Test Emails Failed!</span><button class="btn-flat toast-action">Undo</button>';
                // M.toast({html: toastHTML});
                console.log("Error :",jqXHR.responseText)
            }
        });
    }
    
}