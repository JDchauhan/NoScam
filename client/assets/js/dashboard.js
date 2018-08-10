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

function editProduct(id, name, price, description, image, cc) {
    $('#u_pid').val(id);
    $('#u_pname').val(name);
    $('#u_price').val(price);
    $('#u_description').val(description);
    $('#u_image').val(image);
    $('#u_cc').val(cc);
    $('.addProduct').hide();
    $('.updateProduct').show();
}

function listMyProducts(currentUserID) {
    if (currentUserID) {
        $.get("http://localhost:3000/products/seller/" + currentUserID, {},
            function (data, status, xhr) {
                console.log(data);
                $('.listProducts').empty();
                data.results.products.forEach(product => {
                    if (!product.image) {
                        product.image = "../assets/images/test.jpg";
                    }
                    var description = "";
                    if (product.description && product.description !== "") {
                        description = '<div> Description: ' + product.description + '</div>';
                    }

                    $('.seller').text("Your Products");
                    $('.listProducts').append(
                        '<figure class="col-md-4">' +
                        '<a data-toggle="popover" data-img="' + product.image + '" title="' + product.name + '"' +

                        'data-id="' + product._id + '"' + 'data-name="' + product.name + '"' + 'data-price="' + product.price + '"' +
                        'data-cc="' + product.cc + '"' + 'data-description="' + product.description + '"' +

                        'data-placement="bottom" data-text="' +
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
                                '<div>' + $(this).data('text') + '</div>' +

                                '<button class="btn btn-success" onclick=editProduct("' + $(this).data('id') + '","' +
                                $(this).data('name') + '",' + $(this).data('price') + ',"' +
                                $(this).data('description') + '","' + $(this).data('image') + '",' +
                                $(this).data('cc') + ')> Edit </button>';
                        }
                    });

                    $('#btn_update_form').addClass("btn-success");

                });
            }).fail(function (xhr, status, error) {
            $('.listProducts').empty();
            $('.listProducts').append('<h1>Oops! Some error occured</h1><div class="col-md-12">Unable to fetch your products at this moment</div>');
        });
    } else {

        $('.listProducts').empty();
        $('.listProducts').append('<div class="col-md-12">Unable to fetch at this moment</div>');
    }
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
        $('.addProduct').show();

        listMyProducts(currentUserID);
    }
}

$(document).ready(function () {

    $('.addProduct').hide();
    $('.updateProduct').hide();

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
                listMyProducts(currentUserID);

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

    $(document).on('click', '#product-update-btn', function () {
        var data = {
            productID: $('#u_pid').val(),
            name: $('#u_pname').val(),
            price: $('#u_price').val(),
            description: $('#u_description').val(),
            cc: $('#u_cc').val(),
            url: $('#u_url').val(),
        };

        $.ajax({
            url: "http://localhost:3000/products",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('.updateProduct').hide();
                $('.addProduct').show();

                $('#product-add-err').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your product has been updated successfully' +
                    '</div>'
                );

                listMyProducts(currentUserID);
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
                $('#product-update-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });

        // $.put("http://localhost:3000/products", ,
        //     function (data, status, xhr) {
        //         console.log(data);

        //         $('#product-update-err').append(
        //             '<div class="alert alert-success alert-dismissible fade show">' +
        //             '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
        //             '<strong>Congratulations! </strong> Your product has been added successfully' +
        //             '</div>'
        //         );
        //         listMyProducts(currentUserID);

        //     }).fail(function (xhr, status, error) {
        //     var errMsg = JSON.parse(xhr.responseText).message;
        //     errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
        //     $('#product-update-err').append(
        //         '<div class="alert alert-danger alert-dismissible fade show">' +
        //         '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
        //         '<strong>Oops! </strong>' + errMsg +
        //         '</div>'
        //     );
        // });
    });

    $(document).on('click', '#btn_add_product_form', function () {
        $('.addProduct').show();
        $('.updateProduct').hide();
    });

    $('body').on('click', function (e) {
        $('[data-toggle=popover]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

});