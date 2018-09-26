var currentUserID, currentUserRole, changeQuantity, deleteProduct;

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

                if (data.results.user.role === "seller") {
                    window.location.href = "../";
                }

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;

            }).fail(function (xhr, status, error) {
            window.location.href = "../";
            setCookie("token", "", -1);
        });
    }

    changeQuantity = function (invoiceId, productID) {
        var quantity = parseFloat($('#qty_' + invoiceId).val());
        var price = parseFloat($('#price_' + invoiceId).text());
        var invoiceCost = parseFloat($('#invoice_price_' + invoiceId).text());
        var updatedInvoice = Math.round(quantity * price * 100) / 100;
        var subtotal = Math.round((parseFloat($('#cart-subtotal').text()) - invoiceCost + updatedInvoice) * 100) / 100;

        let tax = Math.round((0.05 * subtotal) * 100) / 100;
        let charge = Math.round((0.05 * subtotal) * 100) / 100;
        let total = Math.round((subtotal + tax + charge) * 100) / 100;

        $('#invoice_price_' + invoiceId).text(updatedInvoice);
        $('#cart-subtotal').text(subtotal);
        $('#cart-tax').text(tax);
        $('#cart-service-charge').text(charge);
        $('#cart-total').text(total);

        data = {
            quantity: quantity,
            productID: productID,
            invoiceID: invoiceId
        };

        $.ajax({
            url: "http://localhost:3000/cart",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                console.log("success");
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("err")
            }
        });
    };

    deleteProduct = function (id) {
        data = {
            invoiceID: id
        };

        $.ajax({
            url: "http://localhost:3000/cart",
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                let removedCost = parseInt($('#invoice_price_' + id).text());
                let subtotal = parseInt($('#cart-subtotal').text() - removedCost);
                subtotal = Math.round((subtotal) * 100) / 100;

                $('#cart-subtotal').text(subtotal);

                let tax = Math.round((0.05 * subtotal) * 100) / 100;
                let charge = Math.round((0.05 * subtotal) * 100) / 100;
                let total = Math.round((subtotal + tax + charge) * 100) / 100;

                $('#cart-tax').text(tax);
                $('#cart-service-charge').text(charge);
                $('#cart-total').text(total);

                $('#prod_' + id).remove();
            },
            error: function (xhr, textStatus, errorThrown) {
                let errMsg = xhr.responseJSON.message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                $('#cart-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    };

    $.get("http://localhost:3000/cart", {},
        function (data, status, xhr) {
            console.log(data);

            let tax = Math.round((0.05 * data.results.total) * 100) / 100;
            let charge = Math.round((0.05 * data.results.total) * 100) / 100;
            let total = Math.round((data.results.total + tax + charge) * 100) / 100;
            $('#cart-subtotal').text(Math.round((data.results.total) * 100) / 100);
            $('#cart-tax').text(tax);
            $('#cart-service-charge').text(charge);
            $('#cart-total').text(total);

            data.results.invoices.forEach(invoice => {
                if (!invoice.product.image) {
                    invoice.product.image = "../assets/images/test.jpg";
                }
                var description = "";
                if (invoice.product.description && invoice.product.description !== "") {
                    invoice.description = '<div> Description: ' + invoice.product.description + '</div>';
                }

                $('.cart-items').append(
                    '<div class="product" id="prod_' + invoice._id + '">' +
                    '<div class="product-image">' +
                    '<img src="' + invoice.product.image + '">' +
                    '</div>' +
                    '<div class="product-details">' +
                    '<div class="product-title">' + invoice.product.name + '</div>' +
                    '<p class="product-description">' + invoice.product.description + '</p>' +
                    '</div>' +
                    '<div id="price_' + invoice._id + '" class="product-price">' + invoice.product.price + '</div>' +
                    '<div class="product-quantity">' +
                    '<input id="qty_' + invoice._id + '" onchange=changeQuantity("' + invoice._id + '","' + invoice.product._id + '") type="number" value="' + invoice.quantity + '" min="1">' +
                    '</div>' +
                    '<div id="invoice_price_' + invoice._id + '" class="product-line-price">' + invoice.price + '</div>' +

                    '<div class="product-removal">' +
                    '<button class="remove-product" onclick=deleteProduct("' + invoice._id + '")>' +
                    'Remove' +
                    '</button>' +
                    '</div>' +
                    '</div>'
                );
            });

        }).fail(function (xhr, status, error) {
        console.log(error);
    });

    $(document).on('click', '#checkout', function () {
        var ids = [];
        var length = $('.cart-items').children().length;

        for (let i = 0; i < length; i++) {
            ids.push($('.cart-items').children()[i].id.split('_')[1])
        }

        data = {
            invoices: ids
        };

        $.ajax({
            url: "http://localhost:3000/cart/checkout",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('.product').remove();
                $('#cart-err').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulation! </strong>Your order has been placed' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                let errMsg = xhr.responseJSON.message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                $('#cart-err').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    });

});