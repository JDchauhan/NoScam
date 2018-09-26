var currentUserID, currentUserRole, addToCart, editProduct, deleteProduct, listMyProducts;
let nextProducts, getSellerNextProducts;

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

                fname = fname.charAt(0).toUpperCase() + fname.substr(1);
                lname = lname.charAt(0).toUpperCase() + lname.substr(1);

                $(".username").text(fname + " " + lname);

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;
                loadHome(data.results.user.role);

            }).fail(function (xhr, status, error) {

            setCookie("token", "", -1);
            window.location.href = "../";
        });
    }

    editProduct = function (id, name, price, description, image, cc) {
        $('#u_pid').val(id);
        $('#u_pname').val(name);
        $('#u_price').val(price);
        $('#u_description').val(description);
        $('#u_image').val(image);
        $('#u_cc').val(cc);
        $('.addProduct').hide();
        $('.updateProduct').show();
    }

    addToCart = function (id) {
        $('[data-toggle=popover]').popover('hide');
        quantity = $('#cartItemCount').val();
        data = {
            "productID": id,
            "quantity": quantity
        };

        $.ajax({
            url: "http://localhost:3000/cart",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                $('#buyer-dashboard-err').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your product has been updated successfully' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
                $('#buyer-dashboard-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    };

    deleteProduct = function (id) {
        data = {
            productID: id
        };

        $.ajax({
            url: "http://localhost:3000/products",
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('.updateProduct').hide();
                $('.addProduct').show();

                $('#product-add-err').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> Your product has been successfully removed' +
                    '</div>'
                );

                listMyProducts(currentUserID);
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg = JSON.parse(xhr.responseText).message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);
                $('.updateProduct').hide();
                $('.addProduct').show();

                $('#product-add-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    };

    listMyProducts = function (currentUserID) {
        if (currentUserID) {
            getSellerNextProducts(1, currentUserID);
            $('#seller_prod_next').attr("style", "display:inline-block;");
        } else {

            $('.listProducts').empty();
            $('.listProducts').append('<div class="col-md-12">Unable to fetch at this moment</div>');
        }
    }

    nextProducts = function(page) {
        $.get("http://localhost:3000/products/" + page, {},
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
                        '<a data-toggle="popover" data-id="' + product._id + '" data-img="' + product.image + '" title="' + product.name + '" data-placement="bottom" data-text="' +
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

                                '<form>' +
                                '<br/>' +
                                '<div class="form-group">' +
                                '<input type="number" class="form-control" id="cartItemCount" value=1>' +
                                '</div>' +
                                '<button type="button" class="btn btn-default popover-btn"  onclick=addToCart("' + $(this).data('id') + '")>Add to cart</button>' +
                                '</form>';
                        }
                    });
                });
                $('#buyer_prod_next').attr('onclick', 'nextProducts(' + (page + 1) + ')');
                if (data.results.isNext === null) {
                    $('#buyer_prod_next').attr('style','display:none');    
                }
            }).fail(function (xhr, status, error) {
            console.log(error);
        });
    };

        getSellerNextProducts = function(page, currentUserID){
            $.get("http://localhost:3000/products/" + page + "/seller/" + currentUserID, {},
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

                                    '<button class="btn btn-success edit_btn" onclick=editProduct("' + $(this).data('id') + '","' +
                                    $(this).data('name') + '",' + $(this).data('price') + ',"' +
                                    $(this).data('description') + '","' + $(this).data('image') + '",' +
                                    $(this).data('cc') + ')> Edit </button>' +

                                    '<button class="btn btn-danger" onclick=deleteProduct("' + $(this).data('id') + '")> Delete </button>';
                            }
                        });

                        $('#btn_update_form').addClass("btn-success");
                    });
                    $('#seller_prod_next').attr('onclick', 'getSellerNextProducts(' + (page + 1) + ',"' + currentUserID + '")');
                }).fail(function (xhr, status, error) {
                $('.listProducts').empty();
                $('.listProducts').append('<h1>Oops! Some error occured</h1><div class="col-md-12">Unable to fetch your products at this moment</div>');
            });
        };

    function loadHome(role) {
        if (role === "buyer") {
            $('.addProduct').hide();
            $('.listProducts').hide();
            nextProducts(1);
            $('#buyer_prod_next').attr("style", "display:inline-block;");

        } else {
            $('.addProduct').show();
            $('.cart').hide();
            listMyProducts(currentUserID);
        }
    }

    $(document).ready(function () {

        $('.updateProduct').hide();

        $(document).on('click', '#product-add-btn', function () {
            window.location.href = "#";

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

            window.location.href = "#";

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

        });

        $(document).on('click', '#btn_add_product_form', function () {
            $('.addProduct').show();
            $('.updateProduct').hide();
        });

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                // hide any open popovers when the anywhere else in the body is clicked
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0) {
                    //$('.popover').has(e.target) === 1 when clicked in popover
                    $(this).popover('hide');
                }
            });

            if (currentUserRole && currentUserRole === "buyer") {
                $('.popover').off('click').on('click', function (e) {
                    e.stopPropagation(); // prevent event for bubbling up => will not get caught with document.onclick
                });
            }


        });

    });
});