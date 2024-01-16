class MapManager{
    constructor(){
        this.tilesets=[];
        this.totalTiles=0;
        this.size=0;
        this.mapData;
        this.canvas=document.getElementsByClassName('game-canvas')[0];
        this.ctx = this.canvas.getContext("2d");
    }

    
drawLowerImage(ctx, cameraPerson){
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
}

drawUpperImage(ctx, cameraPerson){
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y)
}

async renderMap(json){
const map = await fetch("/maps/map.json");
const mapData = await map.json();
this.mapData=mapData;
this.mapTileset=await this.loadImage("/maps/mapTilesets/map1.png")
this.tilesize=32;
let groundLayer;
let collisionLayer;
let skyLayer;

mapData.layers.forEach(layer => {
    switch (layer.name) {
      case "Ground":
        groundLayer = layer;
        break;
      case "Collision":
        collisionLayer = layer;
        break;
      case "Sky":
        skyLayer = layer;
        break;
    }
  });
  console.log(this.mapTileset)
  for(let y=0; y<mapData.height;y++){
    for(let x=0; x<mapData.width;x++){
      let index = groundLayer.data[x+y*groundLayer.width];
      if(index==0) return;
      console.log(index+" "+this.getTilePosition(index).x+" "+this.getTilePosition(index).y)
      this.ctx.drawImage(this.mapTileset,this.getTilePosition(index).x*32,(this.getTilePosition(index)).y*32,this.tilesize,this.tilesize,x*this.tilesize,y*this.tilesize,this.tilesize,this.tilesize)
    }
  }

  for(let y=0; y<mapData.height;y++){
    for(let x=0; x<mapData.width;x++){
      let index = collisionLayer.data[x+y*collisionLayer.width];
      if(index!=0){
        this.ctx.globalAlpha = 0.4;
        this.ctx.drawImage(this.mapTileset,this.getTilePosition(index).x*32,(this.getTilePosition(index)).y*32,this.tilesize,this.tilesize,x*this.tilesize,y*this.tilesize,this.tilesize,this.tilesize)
        this.ctx.globalAlpha = 1;
      }
    }
  }

  for(let y=0; y<mapData.height;y++){
    for(let x=0; x<mapData.width;x++){
      let index = skyLayer.data[x+y*skyLayer.width];
      if(index!=0){
        this.ctx.drawImage(this.mapTileset,this.getTilePosition(index).x*32,(this.getTilePosition(index)).y*32,this.tilesize,this.tilesize,x*this.tilesize,y*this.tilesize,this.tilesize,this.tilesize)
      }
    }
  }
  
  


}

getTilePosition(index) {
  // Calculate the row and column
  index--;
this.size=19;
  const y = Math.floor(index / this.size);
  //size*x+row=index
  const column = index - y*this.size;

  return { x: column, y: y };
}

async loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function() {
      resolve(image);
    };
    image.src = source;
    image.onerror = function() {
      reject(new Error("Failed to load image"));
    };
  });
}


async createMapTileSet(json){
  const map = await fetch("/maps/map.json");
  const mapData = await map.json();

  let groundLayer;
  let collisionLayer;
  let skyLayer;
  let i=0;

  let images=await this.getImages(mapData);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  let tilesize=mapData.tileheight;
  canvas.width = this.size*tilesize;
  canvas.height = this.size*tilesize;
  document.body.appendChild(canvas)

  let xMap=0;
  let yMap=0;
  let ii=0;
  for(let image in images){
    let imageFile = images[image];
    let offsetX=0;
    let offsetY=0;
    for(let y=0; y*tilesize<imageFile.height;y++){

      for(let x=0; x*tilesize<imageFile.width;x++){
        ii++;
          ctx.drawImage(imageFile,offsetX,offsetY,tilesize,tilesize,xMap*tilesize,yMap*tilesize,tilesize,tilesize);
          ctx.fillText(ii, xMap*tilesize, yMap*tilesize+18);
          xMap++;
          offsetX+=tilesize;
          if(offsetX>=imageFile.width){
            offsetX=0;
            offsetY+=tilesize;
          }
          
          if(xMap>this.size){
            xMap=0;
            yMap++;
          }
      }
    }
  }


};

async getImages(mapData) {
  const images = [];

  const promises = mapData.tilesets.map(async (tileset) => {
    try {
      const image = await this.loadImage(`/maps/tilesets/${tileset.source.replace('.tsx', '.png')}`);
      this.totalTiles += (image.width * image.height) / (mapData.tileheight * mapData.tilewidth);
      this.size = Math.ceil(Math.sqrt(this.totalTiles));
      images.push(image); // Add the loaded image to the array
    } catch (error) {
      console.error(error);
    }
  });

  await Promise.all(promises);

  return images; // Return the array of loaded images
}




}