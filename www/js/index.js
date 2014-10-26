var circles = [];

Physics(function( world ) {
    // code here...
    var renderer = Physics.renderer('canvas', {
        el: 'viewport', // id of the canvas element
        width: 500,
        height: 500
    });
    world.add(renderer);

    circles.push(Physics.body('circle', {
        x: 250,
        y: 250,
        vx: 0.25,
        radius: 10,
        styles: {
            fillStyle: '#ff0000'
        }
    }));
    circles.push(Physics.body('circle', {
        x: 250,
        y: 250,
        vx: -0.25,
        radius: 10,
        styles: {
            fillStyle: '#eee000'
        }
    }));
    for (var i = 0; i < circles.length; i++) {
        world.add(circles[i]);
    }


    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function (time, dt) {
        world.step(time);
    });

    // start the ticker
    Physics.util.ticker.start();

    world.on('step', function () {
        world.render();
    });

    var bounds = Physics.aabb(0, 0, 500, 500);

    world.add(Physics.behavior('edge-collision-detection', {
        aabb: bounds,
        restitution: 0.95
    }));
    // ensure objects bounce when edge collision is detected
    world.add(Physics.behavior('body-impulse-response'));
    world.add(Physics.behavior('body-collision-detection'));
    world.add(Physics.behavior('sweep-prune'));

    $('#viewport').click(function (e) {
        circles.forEach(function (circle) {
            var dx = e.offsetX - circle.state.pos.x;
            var dy = e.offsetY - circle.state.pos.y;
            var rad = circle.geometry.radius;

            if ((dx * dx + dy * dy) < (rad * rad)) {
                circle.view = null;
                circle.styles.fillStyle = '#00ff00';
                console.log('click');
            }
        });
    });

    world.on('collisions:detected', function( data ){
        var c;
        for (var i = 0, l = data.collisions.length; i < l; i++){
            c = data.collisions[ i ];
            world.publish({ //  change colour for a collision between a and b
                topic: 'collision-pair',
                bodyA: c.bodyA,
                bodyB: c.bodyB
            });
        }
    });
});