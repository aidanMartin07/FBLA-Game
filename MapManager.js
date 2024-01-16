class MapManager{
    constructor(maps){
        this.maps=maps;
        this.currentMap;
        this.tilesets;
        this.gridSize;
        this.canvas=document.getElementsByClassName('game-canvas')[0];
        this.ctx = this.canvas.getContext("2d");
    }

    async renderMap(cameraPerson){
        this.currentMap.renderMap(cameraPerson);
    }

    async renderSky(cameraPerson){
        this.currentMap.renderSky(cameraPerson);
    }

    async renderTest(cameraPerson){
        this.currentMap.renderTest(cameraPerson);
    }


    async setMap(map){
        this.currentMap=map;
    }

    async switchMap(){

    }
}