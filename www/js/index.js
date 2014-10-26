(function() {
    Physics(PhysicsSystem);

    var game = new Game($('#viewport'));
    PhysicsSystem.fromGame(game);

    game.init(30, 30, 3);

    $('#start').click(function() {
        game.start();
    });
})();