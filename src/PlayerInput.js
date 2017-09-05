'use strict'

import Keyboard from './Globals/Keyboard';

class PlayerInput{
    constructor(){
        this.keyboard = new Keyboard();
    }

    keyboardInput(data){
        let inputList = [];
        if(this.keyboard.pressed('A') || this.keyboard.pressed('left')) 
            inputList.push('L');        
        if( this.keyboard.pressed('D') || this.keyboard.pressed('right'))
            inputList.push('R');
        if( this.keyboard.pressed('S') || this.keyboard.pressed('down'))
            inputList.push('D');
        if( this.keyboard.pressed('W') || this.keyboard.pressed('up'))
            inputList.push('U');
        return inputList;
    }
}

export default PlayerInput;