class TitleScreen{
    constructor() {

    }

    

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
        
            .screenBackground{
                position: absolute;
                left: 0;
                top: 0;
                width:100%;
                height:100%;
                background-size:cover;
                background-repeat: no-repeat;
                background-position: center center;
                background-attachment:fixed;
            }
        
            .left-span {
              position: fixed;
              display: flex;
              align-items: center;
              justify-content: center;
              left: 0;
              top: 0;
              height: 100%;
              width: 200px;
              background-color: rgba(0, 0, 0, 0.5); /* Slightly transparent black background */
            }
        
            .image-button {
              display: inline-block;
              font-family: "MedievalSharp", cursive;
          font-weight: 400;
          font-style: normal;
              line-height: 21px;
              width: 180px; /* Set width to auto to maintain the image's original size */
              height: 21px; /* Set height to auto to maintain the image's original size */
              background: url('/ui/background.png') center/cover; /* Replace 'your-image-url.jpg' with the actual image URL */
              text-align: center;
              color: #fff;
              text-decoration: none;
              font-size: 12px;
              transition: background-color 0.3s ease;
            }
        
            /* Darken the background on hover */
            .image-button:hover {
              background-color: rgba(0, 0, 0, 0.3); /* Slight darkening effect */
            }
        
            /* Darken the background on hover */
            .image-button:hover {
              background-color: rgba(0, 0, 0, 0.3); /* Slight darkening effect */
            }
          </style>
        </head>
        <body>
            <img src="/ui/screenBackground.png" class="screenBackground">
          <div class="left-span">
            <a id="start" href="#" class="image-button">Play</a>
          </div>
          <!-- Your page content goes here -->
        </body>
        </html>
        `)


    }

    close() {
        this.element.remove();
    }

    init(container){
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            setTimeout(() => {
                document.getElementById("start").addEventListener("click", () => {
                    this.element.remove()
                    resolve();
                })
            },1000)
            addEventListener("keyup", e => {
                console.log("esacae")
                if(e.code === "Escape"){
                    this.close();
                    resolve();
                }
            })
        })
    }
}