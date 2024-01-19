class OverworldMap{
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutSceneSpaces = config.cutSceneSpaces || {};
        this.walls = config.walls || {};

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
    return this.walls[`${x},${y}`] || false;
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
                            {type: "textMessage", text:"test", faceHero:"npcA"}
                        ]
                    }
                ]
            }),
        },
        cutSceneSpaces: {
            [utils.asGridCoord(4,4)] : [
                {
                    events: [
                        {type: "changeMap", map: "Dungeon1"}
                    ]
                }
            ]
        }
    },
    Dungeon1 : {
        lowerSrc: "",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(29),
                y: utils.withGrid(29)
            }),
            ghost: new Person({
                x: utils.withGrid(22),
                y: utils.withGrid(22),
                src: "/images/characters/ghost.png"
            })
        }
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
    Kitchen: {
        lowerSrc: "/images/maps/KitchenLower.png",
        upperSrc: "/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(5),
                y: utils.withGrid(5)
            }),
            npcA: new Person({
                x: utils.withGrid(9),
                y: utils.withGrid(6),
                src: "/images/characters/people/npc2.png"
            }),
            npcB: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "/images/characters/people/npc3.png",
                talking: [
                    {
                      events: [
                        { type: "textMessage", text: "ergle", faceHero:"npcB" },
                      ]
                    }
                  ]
            })
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
