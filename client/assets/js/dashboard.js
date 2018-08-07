if (getCookie("token") === "") {
    window.location.href = "../";
} else {
    $.ajaxSetup({
        headers:{
           'authorization': getCookie("token")
        }
    });
    $.get("http://localhost:3000/user", {
        },
        function (data, status, xhr) {
            console.log(data);
        }).fail(function (xhr, status, error) {
        window.location.href = "../";
    });
}