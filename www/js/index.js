(function() {
    Physics(PhysicsSystem);

    var hei = $(window).height();
    var wid = $(window).width();

    var size = Math.max(hei, wid);

    var viewport = $('#viewport');
    viewport.width(size);
    viewport.height(size);

    var game = new Game(viewport);
    PhysicsSystem.fromGame(game);

    game.init(10, 12, 2);

    $('#start').click(function() {
        game.start();
        $('#start').hide();
    });
})();