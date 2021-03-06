module.exports = {
    loadingLabel: function () {
        //Here we add a label to let the user know we are loading everything
        //This is the "Loading" phrase in pixel art
        //You can just as easily change it for your own art :)
        this.loading = game.add.sprite(game.world.centerX, game.world.centerY - 20, 'loading');
        this.loading.anchor.setTo(0.5, 0.5);
        //This is the bright blue bar that is hidden by the dark bar
        this.barBg = game.add.sprite(game.world.centerX, game.world.centerY + 40, 'load_progress_bar');
        this.barBg.anchor.setTo(0.5, 0.5);
        //This bar will get cropped by the setPreloadSprite function as the game loads!
        this.bar = game.add.sprite(game.world.centerX - 192, game.world.centerY + 40, 'load_progress_bar_dark');
        this.bar.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(this.bar);
    },

    preload: function () {
        this.loadingLabel();
        //Add here all the assets that you need to game.load

        game.load.spritesheet('tiles', 'assets/faux_tiles.png', 16,16);
        game.load.text('level-1', 'assets/levels/1.txt');
        game.load.atlasJSONHash('tiles', 'assets/tiles.png', 'assets/tiles.json');
        game.load.image('footman', 'assets/td-footman.png');
        game.load.image('turret_base', 'assets/turret_base.png');
        game.load.image('turret_top', 'assets/turret_top.png');
        game.load.image('clear', 'assets/tracker.png');

        game.load.image('shot', 'assets/shot.png');
    },

    create: function () {
        game.state.start('menu');
    }
};
