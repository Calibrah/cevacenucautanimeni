import express from 'express';
import users from './users';
import database from './database';
import bodyParser from 'body-parser';
import MongoClient from 'mongodb'


let app = express();

const url = "mongodb://localhost:27017/users";
{/*aepvalv*/}

const checkUser = function(req, res, next) {
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        const dbo = db.db("mydb");
        console.log("logininfo :", req.headers.authorization)
        dbo.collection("users").findOne({"logininfo": req.headers.authorization}, function(err, result) {
            if(err) throw err;
            if(result){
                console.log("Valid Credentials");
                db.close();
                next()
            }
            else {
                console.log("Invalid Credentials", req.headers.authorization)
                db.close();
                res.send("<h1>Error 403</h1> </br> Forbidden")
            }
        })
    })
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(checkUser);

app.route('/users')
    .get((req, res) => {
        res.send(database);
    })
    .post((req, res) => {
        const newProfile = {
            index: Object.keys(database).length,
            balance: req.body.balance,
            age: req.body.age,
            eyeColor: req.body.eyeColor,
            name: req.body.name,
            gender: req.body.gender,
            favoriteFruit: req.body.fruit,
        }
        database.push(newProfile);
        res.send(database);
    })

app.route('/users/:userID')
    .get((req, res) => {
        const userID = parseInt(req.params.userID);
        if(userID > Object.keys(database).length - 1) res.send("<h1>Error 404</h1> </br> User not found!");
        database.map((d, i) => {
            if(i === userID){
                res.send(d)
            }
        })
    })
    .delete((req, res) => {
        const userID = parseInt(req.params.userID);
        if(userID > Object.keys(database).length - 1) res.send("<h1>Error 404</h1> </br> User not found!");
        database.map((d, i) => {
            if(d.index === userID){
                database.splice(userID, 1);
                res.send("Delete Complete")
            }
        })
    })
    .put((req, res) => {
        const userID = parseInt(req.params.userID)
        if(userID > Object.keys(database).length - 1)res.send("<h1>Error 404 </h1> </br> User not found!");
        database.map((d,i) => {
            if(d.index == userID){
                if(req.body.balance)d.balance = req.body.balance;
                if(req.body.age)d.age = req.body.age;
                if(req.body.eyeColor)d.eyeColor = req.body.eyeColor;
                if(req.body.name)d.name = req.body.name;
                if(req.body.gender)d.gender = req.body.gender;
                if(req.body.fruit)d.favoriteFruit = req.body.fruit;
                console.log(d);
                res.send(d);
            }
        })
    })

app.listen(3000, () => {
    console.log("server running on port 3000");
})
