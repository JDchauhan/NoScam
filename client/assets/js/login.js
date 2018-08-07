$(document).ready(function () {

    if (getCookie("token") !== "") {
        window.location.href = "pages/dashboard.html";
    }

    $(".register-form").hide();

    $("#login").click(function () {
        $(".register-form").hide();
        $(".login-form").show();
    });

    $("#register").click(function () {
        $(".login-form").hide();
        $(".register-form").show();
    });

    $("#login-btn").click(function(){
        $.post("http://localhost:3000/login",
        {
            email:  $('#login-email').val(),
            password: $('#login-password').val()
        },
        function(data, status, xhr){
            setCookie("token", data.results.token, 1);
            window.location.href = "pages/dashboard.html";
        }).fail(function(xhr, status, error) {
            var errMsg = JSON.parse(xhr.responseText).message;
            errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
            $('#login-err').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                '</div>'
            );
        });
    });

});