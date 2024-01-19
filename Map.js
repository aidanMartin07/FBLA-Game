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
              x: utils.withGrid(1),
              y: utils.withGrid(1)
          })}
 
  }

  setPosition(x, y){
    this.gameObjects.x = utils.witthGrid(x);
    this.gameObjects.y = utils.withGrid(y);
  }


  async initMap(file){
      const map = await fetch("/maps/"+file+".json");
      this.mapData = await map.json();
      this.width=this.mapData.width;
      this.height=this.mapData.height;
      this.tileSize=this.mapData.tileheight;

      // // try{
      //   console.log("HI")
      // //   console.log("HI")
        //   this.tileMapImage=await utils.loadImage("/maps/mapTilesets/"+file+".png");
      //   console.log(this.tileMapImage.width/this.tileSize)
      // //   console.log(this.tileMapImage.width/this.tileSize)
        //   this.tileMapSize=this.tileMapImage.width/this.tileSize;
        
      //   console.log(this.tileMapSize+" size")
      //   
        //   console.log(this.tileMapSize+" size")
        // }catch{
        await this.createCombinedTileset();
        this.tileMapImage = new Image();
        this.tileMapImage.src = document.getElementById("tileset").toDataURL();
        // // var link = document.createElement('a');
        // // link.download = 'tileset.png';
        // // link.href = document.getElementById("tileset").toDataURL();
        // // link.click();
     //// }


      this.mapData.layers.forEach(layer => {
          console.log(layer.name)
          if(layer.name=="collision")
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

    getPlayerPosition(){
      
    }

      //DIVIDED BY 16 IS BECAUSE OF CHARACTER STORED INCCORECTLY WITH PIXEL AMOUNTS
      isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        console.log(this.tileTags.data[y/16*this.width+x/16], y/16, x/16)
        return this.tileTags.data[y/16*this.width+x/16];
    }

  

  addWall(x, y){
      //console.log("x:"+x+" y:"+y)
      this.tileTags.data[(y*this.width)/16+x/16] = 3363;
      //console.log(this.tileTags)
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
              //console.log("render collision")
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
      canvas.id="tileset"
      const ctx = canvas.getContext("2d");
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      const images = [];
      let totalTiles=0;

      for (let i = 0; i < this.mapData.tilesets.length; i++) {
          const image = await utils.loadImage(`/maps/tilesets/${this.mapData.tilesets[i].source.replace('.tsx', '.png')}`);
          totalTiles += (image.width * image.height) / (this.mapData.tileheight * this.mapData.tilewidth);
          this.tileMapSize = Math.ceil(Math.sqrt(totalTiles))+1;
          console.log(totalTiles)
          images[i] = image;
        }



      canvas.width = this.tileMapSize*this.tileSize+16;
      canvas.height = this.tileMapSize*this.tileSize;
      document.body.appendChild(canvas);
      let xMap=0;
      let yMap=0;
      let ii=0;
      for(let image in images){
        let imageFile = images[image];
        console.log(imageFile)
        let offsetX=0;
        let offsetY=0;
        for(let y=0; y*this.tileSize<imageFile.height;y++){
          for(let x=0; x*this.tileSize<imageFile.width;x++){
            ii++;
            //console.log(offsetX,offsetY,this.tileSize,this.tileSize,xMap*this.tileSize,yMap*this.tileSize,this.tileSize,this.tileSize)
              ctx.drawImage(imageFile,offsetX,offsetY,this.tileSize,this.tileSize,xMap*this.tileSize,yMap*this.tileSize,this.tileSize,this.tileSize);
              // ctx.font = "7px Arial";
              // ctx.fillStyle = "red";
              // ctx.fillText(ii, xMap*this.tileSize, yMap*this.tileSize+7);
              xMap++;
              offsetX+=this.tileSize;
              if(offsetX>=imageFile.width){
                offsetX=0;
                offsetY+=this.tileSize;
              }

                //console.log(xMap, this.tileMapSize)
                if(xMap>this.tileMapSize){
                  xMap=0;
                  yMap++;
                }
            }
          }
        }
          
}

}