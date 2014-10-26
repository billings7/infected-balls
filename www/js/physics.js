function PhysicsSystem(world) {
    PhysicsSystem.world = world;
    PhysicsSystem.bodies = [];
}

PhysicsSystem.fromGame = function(game) {
    var self = this;

    game.onInit(function(width, height, balls) {
        self.renderer = Physics.renderer('canvas', {
            el: 'viewport', // id of the canvas element
            width: width,
            height: height
        });

        PhysicsSystem.world.add(self.renderer);

        var bounds = Physics.aabb(0, 0, 500, 500);

        PhysicsSystem.world.add(Physics.behavior('edge-collision-detection', {
            aabb: bounds,
            restitution: 0.99
        }));

        // ensure objects bounce when edge collision is detected
        PhysicsSystem.world.add(Physics.behavior('body-impulse-response'));
        PhysicsSystem.world.add(Physics.behavior('body-collision-detection'));
        PhysicsSystem.world.add(Physics.behavior('sweep-prune'));

        PhysicsSystem.world.on('collisions:detected', function( data ){
            var c;

            for (var i = 0, l = data.collisions.length; i < l; i++){
                c = data.collisions[ i ];

                game.ballCollision(c.bodyA, c.bodyB);
            }
        });

        // Construct circles form balls
        balls.forEach(function(ball) {
            var body = Physics.body('circle', {
                x: ball.position.x,
                y: ball.position.y,
                // TODO: move to start (maybe bounce now and re-randomise)
                vx: ball.speed * ball.direction.x,
                vy: ball.speed * ball.direction.y,
                radius: ball.radius,
                styles: {
                    fillStyle: '#00ff00'
                }
            });

            body.ball = ball;
            PhysicsSystem.bodies.push(body);
            PhysicsSystem.world.add(body);
        });
    });

    game.onStart(function(viewport) {
        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function (time, dt) {
            PhysicsSystem.world.step(time);
        });

        // start the ticker
        Physics.util.ticker.start();

        PhysicsSystem.world.on('step', function () {
            PhysicsSystem.world.render();
            game.update();
        });

        viewport.click(function (e) {
            PhysicsSystem.bodies.forEach(function (body) {
                var dx = e.offsetX - body.state.pos.x;
                var dy = e.offsetY - body.state.pos.y;
                var rad = body.geometry.radius;

                if ((dx * dx + dy * dy) < (rad * rad)) {
                    game.infectBall(body);
                }
            });
        });
    });

    game.onEnd(function() {
        // TODO?
    });
};