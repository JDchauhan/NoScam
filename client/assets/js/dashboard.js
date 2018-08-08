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

            fname = fname.charAt(0).toUpperCase() + fname.substr(1);
            lname = lname.charAt(0).toUpperCase() + lname.substr(1);

            $(".username").text(fname + " " + lname);

            loadHome(data.results.user.role);

        }).fail(function (xhr, status, error) {
        window.location.href = "../";
        setCookie("token", "", -1);
    });
}

function loadHome(role) {
    if (role === "buyer") {
        $.get("http://localhost:3000/products", {},
            function (data, status, xhr) {
                console.log(data);
                data.results.products.forEach(product => {
                    if(!product.image){
                        product.image = "../assets/images/test.jpg";
                    }
                    $('.dashboardContainer').append(
                        '<figure class="col-md-3">' +
                            '<a href=' + product.image + ' data-size="1600x1067">' +
                                '<img alt="' + product.name + '" src=' + product.image + ' class="img-fluid">' +
                            '</a>' +
                            '<figcaption class="figure-caption text-right">' +
                                '<div>' + 
                                    product.name +               
                                '</div>' +
                                '<div>' + 
                                    product.price +
                                '</div>' +        
                            '</figcaption>' +
                        '</figure>'
                    );
                });        
            }).fail(function (xhr, status, error) {
            console.log(error);
        });
        

    } else {

    }
}