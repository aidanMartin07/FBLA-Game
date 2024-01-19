class OverworldMap{
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutSceneSpaces = config.cutSceneSpaces || {};
        this.walls = config.walls || {};
        this.json = config.json

        this.lowerImage = new Image()
        this.lowerImage.src = config.lowerSrc; //constains the floor

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc; //contains things rendered above the characters ex: roofs

        this.isCutscenePlaying = false;
    }

drawLowerImage(ctx, cameraPerson){
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
}

drawUpperImage(ctx, cameraPerson){
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
}

isSpaceTaken(currentX, currentY, direction){
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    console.log(this.tileTags.data[y/16*this.width+x/16], y/16, x/16)
    return this.tileTags.data[y/16*this.width+x/16];
}

mountObjects(){
    Object.keys(this.gameObjects).forEach(key => {

        let object = this.gameObjects[key];
        object.id = key;

        //TODO: determine if this object should actually mount or not 
        object.mount(this);
    })
}

async startCutscene(events) {
    this.isCutscenePlaying = true;

    //start loop of async events
    for( let i = 0; i < events.length; i++){
        const eventHandler = new OverworldEvent({
            event: events[i],
            map: this,
        })
        await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //ONce cutscene done go back to doing idle things
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
}

checkForActionCutscene(){
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if(!this.isCutscenePlaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events)
    }
}

checkForFootstepCutscene(){
    const hero = this.gameObjects["hero"];
    const match = this.cutSceneSpaces[ `${hero.x},${hero.y}` ];
    if(!this.isCutscenePlaying && match){
        this.startCutscene( match[0].events )
    }

}

addWall(x, y){
    this.walls[`${x},${y}`] = true;
}
removeWall(x, y){
    delete this.walls[`${x},${y}`] ;
}
moveWall(wasX, wasY, direction){
    this.removeWall(wasX,wasY);
    const {x,y} = utils.nextPosition(wasX,wasY, direction);
    this.addWall(x,y)
}

async initMap(file){
    const map = await fetch("/maps/"+file+".json");
    this.mapData = await map.json();
    this.width=this.mapData.width;
    this.height=this.mapData.height;
    this.tileSize=this.mapData.tileheight;

    this.mapData.layers.forEach(layer => {
        console.log(layer.name)
        if(layer.name=="collision")
        this.tileTags = layer;
        if(layer.name=="ground"){
            this.ground = layer;
            console.log(this.ground)
        }
      });


}

}


