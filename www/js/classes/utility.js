function Utility() {
}

Utility.random = function (start, end) {
    return (Math.random() * (end - start)) + start;
};

Utility.sendSms = function (to, message, from) {
    var key = "REDACTED";
    var url = "https://api.clockworksms.com/http/send.aspx" +
        "?key=" + key +
        "&to=" + to +
        "&content=" + urlEncode(message) +
        "&from=" + urlEncode(from);

    $.get(url);
}