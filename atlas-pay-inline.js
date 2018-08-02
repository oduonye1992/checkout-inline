'use strict';
function AtlasPay (options) {
    var _defaultOptions = {
        environment: "prod",
        transactionId: null
    };

    var _stylesheetURL = "http://localhost:63342/checkout-inline/atlas-pay-inline.css";

    var _options = Object.assign({}, _defaultOptions, options);

    var _endPoints = {
        dev: "https://nairaland.com/",
        prod: "https://nairaland.com/"
    };

    var _promises = {
        resolve: function(){},
        reject: function(){}
    };

    var _postMessageEvents = {
        "atlas_pay_transaction_successful": "atlas_pay_transaction_successful",
        "atlas_pay_transaction_failed": "atlas_pay_transaction_failed"
    };

    /**
     * @example parent.postMessage("Hello","https://atlas.money");
     * @description The 2nd argument is the origin of the request. This should be setup when creating the transaction
     * @description On successful transaction, the checkout page should send a post message to each allowed origin
     * // Send the message "Hello" to the parent window
     // ...if the domain is still "atlas.money"
     */
    var listenForPostMessage = function() {
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
            console.log('parent received message!:  ',e.data);
            if (_postMessageEvents[e.data]) {
                closeModal(e.data);
            }
        },false);
    };

    var openIframe = function(url) {

        var elementId = "atlas_pay_iframe";
        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', elementId);
        ifrm.setAttribute('allowtransparency', true);
        ifrm.setAttribute('frameborder', 0);
        ifrm.setAttribute('style', "height:50vh; width:50vw; background-color:#34495e;");

        // To place at end of document
        var modal = document.getElementById('myModal');
        modal.appendChild(ifrm);

        // assign url
        ifrm.setAttribute('src', url);
    };

    var openModal = function(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        var head = document.getElementsByTagName('head')[0];
        link.href = _stylesheetURL;
        head.appendChild(link);
        var modalContent = '<div class="modal" id="atlas_pay_modal">'+
            '<div class="modal-content">'+
                '<span class="close">&times;</span>'+
            '<div id="myModal" style="align-items:center; justify-content: center; display: flex;"></div>'+
            '</div>'+
        '</div>';
        var body = document.getElementsByTagName('body')[0];
        body.innerHTML += modalContent;

        openIframe(url);

        // Get the modal
        var modal = document.getElementById('atlas_pay_modal');
        modal.style.display = "block";

        // Listen for PostMessage
        listenForPostMessage();
    };

    var closeModal = function(transaction_status){
        // Get the modal
        var modal = document.getElementById('atlas_pay_modal');

        modal.style.display = "none";
        modal.innerHTML = "";
        if (transaction_status === _postMessageEvents['atlas_pay_transaction_successful']) {
            _promises.resolve("Transaction successful");
        } else {
            _promises.reject("Transaction Failed");
        }
    };

    return {

        charge : function() {
            return new Promise(function(resolve, reject) {
                _promises = {
                    resolve: resolve,
                    reject: reject
                };
                // Open modal
                if (!options.transactionId) throw new Error ("Transaction ID is invalid");
                var url = _endPoints[_options.environment];//+"checkout/"+_options.transactionId;
                openModal(url);
            });
        }
    }
}
