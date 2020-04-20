// This class behaves like a room with some code and adds max two sockets 


class P2PConnection{

    constructor(code){
        this.code=code;
        // this.P2PConnectionId=id;
        this.activeConnections=0;
        this.client1=null;
        this.client2=null;
        this.socket1=null;
        this.socket2=null;
    }

    setClient(client){
        if(this.activeConnections===0){
            this.client1=client.id;
            this.socket1=client;
            this.activeConnections++;
        }
        else if(this.activeConnections===1){
            this.client2=client.id;
            this.socket2=client;
            this.activeConnections++; 
        }
        else{
            this.activeConnections++;
        }
        return this.activeConnections;
    }

    enableEventSharing(){
        this.socket1.on('new-message',(message)=>{
            this.socket1.broadcast.to(this.socket2.id).emit('new-message',message);
            console.log("socket 1 :",message);
        });
        this.socket2.on('new-message',(message)=>{
            this.socket2.broadcast.to(this.socket1.id).emit('new-message',message);
            console.log("socket 2 :",message);
        });
    }

    playerLeft(number){
        if(number == 1){
            this.socket1.broadcast.to(this.socket2.id).emit('player-left',"1");
        }
        else if(number==2){
            this.socket2.broadcast.to(this.socket1.id).emit('player-left',"2");
        }
    }




};

module.exports = P2PConnection;