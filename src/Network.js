'use strict'

class Network{
    constructor(game){
        let socket = io();
        socket.on('tcClientCon', (data) => {
            game.addPlayer(data)
        })        
        .on('tcClientDisc', (data) => {
            game.removePlayer(data)
        })
        .on('tcSendCurClients', (data) => {        
            game.addPlayers(data)
        })
        .on('tcUpdateClient', (data) => {            
            game.serverUpdate(data);
        })
        .on('tcWelcome', (data) => {
            game.addLocalId(data);
        })
        this.socket = socket;
    }

    updateServer(data){
        this.socket.emit('tsSendMovementUpdate', data);
    }
}

export default Network;