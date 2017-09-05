'use strict'

import Network from './Network'
import LPlayer from './LPlayer';
import Player from './Globals/Player';
import RAF from './Globals/rAF'
import PlayerInput from './PlayerInput'

import { pos, v_lerp, v_add, arrayObjectIndexOf } from './Globals/Globals';

class Game{
    constructor(){
        this.context = document.getElementById('canvas').getContext('2d');

        this.network = new Network(this);
        this.playerinput = new PlayerInput();        
        this.localPlayer = new LPlayer(this.context)
        
        this.playerList = [];
        this.time;
        this.clientTime = 0.01;
        this.netOffset = 100; 
        this._pdt = 0.0001;
        this._pdte = Date.now();
        this.update();
        setInterval(this.updatePhysics.bind(this), 1000 / 15);
    }

    update(){
        let current = Date.now();
        let dt = (current - this.time) / 1000;
        this.time = current;
        this.keyBoardInput();
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.localPlayer.update();
        for(let player of this.playerList){
            this.processNetUpdates(player);
            player.update();
        }
        requestAnimationFrame(this.update.bind(this));
    }

    updatePhysics(){
        this._pdt = (Date.now() - this._pdte)/1000.0;
        this._pdte = Date.now();
        this.localPlayer.updatePhysics();
    }

    processNetUpdates(player){
        if(!player.serverInputArray.length) return;
        let currentTime = this.clientTime;
        let count = player.serverInputArray.length - 1;
        let target = null;
        let previous = null;
        for(let i = 0; i < count; ++i) {
            let point = player.serverInputArray[i];
            let nextPoint = player.serverInputArray[i + 1];
            if(currentTime > point.time && currentTime < nextPoint.time) {
                target = nextPoint;
                previous = point;
                break;
            }
        }
        if(!target) {
            target = player.serverInputArray[0];
            previous = player.serverInputArray[0];
        }
        if(target && previous) {
            player.targetTime = target.time;
            let difference = player.targetTime - currentTime;
            let maxDifference = (target.time - previous.time).fixed(3);
            let timePoint = (difference / maxDifference).fixed(3);
            if(isNaN(timePoint)) timePoint = 0;
            if(timePoint == -Infinity) timePoint = 0;
            if(timePoint == Infinity) timePoint = 0;
            let latestServerData = player.serverInputArray[player.serverInputArray.length-1];
            let serverPos = latestServerData.position;
            let targetPos = target.position;
            let pastPos = previous.position;
            player.ghostServerPos = pos(serverPos);
            player.ghostPos = v_lerp(pastPos, targetPos, timePoint);
            player.lastPosition = player.position;
            player.position = v_lerp(player.position, player.ghostPos, this._pdt * player.clientSmooth);
        }
    }

    processNetPredictionCorrection() {
        if(!this.localPlayer.serverInputArray.length) return;
        let latestServerData = this.localPlayer.serverInputArray[this.localPlayer.serverInputArray.length-1];
        let playerServerPosition = latestServerData.position;
        let playerLastInputOnServer = latestServerData.seq;
        if(playerLastInputOnServer) {
            let lastInputSeqIndex = -1;
            for(let i = 0; i < this.localPlayer.clientInputArray.length; ++i) {
                if(this.localPlayer.clientInputArray[i].seq == playerLastInputOnServer) {
                    lastInputSeqIndex = i;
                    break;
                }
            }
            if(lastInputSeqIndex != -1) {
                let numberToClear = Math.abs(lastInputSeqIndex - (-1));
                this.localPlayer.clientInputArray.splice(0, numberToClear);
                this.localPlayer.currentState = pos(playerServerPosition);
                this.localPlayer.lastInputSequence = lastInputSeqIndex;
                this.localPlayer.updatePhysics();
                this.localPlayer.updateLocalPosition();
            }
        }
    }

    keyBoardInput(dt){
        let movement = this.playerinput.keyboardInput();
        let x = 0;
        let y = 0;
        
        for(let key of movement){
            if(key === 'L')
                x -= 1;
            if(key === 'R')
                x += 1;
            if(key === 'D')
                y += 1;
            if(key === 'U')
                y -= 1;
        }
        if(movement.length){
            this.localPlayer.inputSequence++;
            let input = {
                time: this.time, 
                move: movement,
                seq: this.localPlayer.inputSequence
            };
            this.localPlayer.addClientInputArray(input);
            let newDirr = this.localPlayer.vectorFromDirection(x, y);
            this.localPlayer.currentState = v_add(this.localPlayer.position, newDirr)            
            this.network.updateServer(input);
        }
    }

    addPlayer(data){
        let newPlayer = new Player(this.context, data);            
        this.playerList.push(newPlayer);
    }

    addPlayers(data){
        data.forEach((item) => {
            console.log('Added player: ' + item);    
            this.playerList.push(new Player(this.context, item));
        })
    } 

    serverUpdate(data){
        this.clientTime = data.serverTime - (this.netOffset / 1000);        
        data.clients.forEach((item) =>{
            if(item.id === this.localPlayer.id){
                this.localPlayer.addServerInputArray(item)    
            }else{
                var index = arrayObjectIndexOf(this.playerList, item.id, "_id");
                this.playerList[index].addServerInputArray(item)
            }
        })
        this.processNetPredictionCorrection();
    }

    addLocalId(data){
        this.localPlayer.id = data;
    }

    removePlayer(data){
        var index = arrayObjectIndexOf(this.playerList, data, "id");
        this.playerList.splice(index, 1);
    }
}

export default Game;