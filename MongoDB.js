const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";


export const mongodb = function(req,res, next){
    MongoClient.connect(url, function (err, db) {
        if(err) throw err;
        console.log("Database connection established");
        let dbo = db.db("mydb");
        dbo.createCollection("users", function(err,res){
            if(err) throw err;
            console.log("Collection created!")
        });
        dbo.collection("users").insertOne({
            "username": "developer",
            "logininfo": "ZGV2ZWxvcGVyOnRlc3QxMjM="
        }, function(err, res) {
            if(err) throw err;
            console.log("inserted Doc");
        })
        db.close();
    });
}
