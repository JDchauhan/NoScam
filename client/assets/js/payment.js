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