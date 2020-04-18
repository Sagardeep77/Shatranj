// This class behaves like a room with some code and adds max two sockets 


class P2PConnection{

    constructor(code){
        this.code=code;
        // this.P2PConnectionId=id;
        this.activeConnections=0;
        this.client1=null;
        this.client2=null;
        
    }

    setClient(client){
        if(this.activeConnections===0){
            this.client1=client;
            this.activeConnections++;
        }
        else if(this.activeConnections===1){
            this.client2=client;
            this.activeConnections++; 
        }
        else{
            this.activeConnections++;
        }
        return this.activeConnections;
    }


};

module.exports = P2PConnection;