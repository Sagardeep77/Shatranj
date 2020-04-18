//A module for the linkedlist


const P2PConnectionModel = require('./P2PConnection.model');

//linkedList class node

class Node {
    constructor(P2PConnection) {
        this.P2PConnection = P2PConnection;
        this.next = null;
    }
}

//Linked Class
class LinkedListP2P {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    //function to add P2PConnection to the sorted list
    addNode(P2PConnection) {

        var node = new Node(P2PConnection);
        var current,prev;
        // console.log(node);
        if (this.head == null) {
            this.head = node;
            // console.log("P2PConnection added Successfully");
        }
        else {
            current = this.head;
            prev = this.head;
            while (current.next != null) {

                // console.log("current.P2PConnection.code ->",current.P2PConnection.code);
                // console.log("P2PConnection.code ->",P2PConnection.code);

                if (current.P2PConnection.code < P2PConnection.code) {
                    prev = current;
                    current = current.next;
                }
                else {
                    prev.next = node;
                    node.next = current;
                    this.size++;
                    // console.log("P2PConnection added Successfully");

            
                    return;
                }
            }
            // console.log("current.P2PConnection.code ->",current.P2PConnection.code);
                // console.log("P2PConnection.code ->",P2PConnection.code);
            if (current.P2PConnection.code < P2PConnection.code){
                current.next = node;
            }
            else{
                node.next=current;
                prev.next=node;
            }
            
            this.size++;
            // console.log("P2PConnection added Successfully");
            return;
        }
        this.size++;
    }

    //function to remove P2PConnection from the sorted list


    removeNode(P2PConnection) {
        var current ,prev;

        prev = this.head;
        current = this.head;
        while (current != null) {
            if (current.P2PConnection.code == P2PConnection.code) {
                if (current == this.head) {
                    this.head = null;
                }
                else {
                    prev.next = current.next;
                }
                this.size--;
                return "removed P2PConnection";
            }
            prev = current;
            current = current.next;
        }
        return "Can not remove from empty List";
    }


    connectionWithCode(code){
        var current = this.head ;
        while(current!=null){
            if(current.P2PConnection.code == code){
                return current.P2PConnection;
            }
            current=current.next;
        }
        return null;
    }

    connectionWithSocketId(socketId){
        
        var current = this.head ;

        while(current!=null){
            if(current.P2PConnection.client1 === socketId){
                this.removeNode(current.P2PConnection);
                return {"P2PConnection":current.P2PConnection,"player": "1"};
            }
            else if(current.P2PConnection.client2 === socketId){
                this.removeNode(current.P2PConnection);
                return {"P2PConnection":current.P2PConnection,"player": "2"};
            }
            else{
                current=current.next;
            }
        }
        return null;    
    }

    getSize(){
        return this.size;
    }
}

module.exports = LinkedListP2P
