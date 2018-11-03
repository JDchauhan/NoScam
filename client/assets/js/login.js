$(function () {
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

    $("#login-btn").click(function () {
        data = {
            email: $('#login-email').val(),
            password: $('#login-password').val()
        };
        console.log({data: JSON.stringify(data)})
        $.ajax({
            url: "https://screenshot.hexerve.com/noscam/:8000/login",
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data, textStatus, xhr) {
                setCookie("token", data.results.token, 1);
                window.location.href = "pages/dashboard.html";
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
                $('#login-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    });
});

$("#register-btn").click(function () {
    $.post("https://screenshot.hexerve.com/noscam/:8000/user", {
            email: $('#email').val(),
            password: $('#password').val(),
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            mname: $('#mname').val(),
            role: $('#role').val(),
            mobile: $('#mobile').val()
        },
        function (data, status, xhr) {
            console.log(data);
            $(".register-form").hide();
            $(".login-form").show();

            $('#login-err').append(
                '<div class="alert alert-success alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Registration Successful! </strong> Verify your account to continue' +
                '</div>'
            );

            //setCookie("token", data.results.token, 1);
            //window.location.href = "pages/dashboard.html";
        }).fail(function (xhr, status, error) {
        var errMsg = JSON.parse(xhr.responseText).message;
        errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
        $('#registration-err').append(
            '<div class="alert alert-danger alert-dismissible fade show">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>Oops! </strong>' + errMsg +
            '</div>'
        );
        window.location.href = "#";
    });

});