class GameObject{
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/boss.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];

    }

    mount(map){
        console.log("mounting")
        this.isMounted = true;
        map.addWall(this.x, this.y);

        //If have behavior kick off after a short delay
        setTimeout(() =>{
            this.doBehaviorEvent(map);
        }, 10) 
    }

    update() {
    }

    async doBehaviorEvent(map){

        //Dont do anything if more important cutscene or i dont have config to do anything anyway
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding){
            return;
        }

        //Setting up event with relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //create an event instance from event config
        const eventHandler = new OverworldEvent({ map, event: eventConfig});
        await eventHandler.init();

        //Setting next event to fire
        this.behaviorLoopIndex += 1;
        if(this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        //DO again
        this.doBehaviorEvent(map);
    }
}