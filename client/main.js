var baseUrl = 'https://screenshot.hexerve.com/noscam/:8000/';
// var baseUrl = 'http://localhost:8000/';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function logout() {
    setCookie("token", "", -1);
}

function isEmail(email) {
    if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
        email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
        return true;
    }
    return false;
}

function isMobile(mobile) {
    if (isNaN(mobile) || mobile.length < 5) {
        return false;
    }
    return true;
}

function isText(text) {
    if (text.length > 2) {
        return true;
    }
    return false;
}

function isPass(pass) {
    if (pass.length < 8) {
        return false;
    }
    return true;
}
