//game is global
var map;
var startingPoint;
var endingPoint;
var blocks, enemies;
var pathfinder;
var path;

var t1,t2, enemy;


var addTile = function (x,y) { 
    var b = blocks.create(x*game.globals.TILE_SIZE, game.globals.TILE_SIZE *(y), 'tiles', 'greenbrick.png');
    b.body.immovable = true; 
};


var buildMap = function () {
    var l1 = game.cache.getText(game.globals.LEVEL);

    var rows = l1.split('\r\n'); 
    if (rows.length === 1) {
        rows = l1.split('\n'); 
    }
    map = [];
    rows.forEach(function (row, index) {
        var newRow = [];
        for (var i = 0; i < row.length; i++) {

            if (row[i] === '#') {
                addTile(i,index);
                newRow.push(1);
            } else if (row[i] ==='E') {
                //this is the End point
                newRow.push(0);
                endingPoint = {x: i, y: index };
            } else if (row[i] ==='S') {
                //this is the starting point
                newRow.push(0);
                startingPoint = {x: i, y: index };
            } else {
                newRow.push(0);
            } 

        };

        map.push(newRow);
    });
}
var buildEnemyMove = function (actor) {

    var move = game.add.tween(actor);
 
    for (var pathNode in path){

        // x is pf.js [path.x, path.y] or easystar.js [path.x, path.y]
        var x = path[pathNode][0]*16 || path[pathNode].x*16,
            y = path[pathNode][1]*16 || path[pathNode].y*16;

        move.to({ x: x, y: y }, 1800, Phaser.Easing.Linear.None);
    }
    if (actor.activeTween != null) {
        //console.log('activeTween');
        actor.activeTween.stop();
     // create a new tween
    }
    actor.activeTween = move;
    actor.activeTween.start(); 
}
var releaseTheHounds = function () {
    enemy = enemies.getFirstExists(false);
    enemy.reset(startingPoint.x * game.globals.TILE_SIZE, startingPoint.y * game.globals.TILE_SIZE);

    buildEnemyMove(enemy);
}
var preparePath = function () {
    pathfinder.setCallbackFunction(function(fpath) {
        path = fpath || []; 
        releaseTheHounds();
 
    });
    //console.log([startx, starty], [tilex, tiley])
    pathfinder.preparePathCalculation([startingPoint.x ,startingPoint.y], [endingPoint.x ,endingPoint.y]);
    try {
        pathfinder.calculatePath();
    } catch (e) {
        console.log('error');
        //console.log(e);
    }
}

var addTurret = function (x, y) {
    var base = game.add.sprite(x* game.globals.TILE_SIZE, y* game.globals.TILE_SIZE,  'turret_base');
    var gun = game.add.sprite(x* game.globals.TILE_SIZE, y* game.globals.TILE_SIZE, 'turret_top');

    //base.anchor.set(0.5);
    //gun.anchor.set(0.5, 0.5);

    //gun.rotation = game.physics.arcade.angleBetween(gun, target);
}

var Turret = function (x,y) {
    this.base = game.add.sprite(x* game.globals.TILE_SIZE, y* game.globals.TILE_SIZE,  'turret_base');
    this.gun = game.add.sprite((x+.5)* game.globals.TILE_SIZE, (y+.5)* game.globals.TILE_SIZE, 'turret_top');
    this.gun.anchor.set(0.5,0.5);
}

Turret.prototype.update = function() {
    // body...
    if(!this.target) return;
    this.gun.rotation = game.physics.arcade.angleBetween(this.gun, this.target);
    console.log(game.physics.arcade.angleBetween(this.gun, this.target) )
};

Turret.prototype.track = function(target) {
    this.target = target;
};
module.exports = {
    create: function(){
        console.log('play')
    //This is just like any other Phaser create function
        blocks = game.add.group();
        blocks.enableBody = true;
        blocks.physicsBodyType = Phaser.Physics.ARCADE;
        buildMap();



        var walkables = [0];

        pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        pathfinder.setGrid(map, walkables);



        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        enemies.createMultiple(4, 'footman');
        enemies.setAll('outOfBoundsKill', true);
        enemies.setAll('checkWorldBounds', true);

        preparePath();
        console.log('end');

        t1 = new Turret(4,4);
        t2 = new Turret(1,5);
        t1.track(enemy);
        t2.track(enemy);
    },
    update: function(){
    //Game logic goes here

            t1.update();
            t2.update();
    },
};
