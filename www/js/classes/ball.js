function Ball(position, direction, speed, radius) {
    this.infected = false;
    this.speed = speed;
    this.radius = radius;
    this.direction = direction;
    this.position = position;
};

Ball.prototype.infect = function() {
    this.infected = true;
};

Ball.prototype.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
};

Ball.prototype.setDirection = function(x, y) {
    this.direction.x = x;
    this.direction.y = y;
};

Ball.prototype.containsPoint = function(x, y) {
    var xDiff = x - this.position.x;
    var yDiff = y - this.position.y;

    return ((this.radius * this.radius) > ((xDiff * xDiff) + (yDiff * yDiff)));
};

Ball.prototype.bounce = function () {
    // TODO;
};

Ball.prototype.move = function () {
    // TODO
};