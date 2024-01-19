class TitleScreen{
    constructor() {

    }

    

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`<img class="TitleScreen_logo" src="/ui/play.png" alt="FBLA game" />
        `)
    }

    close() {
        this.element.remove();
    }

    init(container){
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            addEventListener("keyup", e => {
                if(e.code === "Escape"){
                    this.close();
                }
            })
        })
    }
}