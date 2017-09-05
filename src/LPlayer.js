'use strict'

const NETOFFSIZE = 0.015;

import Player from './Globals/Player'
import { pos, v_add } from './Globals/Globals';

class LPlayer extends Player{
    constructor(context){
        super(context);
        this.targetTime = 0.01;        
        this._clientInputArray = [];        
        this._inputSequence = 0;
        this._lastInputSequence = 0;        
        this._currentState = {
            x: 0, 
            y: 0
        }
        this._lastState = {
            x: 0, 
            y: 0
        }        
    }

    updateLocalPosition(){
        let currentState = this._currentState;
        this._position = currentState;
    }

    updatePhysics(dt){
        this.lastPosition = pos(this._currentState);
        this._lastState = pos(this._currentState);
        let newDir = this.processInput();
        this._currentState = v_add(this._lastState, newDir);
    }

    processInput(){
        let _x = 0;
        let _y = 0;

        if(this._clientInputArray.length){
            for(let item of this._clientInputArray){                
                if(item.seq <= this._lastInputSequence) continue;
                for(let m of item.move){
                    if(m === 'R'){
                        _x += 1;
                    }
                    if(m === 'L'){
                        _x -= 1;
                    }
                    if(m === 'U'){
                        _y -= 1;
                    }
                    if(m === 'D'){
                        _y += 1;
                    }
                }                
            }
            this._lastInputSequence = this._clientInputArray[this._clientInputArray.length - 1].seq;
        }
        return this.vectorFromDirection(_x, _y);
    }

    update(){
        this.updateLocalPosition();    
        super.update();
    }

    vectorFromDirection(x, y) {
        return {
            x : (x * (this._movementSpeed * NETOFFSIZE)).fixed(3),
            y : (y * (this._movementSpeed * NETOFFSIZE)).fixed(3),
        }
    }    

    addClientInputArray(input){this._clientInputArray.push(input);}

    get inputSequence(){return this._inputSequence;}
    set inputSequence(inputSequence){this._inputSequence = inputSequence;}
    set clientInputArray(clientInputArray){this._clientInputArray = clientInputArray;}
    get clientInputArray(){return this._clientInputArray;}
    set currentState(currentState){this._currentState = currentState;}
    get currentState(){return this._currentState;}
}
export default LPlayer;