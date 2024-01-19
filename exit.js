class Exit{
    constructor() {
        this.src = "/ui/exit.png"
        this.image = new Image();
        this.image.src = "/ui/exit.png"

        this.image.onload = () => {
            this.isLoaded = true;

            if (this.displayCallback) {
                this.displayCallback();
              }
        }
    
    }

    display(ctx) {
        if (this.isLoaded) {
          ctx.drawImage(this.image, 10, 10);
        } else {
          // If not loaded, set a callback to be called when the image is loaded
          this.displayCallback = () => {
            ctx.drawImage(this.image, 10, 10);
          };
        }
      }
}