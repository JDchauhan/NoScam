$(function () {
    if (getCookie("token") === "") {
        window.location.href = "../";
    } else {
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.get("http://localhost:3000/user", {},
            function (data, status, xhr) {
                console.log(data);
                let fname = data.results.user.fname;
                let lname = data.results.user.lname;
                let mname = data.results.user.mname;
                let mobile = data.results.user.mobile;

                fname = fname.charAt(0).toUpperCase() + fname.substr(1);
                lname = lname.charAt(0).toUpperCase() + lname.substr(1);
                mname = mname.charAt(0).toUpperCase() + mname.substr(1);

                $('#fname').val(fname);
                $('#lname').val(lname);
                $('#mname').val(mname);
                $('#mobile').val(mobile);

                $(".username").text(fname + " " + lname);

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;
                if (currentUserRole === "seller") {
                    $('.cart').hide();
                }
            }).fail(function (xhr, status, error) {

            setCookie("token", "", -1);
            window.location.href = "../";
        });
    }

    $(document).on('click', '#update-btn', function () {
        let data = {
            fname: $('#fname').val(),
            mname: $('#mname').val(),
            lname: $('#lname').val(),
            mobile: $('#mobile').val(),
        };

        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.ajax({
            url: "http://localhost:3000/user",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulation! </strong>Details has been updated successfully' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.readyState === 0) {
                    return $('#msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network Error' +
                        '</div>'
                    );
                }

                let errMsg = xhr.responseJSON.message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    });
});