$(function () {
    var currentUserID, currentUserRole;
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

            }).fail(function (xhr, status, error) {
            window.location.href = "../";
            setCookie("token", "", -1);
        });
    }

    $.get("http://localhost:3000/cart", {},
        function (data, status, xhr) {
            console.log(data);
            $('.cart-items').append(
                '<div class="column-labels">' +
                    '<label class="product-image">Image</label>' +
                    '<label class="product-details">Product</label>' +
                    '<label class="product-price">Price</label>' +
                    '<label class="product-quantity">Quantity</label>' +
                    '<label class="product-removal">Remove</label>' +
                    '<label class="product-line-price">Total</label>' +
                '</div>'
            );

            data.results.invoices.forEach(invoice => {
                if (!invoice.product.image) {
                    invoice.product.image = "../assets/images/test.jpg";
                }
                var description = "";
                if (invoice.product.description && invoice.product.description !== "") {
                    invoice.description = '<div> Description: ' + invoice.product.description + '</div>';
                }

                $('.cart-items').append(
                    '<div class="product">' +
                    '<div class="product-image">' +
                        '<img src="' + invoice.product.image + '">' +
                    '</div>' +
                    '<div class="product-details">' +
                        '<div class="product-title">' + invoice.product.name + '</div>' +
                        '<p class="product-description">' + invoice.product.description + '</p>' +
                    '</div>' +
                    '<div class="product-price">' + invoice.product.price + '</div>' +
                    '<div class="product-quantity">' +
                        '<input type="number" value="' + invoice.quantity + '" min="1">' +
                    '</div>' +
                    '<div class="product-removal">' +
                        '<button class="remove-product">' +
                            'Remove' +
                        '</button>' +
                    '</div>' +
                    '<div class="product-line-price">' + invoice.price + '</div>' +
                '</div>'
                );

                

            //     $('.cart').append(
            //         '<figure class="col-md-3">' +
            //         '<a data-toggle="popover" data-id="' + invoice._id + '" data-img="' + invoice.product.image + '" title="' + invoice.product.name +
            //         '" data-placement="bottom" data-text="' +
            //         '<div>' +
            //         "Total Price: " + invoice.price +
            //         '</div>' +
            //         '<div>' +
            //         "Unit Price: " + invoice.product.price +
            //         '</div>' +
            //         '<div>' +
            //         "Quantity: " + invoice.product.quantity +
            //         '</div>' +
            //         description +
            //         '">' +
            //         '<img alt="' + invoice.product.name + '" src=' + invoice.product.image + ' class="img-fluid">' +
            //         '</a>' +
            //         '<figcaption class="figure-caption text-right">' +
            //         '<div>' +
            //         invoice.product.name +
            //         '</div>' +
            //         '<div>' +
            //         invoice.product.price +
            //         '</div>' +
            //         '</figcaption>' +
            //         '</figure>'
            //     );
            //     $('[data-toggle="popover"]').popover({
            //         html: true,
            //         content: function () {
            //             return '<img src="' + $(this).data('img') + '" height="40px" width="40px"/>' +

            //                 '<div>' + $(this).data('text') + '</div>' +

            //                 '<form>' +
            //                 '<br/>' +
            //                 '<div class="form-group">' +
            //                 '<input type="number" class="form-control" id="cartItemCount" value=1>' +
            //                 '</div>' +
            //                 '<button type="button" class="btn btn-default popover-btn"  onclick=addToCart("' + $(this).data('id') + '")>Add to cart</button>' +
            //                 '</form>';
            //         }
            //     });
            });

        }).fail(function (xhr, status, error) {
        console.log(error);
    });
});