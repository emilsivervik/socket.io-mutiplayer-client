'use strict'

class Entity{
    constructor(){
        this._scale = 1.0;
        this._position = {
            x:0, 
            y:0 
        }
        this._size = { 
            x:0, 
            y:0, 
            hx:0, 
            hy:0
        }
        this._center = {
            x : 0, 
            y : 0
        }   
    }

    get scale(){return this._scale;}
    set scale(scale){this._scale = scale;}
    get position(){return this._position;}
    set position(position){this._position = position;}
    get size(){return this._size;}
    set size(size){this._size = size;}
    get center(){return this._center;}
    set center(center){this._center = center;}
}
export default Entity;