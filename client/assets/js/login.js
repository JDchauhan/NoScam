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
        if (!isEmail(data.email)) {
            $('.alert').hide(500);
            $('#login-err').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid email.' +
                '</div>'
            );
            return;
        }

        if (!isPass(data.password)) {
            $('.alert').hide(500);
            $('#login-err').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid password(password must be greater than 8 characters)' +
                '</div>'
            );
            return;
        }

        $.ajax({
            url: baseUrl + "login",
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data, textStatus, xhr) {
                setCookie("token", data.results.token, 1);
                window.location.href = "pages/dashboard.html";
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }
                $('.alert').hide(500);
                $('#login-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    });

    $("#register-btn").click(function () {
        let data = {
            email: $('#email').val(),
            password: $('#password').val(),
            fname: $('#fname').val(),
            lname: $('#lname').val(),
            mname: $('#mname').val(),
            role: $('#role').val(),
            mobile: $('#mobile').val()
        };
        if (!isText(data.name)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid name(must be greater than 3 characters)' +
                '</div>'
            );
            return;
        }

        if (!isEmail(data.email)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid email.' +
                '</div>'
            );
            return;
        }

        if (!isMobile(data.mobile)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid mobile.' +
                '</div>'
            );
            return;
        }

        if (!isPass(data.password)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid password(password must be greater than 8 characters)' +
                '</div>'
            );
            return;
        }

        $.post(baseUrl + "user", data,
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
            var errMsg;
            if (xhr.status === 0) {
                errMsg = "Network error.";
            } else {
                errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                if (errMsg === 'Validation failed.') {
                    errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                }
            }

            $('.alert').hide(500);
            $('#register-err').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> ' + errMsg +
                '</div>'
            );
            window.location.href = "#";
        });

    });
});