$(document).ready(function () {
    $(".register-form").hide();

    $("#login").click(function () {
        $(".register-form").hide();
        $(".login-form").show();

    });
    $("#register").click(function () {
        $(".login-form").hide();
        $(".register-form").show();
    });
});