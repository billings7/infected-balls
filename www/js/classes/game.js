function Game(viewport) {
    // Singleton
    if (Game._instance) {
        return Game._instance;
    }
    Game._instance = this;

    this.viewport = viewport;
    this.balls = [];
    this.started = false;
    this.timeLimit = 0;
    this.endTime = null;
    this.noOfInfections = 0;
}

Game.prototype.init = function(timeLimit, noOfBalls, noOfInfections) {
    this.timeLimit = timeLimit;
    this.noOfInfections = noOfInfections;

    for (var i = 0; i < noOfBalls; i++) {
        this.balls.push(new Ball({
            x: Utility.random(0, 1),
            y: Utility.random(0, 1)
        }, {
            x: Utility.random(0, 1),
            y: Utility.random(0, 1)
        }, Utility.random(0.4, 1),
        15));
    }
};

Game.prototype.start = function() {
    var self = this;
    var infectedCount = 0;

    this.started = true;

    this.endTime = new Date().setTime(new Date().getTime() + (this.timeLimit * 1000));

    this.viewport.on('click', function clickHandler(event) {
        self.balls.forEach(function (ball) {
            if (!ball.infected) {
                if (ball.containsPoint(event.offsetX, event.offsetX)) {
                    ball.infect();
                    self.noOfInfections--;
                    if (!self.noOfInfections) {
                        self.viewport.off('click', clickHandler);
                    }
                }
            }

            if(ball.infected) {
                infectedCount++;
            }
        });

        if(infectedCount === self.balls.length) {
            // Game over - all balls infected!

        }
    });
};

Game.prototype.update = function() {
    if(new Date() >= this.endTime) {
        this.endGame();
    }
};

Game.prototype.timeLeft = function() {
    return (this.endTime - new Date()) / 1000;
};

Game.prototype.endGame = function() {
    // Fire callbacks, render end screen yadd yadda

};