class SaveMenu{
    constructor(){
        this.src = "/ui/savemenu.png"
        this.image = new Image()
        this.image.src = "/ui/savemenu.png"
        this.image.onload = () => {
         this.isLoaded = true;
        }

        
    }

    createMenu(){
    }

    drawMenu() {
        this.isLoaded && this.ctx.drawImage(this.image, 50, 50
            )
    }
}