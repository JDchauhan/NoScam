var currentUserID, currentUserRole, changeQuantity, deleteProduct;
var getOrders, updateStatus;

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
                    $('.cart').hide();
                }

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;

            }).fail(function (xhr, status, error) {
            window.location.href = "../";
            setCookie("token", "", -1);
        });
    }

    getOrders = function (page) {
        $.get("http://localhost:3000/orders/" + page, {},
            function (data, status, xhr) {
                console.log(data);

                data.results.invoices.forEach(invoice => {
                    if (!invoice.product.image) {
                        invoice.product.image = "../assets/images/test.jpg";
                    }
                    var description = "";
                    if (invoice.product.description && invoice.product.description !== "") {
                        invoice.description = '<div> Description: ' + invoice.product.description + '</div>';
                    }
                    let prodStatus, percentageComplete;
                    if (currentUserRole === "seller") {
                        prodStatus =
                            '<select class="form-control product-status" id="status_invoice_' + invoice._id + '">' +
                            '<option class="complete" value="complete">complete</option>' +
                            '<option class="process" value="process">process</option>' +
                            '<option class="pending" value="pending">pending</option>' +
                            '<option class="hold" value="hold">hold</option>' +
                            '<option class="canceled" value="canceled">canceled</option>' +
                            '</select>';
                        percentageComplete =
                            '<input class="form-control product-completion" type="Number" value="' + invoice.completion + '" min=0 max=100 id="completion_invoice_' + invoice._id + '"/>';
                    } else {
                        percentageComplete = '<div class="product-completion">' + invoice.completion + '</div>';
                        prodStatus = '<div class="product-status">' + invoice.status + '</div>';
                    }

                    $('.unprocessed-orders').append(
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
                        invoice.quantity +
                        '</div>' +
                        '<div id="invoice_price_' + invoice._id + '" class="product-line-price">' + invoice.price + '</div>' +
                        percentageComplete +
                        prodStatus +
                        '</div>'
                    );
                    if (currentUserRole === "seller") {
                        $('#status_invoice_' + invoice._id + ' .' + invoice.status).attr('selected', 'selected');
                        $(document).on('change', '#status_invoice_' + invoice._id, function () {
                            updateOrder(invoice._id, $('#status_invoice_' + invoice._id).val(), "status");
                        });

                        $('#completion_invoice_' + invoice._id + ' .' + invoice.completion).attr('selected', 'selected');
                        $(document).on('change', '#completion_invoice_' + invoice._id, function () {
                            updateOrder(invoice._id, $('#completion_invoice_' + invoice._id).val(), "completion");
                        });

                    }
                });

                if (data.results.isNext !== null) {
                    $('#order_prod_next').attr('style', 'display:inline-block;');
                    $('#order_prod_next').attr('onclick', 'getOrders(' + (page + 1) + ')');
                } else {
                    $('#order_prod_next').attr('style', 'display:none;');
                }

            }).fail(function (xhr, status, error) {
            console.log(error);
        });
    }

    getOrders(1);

    updateOrder = function (id, val, field) {
        let data = {
            _id: id,
        };

        if (field == "status") {
            data.status = val;
        } else {
            data.completion = val;
        }

        $.ajax({
            url: "http://localhost:3000/orders/status",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('#msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulation! </strong>Invoice has been updated successfully' +
                    '</div>'
                );
            },
            error: function (xhr, textStatus, errorThrown) {
                if(xhr.readyState === 0){
                    return $('#msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network Error' +
                        '</div>'
                    );
                }

                let errMsg = xhr.responseJSON.message;
                errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                $('#msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>' + errMsg +
                    '</div>'
                );
            }
        });
    };

});