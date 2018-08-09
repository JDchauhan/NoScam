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
                    var description = "";
                    if(product.description && product.description !== ""){
                        description = '<div> Description: ' + product.description + '</div>'; 
                    }

                    $('.dashboardContainer').append(
                        '<figure class="col-md-3">' +
                            '<a data-toggle="popover" data-img="' + product.image + '" title="' + product.name + '" data-placement="bottom" data-text="' +
                                '<div>' + 
                                    "Price: " + product.price +
                                '</div>' +
                                description +
                            '">' +
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
                    $('[data-toggle="popover"]').popover({
                        html: true,
                        content: function(){return '<img src="'+$(this).data('img') + '" height="40px" width="40px"/>' +
                        '<p>' + $(this).data('text') + '</p>';}});
                    });        
            }).fail(function (xhr, status, error) {
            console.log(error);
        });
        

    } else {
        $('.dashboardContainer').append(
            '<div class="product-form">' +
                '<h1> Add Product </h1>' +
                '<div id="product-add-err"></div>' +
                '<form>' +
                    '<div class="form-group">' +
                        '<label for="pname">Product Name:</label>' +
                        '<input type="text" class="form-control" id="pname" name="pname">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="price">Unit Price:</label>' +
                        '<input type="number" class="form-control" id="price" name="price">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="description">Description:</label>' +
                        '<input type="text" class="form-control" id="description" name="description">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="cc">CC:</label>' +
                        '<input type="text" class="form-control" id="cc" name="cc">' +
                    '</div>' +
                    '<button type="button" class="btn btn-primary" id="register-btn">Submit</button>' +
                '</form>' +
            '</div>'
        );
    }
}