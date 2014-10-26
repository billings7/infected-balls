function Utility() {
}

Utility.random = function (start, end) {
    return (Math.random() * (end - start)) + start;
};