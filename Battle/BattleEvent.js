class BattleEvent {
    constructor(event, battle) {
      this.event = event;
      this.battle = battle;
    }
    
    textMessage(resolve) {
  
      const text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name)
  
      const message = new TextMessage({
        text,
        onComplete: () => {
          resolve();
        }
      })
      message.init( this.battle.element )
    }
  
    async stateChange(resolve){
        const {caster, target, damage} = this.event;
        if(damage) {
            //modify target health
            target.update({
                hp: target.hp - damage
            })
        

            target.hudElement.classList.add("battle-damage-blink");
        }

        //resolve event after small wait
        await utils.wait(600)
        target.hudElement.classList.remove("battle-damage-blink");
        resolve();
    }
  
    submissionMenu(resolve) {
      const menu = new SubmissionMenu({
        caster: this.event.caster,
        enemy: this.event.enemy,
        onComplete: submission => {
          //submission { what move to use, who to use it on }
          resolve(submission)
        }
      })
      menu.init( this.battle.element )
    }
  
    animation(resolve) {
      const fn = BattleAnimations[this.event.animation];
      fn(this.event, resolve);
    }
  
    init(resolve) {
      this[this.event.type](resolve);
    }
  }