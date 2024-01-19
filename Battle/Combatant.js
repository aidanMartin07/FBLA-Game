class Combatant{
    constructor(config, battle ) {
        Object.keys(config).forEach(key =>{
            this[key] = config[key];
        })
        this.battle = battle
    }

    get hpPercent() { //meant for a rectangle health bar that fills/depletes
        const percent = this.hp/ this.maxHp * 100;
        return percent > 0 ? percent : 0
    }

    get isActive() {
        return this.battle.activeCombatants[this.team] === this.id;
    }

    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id)
        this.hudElement.setAttribute("data-team", this.team)

        //HUD element to display the users health and their name 
        this.hudElement.innerHTML = (`
        <p class="Combatant_name">${this.name}</p>
        <p class="Health_amount">${this.hp}</p>
        `);

        // this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    }

    update(changes={}){
        //updates new stuff like updating hp values
        Object.keys(changes).forEach(key =>{
            this[key] = changes[key]
        });

       
        this.hudElement.querySelector(".Health_amount").innerText = this.hp;
        // this.hudElement.querySelector(".Combatant_level").innerText = this.level;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement)
        
        this.update();
    }
}