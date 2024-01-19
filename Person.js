class Person extends GameObject{
    constructor(config){
        super(config);
        this.movementProgressRemaining = 0;
        this.isStanding = false;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1]
        }
    }

    setPosition(x, y){
        this.x = utils.withGrid(x);
        this.y = utils.withGrid(y);
    }

    update(state){
        if (this.movementProgressRemaining > 0) {
            this.updatePosition();
        }else{

            //More cases for starting to walk here later

            //Case: Player can provide input and has arrow pressed
            if(!state.map.isCutscenePlaying &&this.isPlayerControlled && state.arrow){
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                })
            }
            this.updateSprite(state)
        } 
    }

    startBehavior(state, behavior){
        //console.log("HOLA")
        //set character direction to whatever behavior has
        this.direction = behavior.direction;
        if(behavior.type === "walk"){

            //stop if space is not free
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)) {

                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 10);

                return;
            }
            //can walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movementProgressRemaining = 16;
            this.updateSprite(state)
        }

        if(behavior.type === "stand"){
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id
                })
                this.isStanding = false;
            }, behavior.time)
        }
    }

    updatePosition(){
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movementProgressRemaining -= 1;

            if(this.movementProgressRemaining === 0){
                //Walk has finished
                utils.emitEvent("PersonWalkingComplete", {
                    whoId: this.id
                })

            }
    }
    
    updateSprite(){
        if(this.movementProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction)
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction);
    }

}