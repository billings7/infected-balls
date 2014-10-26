function Game(viewport) {
    // Singleton
    if (Game._instance) {
        return Game._instance;
    }
    Game._instance = this;

    this.viewport = viewport;
    this.width = viewport.width();
    this.height = viewport.height();

    this.boundsWidth = $(window).width();
    this.boundsHeight = $(window).height();

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
    $('#infectionsLeft').text(this.noOfInfections);

    for (var i = 0; i < noOfBalls; i++) {
        ballTries = 0;

        while(!this.doesBallFit(ball) && (ballTries < ballTryLimit)) {
            ballTries++;
            ball = new Ball({
                    x: this.boundsWidth * Utility.random(0, 1),
                    y: this.boundsHeight * Utility.random(0, 1)
                }, {
                    x: Utility.random(0, 0.5),
                    y: Utility.random(0, 0.5)
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
            infectBall(this, bodyB);
        }

        if (bodyB.ball.infected && !bodyA.ball.infected) {
            infectBall(this, bodyA);
        }
    }
};

Game.prototype.infectBall = function(body) {
    var self = this;

    if (this.noOfInfections > 0) {
        if (!body.ball.infected) {
            this.useInfection();
            infectBall(this, body);
        }
    }
}

function infectBall(self, body) {
    body.ball.infect();
    self.infectBody(body);
    self.addInfected();
            $('#infections').html(this.infectionCount);

    if (self.infectionCount === self.balls.length) {
        // Game over - all balls infected!
        self.endGame();
    }
}

Game.prototype.infectBody = function(body) {
    var infectedSprite = new Image();
    infectedSprite.src = 'data:image/png;base64,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';
    body.styles.fillStyle = '#ff0000';
    body.view = infectedSprite;
};

Game.prototype.useInfection = function() {
    this.noOfInfections--;
    $('#infectionsLeft').text(this.noOfInfections);
};

Game.prototype.addInfected = function() {
    this.infectionCount++;
    $('#infections').text(this.infectionCount);
};

Game.prototype.update = function() {
    if(new Date() >= this.endTime) {
        this.endGame();
    } else {
        $('#timeRemaining').text(this.timeLeft().toFixed(3));
    }
};

Game.prototype.timeLeft = function() {
    return (this.endTime - new Date()) / 1000;
};

Game.prototype.endGame = function() {
    // Fire callbacks, render end screen yadda yadda
    if (this.started) {
        this.started = false;

        if(this.infectionCount < this.balls.length) {
            // Bad end
            $('#bad-end').css({visibility: 'visible'});
        } else {
            // Good end
            $('#good-end').css({visibility: 'visible'});
        }

        this.endFns.forEach(function (fn) {
            fn(self.viewport);
        });
    }
};