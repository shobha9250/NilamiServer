/*The algorithm for inviting bidders. 
It uses BFS to get the list of bidders to be invited*/

const db = require('./db');

class Queue{
    constructor() {
        this.items = [];
    }
    enqueue(element){   
        this.items.push(element);
    }
    dequeue(){
        if(this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front(){
        if(this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty(){
        return this.items.length == 0;
    }
}

async function inviteBidders (req,res) {
    try {
        const client_user_id = req.user.user_id;
        const category = req.body.product_category;
        var suggestedUsers = [];
        var queue = new Queue();
        const visited = new Map();
        visited.set(client_user_id,true);
        queue.enqueue(client_user_id);

        const winnerAndAuctioneerQuery = `SELECT auctioneer_id,winner_user_id 
                                    FROM auction 
                                    INNER JOIN product ON auction.product_id=product.product_id 
                                    WHERE product_category='${category}'`;

        const winnerAndAuctioneerArray = await db.query(winnerAndAuctioneerQuery);
        
        while(!queue.isEmpty()){
            const user_id = queue.front();
            const winnerArray = winnerAndAuctioneerArray.filter(data => data.auctioneer_id == user_id);
            winnerArray.forEach(winner => {
                if(winner.winner_user_id && !visited.get(winner.winner_user_id)){
                    queue.enqueue(winner.winner_user_id);
                    suggestedUsers.push('"'+winner.winner_user_id+'"');
                    visited.set(winner.winner_user_id,true);
                }
            });
            queue.dequeue();
        }
        const suggestedMails = [];
        if(suggestedUsers.length){
            const userMailQuery = `SELECT email FROM user_data WHERE user_id IN (${suggestedUsers})`;
            const mailObjectArray = await db.query(userMailQuery);
            mailObjectArray.forEach(mailObject => {
                suggestedMails.push(mailObject.email);
            });
        }else{
            console.log("no suggestions");
        }
        return {
			suggestedMails
		};
    } catch (error) {
        console.log(error);
        return {error};
    }
}

module.exports = {
    inviteBidders
}