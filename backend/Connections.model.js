


const P2PConnectionModel = require('./P2PConnection.model');
const LinkedListP2P = require('./LinkedListP2PConnections');

class ConnectionModel {
    constructor() {
        this.usedCodes = new Array(101); //max 100 codes can be used excluding 0
        this.intializeUsedCodes();
        this.list = new LinkedListP2P(); //LinkedList of P2PConnections
    }

    //function to initialize all the code as usable

    intializeUsedCodes() {
        for (let i = 0; i < this.usedCodes.length; i++) {
            this.usedCodes[i] = false;
        }
    }

    //function which returns whether the code is used or not

    checkCodeUsed(code) {
        return this.usedCodes[code];
    }

    //function for making code as used
    setCodeUsed(code){
        let P2PConnection = this.list.connectionWithCode(code);
        if(P2PConnection){
            if(P2PConnection.activeConnections == 2){
                console.log("P2Pconnection with used code ", P2PConnection);
                this.usedCodes[code]=true;
                console.log("code "+code + " is in use");
            }
        }
    }


    /*
    function to searche a socket in list
        if the socket was a player of P2PConnection 
            removes P2PConnection from list and makes code reusable
        else 
            do nothing
    */
    searchP2PConnection(socketId) {
        let response = this.list.connectionWithSocketId(socketId)
        if (response) {
            this.usedCodes[response.P2PConnection.code] = false;
            return response;
        }
        return null;
    }


    /*
    function to establish connection between two players
        if P2PConnection is not made
            adds P2PConnection to list
        
        returns the active no of connections and adds the socket to the P2PConneetion
    */
    establishP2PConnection(socketId, code) {
        let P2PConnection = this.list.connectionWithCode(code);
        if (!P2PConnection) {
            P2PConnection = new P2PConnectionModel(code);
            this.list.addNode(P2PConnection);
            console.log("list size --> ",this.list.getSize());
        }
        let activeConnections = P2PConnection.setClient(socketId);
        // console.log(P2PConnection);
        return activeConnections;
    }
}

module.exports = ConnectionModel;



