class Overworld{
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.map = null;
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
        this.mapManager = new MapManager();

        let mapName = "BossRoom"
        let mapType; 
        //map type to determine what song forest map: nature theme; battle map: battle theme; boss map: boss theme;
        switch(mapName){
            case "forest": mapType = "forest"; break;
            case "Dungeon1": mapType = "dungeon"; break;
            case "dungeon2f1": mapType = "dungeon"; break;
            case "dungeon2f2": mapType = "dungeon"; break;
            case "BossRoom": mapType = "boss"; break;
            case "village": mapType = "city"; break;
            case "city": mapType = "city"; break;
            case "weaponstore": mapType = "city"; break;
            case "alchemystore": mapType = "city"; break;
        }
        
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
        
        let songName;

        switch(mapType){
            case "forest": songName = "/audio/nature sketch.wav"; break;
            case "dungeon": songName = "/audio/old_city_theme.ogg"; break;
            case "boss": songName  = "/audio/Battle in the winter.mp3"; break;
            case "city": songName = "/audio/old_city_theme.ogg"; break;
            case "battle": songName = "/battleThemeA.mp3"; break;
            
        }

        var music = new Howl({
            src: [songName],
            loop: true,
            volume: 0.5
        });
        music.play();

        this.startGameLoop();

        
        // this.map.startCutscene([    
        //     {type: "changeMap", map: "DemoRoom"}
        //     {type: "textMessage", text: "GringleTorg"},
        // ])
    }

}