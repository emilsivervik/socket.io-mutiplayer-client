'use strict'

import Entity from './Entity'

const BUFFERSIZE = 120;

class Player extends Entity{
    constructor(context, id){
        super();
        this._context = context;
        this._id = id;
        this._movementSpeed = 120;
        this._serverInputArray = [];
        this._clientSmooth = 10;
        this._ghostPos = {
            x: 0, 
            y: 0
        }
        this._ghostServerPos = {
            x: 0, 
            y: 0
        }
        this._lastPosition = {
            x: 0, 
            y: 0
        }
        this.size = {
            x: 32, 
            y: 32
        }
        this.center = {
            x : 16, 
            y : 16
        } 
    }
    update(){
        this.draw();
    }

    draw(){
        this._context.fillRect(this._position.x, this._position.y, this._size.x, this._size.y);
    }

    addServerInputArray(input){
        if(this._serverInputArray.length >= BUFFERSIZE)
            this._serverInputArray.splice(0, 1)
        this._serverInputArray.push(input);
    }
    set id(id){this._id = id;}
    get id(){return this._id;}
    set lastPosition(lastPosition){this._lastPosition = lastPosition;}
    get lastPosition(){return this._lastPosition;}
    set serverInputArray(serverInputArray){this._serverInputArray = serverInputArray;}
    get serverInputArray(){return this._serverInputArray;}
    get clientSmooth(){return this._clientSmooth;}
}
export default Player;