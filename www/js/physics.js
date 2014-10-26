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

        var bounds = Physics.aabb(0, 0, $(window).width(), $(window).height());

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
            var sprite = new Image();
            sprite.src = 'data:image/png;base64,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';
            var body = Physics.body('circle', {
                x: ball.position.x,
                y: ball.position.y,
                // TODO: move to start (maybe bounce now and re-randomise)
                vx: ball.speed * ball.direction.x,
                vy: ball.speed * ball.direction.y,
                radius: ball.radius,
                styles: {
                    fillStyle: '#00ff00'
                },
                view: sprite
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
                var rad = body.geometry.radius * 3;

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