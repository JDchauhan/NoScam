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
                    '<div class="product-line-price">' + invoice.price + '</div>' +

                    '<div class="product-removal">' +
                    '<button class="remove-product">' +
                    'Remove' +
                    '</button>' +
                    '</div>' +
                    '</div>'
                );
            });

        }).fail(function (xhr, status, error) {
        console.log(error);
    });
});