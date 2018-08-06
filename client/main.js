$(document).ready(function () {
    $(document).on('click', '', function(){ 
        $('.alert').hide(500);
   });

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
            console.log("Data: " + data + "\nStatus: " + status);
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