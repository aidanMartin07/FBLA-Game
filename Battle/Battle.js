class Battle{
    constructor() {
        this.combatants = {
            "player1": new Combatant({
                ...Fighters.Hero, team: "player",hp: 50, maxHp: 50, xp:0, maxXp: 100, level: 1, status: null, name: "You", isPlayerControlled: true
            }, this),
            "enemy1": new Combatant({
               ...Fighters.Ghost, team: "enemy", hp: 50, maxHp: 70, xp:20, level: 1, status: null, name: "Boss", isPlayerControlled: false
            }),
            "enemy2": new Combatant({
               ...Fighters.Boss , team: "enemy", hp: 70, maxHp: 30, xp:50, level: 1, status: null, name: "Ghost", isPlayerControlled: false
            })
        }
        this.activeCombatants = {
            player: "player1",
            enemy: "enemy2",
        }
    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add("Battle");
        this.element.innerHTML = (`
        <div class="Battle_hero">
            <img src="${'/images/characters/people/npc7.png'}" alt="Hero" />
        </div>
        <div class="Battle_enemy">
            <img src="${'/images/characters/people/ghost.png'}" alt="Enemy" />
        <div>
        `)
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    
        Object.keys(this.combatants).forEach(key => {
          let combatant = this.combatants[key];
          combatant.id = key;
          combatant.init(this.element)
        })
    
        this.turnCycle = new TurnCycle({
          battle: this,
          onNewEvent: event => {
            return new Promise(resolve => {
              const battleEvent = new BattleEvent(event, this)
              battleEvent.init(resolve);
            })
          }
        })
        this.turnCycle.init();
    
    
      }
}