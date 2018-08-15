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

                if(data.results.user.role === "seller"){
                    $('.cart').hide();
                }

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;

            }).fail(function (xhr, status, error) {
            window.location.href = "../";
            setCookie("token", "", -1);
        });
    }

    $.get("http://localhost:3000/orders", {},
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
                    '<div class="product-status">' + invoice.status + '</div>' +

                    '</div>'
                );
            });

        }).fail(function (xhr, status, error) {
        console.log(error);
    });

});