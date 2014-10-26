function Game(viewport) {
    // Singleton
    if (Game._instance) {
        return Game._instance;
    }
    Game._instance = this;

    this.viewport = viewport;
    this.width = viewport.width();
    this.height = viewport.height();

    this.balls = [];
    this.infectionCount = 0;
    this.started = false;
    this.timeLimit = 0;
    this.endTime = null;
    this.noOfInfections = 0;
    this.renderer = null;

    this.initFns = [];
    this.startFns = [];
    this.endFns = [];
}

Game.prototype.onInit = function(fn) {
    this.initFns.push(fn);
};
Game.prototype.onStart = function(fn) {
    this.startFns.push(fn);
};
Game.prototype.onEnd = function(fn) {
    this.endFns.push(fn);
};

Game.prototype.init = function(timeLimit, noOfBalls, noOfInfections) {
    var self = this,
        ballTryLimit = 10,
        ballTries = 0,
        ball;

    this.timeLimit = timeLimit;
    this.noOfInfections = noOfInfections;

    for (var i = 0; i < noOfBalls; i++) {
        ballTries = 0;

        while(!this.doesBallFit(ball) && (ballTries < ballTryLimit)) {
            ballTries++;
            ball = new Ball({
                    x: this.width * Utility.random(0, 1),
                    y: this.height * Utility.random(0, 1)
                }, {
                    x: Utility.random(0, 1),
                    y: Utility.random(0, 1)
                }, Utility.random(0.3, 0.7),
                15);
        }

        if(ballTries < ballTryLimit) {
            this.balls.push(ball);
        }
    }

    this.initFns.forEach(function(fn) {
        fn(self.width, self.height, self.balls);
    });
};

Game.prototype.doesBallFit = function(otherBall) {
    return otherBall && this.balls.every(function(ball) {
        return !ball.collidesWith(otherBall);
    });
};

Game.prototype.start = function() {
    var self = this;

    if(!this.started) {
        this.started = true;
        this.endTime = new Date().setTime(new Date().getTime() + (this.timeLimit * 1000));

        this.startFns.forEach(function (fn) {
            fn(self.viewport);
        });
    }
};

Game.prototype.ballCollision = function(bodyA, bodyB) {
    if(bodyA.ball && bodyB.ball) {
        if (bodyA.ball.infected && !bodyB.ball.infected) {
            this.infectBall(bodyB);
        }

        if (bodyB.ball.infected && !bodyA.ball.infected) {
            this.infectBall(bodyA);
        }
    }
};

Game.prototype.infectBall = function(body) {
    var self = this;

    if (this.noOfInfections > 0) {
        if (!body.ball.infected) {
            body.ball.infect();
            this.infectBody(body);
            this.noOfInfections--;
            this.infectionCount++;

            if (this.infectionCount === this.balls.length) {
                // Game over - all balls infected!
                this.endGame();
            }
        }
    }
};

Game.prototype.infectBody = function(body) {
    body.styles.fillStyle = '#ff0000';
    body.view = null;
};

// TODO: Call this
Game.prototype.update = function() {
    if(new Date() >= this.endTime) {
        this.endGame();
    } else {
        $('#timeRemaining').text(Math.round(this.timeLeft()));
    }
};

// TODO: Display infections remaining count

// TODO: Use this to display counter
Game.prototype.timeLeft = function() {
    return (this.endTime - new Date()) / 1000;
};

// TODO: End the game
Game.prototype.endGame = function() {
    // Fire callbacks, render end screen yadda yadda
    if (this.started) {
        this.started = false;

        // TODO: Reset physics system
        if(this.infectionCount < this.balls.length) {
            // Bad end
            $('#bad-end').toggle();
        } else {
            // Good end
            $('#good-end').toggle();
        }
    }
};