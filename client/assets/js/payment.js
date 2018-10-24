var RequestData = {
    key: 'eolzYsVq',
    txnid: 'ishfuewouro3u',
    hash: '',
    amount: '',
    firstname: '',
    email: '',
    phone: '',
    productinfo: 'Bag',
    surl: 'http://localhost/kontact%20services/NoScam/client/pages/payment.html',
    furl: 'http://localhost/kontact%20services/NoScam/client/pages/payment.html',
};

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

                RequestData.email = data.results.user.email;
                RequestData.firstname = data.results.user.fname;
                RequestData.phone = data.results.user.mobile;

                fname = fname.charAt(0).toUpperCase() + fname.substr(1);
                lname = lname.charAt(0).toUpperCase() + lname.substr(1);

                $(".username").text(fname + " " + lname);

                currentUserID = data.results.user._id;
                currentUserRole = data.results.user.role;
                if (currentUserRole === "seller") {
                    $('.cart').hide();
                }
            }).fail(function (xhr, status, error) {

            setCookie("token", "", -1);
            window.location.href = "../";
        });
    }

    //open payment dialog
    $(document).on('click', '#payment', function () {
        if ($('#amount').val() && $('#amount').val() >= 1) {
            RequestData.amount = $('#amount').val();
            payumoney();
        } else {
            alert("Please enter an amount")
        }
    });

    $('#stripe_payment').on('click', function (e) {
        if ($('#amount').val() && $('#amount').val() >= 1) {
            RequestData.amount = $('#amount').val();
        } else {
            alert("Please enter an amount");
            return;
        }

        var handler = StripeCheckout.configure({
            key: 'pk_test_a09RA0CrRjZQFvHO1gcQ1way',
            image: 'https://raw.githubusercontent.com/JDchauhan/dev-screenshots/03d23ae0e3e63430990287e5d30204d186b1dd83/public/Hexerve.png',
            locale: 'auto',
            currency: 'INR',
            token: function (token) {
                $.ajax({
                    url: "http://localhost:3000/payment/stripe",
                    type: 'POST',
                    data: JSON.stringify({token:token, amount: RequestData.amount * 100}),
                    contentType: 'application/json',
                    success: function (result) {
                        console.log("success");
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("error");
                    }
                });
            }
        });

        //Open Checkout with further options:
        handler.open({
            name: 'Hexerve',
            description: 'Screenshot taker tool',
            zipCode: true,
            amount: RequestData.amount * 100,
            email: RequestData.email
        });
        e.preventDefault();
    });

    // Close Checkout on page navigation:
    window.addEventListener('popstate', function () {
        handler.close();
    });

});


//get hash for payment
function payumoney() {
    // Data to be Sent to API to generate hash.
    let data = {
        'txnid': RequestData.txnid,
        'email': RequestData.email,
        'amount': RequestData.amount,
        'productinfo': RequestData.productinfo,
        'firstname': RequestData.firstname
    }

    // API call to get the Hash value
    fetch('http://localhost:3000/payment/payumoney', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(function (a) {
            return a.json();
        })
        .then(function (json) {
            RequestData.hash = json['hash']
            //  With the hash value in response, we are ready to launch the bolt overlay.
            //Function to launch BOLT   
            console.log(RequestData);
            bolt.launch(RequestData, {
                responseHandler: function (response) {
                    fetch('http://localhost:3000/payment/payumoney/response', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(response.response)
                        })
                        .then(function (a) {
                            return a.json();
                        })
                        .then(function (json) {
                            console.log(json);
                        });
                },
                catchException: function (BOLT) {
                    console.log(BOLT);
                }
            });
        });
}