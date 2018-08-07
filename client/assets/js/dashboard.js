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
            let fname = data.results.user.fname;
            let lname = data.results.user.lname;
            
            fname = fname.charAt(0).toUpperCase() + fname.substr(1);
            lname = lname.charAt(0).toUpperCase() + lname.substr(1);
            
            $(".username").text(fname + " " + lname);
        }).fail(function (xhr, status, error) {
        window.location.href = "../";
        setCookie("token", "", -1);
    });
}