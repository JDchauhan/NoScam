var currentUserID;
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

            currentUserID = data.results.user._id;
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
                    if (!product.image) {
                        product.image = "../assets/images/test.jpg";
                    }
                    var description = "";
                    if (product.description && product.description !== "") {
                        description = '<div> Description: ' + product.description + '</div>';
                    }

                    $('.buyerDashboardContainer').append(
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
                        content: function () {
                            return '<img src="' + $(this).data('img') + '" height="40px" width="40px"/>' +
                                '<p>' + $(this).data('text') + '</p>';
                        }
                    });
                });
            }).fail(function (xhr, status, error) {
            console.log(error);
        });


    } else {
        $('.addProduct').append(
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
            '<label for="url">Image url:</label>' +
            '<input type="text" class="form-control" id="url" name="url">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="cc">CC:</label>' +
            '<input type="text" class="form-control" id="cc" name="cc">' +
            '</div>' +
            '<button type="button" class="btn btn-primary" id="product-add-btn">Submit</button>' +
            '</form>' +
            '</div>'
        );

        if (currentUserID) {
            $.get("http://localhost:3000/products/seller/" + currentUserID, {},
                function (data, status, xhr) {
                    console.log(data);
                    data.results.products.forEach(product => {
                        if (!product.image) {
                            product.image = "../assets/images/test.jpg";
                        }
                        var description = "";
                        if (product.description && product.description !== "") {
                            description = '<div> Description: ' + product.description + '</div>';
                        }

                        $('.listProducts').append(
                            '<figure class="col-md-4">' +
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
                            content: function () {
                                return '<img src="' + $(this).data('img') + '" height="40px" width="40px"/>' +
                                    '<p>' + $(this).data('text') + '</p>';
                            }
                        });
                    });
                }).fail(function (xhr, status, error) {
                console.log(error);
            });
        }else {
            $('.listProducts').empty();
            $('.listProducts').append('<div class="col-md-12">Unable to fetch at this moment</div>');
        }
    }
}

$(document).ready(function () {
    $(document).on('click', '#product-add-btn', function () {
        $.post("http://localhost:3000/products", {
                name: $('#pname').val(),
                price: $('#price').val(),
                description: $('#description').val(),
                cc: $('#cc').val(),
                url: $('#url').val(),
            },
            function (data, status, xhr) {
                console.log(data);

                $('#product-add-err').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your product has been added successfully' +
                    '</div>'
                );

            }).fail(function (xhr, status, error) {
            var errMsg = JSON.parse(xhr.responseText).message;
            errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
            $('#product-add-err').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong>' + errMsg +
                '</div>'
            );
        });
    });
});