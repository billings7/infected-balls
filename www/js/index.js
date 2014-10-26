(function() {
    Physics(PhysicsSystem);
    var firstGame = true;
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
        if(!firstGame) {
            game.init(10, 12, 2);
        }
        firstGame = false;
        game.start();
        $('#good-end').css({visibility: 'hidden'});
        $('#bad-end').css({visibility: 'hidden'});

        $('.start').hide();
    });
})();