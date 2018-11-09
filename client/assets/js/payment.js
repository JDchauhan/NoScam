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
        $.get(baseUrl + "user", {},
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
            var errMsg;
            if (xhr.status === 0) {
                errMsg = "Network error.";
            } else {
                setCookie("token", "", -1);
                window.location.href = "../";
            }
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
                    url: baseUrl + "payment/stripe",
                    type: 'POST',
                    data: JSON.stringify({
                        token: token,
                        amount: RequestData.amount * 100
                    }),
                    contentType: 'application/json',
                    success: function (result) {
                        if (result && result.status === 200) {
                            $('.alert').hide(500);
                            $('#msg').append(
                                '<div class="alert alert-success alert-dismissible fade show">' +
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                '<strong>Congratulation! </strong>Payment has been successfully processed' +
                                '</div>'
                            );
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var errMsg;
                        if (xhr.status === 0) {
                            errMsg = "Network error.";
                        } else {
                            errMsg = JSON.parse(xhr.responseText).message;
                            errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                            if (errMsg === 'Validation failed.') {
                                errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                            }

                            $('.alert').hide(500);
                            $('#msg').append(
                                '<div class="alert alert-danger alert-dismissible fade show">' +
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                '<strong>Oops! </strong> ' + errMsg +
                                '</div>'
                            );

                        }
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

    $(document).on('click', '#paytm_payment', function () {
        if ($('#amount').val() && $('#amount').val() >= 1) {
            RequestData.amount = $('#amount').val();
        } else {
            alert("Please enter an amount");
            return;
        }

        let data = {
            'email': RequestData.email,
            'amount': RequestData.amount,
            'firstname': RequestData.firstname
        };

        $.ajax({
            url: baseUrl + "payment/paytm",
            type: 'POST',
            cors: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (response) {
                if (response.status === 200) {
                    $('#checkout').empty();
                    $('#checkout').empty();
                    $('#payment-container').hide();
                    $('#checkout').show();
                    $('#checkout').append(
                        '<h1>Please do not refresh this page...</h1>' +
                        '<form method="post" action="' + 'https://securegw-stage.paytm.in/theia/processTransaction' + '" name="f1">' +
                        '<input type="hidden" name="MID" value="' + response.results.MID + '">' +
                        '<input type="hidden" name="ORDER_ID" value="' + response.results.ORDER_ID + '">' +
                        '<input type="hidden" name="CUST_ID" value="' + response.results.CUST_ID + '">' +
                        '<input type="hidden" name="TXN_AMOUNT" value="' + response.results.TXN_AMOUNT + '">' +
                        '<input type="hidden" name="CHANNEL_ID" value="' + response.results.CHANNEL_ID + '">' +
                        '<input type="hidden" name="WEBSITE" value="' + response.results.WEBSITE + '">' +
                        '<input type="hidden" name="INDUSTRY_TYPE_ID" value="' + response.results.INDUSTRY_TYPE_ID + '">' +
                        '<input type="hidden" name="CALLBACK_URL" value="' + response.results.CALLBACK_URL + '">' +
                        '<input type="hidden" name="CHECKSUMHASH" value="' + response.results.CHECKSUMHASH + '">' +
                        '</form>'
                    );
                    document.f1.submit();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("error");
            }
        });

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
    fetch(baseUrl + 'payment/payumoney', {
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
                    fetch(baseUrl + 'payment/payumoney/response', {
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
                            if (json && json.status === 200) {
                                $('.alert').hide(500);
                                $('#msg').append(
                                    '<div class="alert alert-success alert-dismissible fade show">' +
                                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                    '<strong>Congratulation! </strong>Payment has been successfully processed' +
                                    '</div>'
                                );
                            }
                        });
                },
                catchException: function (BOLT) {
                    console.log(BOLT);
                }
            });
        });
}