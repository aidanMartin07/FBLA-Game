class Map{
    constructor(){
        this.mapData;
        this.width;
        this.height;
        this.tileSize;
        this.tileMapSize; //width and height are the same
        this.tileMapImage; //image for the combined tilemap
        this.tileTags; //collision, water, interactables, events
        this.ground;
        this.sky;
        this.canvas=document.getElementsByClassName('game-canvas')[0];
        this.ctx = this.canvas.getContext("2d");
        this.gameObjects = {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(13),
                y: utils.withGrid(13)
            })}
    }

    async initMap(file){
        const map = await fetch("/maps/"+file+".json");
        this.mapData = await map.json();
        this.tileMapImage=await utils.loadImage("/maps/mapTilesets/"+file+".png")

        this.width=this.mapData.width;
        this.height=this.mapData.height;
        this.tileSize=this.mapData.tileheight;
        this.mapData.layers.forEach(layer => {
            console.log(layer.name)
            if(layer.name=="Collision")
            this.tileTags = layer;
            if(layer.name=="ground"){
                this.ground = layer;
                console.log(this.ground)
            }
          });


    }

    getTilePosition(index) {
        // Calculate the row and column
        //0 isnt used
        //clean up+= thats because the map is actually 19 tiles wide
        //starts at 0
        index--;
        const y = Math.floor(index / (this.tileMapSize+1));
        const x = index - y*(this.tileMapSize+1);
      
        return { x: x, y: y };
      }

      isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.tileTags[y*this.width+x]==0;
    }

    addWall(x, y){
        console.log("x:"+x+" y:"+y)
        this.tileTags.data[(y*this.width)/16+x/16] = 3363;
        console.log(this.tileTags)
    }
    removeWall(x, y){
        this.tileTags.data[(y*this.width)/16+x/16] = 0;
        }
    moveWall(wasX, wasY, direction){
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX,wasY, direction);
        this.addWall(x,y)
    }

    async renderTest(cameraPerson){
        this.mapData.layers.forEach(layer => {
            for(let y = 0; y < this.height; y++) {
              for(let x = 0; x < this.width; x++) {
                let index = layer.data[x + y * this.width];
                //console.log(layer.name+" "+index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
                if(index == 0) continue;
                this.ctx.drawImage(
                  this.tileMapImage,
                  this.getTilePosition(index).x * this.tileSize,
                  this.getTilePosition(index).y * this.tileSize,
                  this.tileSize,
                  this.tileSize,
                  x * this.tileSize - cameraPerson.x + utils.withGrid(10.5),
                  y * this.tileSize - cameraPerson.y + utils.withGrid(6),
                  this.tileSize,
                  this.tileSize
                );
              }
            }
          });
          this.renderCollision(cameraPerson);
    }

    async renderCollision(cameraPerson){
            for(let y = 0; y < this.height; y++) {
              for(let x = 0; x < this.width; x++) {
                let index = this.tileTags.data[x + y * this.width];
                //console.log(layer.name+" "+index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
                if(index == 0) continue;
                this.ctx.drawImage(
                  this.tileMapImage,
                  this.getTilePosition(index).x * this.tileSize,
                  this.getTilePosition(index).y * this.tileSize,
                  this.tileSize,
                  this.tileSize,
                  x * this.tileSize - cameraPerson.x + utils.withGrid(10.5),
                  y * this.tileSize - cameraPerson.y + utils.withGrid(6),
                  this.tileSize,
                  this.tileSize
                );
              }
            }          
    }

    async renderMap(cameraPerson){
        if(this.tileMapImage==null)
        return;
    
          for(let y=0; y<this.height;y++){
            for(let x=0; x<this.width;x++){
              let index = this.ground.data[x+y*this.ground.width];
              //console.log(index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
              if(index==0) continue;
              this.ctx.drawImage(this.tileMapImage,this.getTilePosition(index).x*this.tileSize,(this.getTilePosition(index)).y*this.tileSize,this.tileSize,this.tileSize,x*this.tileSize- cameraPerson.x+utils.withGrid(10.5),y*this.tileSize- cameraPerson.y+utils.withGrid(6),this.tileSize,this.tileSize)
            }
          }
        
          for(let y=0; y<this.height;y++){
            for(let x=0; x<this.width;x++){
              let index = this.tileTags.data[x+y*this.tileTags.width];
              //console.log(index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
              if(index==0) continue;
              this.ctx.globalAlpha = 0.4;
              this.ctx.drawImage(this.tileMapImage,this.getTilePosition(index).x*this.tileSize,(this.getTilePosition(index)).y*this.tileSize,this.tileSize,this.tileSize,x*this.tileSize- cameraPerson.x+utils.withGrid(10.5),y*this.tileSize- cameraPerson.y+utils.withGrid(6),this.tileSize,this.tileSize)
              this.ctx.globalAlpha = 1;
            }
          }


        }

        async renderSky(cameraPerson){

            for(let y=0; y<this.height;y++){
              for(let x=0; x<this.width;x++){
                let index = this.sky.data[x+y*this.sky.width];
                //console.log(index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
                if(index==0) continue;
                this.ctx.drawImage(this.tileMapImage,this.getTilePosition(index).x*this.tileSize,(this.getTilePosition(index)).y*this.tileSize,this.tileSize,this.tileSize,x*this.tileSize- cameraPerson.x+utils.withGrid(10.5),y*this.tileSize- cameraPerson.y+utils.withGrid(6),this.tileSize,this.tileSize)
              }
            }
          
          }


        //requires a little cleaning
    async createCombinedTileset(){
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        const images = [];
        let totalTiles=0;

        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            const image = await utils.loadImage(`/maps/tilesets/${this.mapData.tilesets[i].source.replace('.tsx', '.png')}`);
            totalTiles += (image.width * image.height) / (this.mapData.tileheight * this.mapData.tilewidth);
            this.tileMapSize = Math.ceil(Math.sqrt(totalTiles));
            images[i] = image;
          }



        canvas.width = this.tileMapSize*this.tileSize;
        canvas.height = this.tileMapSize*this.tileSize;
        document.body.appendChild(canvas);
        let xMap=0;
        let yMap=0;
        let ii=0;
        for(let image in images){
          let imageFile = images[image];
          let offsetX=0;
          let offsetY=0;
          for(let y=0; y*this.tileSize<imageFile.height;y++){
            for(let x=0; x*this.tileSize<imageFile.width;x++){
              ii++;
                ctx.drawImage(imageFile,offsetX,offsetY,this.tileSize,this.tileSize,xMap*this.tileSize,yMap*this.tileSize,this.tileSize,this.tileSize);
                //ctx.fillText(ii, xMap*this.tileSize, yMap*this.tileSize+18);
                xMap++;
                offsetX+=this.tileSize;
                if(offsetX>=imageFile.width){
                  offsetX=0;
                  offsetY+=this.tileSize;
                }

                if(xMap>this.tileMapSize){
                  xMap=0;
                  yMap++;
                }
            }
          }
        }
          
}

}