window.OverworldMaps = {
    forest : {
        lowerSrc: "/images/maps/Forest1Lower.png",
        upperSrc: "/images/maps/Forest1Upper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(6),
                y: utils.withGrid(22)
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(20),
                src: "/images/characters/people/alchemist.png",
                behaviorLoop: [
                    {type: "stand", direction: "left", time: 1500},
                    {type: "stand", direction: "up", time:1500},
                ],
                talking: [
                    {
                        events: [
                            {type: "textMessage", text:"It appears that many monsters have appeared in the wilderness and only YOU can save us",
                            faceHero:"npcA"}
                        ]
                    }
                ]
            }),
        },
        cutSceneSpaces: {
            [utils.asGridCoord(4,3)] : [
                {
                    events: [
                        {type: "changeMap", map: "Dungeon1"}
                    ]
                }
            ],
            [utils.asGridCoord(20, 4)] : [
                {
                    events: [
                        {type: "changeMap", map: "dungeon2f1"}
                    ]
                }
            ]
        },
        json: "forest"
    },
    Dungeon1 : {
        lowerSrc: "/images/maps/Dungeon1Lower.png",
        upperSrc: "/images/maps/Dungeon1Upper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(29),
                y: utils.withGrid(29)
            }),
            ghost: new Person({
                x: utils.withGrid(22),
                y: utils.withGrid(25),
                src: "/images/characters/people/ghost.png",
            })
        },
        cutSceneSpaces: {
            [utils.asGridCoord(30,29)] : [
                {
                    events: [
                        {type: "changeMap", map: "forest"}
                    ]
                }
            ],
            [utils.asGridCoord(30,30)] : [
                {
                    events: [
                        {type: "changeMap", map: "forest"}
                    ]
                }
            ]
        },
        json: "Dungeon1"
    },
    dungeon2f1 : {
        lowerSrc: "/images/maps/Dungeon2Floor1Lower.png",
        upperSrc: "images/maps/Dungeon2Floor1Upper.png",
        gameObjects : {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(4),
                y: utils.withGrid(39)
            }),
            ghost: new Person({
                x: utils.withGrid(22),
                y: utils.withGrid(22),
                src: "/images/characters/people/ghost.png"
            })
        },
        cutSceneSpaces : {
            [utils.asGridCoord(3,39)] : [
                {
                    events: [
                        {type: "changeMap", map: "forest"}
                    ]
                }
            ],
            [utils.asGridCoord(4,8)] : [
                {
                    events: [
                        {type: "changeMap", map: "BossRoom"}
                    ]
                }
            ]
        },
        json: "dungeon2f1"
    },
    BossRoom : {
        lowerSrc: "/images/maps/BossRoomLower.png",
        upperSrc: "/images/maps/BossRoomUpper.png",
        gameObjects: {
            hero : new Person({
                isPlayerControlled: true,
                x: utils.withGrid(16),
                y: utils.withGrid(24)
            }),
            boss : new Person({
                x: utils.withGrid(16),
                y: utils.withGrid(11),
                src: "/images/characters/people/boss.png",
            })
        },
        cutSceneSpaces: {
            [utils.asGridCoord(16,25)] : [
                {
                    events : [
                        {type: "changeMap", map:"dungeon2f1"}
                    ]
                }
            ]
        },
        json: "BossRoom"
    },
    DemoRoom: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "/images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "/images/characters/people/npc7alt.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800},
                    { type: "stand", direction: "up", time: 800},
                    { type: "stand", direction: "right", time: 1200},
                    { type: "stand", direction: "up", time: 300},
                ],
                talking: [
                    {
                        events: [
                            {type: "textMessage", text: "gourgle", faceHero: "npcA"},
                            {type: "textMessage", text: "Flingle"},
                            {who: "hero",type: "walk", direction: "up"},

                        ]
                    },
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "/images/characters/people/npc2.png",
                // behaviorLoop: [
                //     { type: "walk", direction: "left" },
                //     { type: "stand", direction: "up", time: 800 },
                //     { type: "walk", direction: "up" },
                //     { type: "walk", direction: "right" },
                //     { type: "walk", direction: "down"},
                // ]
                
            })
        },
        walls : {
            // "16,16": true
            [utils.asGridCoord(7,6)] : true,
            [utils.asGridCoord(8,6)] : true,
            [utils.asGridCoord(7,7)] : true,
            [utils.asGridCoord(8,7)] : true,
        },
        cutSceneSpaces: {
            [utils.asGridCoord(7,4)] : [
                {
                    events: [
                        {who: "npcB", type: "walk", direction: "left"},
                        {who: "npcB", type: "stand", direction: "up", time: 500},
                        {type: "textMessage", text: "what the flip"},
                        {who: "npcB", type: "walk", direction: "right"},
                        {who: "hero", type: "walk", direction: "down"},
                        {who: "hero", type: "walk", direction: "left"},
                    ]
                }
            ],
            [utils.asGridCoord(5,10)] : [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen"}
                    ]
                }
            ]
        }
    },
    ForestCatacombsDemo: {
        lowerSrc: "/images/maps/MapTestLower.png",
        upperSrc: "/images/maps/MapTestUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(6)
            }),
            npcA: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(8),
                src: "/images/characters/people/npc7alt.png",
                behaviorLoop: [
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "up", time: 2400 },
                    { type: "walk", direction: "down", },
                    { type: "walk", direction: "down", },
                    { type: "walk", direction: "down", time: 3200},
                ]
            })
        },
        walls : {
            // "16,16": true
            [utils.asGridCoord(0,12)] : true,
            [utils.asGridCoord(0,13)] : true,
            [utils.asGridCoord(1,12)] : true,
            [utils.asGridCoord(1,13)] : true,
            [utils.asGridCoord(0,16)] : true,
            [utils.asGridCoord(1,16)] : true,
            [utils.asGridCoord(3,17)] : true,
            [utils.asGridCoord(3,18)] : true,
            [utils.asGridCoord(4,17)] : true,
            [utils.asGridCoord(4,18)] : true,
        }
    }
}
