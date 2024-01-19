class Overworld{
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.map = null;

        this.exit = new Exit()
      }

      startGameLoop(){
        const step = () => {
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // //Establish Camera person
            const cameraPerson = this.map.gameObjects.hero;
            //Update all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,

                })
            })

            // //Draw Lower Layer
            // this.map.drawLowerImage(this.ctx, cameraPerson)
            this.mapManager.renderTest(cameraPerson);

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson)
            })

            //this.mapManager.renderSky(cameraPerson);


            // //Draw Upper Layer
            // this.map.drawUpperImage(this.ctx, cameraPerson)
            //this.mapManager.renderMap();
            // this.mapManager.renderMap();

            


            requestAnimationFrame(() => {
                step();
            })
        }
        step();
      }

      bindActionInput() {
        new KeyPressListener("Enter", () => {
            //checks if player can talk to an npc next to themselves
            this.map.checkForActionCutscene()
        })
      }

      bindHeroPositionCheck(){
        document.addEventListener("PersonWalkingComplete", e =>{
            if (e.detail.whoId === "hero"){
                this.map.checkForFootstepCutscene();
            }
        })
      }

      startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
      }

    async init() {
        const container = document.querySelector(".game-container")

        this.titleScreen = new TitleScreen()
        await this.titleScreen.init(container)

        this.mapManager = new MapManager();

        let mapName = "forest" //CHANGE THE MAP NAME HERE
        let mapType; //map type to determine what song forest map: nature theme; battle map: battle theme; boss map: boss theme;
        
        this.map=new Map();
        await this.map.initMap(mapName);
        //await this.map.createCombinedTileset();

        this.mapManager.setMap(this.map)
// this.mapManager.createMapTileSet();

        // this.startMap(window.OverworldMaps.Kitchen);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction;
        
        switch(mapName){
            case "forest": mapType = "forest"; this.map.gameObjects.hero.setPosition(6,22);

            break;
            case "Dungeon1": mapType = "dungeon"; this.map.gameObjects.hero.setPosition(29,29); break;
            case "dungeon2f1": mapType = "dungeon"; this.map.gameObjects.hero.setPosition(4,39); break;
            case "dungeon2f2": mapType = "dungeon"; this.map.gameObjects.hero.setPosition(30,25);break;
            case "BossRoom": mapType = "boss"; this.map.gameObjects.hero.setPosition(16,24);break;
            case "village": mapType = "city"; break; //village map is unused for now 
            case "city": mapType = "city"; this.map.gameObjects.hero.setPosition(2,19);break;
            case "weaponstore": mapType = "city"; this.map.gameObjects.hero.setPosition(2,8);break;
            case "alchemystore": mapType = "city"; this.map.gameObjects.hero.setPosition(2,8);break;
            case "battle": mapType = "battle"; this.map.gameObjects.hero.setPosition(1,7);break;
        }


        let songName;

        switch(mapType){
            case "forest": songName = "/audio/nature sketch.wav"; break;
            case "dungeon": songName = "/audio/old_city_theme.ogg"; break;
            case "boss": songName  = "/audio/Battle in the winter.mp3"; break;
            case "city": songName = "/audio/old_city_theme.ogg"; break;
            case "battle": songName = "/audio/battle theme.mp3"; break;
            
        }

        var music = new Howl({
            src: [songName],
            loop: true,
            volume: 0.0
        });
        music.play();

        addEventListener("keyup", e=> { //display button to exit the game
            if(e.code === "Escape"){
                this.exit.display(this.ctx);
                console.log(this.exit)
            }
        })

        this.startGameLoop();
        
        // this.map.startCutscene([    
        //     {type: "changeMap", map: "DemoRoom"}
        //     {type: "textMessage", text: "GringleTorg"},
        // ])
    }
}